import { NextRequest, NextResponse } from "next/server";
import CloudConvert from "cloudconvert";
import fs from "fs/promises";
import path from "path";
import os from "os";
import crypto from "crypto";

const cloudConvert = new CloudConvert(process.env.CLOUDCONVERT_API_KEY || "");

export async function POST(req: NextRequest) {
  let tempDir = "";
  try {
    const formData = await req.formData();
    const toolSlug = formData.get("toolSlug") as string;
    
    // Extract files from formData
    const files: File[] = [];
    for (const [key, value] of formData.entries()) {
      if (key === "files" && value instanceof File) {
        files.push(value);
      }
    }

    if (!files.length || !toolSlug) {
      return NextResponse.json(
        { error: "Missing required fields: files, toolSlug" },
        { status: 400 }
      );
    }

    if (!process.env.CLOUDCONVERT_API_KEY) {
      return NextResponse.json(
        { error: "CloudConvert API Key is missing. Please add CLOUDCONVERT_API_KEY to your .env file." },
        { status: 500 }
      );
    }

    // Map tool to input and output format
    let inputFormat = "pdf";
    let outputFormat = "pdf";
    
    if (toolSlug === "word-to-pdf") { inputFormat = "docx"; outputFormat = "pdf"; }
    else if (toolSlug === "ppt-to-pdf") { inputFormat = "pptx"; outputFormat = "pdf"; }
    else if (toolSlug === "pdf-to-word") { inputFormat = "pdf"; outputFormat = "docx"; }
    else if (toolSlug === "pdf-to-ppt") { inputFormat = "pdf"; outputFormat = "pptx"; }
    else {
      return NextResponse.json({ error: "Unsupported tool for CloudConvert" }, { status: 400 });
    }

    const file = files[0]; // Process only the first file for now (batch not needed for office-pdf mostly)
    
    const reqId = crypto.randomUUID();
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), `aayudocs-cc-${reqId}`));
    const inputFilePath = path.join(tempDir, file.name);
    
    const arrayBuffer = await file.arrayBuffer();
    await fs.writeFile(inputFilePath, Buffer.from(arrayBuffer));

    // Create CloudConvert Job
    const job = await cloudConvert.jobs.create({
      tasks: {
        'import-my-file': {
          operation: 'import/upload'
        },
        'convert-my-file': {
          operation: 'convert',
          input: 'import-my-file',
          output_format: outputFormat,
          engine: outputFormat === 'pdf' ? 'office' : undefined, // Use Microsoft Office engine if converting TO pdf
        },
        'export-my-file': {
          operation: 'export/url',
          input: 'convert-my-file'
        }
      }
    });

    const uploadTask = job.tasks.find(task => task.name === 'import-my-file');
    if (!uploadTask) throw new Error("Upload task not found");

    // Upload the file
    const fsReadStream = require("fs").createReadStream(inputFilePath);
    await cloudConvert.tasks.upload(uploadTask, fsReadStream, file.name);

    // Wait for the job to finish
    const finishedJob = await cloudConvert.jobs.wait(job.id);
    
    const exportTask = finishedJob.tasks.find(
      task => task.name === 'export-my-file'
    );
    if (!exportTask || !exportTask.result || !exportTask.result.files) {
      throw new Error("Export task failed or result not found");
    }

    const exportedFile = exportTask.result.files[0];
    const downloadResponse = await fetch(exportedFile.url);
    const buffer = Buffer.from(await downloadResponse.arrayBuffer());

    // Clean up temp directory
    await fs.rm(tempDir, { recursive: true, force: true });

    const firstFileName = file.name.replace(/\.[^/.]+$/, "");
    
    const headers = new Headers();
    headers.set("Content-Disposition", `attachment; filename="${firstFileName}_processed.${outputFormat}"`);
    
    let mimeType = "application/pdf";
    if (outputFormat === "docx") mimeType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    if (outputFormat === "pptx") mimeType = "application/vnd.openxmlformats-officedocument.presentationml.presentation";
    
    headers.set("Content-Type", mimeType);

    return new NextResponse(buffer, {
      status: 200,
      headers,
    });

  } catch (error: any) {
    console.error("CloudConvert Conversion error:", error);
    if (tempDir) {
      try {
        await fs.rm(tempDir, { recursive: true, force: true });
      } catch (cleanupError) {
        console.error("Cleanup error:", cleanupError);
      }
    }
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred during API conversion" },
      { status: 500 }
    );
  }
}
