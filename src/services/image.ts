

export const processImageTool = async (files: File[], toolSlug: string, options?: any): Promise<string> => {
  if (files.length === 0) throw new Error("No files provided");

  const file = files[0];

  switch (toolSlug) {
    case 'jpg-to-png':
      return await convertFormat(file, 'image/png');
    case 'png-to-jpg':
      return await convertFormat(file, 'image/jpeg');
    case 'webp-converter':
      return await convertFormat(file, 'image/webp');
    case 'compress-image':
      return await compressImage(file, options);
    case 'resize-image':
      return await resizeImage(file);
    case 'crop-image':
      return await cropImage(file);
    case 'heic-converter':
      return await convertHeic(file);
    case 'image-to-pdf':
      return await imageToPdf(files);
    case 'image-color-change':
      return await changeColor(file, options?.filter);
    default:
      return mockProcess(file, toolSlug);
  }
};

const changeColor = async (file: File, filter: string = 'grayscale'): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error("Failed to get canvas context"));
      
      ctx.drawImage(img, 0, 0);
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        if (filter === 'grayscale') {
          const avg = (r + g + b) / 3;
          data[i] = avg;
          data[i + 1] = avg;
          data[i + 2] = avg;
        } else if (filter === 'sepia') {
          data[i] = (r * 0.393) + (g * 0.769) + (b * 0.189);
          data[i + 1] = (r * 0.349) + (g * 0.686) + (b * 0.168);
          data[i + 2] = (r * 0.272) + (g * 0.534) + (b * 0.131);
        } else if (filter === 'invert') {
          data[i] = 255 - r;
          data[i + 1] = 255 - g;
          data[i + 2] = 255 - b;
        } else if (filter === 'boost') {
          data[i] = Math.min(255, r * 1.2);
          data[i + 1] = Math.min(255, g * 1.2);
          data[i + 2] = Math.min(255, b * 1.2);
        }
      }
      
      ctx.putImageData(imageData, 0, 0);
      
      canvas.toBlob((blob) => {
        if (!blob) return reject(new Error("Canvas toBlob failed"));
        resolve(URL.createObjectURL(blob));
      }, 'image/jpeg', 0.9);
      
      URL.revokeObjectURL(url);
    };
    img.onerror = reject;
    img.src = url;
  });
};

const convertFormat = async (file: File, targetMimeType: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error("Failed to get canvas context"));
      
      // If converting to JPEG, fill white background to avoid black transparent areas
      if (targetMimeType === 'image/jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      
      ctx.drawImage(img, 0, 0);
      
      canvas.toBlob((blob) => {
        if (!blob) return reject(new Error("Canvas toBlob failed"));
        resolve(URL.createObjectURL(blob));
      }, targetMimeType, 0.9);
      
      URL.revokeObjectURL(url);
    };
    img.onerror = reject;
    img.src = url;
  });
};

const compressImage = async (file: File, options?: any): Promise<string> => {
  const compressionOptions = {
    maxSizeMB: options?.maxSizeMB || 1,
    maxWidthOrHeight: options?.maxWidthOrHeight || 1920,
    useWebWorker: true
  };
  
  const imageCompression = (await import('browser-image-compression')).default;
  const compressedFile = await imageCompression(file, compressionOptions);
  return URL.createObjectURL(compressedFile);
};

const resizeImage = async (file: File, options?: any): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const scale = (options?.scale || 100) / 100;
      
      canvas.width = options?.width || img.width * scale;
      canvas.height = options?.height || img.height * scale;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error("Failed to get canvas context"));
      
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob((blob) => {
        if (!blob) return reject(new Error("Canvas toBlob failed"));
        resolve(URL.createObjectURL(blob));
      }, file.type, 0.9);
      
      URL.revokeObjectURL(url);
    };
    img.onerror = reject;
    img.src = url;
  });
};

const cropImage = async (file: File, options?: any): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ratio = options?.aspectRatio || '1:1';
      
      let cropWidth = img.width;
      let cropHeight = img.height;
      
      if (ratio === '1:1') {
        const size = Math.min(img.width, img.height);
        cropWidth = size;
        cropHeight = size;
      } else if (ratio === '16:9') {
        if (img.width / img.height > 16 / 9) {
          cropWidth = img.height * (16 / 9);
          cropHeight = img.height;
        } else {
          cropWidth = img.width;
          cropHeight = img.width * (9 / 16);
        }
      } else if (ratio === '4:5') {
        if (img.width / img.height > 4 / 5) {
          cropWidth = img.height * (4 / 5);
          cropHeight = img.height;
        } else {
          cropWidth = img.width;
          cropHeight = img.width * (5 / 4);
        }
      }
      
      canvas.width = cropWidth;
      canvas.height = cropHeight;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error("Failed to get canvas context"));
      
      const srcX = (img.width - cropWidth) / 2;
      const srcY = (img.height - cropHeight) / 2;
      
      ctx.drawImage(img, srcX, srcY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
      
      canvas.toBlob((blob) => {
        if (!blob) return reject(new Error("Canvas toBlob failed"));
        resolve(URL.createObjectURL(blob));
      }, file.type, 0.9);
      
      URL.revokeObjectURL(url);
    };
    img.onerror = reject;
    img.src = url;
  });
};

const convertHeic = async (file: File): Promise<string> => {
  try {
    const heic2any = (await import('heic2any')).default;
    const convertedBlob = await heic2any({
      blob: file,
      toType: "image/jpeg",
      quality: 0.8
    });
    
    const finalBlob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
    return URL.createObjectURL(finalBlob);
  } catch (err) {
    console.error("HEIC conversion failed:", err);
    throw err;
  }
};

const imageToPdf = async (files: File[]): Promise<string> => {
  const formData = new FormData();
  formData.append("toolSlug", "image-to-pdf");
  for (const file of files) {
    formData.append("files", file);
  }

  const response = await fetch("/api/ilovepdf", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: "Unknown API error" }));
    throw new Error(err.error || "iLovePDF API failed for image-to-pdf");
  }

  const blob = await response.blob();
  return URL.createObjectURL(blob);
};

const mockProcess = async (file: File, toolSlug: string): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const blob = new Blob([`Mock processed content for ${toolSlug}: ${file?.name}`], { type: "text/plain" });
      resolve(URL.createObjectURL(blob));
    }, 1500);
  });
};
