export const processOcrTool = async (file: File, language: string = 'eng', onProgress?: (progress: number) => void): Promise<string> => {
  const tesseract = (await import('tesseract.js')).default;
  
  const worker = await tesseract.createWorker(language, 1, {
    logger: m => {
      if (m.status === 'recognizing text' && onProgress) {
        onProgress(m.progress);
      }
    }
  });

  try {
    const { data: { text } } = await worker.recognize(file);
    return text;
  } finally {
    await worker.terminate();
  }
};
