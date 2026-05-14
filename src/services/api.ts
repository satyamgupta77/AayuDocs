/**
 * Mock API Service for Tool Processing
 */
export const processFile = async (file: File, toolSlug: string): Promise<string> => {
  return new Promise((resolve) => {
    // Simulate API processing time
    setTimeout(() => {
      // Return a mock object URL for downloading
      const blob = new Blob(["Processed content for " + file.name], { type: "text/plain" });
      resolve(URL.createObjectURL(blob));
    }, 2500);
  });
};
