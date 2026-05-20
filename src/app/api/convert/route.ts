import { NextRequest, NextResponse } from "next/server";
import CloudConvert from "cloudconvert";

export async function POST(req: NextRequest) {
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

    const apiKey = process.env.CLOUDCONVERT_API_KEY;

    if (!apiKey) {
      // Return a 501 Not Implemented or 400 with instructions if no API key
      return NextResponse.json(
        { 
          error: "CloudConvert API Key is missing. Please sign up at cloudconvert.com, get an API key, and add it to your .env file as CLOUDCONVERT_API_KEY." 
        },
        { status: 501 }
      );
    }

    const cloudConvert = new CloudConvert(apiKey);

    // Create a job
    let job = await cloudConvert.jobs.create({
      tasks: {
        "import-my-file": {
          operation: "import/upload",
        },
        "convert-my-file": {
          operation: "convert",
          input: "import-my-file",
          output_format: toFormat,
          input_format: fromFormat,
        },
        "export-my-file": {
          operation: "export/url",
          input: "convert-my-file",
        },
      },
    });

    const uploadTask = job.tasks.filter((task) => task.name === "import-my-file")[0];

    // Convert Web File to Buffer for CloudConvert SDK
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload the file
    await cloudConvert.tasks.upload(uploadTask, buffer, file.name);

    // Wait for the job to complete
    job = await cloudConvert.jobs.wait(job.id);

    // Fetch the export task result
    const exportTask = job.tasks.filter((task) => task.name === "export-my-file")[0];
    
    if (exportTask.status === "error") {
      throw new Error(exportTask.message || "Conversion failed");
    }
    
    if (!exportTask.result || !exportTask.result.files || exportTask.result.files.length === 0) {
      throw new Error("No file was returned from CloudConvert");
    }

    const fileResult = exportTask.result.files[0];

    return NextResponse.json({
      url: fileResult.url,
      filename: fileResult.filename,
    });

  } catch (error: any) {
    console.error("Conversion error:", error);
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred during conversion" },
      { status: 500 }
    );
  }
}
