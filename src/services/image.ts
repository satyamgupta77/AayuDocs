

export const processImageTool = async (files: File[], toolSlug: string): Promise<string> => {
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
      return await compressImage(file);
    case 'resize-image':
      return await resizeImage(file);
    case 'crop-image':
      return await cropImage(file);
    case 'heic-converter':
      return await convertHeic(file);
    case 'image-to-pdf':
      return await imageToPdf(files);
    default:
      return mockProcess(file, toolSlug);
  }
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

const compressImage = async (file: File): Promise<string> => {
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true
  };
  
  const imageCompression = (await import('browser-image-compression')).default;
  const compressedFile = await imageCompression(file, options);
  return URL.createObjectURL(compressedFile);
};

const resizeImage = async (file: File): Promise<string> => {
  // Demo: Scale down to 50%
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width * 0.5;
      canvas.height = img.height * 0.5;
      
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

const cropImage = async (file: File): Promise<string> => {
  // Demo: Crop center 50%
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width * 0.5;
      canvas.height = img.height * 0.5;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error("Failed to get canvas context"));
      
      const srcX = img.width * 0.25;
      const srcY = img.height * 0.25;
      const srcW = img.width * 0.5;
      const srcH = img.height * 0.5;
      
      ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, canvas.width, canvas.height);
      
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
  const { jsPDF } = await import('jspdf');
  // jspdf creates a new PDF document
  const pdf = new jsPDF();
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (i > 0) pdf.addPage();
    
    const imgData = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
    
    // Fit image to PDF A4 page
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    // Create an image to get true dimensions
    const img = new Image();
    img.src = imgData;
    await new Promise((resolve) => { img.onload = resolve; });
    
    const ratio = Math.min(pdfWidth / img.width, pdfHeight / img.height);
    const width = img.width * ratio;
    const height = img.height * ratio;
    const x = (pdfWidth - width) / 2;
    const y = (pdfHeight - height) / 2;
    
    pdf.addImage(imgData, 'JPEG', x, y, width, height);
  }
  
  const blob = pdf.output('blob');
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
