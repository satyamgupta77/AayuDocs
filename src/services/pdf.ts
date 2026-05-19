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

const wordToPdf = async (file: File): Promise<string> => {
  let htmlContent = "";

  if (file.name.endsWith('.docx')) {
    try {
      await loadScript("https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.8.0/mammoth.browser.min.js");
      const arrayBuffer = await file.arrayBuffer();
      const result = await (window as any).mammoth.convertToHtml({ arrayBuffer: arrayBuffer });
      htmlContent = result.value;
    } catch (err) {
      console.error("Mammoth DOCX conversion failed, falling back to text read:", err);
      const text = await file.text();
      htmlContent = `<div style="white-space: pre-wrap;">${text}</div>`;
    }
  } else {
    const text = await file.text();
    htmlContent = `<div style="white-space: pre-wrap;">${text}</div>`;
  }

  const element = document.createElement('div');
  element.innerHTML = `
    <div style="padding: 40px; font-family: sans-serif; background-color: #ffffff; color: #000000; min-height: 297mm; box-sizing: border-box;">
      <div style="margin-top: 10px; line-height: 1.6;">
        ${htmlContent}
      </div>
    </div>
  `;
  
  const html2pdf = (await import('html2pdf.js')).default;
  const opt = {
    margin: [15, 15, 15, 15] as [number, number, number, number],
    filename: file.name.replace(/\.[^/.]+$/, "") + ".pdf",
    image: { type: 'jpeg' as const, quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, letterRendering: true },
    jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
  };

  const pdfBlob = await html2pdf().set(opt).from(element).output('blob');
  return URL.createObjectURL(pdfBlob);
};

const pdfToWord = async (file: File): Promise<string> => {
  // Demo: Extract text and wrap in HTML for Word
  const arrayBuffer = await file.arrayBuffer();
  const pdfjs = await import('pdfjs-dist');
  pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
  
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

const pptToPdf = async (file: File): Promise<string> => {
  await loadScript("https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js");
  const JSZip = (window as any).JSZip;
  const zip = new JSZip();
  const content = await file.arrayBuffer();
  const loadedZip = await zip.loadAsync(content);
  
  // Find slide files
  const slideFiles = Object.keys(loadedZip.files).filter(name => 
    name.startsWith("ppt/slides/slide") && name.endsWith(".xml")
  ).sort((a, b) => {
    const numA = parseInt(a.replace(/[^\d]/g, ""), 10);
    const numB = parseInt(b.replace(/[^\d]/g, ""), 10);
    return numA - numB;
  });
  
  const slidesHtml: string[] = [];
  
  if (slideFiles.length === 0) {
    slidesHtml.push(`
      <div style="padding: 40px; text-align: center; font-family: sans-serif;">
        <h2>Presentation Document</h2>
        <p>Source file: ${file.name}</p>
      </div>
    `);
  } else {
    for (const slideFile of slideFiles) {
      const xmlText = await loadedZip.files[slideFile].async("text");
      // Extract text in <a:t>...</a:t>
      const textMatches = xmlText.match(/<a:t>([^<]*)<\/a:t>/g) || [];
      const textRuns = textMatches.map((m: string) => m.replace(/<\/?a:t>/g, ""));
      
      const title = textRuns[0] || "Slide";
      const bodyPoints = textRuns.slice(1).filter((t: string) => t.trim().length > 0);
      
      slidesHtml.push(`
        <div style="width: 297mm; height: 210mm; padding: 40px; box-sizing: border-box; background-color: #0f172a; color: #f8fafc; font-family: sans-serif; display: flex; flex-direction: column; justify-content: space-between; page-break-after: always; position: relative;">
          <div>
            <h1 style="color: #38bdf8; font-size: 32px; margin-bottom: 20px; border-bottom: 2px solid #334155; padding-bottom: 10px;">${title}</h1>
            <ul style="font-size: 18px; line-height: 1.8; color: #cbd5e1; padding-left: 20px;">
              ${bodyPoints.map((pt: string) => `<li style="margin-bottom: 10px;">${pt}</li>`).join("")}
            </ul>
          </div>
          <div style="position: absolute; bottom: 20px; right: 40px; font-size: 12px; color: #64748b;">
            AayuDocs Presentation Converter | Page ${slidesHtml.length + 1}
          </div>
        </div>
      `);
    }
  }
  
  const element = document.createElement("div");
  element.innerHTML = slidesHtml.join("");
  
  const html2pdf = (await import('html2pdf.js')).default;
  const opt = {
    margin: 0,
    filename: file.name.replace(/\.[^/.]+$/, "") + ".pdf",
    image: { type: 'jpeg' as const, quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'landscape' as const }
  };
  
  const pdfBlob = await html2pdf().set(opt).from(element).output('blob');
  return URL.createObjectURL(pdfBlob);
};

const pdfToPpt = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdfjs = await import('pdfjs-dist');
  pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
  
  const loadingTask = pdfjs.getDocument(arrayBuffer);
  const pdf = await loadingTask.promise;
  
  await loadScript("https://cdn.jsdelivr.net/npm/pptxgenjs@3.12.0/dist/pptxgen.bundle.js");
  const PptxGenJS = (window as any).PptxGenJS;
  const pptx = new PptxGenJS();
  
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const strings = content.items.map((item: any) => item.str);
    
    const slide = pptx.addSlide();
    slide.background = { color: "0f172a" };
    
    slide.addText(`AayuDocs Converted Slide ${i}`, { 
      x: 0.5, y: 0.5, w: 9, h: 0.8, 
      fontSize: 24, color: "38bdf8", bold: true 
    });
    
    const fullText = strings.join(" ");
    const bulletPoints = fullText.split(". ").filter(p => p.trim().length > 0).map(p => p.trim());
    
    if (bulletPoints.length > 0) {
      slide.addText(
        bulletPoints.map(p => ({ text: p, options: { bullet: true } })), 
        { 
          x: 0.5, y: 1.5, w: 9, h: 5.5, 
          fontSize: 14, color: "cbd5e1", lineSpacing: 24
        }
      );
    }
  }
  
  const pptxBlob = await pptx.write("blob");
  return URL.createObjectURL(pptxBlob as Blob);
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
