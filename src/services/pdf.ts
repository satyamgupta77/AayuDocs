export const processPdfTool = async (files: File[], toolSlug: string): Promise<string> => {
  if (files.length === 0) throw new Error("No files provided");

  // These tools require precise formatting and are handled by CloudConvert
  const cloudConvertTools = ['pdf-to-word', 'pdf-to-ppt', 'word-to-pdf', 'ppt-to-pdf'];

  if (cloudConvertTools.includes(toolSlug)) {
    return await convertWithCloudConvert(files, toolSlug);
  }

  // Convert via iLovePDF API for all other native PDF tools
  return await convertWithILovePdf(files, toolSlug);
};

const convertWithCloudConvert = async (files: File[], toolSlug: string): Promise<string> => {
  const formData = new FormData();
  formData.append("toolSlug", toolSlug);
  for (const file of files) {
    formData.append("files", file);
  }

  const response = await fetch("/api/cloudconvert", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: "Unknown API error" }));
    throw new Error(err.error || "CloudConvert API failed");
  }

  const blob = await response.blob();
  return URL.createObjectURL(blob);
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

