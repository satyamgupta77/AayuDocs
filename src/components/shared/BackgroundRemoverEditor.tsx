"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Upload, FileUp, Download, X, 
  Paintbrush, Check, Loader2, Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAppStore } from "@/hooks/useAppStore";
import { useDropzone } from "react-dropzone";
import { removeBackground } from "@imgly/background-removal";

const PRESET_COLORS = [
  { name: "Transparent", value: "transparent" },
  { name: "White", value: "#ffffff" },
  { name: "Black", value: "#000000" },
  { name: "Slate", value: "#475569" },
  { name: "Red", value: "#ef4444" },
  { name: "Blue", value: "#3b82f6" },
  { name: "Green", value: "#10b981" },
  { name: "Yellow", value: "#f59e0b" },
  { name: "Purple", value: "#8b5cf6" },
  { name: "Pink", value: "#ec4899" },
];

const PRESET_GRADIENTS = [
  { name: "Sunset", value: "linear-gradient(135deg, #ff7e5f 0%, #feb47b 100%)", colors: ["#ff7e5f", "#feb47b"] },
  { name: "Ocean", value: "linear-gradient(135deg, #2b5876 0%, #4e4376 100%)", colors: ["#2b5876", "#4e4376"] },
  { name: "Emerald", value: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)", colors: ["#11998e", "#38ef7d"] },
  { name: "Royal", value: "linear-gradient(135deg, #240b36 0%, #c3073f 100%)", colors: ["#240b36", "#c3073f"] },
  { name: "Neon", value: "linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)", colors: ["#00c6ff", "#0072ff"] },
  { name: "Cotton Candy", value: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)", colors: ["#ff9a9e", "#fecfef"] },
];

