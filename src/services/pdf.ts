import { PDFDocument, rgb, degrees } from 'pdf-lib';

export const processPdfTool = async (files: File[], toolSlug: string): Promise<string> => {
  if (files.length === 0) throw new Error("No files provided");

  switch (toolSlug) {
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

const wordToPdf = async (file: File): Promise<string> => {
  // In a real browser env, we'd use a more complex parser for .docx
  // For now, we read as text/html and convert to PDF
  const text = await file.text();
  const element = document.createElement('div');
  element.innerHTML = `
    <div style="padding: 40px; font-family: sans-serif;">
      <h1 style="color: #7c3aed;">AayuDocs Converted PDF</h1>
      <hr/>
      <div style="margin-top: 20px; line-height: 1.6;">
        ${text.replace(/\n/g, '<br/>')}
      </div>
    </div>
  `;
  
  const html2pdf = (await import('html2pdf.js')).default;
  const pdfBlob = await html2pdf().from(element).output('blob');
  return URL.createObjectURL(pdfBlob);
};

const pdfToWord = async (file: File): Promise<string> => {
  // Demo: Extract text and wrap in HTML for Word
  const arrayBuffer = await file.arrayBuffer();
  const pdfjs = await import('pdfjs-dist');
  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
  
  const loadingTask = pdfjs.getDocument(arrayBuffer);
  const pdf = await loadingTask.promise;
  let fullText = "";
  
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const strings = content.items.map((item: any) => item.str);
    fullText += strings.join(' ') + "\n\n";
  }

  const htmlContent = `
    <html>
      <body>
        <h1 style="color: #7c3aed;">AayuDocs Extracted Content</h1>
        <p><b>Source:</b> ${file.name}</p>
        <hr/>
        <div style="white-space: pre-wrap;">${fullText}</div>
      </body>
    </html>
  `;
  
  const asBlob = (await import('html-docx-js-typescript')).asBlob;
  const wordBlob = await asBlob(htmlContent);
  return URL.createObjectURL(wordBlob as Blob);
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

const mockProcess = async (file: File, toolSlug: string): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (toolSlug === 'pdf-to-word') {
        const wordHtml = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head><title>Converted Document</title></head>
<body style="font-family: Calibri, sans-serif; padding: 20px;">
<h1 style="color: #7c3aed;">AayuDocs Converted Word Document</h1>
<hr/>
<p><b>Source File:</b> ${file?.name || 'document.pdf'}</p>
<p><b>Status:</b> Successfully analyzed and extracted layout elements into editable Word text format.</p>
<br/>
<p><i>Note: This document has been optimized for clean native viewing and editing inside Microsoft Word.</i></p>
</body></html>`;
        const blob = new Blob([wordHtml], { type: "application/msword" });
        resolve(URL.createObjectURL(blob));
      } else {
        const blob = new Blob([`Mock processed content for ${toolSlug}: ${file?.name}`], { type: "text/plain" });
        resolve(URL.createObjectURL(blob));
      }
    }, 1500);
  });
};
