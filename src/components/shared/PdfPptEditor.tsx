"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Type, Download, FileUp, Settings, Trash2, 
  ZoomIn, ZoomOut, Check, Sliders, Presentation, Edit3,
  Undo, Plus, Layers, ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useAppStore } from "@/hooks/useAppStore";
import { PDFDocument, rgb } from "pdf-lib";

interface TextElement {
  id: string;
  pageIndex: number;
  text: string;
  x: number; // percentage from left
  y: number; // percentage from top
  fontSize: number;
  color: string;
}

interface SlideElement {
  id: string;
  title: string;
  bullets: string[];
}

interface PdfPptEditorProps {
  type: "pdf" | "ppt";
}

export function PdfPptEditor({ type }: PdfPptEditorProps) {
  const { activeFiles, setActiveFiles } = useAppStore();
  const [fileLoaded, setFileLoaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // PDF state
  const [pdfDocBytes, setPdfDocBytes] = useState<ArrayBuffer | null>(null);
  const [pdfNumPages, setPdfNumPages] = useState<number>(0);
  const [pdfPageImages, setPdfPageImages] = useState<string[]>([]);
  const [textElements, setTextElements] = useState<TextElement[]>([]);
  const [selectedTextId, setSelectedTextId] = useState<string | null>(null);
  const [textColor, setTextColor] = useState<string>("#000000");
  const [textSize, setTextSize] = useState<number>(16);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  
  // PPT state
  const [slides, setSlides] = useState<SlideElement[]>([]);
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);

  const containerRef = useRef<HTMLDivElement | null>(null);

  // Load script helper
  const loadScript = (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (typeof window === "undefined") return resolve();
      if (document.querySelector(`script[src="${src}"]`)) return resolve();
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve();
      script.onerror = () => reject();
      document.body.appendChild(script);
    });
  };

  // Convert HEX to RGB ratio for pdf-lib (0-1)
  const hexToRgbRatio = (hex: string): [number, number, number] => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
      parseInt(result[1], 16) / 255,
      parseInt(result[2], 16) / 255,
      parseInt(result[3], 16) / 255
    ] : [0, 0, 0];
  };

  // Handle uploaded file
  useEffect(() => {
    if (activeFiles.length > 0) {
      const file = activeFiles[0];
      if (type === "pdf") {
        loadPdfFile(file);
      } else {
        loadPptFile(file);
      }
    } else {
      resetState();
    }
  }, [activeFiles, type]);

  const loadPdfFile = async (file: File) => {
    setIsProcessing(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      setPdfDocBytes(arrayBuffer);
      
      const pdfjs = await import("pdfjs-dist");
      pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
      
      const loadingTask = pdfjs.getDocument({ data: new Uint8Array(arrayBuffer) });
      const pdf = await loadingTask.promise;
      setPdfNumPages(pdf.numPages);
      
      const images: string[] = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1.5 });
        
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        
        const ctx = canvas.getContext("2d");
        if (ctx) {
          await page.render({ canvasContext: ctx, canvas, viewport }).promise;
          images.push(canvas.toDataURL());
        }
      }
      setPdfPageImages(images);
      setFileLoaded(true);
    } catch (err) {
      console.error("Failed to load PDF:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const loadPptFile = async (file: File) => {
    setIsProcessing(true);
    try {
      await loadScript("https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js");
      const JSZip = (window as any).JSZip;
      const zip = new JSZip();
      const content = await file.arrayBuffer();
      const loadedZip = await zip.loadAsync(content);
      
      const slideFiles = Object.keys(loadedZip.files).filter(name => 
        name.startsWith("ppt/slides/slide") && name.endsWith(".xml")
      ).sort((a, b) => {
        const numA = parseInt(a.replace(/[^\d]/g, ""), 10);
        const numB = parseInt(b.replace(/[^\d]/g, ""), 10);
        return numA - numB;
      });
      
      const extractedSlides: SlideElement[] = [];
      
      if (slideFiles.length === 0) {
        extractedSlides.push({
          id: "slide-1",
          title: "Welcome Slide",
          bullets: ["Add slide bullet point 1", "Add slide bullet point 2"]
        });
      } else {
        for (let i = 0; i < slideFiles.length; i++) {
          const xmlText = await loadedZip.files[slideFiles[i]].async("text");
          const textMatches = xmlText.match(/<a:t>([^<]*)<\/a:t>/g) || [];
          const textRuns = textMatches.map((m: string) => m.replace(/<\/?a:t>/g, ""));
          
          const title = textRuns[0] || `Slide ${i + 1}`;
          const bullets = textRuns.slice(1).filter((t: string) => t.trim().length > 0);
          
          extractedSlides.push({
            id: `slide-${i + 1}`,
            title,
            bullets: bullets.length > 0 ? bullets : ["Edit slide details here"]
          });
        }
      }
      setSlides(extractedSlides);
      setActiveSlideIndex(0);
      setFileLoaded(true);
    } catch (err) {
      console.error("Failed to load PPTX:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const resetState = () => {
    setFileLoaded(false);
    setPdfDocBytes(null);
    setPdfNumPages(0);
    setPdfPageImages([]);
    setTextElements([]);
    setSelectedTextId(null);
    setSlides([]);
    setActiveSlideIndex(0);
  };

  // Add text element onto PDF page
  const handleAddText = (pageIndex: number) => {
    const newElement: TextElement = {
      id: `text-${Date.now()}`,
      pageIndex,
      text: "Double-click to edit text",
      x: 35,
      y: 40,
      fontSize: textSize,
      color: textColor
    };
    setTextElements([...textElements, newElement]);
    setSelectedTextId(newElement.id);
  };

  const handleTextChange = (id: string, text: string) => {
    setTextElements(textElements.map(el => el.id === id ? { ...el, text } : el));
  };

  const handleDeleteText = (id: string) => {
    setTextElements(textElements.filter(el => el.id !== id));
    setSelectedTextId(null);
  };

  // PPT editing handlers
  const handleAddSlide = () => {
    const newSlide: SlideElement = {
      id: `slide-${Date.now()}`,
      title: "New Slide Title",
      bullets: ["New bullet point"]
    };
    setSlides([...slides, newSlide]);
    setActiveSlideIndex(slides.length);
  };

  const handleDeleteSlide = (index: number) => {
    const updated = slides.filter((_, i) => i !== index);
    setSlides(updated);
    setActiveSlideIndex(Math.max(0, index - 1));
  };

  const updateSlideTitle = (title: string) => {
    setSlides(slides.map((s, idx) => idx === activeSlideIndex ? { ...s, title } : s));
  };

  const updateSlideBullet = (bulletIdx: number, val: string) => {
    setSlides(slides.map((s, idx) => {
      if (idx === activeSlideIndex) {
        const bullets = [...s.bullets];
        bullets[bulletIdx] = val;
        return { ...s, bullets };
      }
      return s;
    }));
  };

  const addSlideBullet = () => {
    setSlides(slides.map((s, idx) => {
      if (idx === activeSlideIndex) {
        return { ...s, bullets: [...s.bullets, "New point"] };
      }
      return s;
    }));
  };

  const deleteSlideBullet = (bulletIdx: number) => {
    setSlides(slides.map((s, idx) => {
      if (idx === activeSlideIndex) {
        return { ...s, bullets: s.bullets.filter((_, bIdx) => bIdx !== bulletIdx) };
      }
      return s;
    }));
  };

  // Drag Text overlay helper
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData("text/plain", id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, pageIndex: number) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    const container = e.currentTarget.getBoundingClientRect();
    
    const x = ((e.clientX - container.left) / container.width) * 100;
    const y = ((e.clientY - container.top) / container.height) * 100;
    
    setTextElements(textElements.map(el => el.id === id ? { ...el, x, y, pageIndex } : el));
  };

  // Export PDF
  const exportPdf = async () => {
    if (!pdfDocBytes) return;
    setIsProcessing(true);
    try {
      const pdfDoc = await PDFDocument.load(pdfDocBytes);
      const pages = pdfDoc.getPages();
      
      for (const el of textElements) {
        const page = pages[el.pageIndex];
        if (!page) continue;
        
        const { width, height } = page.getSize();
        const drawX = (el.x / 100) * width;
        const drawY = height - ((el.y / 100) * height) - (el.fontSize * 0.8);
        const [r, g, b] = hexToRgbRatio(el.color);
        
        page.drawText(el.text, {
          x: drawX,
          y: drawY,
          size: el.fontSize,
          color: rgb(r, g, b)
        });
      }
      
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.download = `aayudocs_edited_${activeFiles[0].name}`;
      link.href = url;
      link.click();
    } catch (err) {
      console.error("Export failed:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Export PPT
  const exportPpt = async () => {
    setIsProcessing(true);
    try {
      await loadScript("https://cdn.jsdelivr.net/npm/pptxgenjs@3.12.0/dist/pptxgen.bundle.js");
      const PptxGenJS = (window as any).PptxGenJS;
      const pptx = new PptxGenJS();
      
      for (const slideData of slides) {
        const slide = pptx.addSlide();
        slide.background = { color: "0f172a" };
        
        // Header title
        slide.addText(slideData.title, { 
          x: 0.5, y: 0.5, w: 9, h: 0.8, 
          fontSize: 24, color: "38bdf8", bold: true 
        });
        
        // Bullets
        if (slideData.bullets.length > 0) {
          slide.addText(
            slideData.bullets.map(b => ({ text: b, options: { bullet: true } })), 
            { 
              x: 0.5, y: 1.5, w: 9, h: 5.5, 
              fontSize: 14, color: "cbd5e1", lineSpacing: 24
            }
          );
        }
      }
      
      const pptxBlob = await pptx.write("blob");
      const url = URL.createObjectURL(pptxBlob as Blob);
      
      const link = document.createElement("a");
      link.download = `aayudocs_edited_${activeFiles[0].name.split(".")[0]}.pptx`;
      link.href = url;
      link.click();
    } catch (err) {
      console.error("Export PPT failed:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {!fileLoaded ? (
        <Card className="p-12 border-dashed border-2 border-slate-700 bg-slate-900/40 text-center">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="h-16 w-16 bg-violet-500/10 rounded-2xl flex items-center justify-center text-violet-400 border border-violet-500/20">
              {type === "pdf" ? <Edit3 size={32} /> : <Presentation size={32} />}
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white">Upload {type.toUpperCase()} to Edit</h3>
              <p className="text-sm text-slate-400">Select the {type.toUpperCase()} document you wish to edit directly</p>
            </div>
            <input 
              type="file" 
              accept={type === "pdf" ? ".pdf" : ".pptx,.ppt"}
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  setActiveFiles([e.target.files[0]]);
                }
              }}
              className="hidden" 
              id="file-editor-upload" 
            />
            <label
              htmlFor="file-editor-upload"
              className="inline-flex items-center justify-center bg-gradient-to-r from-violet-600 to-blue-500 text-white rounded-xl shadow-lg cursor-pointer px-6 py-3 text-sm font-semibold hover:from-violet-500 hover:to-blue-400 transition-all"
            >
              <FileUp className="mr-2 h-5 w-5" /> Select File
            </label>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Visual Editor Workspace */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-4 rounded-xl">
              <div className="flex items-center space-x-2">
                <Button size="sm" variant="ghost" onClick={resetState} className="text-slate-400 hover:text-white">
                  <ArrowLeft size={16} className="mr-1" /> Back
                </Button>
                <span className="text-sm text-slate-400 font-semibold truncate max-w-[200px]">
                  Editing: {activeFiles[0]?.name}
                </span>
              </div>
              
              {type === "pdf" && (
                <div className="flex items-center space-x-2">
                  <Button size="icon" variant="ghost" onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.1))}>
                    <ZoomOut size={16} />
                  </Button>
                  <span className="text-xs font-medium w-10 text-center">{Math.round(zoomLevel * 100)}%</span>
                  <Button size="icon" variant="ghost" onClick={() => setZoomLevel(Math.min(2, zoomLevel + 0.1))}>
                    <ZoomIn size={16} />
                  </Button>
                </div>
              )}
            </div>

            {/* Canvas/Slide Workspace area */}
            <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 flex flex-col items-center justify-center min-h-[500px] overflow-auto max-h-[700px]">
              {type === "pdf" ? (
                <div className="space-y-8 w-full max-w-2xl">
                  {pdfPageImages.map((src, pageIdx) => (
                    <div 
                      key={pageIdx}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, pageIdx)}
                      className="relative border border-slate-800 rounded-lg overflow-hidden shadow-2xl bg-white select-none"
                      style={{ transform: `scale(${zoomLevel})`, transformOrigin: "top center", marginBottom: `${(zoomLevel - 1) * 200}px` }}
                    >
                      <img src={src} alt={`Page ${pageIdx + 1}`} className="w-full object-contain pointer-events-none" />
                      
                      {/* Added Text Overlay Layers */}
                      {textElements.filter(el => el.pageIndex === pageIdx).map(el => (
                        <div
                          key={el.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, el.id)}
                          onClick={() => setSelectedTextId(el.id)}
                          className={`absolute p-1 cursor-move select-text rounded border ${selectedTextId === el.id ? "border-violet-500 bg-violet-500/10 ring-2 ring-violet-500/40" : "border-transparent hover:border-slate-300"}`}
                          style={{ 
                            left: `${el.x}%`, 
                            top: `${el.y}%`, 
                            fontSize: `${el.fontSize}px`, 
                            color: el.color,
                            fontWeight: "bold",
                            fontFamily: "sans-serif"
                          }}
                        >
                          <input 
                            type="text" 
                            value={el.text} 
                            onChange={(e) => handleTextChange(el.id, e.target.value)} 
                            className="bg-transparent border-0 p-0 focus:outline-none focus:ring-0 w-auto min-w-[100px]"
                            style={{ color: el.color }}
                          />
                        </div>
                      ))}

                      {/* Floating Page Options */}
                      <div className="absolute top-4 right-4 bg-slate-900/90 text-white text-xs px-3 py-1.5 rounded-full border border-slate-700/80 flex items-center space-x-2 shadow-lg">
                        <span>Page {pageIdx + 1} of {pdfNumPages}</span>
                        <button 
                          onClick={() => handleAddText(pageIdx)} 
                          className="hover:text-violet-400 transition-colors p-0.5 rounded"
                          title="Add text to this page"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* PPT Workspace Slide view */
                <div className="w-full max-w-2xl bg-slate-900 rounded-xl border border-slate-800 aspect-[16/9] p-8 flex flex-col justify-between relative shadow-2xl">
                  <div>
                    <input 
                      type="text" 
                      value={slides[activeSlideIndex]?.title || ""} 
                      onChange={(e) => updateSlideTitle(e.target.value)}
                      className="bg-transparent border-b border-transparent hover:border-slate-700 focus:border-violet-500 focus:outline-none w-full text-3xl font-extrabold text-sky-400 mb-6 pb-2"
                      placeholder="Slide Title"
                    />
                    
                    <div className="space-y-4">
                      {slides[activeSlideIndex]?.bullets.map((bullet, bIdx) => (
                        <div key={bIdx} className="flex items-center space-x-2 group">
                          <span className="text-sky-500 text-lg">•</span>
                          <input 
                            type="text" 
                            value={bullet} 
                            onChange={(e) => updateSlideBullet(bIdx, e.target.value)}
                            className="bg-transparent border-b border-transparent hover:border-slate-800 focus:border-violet-500 focus:outline-none w-full text-lg text-slate-300"
                            placeholder="Enter slide detail"
                          />
                          <button 
                            onClick={() => deleteSlideBullet(bIdx)} 
                            className="text-slate-500 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                    
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={addSlideBullet} 
                      className="mt-4 text-xs text-slate-400 hover:text-white"
                    >
                      <Plus size={12} className="mr-1" /> Add point
                    </Button>
                  </div>
                  
                  <div className="flex justify-between items-center text-xs text-slate-500">
                    <span>AayuDocs Slideshow Editor</span>
                    <span>Slide {activeSlideIndex + 1} of {slides.length}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar Control Column */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="p-6 bg-slate-900 border-slate-800 text-white shadow-xl space-y-6">
              <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
                <Settings className="text-violet-500 h-5 w-5" />
                <h3 className="text-lg font-semibold">Workspace Controls</h3>
              </div>

              {type === "pdf" ? (
                /* PDF specific settings */
                <div className="space-y-6">
                  {selectedTextId ? (
                    <div className="space-y-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-400">Selected text settings</span>
                        <Button size="icon" variant="ghost" className="h-6 w-6 text-rose-500" onClick={() => handleDeleteText(selectedTextId)}>
                          <Trash2 size={14} />
                        </Button>
                      </div>

                      <div className="space-y-3">
                        <label className="text-xs font-semibold text-slate-300">Text Size</label>
                        <div className="flex items-center space-x-4">
                          <input 
                            type="range" 
                            min="10" 
                            max="36" 
                            value={textSize}
                            onChange={(e) => {
                              const size = Number(e.target.value);
                              setTextSize(size);
                              setTextElements(textElements.map(el => el.id === selectedTextId ? { ...el, fontSize: size } : el));
                            }}
                            className="w-full accent-violet-600"
                          />
                          <span className="text-xs font-mono">{textSize}px</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-300">Text Color</label>
                        <div className="flex items-center space-x-3">
                          <input 
                            type="color" 
                            value={textColor}
                            onChange={(e) => {
                              const col = e.target.value;
                              setTextColor(col);
                              setTextElements(textElements.map(el => el.id === selectedTextId ? { ...el, color: col } : el));
                            }}
                            className="h-8 w-12 rounded bg-transparent cursor-pointer"
                          />
                          <span className="text-xs font-mono">{textColor.toUpperCase()}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6 bg-slate-950/40 rounded-xl border border-slate-800 text-xs text-slate-400">
                      Select a text overlay on any page to configure size & color options.
                    </div>
                  )}

                  <div className="pt-4 border-t border-slate-800 space-y-3">
                    <Button 
                      onClick={exportPdf} 
                      disabled={isProcessing}
                      className="w-full h-12 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white rounded-xl shadow-lg"
                    >
                      {isProcessing ? "Saving changes..." : <><Download className="mr-2 h-4 w-4" /> Save & Export PDF</>}
                    </Button>
                  </div>
                </div>
              ) : (
                /* PPT specific settings */
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-slate-400">Slides Deck List</span>
                    <Button size="sm" variant="outline" className="h-8" onClick={handleAddSlide}>
                      <Plus size={14} className="mr-1" /> Add Slide
                    </Button>
                  </div>
                  
                  <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
                    {slides.map((s, idx) => (
                      <div 
                        key={s.id}
                        onClick={() => setActiveSlideIndex(idx)}
                        className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${idx === activeSlideIndex ? "border-violet-500 bg-violet-600/10 text-white" : "border-slate-800 bg-slate-950/40 hover:bg-slate-900 text-slate-400"}`}
                      >
                        <div className="flex items-center space-x-2">
                          <Layers size={14} />
                          <span className="text-xs font-semibold truncate max-w-[120px]">{s.title || `Slide ${idx + 1}`}</span>
                        </div>
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="h-6 w-6 text-rose-500 opacity-60 hover:opacity-100" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteSlide(idx);
                          }}
                        >
                          <Trash2 size={12} />
                        </Button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="pt-4 border-t border-slate-800">
                    <Button 
                      onClick={exportPpt}
                      disabled={isProcessing}
                      className="w-full h-12 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white rounded-xl shadow-lg"
                    >
                      {isProcessing ? "Exporting PPTX..." : <><Download className="mr-2 h-4 w-4" /> Save & Export PPTX</>}
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
