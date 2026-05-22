import { NextRequest, NextResponse } from "next/server";
import ILovePDFApi from "@ilovepdf/ilovepdf-nodejs";
import fs from "fs/promises";
import path from "path";
import os from "os";
import crypto from "crypto";
// @ts-ignore
import ILovePDFFile from "@ilovepdf/ilovepdf-nodejs/ILovePDFFile";

// Map toolSlugs to iLovePDF Tool names
const toolMap: Record<string, string> = {
  "ppt-to-pdf": "officepdf",
  "word-to-pdf": "officepdf",
  "merge-pdf": "merge",
  "split-pdf": "split",
  "rotate-pdf": "rotate",
  "compress-pdf": "compress",
  "watermark-pdf": "watermark",
  "protect-pdf": "protect",
  "unlock-pdf": "unlock",
  "ocr": "pdfocr",
  "pdf-to-jpg": "pdfjpg",
  "image-to-pdf": "imagepdf",
  "page-numbers": "pagenumber",
  "repair-pdf": "repair",
  "pdf-to-pdfa": "pdfa",
  "extract-pdf": "extract",
  "html-to-pdf": "htmlpdf",
};

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

    const iloveTool = toolMap[toolSlug];
    if (!iloveTool) {
      return NextResponse.json(
        { error: `Tool ${toolSlug} is not supported by the API mapping.` },
        { status: 400 }
      );
    }

    const publicKey = process.env.ILOVEPDF_PUBLIC_KEY;
    const secretKey = process.env.ILOVEPDF_SECRET_KEY;

    if (!publicKey || !secretKey) {
      throw new Error("iLovePDF API credentials not configured.");
    }

    const instance = new ILovePDFApi(publicKey, secretKey);
    const task = instance.newTask(iloveTool as any);

    await task.start();

    // Create a temporary directory to save the uploaded files
    const reqId = crypto.randomUUID();
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), `aayudocs-ilovepdf-${reqId}`));

    // Save uploaded files to temp directory and add them to the task
    for (const file of files) {
      const inputFilePath = path.join(tempDir, file.name);
      const arrayBuffer = await file.arrayBuffer();
      await fs.writeFile(inputFilePath, Buffer.from(arrayBuffer));
      
      await task.addFile(new ILovePDFFile(inputFilePath));
    }

    // Pass required default params based on tool if necessary
    const processParams: any = {};
    if (iloveTool === 'watermark') {
      const watermarkText = formData.get("watermarkText") as string;
      processParams.text = watermarkText || "Draft"; // Fallback to Draft if empty
    } else if (iloveTool === 'rotate') {
      processParams.rotate = 90; // Default rotate
    }

    await task.process(processParams);
    
    // Download processed file
    const downloadedData = await task.download(); // Returns Uint8Array
    const buffer = Buffer.from(downloadedData);

    // Clean up temp directory
    await fs.rm(tempDir, { recursive: true, force: true });

    // Determine return format and filename
    const firstFileName = files[0].name.replace(/\.[^/.]+$/, "");
    let ext = "pdf";
    let mimeType = "application/pdf";
    
    if (iloveTool === "pdfjpg") {
      ext = files.length > 1 || iloveTool === "pdfjpg" ? "zip" : "jpg"; // Note: pdfjpg returns zip if multiple pages, simplify for now
      mimeType = ext === "zip" ? "application/zip" : "image/jpeg";
    }

    // Many tasks return pdf, but if we merge/compress it's always pdf. 
    // If it's word-to-pdf, output is pdf.
    const headers = new Headers();
    headers.set("Content-Disposition", `attachment; filename="${firstFileName}_processed.${ext}"`);
    headers.set("Content-Type", mimeType);

    return new NextResponse(buffer, {
      status: 200,
      headers,
    });

  } catch (error: any) {
    console.error("iLovePDF Conversion error:", error);
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
