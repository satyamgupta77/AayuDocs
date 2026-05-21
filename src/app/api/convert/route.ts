import { NextRequest, NextResponse } from "next/server";
import { execFile } from "child_process";
import fs from "fs/promises";
import path from "path";
import os from "os";
import util from "util";
import crypto from "crypto";

const execFileAsync = util.promisify(execFile);

// LibreOffice path (assumes 'soffice' is in PATH)
const SOFFICE_PATH = "soffice";

export async function POST(req: NextRequest) {
  let tempDir = "";
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const fromFormat = formData.get("fromFormat") as string | null;
    const toFormat = formData.get("toFormat") as string | null;

    if (!file || !fromFormat || !toFormat) {
      return NextResponse.json(
        { error: "Missing required fields: file, fromFormat, toFormat" },
        { status: 400 }
      );
    }

    // Create a temporary directory for this conversion
    const reqId = crypto.randomUUID();
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), `aayudocs-convert-${reqId}`));

    // Save uploaded file to temp directory
    const inputFilePath = path.join(tempDir, `input.${fromFormat}`);
    const arrayBuffer = await file.arrayBuffer();
    await fs.writeFile(inputFilePath, Buffer.from(arrayBuffer));

    // Execute LibreOffice headless conversion
    // Command: soffice --headless --convert-to targetFormat inputFilePath --outdir tempDir
    try {
      await execFileAsync(SOFFICE_PATH, [
        "--headless",
        "--invisible",
        "--nodefault",
        "--nofirststartwizard",
        "--nologo",
        "--norestore",
        "--convert-to",
        toFormat,
        inputFilePath,
        "--outdir",
        tempDir,
      ]);
    } catch (execError: any) {
      console.error("LibreOffice execution error:", execError);
      return NextResponse.json(
        { error: "Failed to convert document. Ensure LibreOffice is installed on the server and added to PATH." },
        { status: 500 }
      );
    }

    // Read the converted file
    const convertedFileName = `input.${toFormat}`;
    const convertedFilePath = path.join(tempDir, convertedFileName);
    const convertedFileBuffer = await fs.readFile(convertedFilePath);
    
    // Clean up temp directory
    await fs.rm(tempDir, { recursive: true, force: true });

    // Return the file as a response
    const headers = new Headers();
    const cleanFilename = file.name.replace(/\.[^/.]+$/, "");
    headers.set("Content-Disposition", `attachment; filename="${cleanFilename}.${toFormat}"`);
    
    let mimeType = "application/octet-stream";
    if (toFormat === "pdf") mimeType = "application/pdf";
    if (toFormat === "docx") mimeType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    if (toFormat === "pptx") mimeType = "application/vnd.openxmlformats-officedocument.presentationml.presentation";
    headers.set("Content-Type", mimeType);

    return new NextResponse(convertedFileBuffer, {
      status: 200,
      headers,
    });

  } catch (error: any) {
    console.error("Conversion error:", error);
    // Attempt cleanup on failure
    if (tempDir) {
      try {
        await fs.rm(tempDir, { recursive: true, force: true });
      } catch (cleanupError) {
        console.error("Cleanup error:", cleanupError);
      }
    }
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred during conversion" },
      { status: 500 }
    );
  }
}
