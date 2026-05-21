import { PDFDocument, rgb, degrees } from 'pdf-lib';

export const processPdfTool = async (files: File[], toolSlug: string): Promise<string> => {
  if (files.length === 0) throw new Error("No files provided");

  switch (toolSlug) {
    case 'ppt-to-pdf':
      return await pptToPdf(files[0]);
    case 'pdf-to-ppt':
      return await pdfToPpt(files[0]);
    case 'merge-pdf':
      return await mergePdfs(files);
    case 'split-pdf':
      return await splitPdf(files[0]);
    case 'rotate-pdf':
      return await rotatePdf(files[0]);
    case 'compress-pdf':
      return await compressPdf(files[0]);
    case 'watermark-pdf':
      return await watermarkPdf(files[0]);
    case 'word-to-pdf':
      return await wordToPdf(files[0]);
    case 'pdf-to-word':
      return await pdfToWord(files[0]);
    case 'protect-pdf':
      return await protectPdf(files[0]);
    case 'unlock-pdf':
    case 'ocr':
      // For tools not fully supported client-side without external APIs, we return a mock file.
      return mockProcess(files[0], toolSlug);
    default:
      // Utility and Image tools return mock files for now
      return mockProcess(files[0], toolSlug);
  }
};

const protectPdf = async (file: File): Promise<string> => {
  // pdf-lib does not support native encryption. 
  // Real PDF protection requires a server-side engine or specialized library.
  return mockProcess(file, 'protect-pdf');
};

const loadScript = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      resolve();
      return;
    }
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script ${src}`));
    document.body.appendChild(script);
  });
};

const convertWithLibreOffice = async (file: File, fromFormat: string, toFormat: string): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("fromFormat", fromFormat);
  formData.append("toFormat", toFormat);

  const response = await fetch("/api/convert", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: "Unknown API error" }));
    throw new Error(err.error || "Conversion API failed");
  }

  const blob = await response.blob();
  return URL.createObjectURL(blob);
};

const wordToPdf = async (file: File): Promise<string> => {
  const ext = file.name.split('.').pop()?.toLowerCase() || 'docx';
  return await convertWithLibreOffice(file, ext, 'pdf');
};

const pdfToWord = async (file: File): Promise<string> => {
  return await convertWithLibreOffice(file, 'pdf', 'docx');
};

const pptToPdf = async (file: File): Promise<string> => {
  const ext = file.name.split('.').pop()?.toLowerCase() || 'pptx';
  return await convertWithLibreOffice(file, ext, 'pdf');
};

const pdfToPpt = async (file: File): Promise<string> => {
  return await convertWithLibreOffice(file, 'pdf', 'pptx');
};

const mergePdfs = async (files: File[]): Promise<string> => {
  const mergedPdf = await PDFDocument.create();

  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer);
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }

  const pdfBytes = await mergedPdf.save();
  const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
  return URL.createObjectURL(blob);
};

const splitPdf = async (file: File): Promise<string> => {
  // Extract just the first page as a "split" demo
  const arrayBuffer = await file.arrayBuffer();
  const originalPdf = await PDFDocument.load(arrayBuffer);
  
  const newPdf = await PDFDocument.create();
  const [copiedPage] = await newPdf.copyPages(originalPdf, [0]);
  newPdf.addPage(copiedPage);

  const pdfBytes = await newPdf.save();
  const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
  return URL.createObjectURL(blob);
};

const rotatePdf = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  
  const pages = pdfDoc.getPages();
  pages.forEach((page) => {
    const currentRotation = page.getRotation().angle;
    page.setRotation(degrees(currentRotation + 90));
  });

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
  return URL.createObjectURL(blob);
};

const compressPdf = async (file: File): Promise<string> => {
  // Basic "compression" in pdf-lib usually involves removing metadata/objects
  // Real compression requires external server APIs (Ghostscript, etc.)
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  
  // Just save without object streams to slightly reduce size
  const pdfBytes = await pdfDoc.save({ useObjectStreams: false });
  const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
  return URL.createObjectURL(blob);
};

const watermarkPdf = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  
  const pages = pdfDoc.getPages();
  pages.forEach((page) => {
    const { width, height } = page.getSize();
    page.drawText('CONFIDENTIAL', {
      x: width / 4,
      y: height / 2,
      size: 50,
      color: rgb(0.95, 0.1, 0.1),
      rotate: degrees(45),
      opacity: 0.3,
    });
  });

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
  return URL.createObjectURL(blob);
};

// Fallbacks removed since LibreOffice headless is natively available and reliable.

const mockProcess = async (file: File, toolSlug: string): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const blob = new Blob([`Mock processed content for ${toolSlug}: ${file?.name}`], { type: "text/plain" });
      resolve(URL.createObjectURL(blob));
    }, 1500);
  });
};