const PRESET_IMAGES = [
  { name: "Beach", value: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80" },
  { name: "Mountain", value: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80" },
  { name: "Office", value: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80" },
  { name: "Abstract", value: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&q=80" },
  { name: "Studio", value: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=800&q=80" },
  { name: "Forest", value: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=800&q=80" },
];

export function BackgroundRemoverEditor() {
  const { activeFiles, setActiveFiles } = useAppStore();
  
  // Editor State
  const [originalImageSrc, setOriginalImageSrc] = useState<string | null>(null);
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<HTMLImageElement | null>(null);
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [progressMsg, setProgressMsg] = useState("");
  
  // Background selection state
  const [bgType, setBgType] = useState<"transparent" | "color" | "gradient" | "image">("transparent");
  const [bgValue, setBgValue] = useState<string>("transparent");
  const [customBgUrl, setCustomBgUrl] = useState<string | null>(null);
  
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Load uploaded file and process AI Background Removal
  useEffect(() => {
    const processImage = async () => {
      if (activeFiles.length > 0) {
        const file = activeFiles[0];
        const url = URL.createObjectURL(file);
        setOriginalImageSrc(url);
        
        setIsProcessingAI(true);
        setProgressMsg("Initializing AI Model...");
        
        try {
          const blob = await removeBackground(file, {
            progress: (key, current, total) => {
              if (key === 'compute:inference') {
                setProgressMsg(`Removing Background... ${Math.round((current / total) * 100)}%`);
              } else if (key === 'fetch:model') {
                setProgressMsg(`Downloading AI Model... ${Math.round((current / total) * 100)}%`);
              }
            }
          });
          
          const processedUrl = URL.createObjectURL(blob);
          setProcessedImageUrl(processedUrl);
          
          const img = new Image();
          img.onload = () => {
            setProcessedImage(img);
          };
          img.src = processedUrl;
        } catch (error) {
          console.error("AI Background Removal failed:", error);
          setProgressMsg("Failed to remove background. Please try again.");
        } finally {
          setIsProcessingAI(false);
        }
      } else {
        setOriginalImageSrc(null);
        setProcessedImageUrl(null);
        setProcessedImage(null);
      }
    };
    
    processImage();
  }, [activeFiles]);

  // Render on Canvas when processed image or background changes
  useEffect(() => {
    if (!processedImage || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    // Scale image down slightly for editing preview performance if it's huge
    const maxDim = 800;
    let width = processedImage.width;
    let height = processedImage.height;
    if (width > maxDim || height > maxDim) {
      if (width > height) {
        height = (height / width) * maxDim;
        width = maxDim;
      } else {
        width = (width / height) * maxDim;
        height = maxDim;
      }
    }
    
    canvas.width = width;
    canvas.height = height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw the processed image with transparent background
    ctx.drawImage(processedImage, 0, 0, width, height);
  }, [processedImage]);

  // Custom Background Upload
  const handleCustomBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setCustomBgUrl(url);
      setBgType("image");
      setBgValue(url);
    }
  };

  // Download composed image
  const handleDownload = async () => {
    if (!processedImage || !canvasRef.current) return;
    
    const finalCanvas = document.createElement("canvas");
    finalCanvas.width = processedImage.width;
    finalCanvas.height = processedImage.height;
    const ctx = finalCanvas.getContext("2d");
    if (!ctx) return;

    // 1. Draw Background
    if (bgType === "color" && bgValue !== "transparent") {
      ctx.fillStyle = bgValue;
      ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);
    } else if (bgType === "gradient") {
      const gradPreset = PRESET_GRADIENTS.find(g => g.value === bgValue);
      const grad = ctx.createLinearGradient(0, 0, finalCanvas.width, finalCanvas.height);
      if (gradPreset) {
        grad.addColorStop(0, gradPreset.colors[0]);
        grad.addColorStop(1, gradPreset.colors[1]);
      } else {
        grad.addColorStop(0, "#ff7e5f");
        grad.addColorStop(1, "#feb47b");
      }
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);
    } else if (bgType === "image" && bgValue) {
      // Draw background image scaled to fill
      const bgImg = new Image();
      bgImg.crossOrigin = "anonymous";
      await new Promise<void>((resolve) => {
        bgImg.onload = () => {
          const ratio = Math.max(finalCanvas.width / bgImg.width, finalCanvas.height / bgImg.height);
          const w = bgImg.width * ratio;
          const h = bgImg.height * ratio;
          const x = (finalCanvas.width - w) / 2;
          const y = (finalCanvas.height - h) / 2;
          ctx.drawImage(bgImg, x, y, w, h);
          resolve();
        };
        bgImg.onerror = () => resolve(); // continue on error
        bgImg.src = bgValue;
      });
    }

    // 2. Draw Processed Image
    ctx.drawImage(processedImage, 0, 0, finalCanvas.width, finalCanvas.height);

    // 3. Trigger Download
    const dataUrl = finalCanvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `aayudocs_bg_removed_${activeFiles[0].name.split(".")[0]}.png`;
    link.href = dataUrl;
    link.click();
  };

  const handleReset = () => {
    setActiveFiles([]);
    setOriginalImageSrc(null);
    setProcessedImageUrl(null);
    setProcessedImage(null);
    setCustomBgUrl(null);
    setBgType("transparent");
    setBgValue("transparent");
  };

  const onDrop = React.useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setActiveFiles([acceptedFiles[0]]);
    }
  }, [setActiveFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    multiple: false,
    accept: { "image/*": [] }
  });

  return (
    <div className="space-y-8">
      {!originalImageSrc ? (
        <div 
          {...getRootProps()}
          className={`group relative rounded-3xl border-2 border-dashed ${isDragActive ? "border-emerald-400 bg-emerald-50/50 dark:bg-emerald-900/20" : "border-violet-200 dark:border-violet-900/50 bg-white/80 dark:bg-slate-900/50"} backdrop-blur-xl p-8 md:p-12 transition-all hover:border-violet-400 hover:bg-violet-50/50 dark:hover:bg-slate-800/50 shadow-xl shadow-violet-100/50 dark:shadow-none cursor-pointer`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="h-20 w-20 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-sm bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400 group-hover:scale-110">
              <FileUp size={40} strokeWidth={1.5} />
            </div>
            <div className="space-y-2 text-center">
              <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">
                Drag & drop your image here
              </h3>
              <p className="text-slate-500 dark:text-slate-400">
                or click to browse your computer
              </p>
            </div>
            <Button type="button" size="lg" className="h-14 px-8 text-lg rounded-xl bg-gradient-to-r from-violet-600 to-blue-500 hover:from-violet-700 hover:to-blue-600 text-white shadow-lg pointer-events-none">
              <Upload className="mr-2 h-5 w-5" />
              Select Image
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Visual Workspace Column */}
          <div className="lg:col-span-7 flex flex-col space-y-4">
            <div 
              className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-slate-200 dark:border-slate-800 flex items-center justify-center max-h-[550px] min-h-[350px] bg-slate-900"
              style={{
                background: bgType === "color" && bgValue !== "transparent" ? bgValue : bgType === "gradient" ? bgValue : bgType === "image" ? `url(${bgValue}) center/cover no-repeat` : undefined,
                backgroundImage: bgType === "transparent" ? "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"20\" height=\"20\" viewBox=\"0 0 20 20\"><rect width=\"10\" height=\"10\" fill=\"%23262626\"/><rect x=\"10\" y=\"10\" width=\"10\" height=\"10\" fill=\"%23262626\"/><rect x=\"10\" width=\"10\" height=\"10\" fill=\"%231a1a1a\"/><rect y=\"10\" width=\"10\" height=\"10\" fill=\"%231a1a1a\"/></svg>')" : undefined,
                backgroundSize: bgType === "transparent" ? "20px 20px" : undefined
              }}
            >
              {isProcessingAI ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-sm z-10">
                  <Loader2 className="h-12 w-12 text-violet-500 animate-spin mb-4" />
                  <p className="text-white font-medium">{progressMsg}</p>
                </div>
              ) : null}
              
              <canvas 
                ref={canvasRef} 
                className={`max-w-full max-h-[520px] object-contain transition-opacity duration-300 ${isProcessingAI ? 'opacity-0' : 'opacity-100'}`} 
              />
            </div>

            <div className="flex justify-between items-center bg-slate-900/60 border border-slate-800/80 p-4 rounded-xl backdrop-blur-md">
              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-400">File Name:</span>
                <span className="text-xs font-semibold text-white truncate max-w-[180px]">{activeFiles[0]?.name}</span>
              </div>
              <Button size="sm" variant="ghost" className="h-8 hover:text-rose-500" onClick={handleReset}>
                <X size={14} className="mr-1" /> Remove Image
              </Button>
            </div>
          </div>

          {/* Controls Panel Column */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="p-6 bg-slate-900/80 border-slate-800/80 backdrop-blur-xl text-white shadow-xl">
              <div className="flex items-center space-x-2 mb-4 border-b border-slate-800 pb-3">
                <Sparkles className="text-violet-500 h-5 w-5" />
                <h3 className="text-lg font-semibold">AI Background Removal</h3>
              </div>
              
              <div className="space-y-2">
                {isProcessingAI ? (
                  <p className="text-sm text-slate-400">Our advanced AI model is analyzing your image to create a perfect cutout.</p>
                ) : (
                  <div className="flex items-center space-x-2 text-emerald-400 bg-emerald-950/30 p-3 rounded-lg border border-emerald-900/50">
                    <Check size={18} />
                    <span className="text-sm font-medium">Background removed flawlessly!</span>
                  </div>
                )}
              </div>
            </Card>

            {/* Background Customizer Card */}
            <Card className={`p-6 bg-slate-900/80 border-slate-800/80 backdrop-blur-xl text-white shadow-xl space-y-6 transition-opacity duration-300 ${isProcessingAI ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
              <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
                <Paintbrush className="text-emerald-500 h-5 w-5" />
                <h3 className="text-lg font-semibold">Change Background</h3>
              </div>

              {/* Tabs for Category Selection */}
              <div className="grid grid-cols-4 gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800">
                <button 
                  onClick={() => { setBgType("transparent"); setBgValue("transparent"); }}
                  className={`text-xs py-2 rounded-md font-medium transition-all ${bgType === "transparent" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white"}`}
                >
                  Transparent
                </button>
                <button 
                  onClick={() => { setBgType("color"); setBgValue("#ffffff"); }}
                  className={`text-xs py-2 rounded-md font-medium transition-all ${bgType === "color" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white"}`}
                >
                  Colors
                </button>
                <button 
                  onClick={() => { setBgType("gradient"); setBgValue(PRESET_GRADIENTS[0].value); }}
                  className={`text-xs py-2 rounded-md font-medium transition-all ${bgType === "gradient" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white"}`}
                >
                  Gradients
                </button>
                <button 
                  onClick={() => { setBgType("image"); setBgValue(PRESET_IMAGES[0].value); }}
                  className={`text-xs py-2 rounded-md font-medium transition-all ${bgType === "image" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white"}`}
                >
                  Images
                </button>
              </div>

              {/* Render dynamic background selectors */}
              {bgType === "transparent" && (
                <div className="flex items-center space-x-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                  <div className="h-10 w-10 rounded-lg border border-slate-700 bg-transparent flex items-center justify-center font-mono text-[9px] text-slate-500"
                    style={{
                      backgroundImage: "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"10\" height=\"10\" viewBox=\"0 0 10 10\"><rect width=\"5\" height=\"5\" fill=\"%23262626\"/><rect x=\"5\" y=\"5\" width=\"5\" height=\"5\" fill=\"%23262626\"/><rect x=\"5\" width=\"5\" height=\"5\" fill=\"%231a1a1a\"/><rect y=\"5\" width=\"5\" height=\"5\" fill=\"%231a1a1a\"/></svg>')",
                      backgroundSize: "10px 10px"
                    }}
                  />
                  <div>
                    <h4 className="text-sm font-semibold">Transparent PNG</h4>
                    <p className="text-xs text-slate-400">Excellent choice for logos and stickers</p>
                  </div>
                </div>
              )}

              {bgType === "color" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-5 gap-2">
                    {PRESET_COLORS.slice(1).map((col, idx) => (
                      <button 
                        key={idx}
                        onClick={() => setBgValue(col.value)}
                        className="h-10 rounded-lg border border-slate-800 transition-all hover:scale-105 flex items-center justify-center relative overflow-hidden"
                        style={{ backgroundColor: col.value }}
                      >
                        {bgValue === col.value && (
                          <div className={`absolute inset-0 flex items-center justify-center bg-black/20 text-white`}>
                            <Check size={16} strokeWidth={3} />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center space-x-3 pt-2">
                    <label className="text-xs text-slate-400">Custom Color:</label>
                    <div className="relative h-8 w-12 rounded overflow-hidden border border-slate-800">
                      <input 
                        type="color" 
                        value={bgValue.startsWith("#") ? bgValue : "#ffffff"}
                        onChange={(e) => setBgValue(e.target.value)}
                        className="absolute inset-0 opacity-0 cursor-pointer h-full w-full"
                      />
                      <div className="h-full w-full" style={{ backgroundColor: bgValue.startsWith("#") ? bgValue : "#ffffff" }} />
                    </div>
                  </div>
                </div>
              )}

              {bgType === "gradient" && (
                <div className="grid grid-cols-3 gap-2">
                  {PRESET_GRADIENTS.map((grad, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setBgValue(grad.value)}
                      className="h-16 rounded-xl transition-all hover:scale-105 relative overflow-hidden text-left p-2 border border-slate-800"
                      style={{ background: grad.value }}
                    >
                      <span className="text-[10px] bg-black/40 px-1.5 py-0.5 rounded text-white font-medium absolute bottom-2 left-2">{grad.name}</span>
                      {bgValue === grad.value && (
                        <div className="absolute top-2 right-2 bg-white text-slate-900 rounded-full p-0.5 shadow-sm">
                          <Check size={10} strokeWidth={4} />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {bgType === "image" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-2">
                    {PRESET_IMAGES.map((img, idx) => (
                      <button 
                        key={idx}
                        onClick={() => setBgValue(img.value)}
                        className="h-16 rounded-xl transition-all hover:scale-105 relative overflow-hidden border border-slate-800"
                        style={{ background: `url(${img.value}) center/cover no-repeat` }}
                      >
                        <span className="text-[10px] bg-black/60 px-1.5 py-0.5 rounded text-white font-medium absolute bottom-2 left-2">{img.name}</span>
                        {bgValue === img.value && (
                          <div className="absolute top-2 right-2 bg-violet-600 text-white rounded-full p-0.5 shadow-sm">
                            <Check size={10} strokeWidth={4} />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="border-t border-slate-800 pt-4">
                    <label className="block text-xs text-slate-400 mb-2">Upload Custom Background Image</label>
                    <input 
                      type="file"
                      accept="image/*"
                      onChange={handleCustomBgUpload}
                      className="text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-white hover:file:bg-slate-700 cursor-pointer"
                    />
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-850">
                <Button 
                  onClick={handleDownload}
                  disabled={!processedImage}
                  className="flex-1 h-12 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white border-0 shadow-lg shadow-emerald-950/20 rounded-xl font-semibold disabled:opacity-50"
                >
                  <Download className="mr-2 h-4 w-4" /> Download Image
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleReset}
                  className="h-12 border-slate-800 hover:bg-slate-800/60 rounded-xl"
                >
                  Reset
                </Button>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
