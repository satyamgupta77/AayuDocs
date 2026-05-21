export const processPdfTool = async (files: File[], toolSlug: string): Promise<string> => {
  if (files.length === 0) throw new Error("No files provided");

  // These tools are not supported by iLovePDF API Developer tier directly as "pdf-to-word" / "pdf-to-ppt"
  // If they somehow are passed, we mock them
  if (toolSlug === 'pdf-to-word' || toolSlug === 'pdf-to-ppt') {
    return mockProcess(files[0], toolSlug);
  }

  // Convert via iLovePDF API
  return await convertWithILovePdf(files, toolSlug);
};

const convertWithILovePdf = async (files: File[], toolSlug: string): Promise<string> => {
  const formData = new FormData();
  formData.append("toolSlug", toolSlug);
  for (const file of files) {
    formData.append("files", file);
  }

  const response = await fetch("/api/ilovepdf", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: "Unknown API error" }));
    throw new Error(err.error || "iLovePDF API failed");
  }

  const blob = await response.blob();
  return URL.createObjectURL(blob);
};

const mockProcess = async (file: File, toolSlug: string): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const blob = new Blob([`Mock processed content for ${toolSlug}: ${file?.name}\n\nNote: iLovePDF Developer API does not natively support extracting PDF to Office formats.`], { type: "text/plain" });
      resolve(URL.createObjectURL(blob));
    }, 1500);
  });
};

