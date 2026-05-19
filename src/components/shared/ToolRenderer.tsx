"use client";

import { motion } from "framer-motion";
import { Upload, FileUp, Settings, Download, File, X, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToolConfig, toolsConfig } from "@/config/tools";
import { useAppStore } from "@/hooks/useAppStore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toolConfigurationSchema, ToolConfiguration } from "@/lib/validations";
import Link from "next/link";
import { FAQ } from "@/components/sections/FAQ";
import { useDropzone } from "react-dropzone";
import { processPdfTool } from "@/services/pdf";
import { processImageTool } from "@/services/image";
import { processOcrTool } from "@/services/ocr";
import React, { useState } from "react";
import { Copy } from "lucide-react";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import { BackgroundRemoverEditor } from "./BackgroundRemoverEditor";
import { PdfPptEditor } from "./PdfPptEditor";
import { ResumeBuilderWorkspace } from "./ResumeBuilderWorkspace";

const DocumentEditor = dynamic(
  () => import("@/components/shared/DocumentEditor").then((mod) => mod.DocumentEditor),
  { 
    ssr: false, 
    loading: () => (
      <div className="h-[600px] w-full rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center bg-slate-50/50 dark:bg-slate-900/50">
        <div className="flex flex-col items-center text-slate-500">
          <Loader2 className="h-8 w-8 animate-spin mb-4 text-violet-600" />
          <p className="font-medium">Loading rich-text editor...</p>
        </div>
      </div>
    )
  }
);

interface ToolRendererProps {
  toolSlug: string;
  isPro?: boolean;
}

export function ToolRenderer({ toolSlug, isPro = false }: ToolRendererProps) {
  const tool = toolsConfig.find((t) => t.slug === toolSlug)!;
  const { isProcessing, processingProgress, activeFiles, processedUrl, extractedText, setActiveFiles, removeActiveFile, setIsProcessing, setProcessingProgress, setProcessedUrl, setExtractedText } = useAppStore();
  const Icon = tool.icon;

  const [ocrLang, setOcrLang] = useState("eng");
  const [imageFilter, setImageFilter] = useState("grayscale");
  const [maxSize, setMaxSize] = useState(1);
  const [maxDim, setMaxDim] = useState(1920);
  const [copied, setCopied] = useState(false);
  const [resizeScale, setResizeScale] = useState(50);
  const [cropRatio, setCropRatio] = useState("1:1");

  const isMultiFile = tool.slug === "merge-pdf" || tool.slug === "image-to-pdf";

  const onDrop = React.useCallback((acceptedFiles: File[]) => {
    if (isMultiFile) {
      setActiveFiles([...activeFiles, ...acceptedFiles]);
    } else {
      setActiveFiles([acceptedFiles[0]]);
    }
  }, [activeFiles, isMultiFile, setActiveFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    multiple: isMultiFile
  });

  // Get 3 related tools based on category
  const relatedTools = toolsConfig
    .filter(t => t.category === tool.category && t.id !== tool.id)
    .slice(0, 3);

  const onSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (activeFiles.length === 0 && tool.slug !== "document-editor") return;
    setIsProcessing(true);
    setProcessingProgress(0);
    try {
      let url = "";
      
      if (tool.isAi) {
        // Placeholder AI Processing Logic
        for (let i = 1; i <= 100; i += 10) {
          setProcessingProgress(i);
          await new Promise(r => setTimeout(r, 200));
        }
        const aiText = `[AI GENERATED PLACEHOLDER OUTPUT]\n\nTool Used: ${tool.title}\nStatus: Successfully Processed\n\nThis is a premium AI feature demonstration. Your file has been intelligently analyzed and optimized using our placeholder AI pipeline.`;
        setExtractedText(aiText);
        const blob = new Blob([aiText], { type: "text/plain" });
        url = URL.createObjectURL(blob);
        
      } else if (tool.slug === "ocr") {
        const text = await processOcrTool(activeFiles[0], ocrLang, (p) => setProcessingProgress(Math.round(p * 100)));
        setExtractedText(text);
        const blob = new Blob([text], { type: "text/plain" });
        url = URL.createObjectURL(blob);
      } else if (tool.category === "Image") {
        url = await processImageTool(activeFiles, tool.slug, { 
          filter: imageFilter,
          maxSizeMB: maxSize,
          maxWidthOrHeight: maxDim,
          scale: resizeScale,
          aspectRatio: cropRatio
        });
      } else if (tool.slug === "image-to-pdf") {
        url = await processImageTool(activeFiles, tool.slug);
      } else {
        url = await processPdfTool(activeFiles, tool.slug);
      }
      
      setProcessedUrl(url);
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setActiveFiles([]);
    setProcessedUrl(null);
    setExtractedText(null);
    setProcessingProgress(0);
    setCopied(false);
  };

  const copyToClipboard = () => {
    if (extractedText) {
      navigator.clipboard.writeText(extractedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="container mx-auto px-4 max-w-4xl py-8">
      {/* SEO Content & Tool Header */}
      <div className="flex flex-col items-center text-center space-y-4 mb-12">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`h-20 w-20 rounded-2xl flex items-center justify-center ${tool.color} shadow-sm`}
        >
          <Icon size={40} strokeWidth={1.5} />
        </motion.div>
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-4xl font-bold text-slate-900 dark:text-white"
        >
          {tool.title}
        </motion.h1>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl"
        >
          {tool.description} Fast, secure, and 100% free online {tool.title.toLowerCase()} tool. No registration required.
        </motion.p>
      </div>

      {/* Main Tool Area or Document Editor */}
      {tool.slug === "document-editor" ? (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-16"
        >
          <DocumentEditor />
        </motion.div>
      ) : tool.slug === "resume-builder" || tool.slug === "ai-resume-builder" ? (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-16"
        >
          {(tool.isAi || tool.isProRequired) && !isPro ? (
            <div className="bg-slate-900 rounded-3xl p-8 md:p-12 border border-violet-500/30 text-center relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 bg-gradient-to-r from-violet-600 to-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
                Premium Feature
              </div>
              <div className="w-16 h-16 bg-violet-500/10 text-violet-400 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-violet-500/20">
                <Icon size={32} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Unlock {tool.title}</h3>
              <p className="text-slate-400 max-w-lg mx-auto mb-8">
                This feature is available exclusively on the AayuDocs Pro plan. Upgrade now to get unlimited access to all tools and premium templates.
              </p>
              <Link href="/pricing">
                <Button className="h-12 px-8 text-lg font-semibold bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white border-0 shadow-lg shadow-violet-500/20">
                  Upgrade to Pro
                </Button>
              </Link>
            </div>
          ) : (
            <ResumeBuilderWorkspace />
          )}
        </motion.div>
      ) : tool.slug === "pdf-editor" || tool.slug === "ppt-editor" ? (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-16"
        >
          {(tool.isAi || tool.isProRequired) && !isPro ? (
            <div className="bg-slate-900 rounded-3xl p-8 md:p-12 border border-violet-500/30 text-center relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 bg-gradient-to-r from-violet-600 to-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
                Premium Feature
              </div>
              <div className="w-16 h-16 bg-violet-500/10 text-violet-400 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-violet-500/20">
                <Icon size={32} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Unlock {tool.title}</h3>
              <p className="text-slate-400 max-w-lg mx-auto mb-8">
                Direct editing of PDF and PPT files is available exclusively on the AayuDocs Pro plan. Upgrade now to get full edit access.
              </p>
              <Link href="/pricing">
                <Button className="h-12 px-8 text-lg font-semibold bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white border-0 shadow-lg shadow-violet-500/20">
                  Upgrade to Pro
                </Button>
              </Link>
            </div>
          ) : (
            <PdfPptEditor type={tool.slug === "pdf-editor" ? "pdf" : "ppt"} />
          )}
        </motion.div>
      ) : tool.slug === "background-remover" || tool.slug === "ai-bg-removal" ? (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-16"
        >
          {(tool.isAi || tool.isProRequired) && !isPro ? (
            <div className="bg-slate-900 rounded-3xl p-8 md:p-12 border border-violet-500/30 text-center relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 bg-gradient-to-r from-violet-600 to-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
                Premium Feature
              </div>
              <div className="w-16 h-16 bg-violet-500/10 text-violet-400 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-violet-500/20">
                <Icon size={32} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Unlock {tool.title}</h3>
              <p className="text-slate-400 max-w-lg mx-auto mb-8">
                This AI-powered feature is available exclusively on the AayuDocs Pro plan. Upgrade now to get unlimited access to all AI tools and priority processing speeds.
              </p>
              <Link href="/pricing">
                <Button className="h-12 px-8 text-lg font-semibold bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white border-0 shadow-lg shadow-violet-500/20">
                  Upgrade to Pro
                </Button>
              </Link>
            </div>
          ) : (
            <BackgroundRemoverEditor />
          )}
        </motion.div>
      ) : (
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mb-16"
      >
        {(tool.isAi || tool.isProRequired) && !isPro ? (
          <div className="bg-slate-900 rounded-3xl p-8 md:p-12 border border-violet-500/30 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 bg-gradient-to-r from-violet-600 to-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
              Premium Feature
            </div>
            <div className="w-16 h-16 bg-violet-500/10 text-violet-400 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-violet-500/20">
              <Icon size={32} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Unlock {tool.title}</h3>
            <p className="text-slate-400 max-w-lg mx-auto mb-8">
              This AI-powered feature is available exclusively on the AayuDocs Pro plan. Upgrade now to get unlimited access to all AI tools and priority processing speeds.
            </p>
            <Link href="/pricing">
              <Button className="h-12 px-8 text-lg font-semibold bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white border-0 shadow-lg shadow-violet-500/20">
                Upgrade to Pro
              </Button>
            </Link>
          </div>
        ) : !processedUrl ? (
          <form onSubmit={onSubmit} className="space-y-8">
            {/* Upload Section / File Preview */}
            <div 
              {...getRootProps()}
              className={`group relative rounded-3xl border-2 border-dashed ${isDragActive ? 'border-emerald-400 bg-emerald-50/50 dark:bg-emerald-900/20' : 'border-violet-200 dark:border-violet-900/50 bg-white/80 dark:bg-slate-900/50'} backdrop-blur-xl p-8 md:p-12 transition-all hover:border-violet-400 hover:bg-violet-50/50 dark:hover:bg-slate-800/50 shadow-xl shadow-violet-100/50 dark:shadow-none cursor-pointer`}
            >
              <input {...getInputProps()} />
              {activeFiles.length === 0 ? (
                <div className="flex flex-col items-center justify-center space-y-6">
                  <div className={`h-20 w-20 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-sm bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400 group-hover:scale-110`}>
                    <FileUp size={40} strokeWidth={1.5} />
                  </div>
                  <div className="space-y-2 text-center">
                    <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">
                      Drag & drop files here
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400">
                      or click to browse your computer
                    </p>
                  </div>
                  <Button type="button" size="lg" className="h-14 px-8 text-lg rounded-xl bg-gradient-to-r from-violet-600 to-blue-500 hover:from-violet-700 hover:to-blue-600 text-white shadow-lg pointer-events-none">
                    <Upload className="mr-2 h-5 w-5" />
                    Select {isMultiFile ? "Files" : "File"}
                  </Button>
                </div>
              ) : (
                /* File Preview */
                <div className="flex flex-col items-center space-y-4" onClick={(e) => e.stopPropagation()}>
                  {activeFiles.map((file, idx) => (
                    <div key={idx} className="relative w-full max-w-sm bg-white dark:bg-slate-800 rounded-xl p-4 flex items-center space-x-4 border border-slate-200 dark:border-slate-700 shadow-sm">
                      <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${tool.color}`}>
                        <File size={24} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                          {file.name}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => removeActiveFile(idx)}
                        className="p-2 text-slate-400 hover:text-rose-500 transition-colors z-20"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  ))}
                  
                  {isMultiFile && (
                    <Button type="button" variant="outline" className="mt-4" onClick={(e) => e.stopPropagation()}>
                      <label className="cursor-pointer flex items-center">
                        <Upload className="mr-2 h-4 w-4" /> Add more files
                        <input type="file" multiple className="hidden" onChange={(e) => {
                          if (e.target.files) {
                            setActiveFiles([...activeFiles, ...Array.from(e.target.files)]);
                          }
                        }} />
                      </label>
                    </Button>
                  )}
                </div>
              )}
            </div>

            {/* Convert Button & Settings */}
            {activeFiles.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm"
              >
                <div className="flex items-center space-x-2 mb-4 text-slate-800 dark:text-slate-200">
                  <Settings size={20} />
                  <h3 className="text-lg font-semibold">Settings</h3>
                </div>

                {tool.slug === 'ocr' && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Select Language</label>
                    <select 
                      value={ocrLang} 
                      onChange={(e) => setOcrLang(e.target.value)}
                      className="w-full md:w-1/2 p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-violet-500"
                    >
                      <option value="eng">English</option>
                      <option value="spa">Spanish</option>
                      <option value="fra">French</option>
                      <option value="deu">German</option>
                      <option value="ita">Italian</option>
                      <option value="por">Portuguese</option>
                      <option value="hin">Hindi</option>
                      <option value="ara">Arabic</option>
                      <option value="jpn">Japanese</option>
                      <option value="chi_sim">Chinese (Simplified)</option>
                    </select>
                  </div>
                )}
                
                {tool.slug === 'image-color-change' && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Select Filter</label>
                    <select 
                      value={imageFilter} 
                      onChange={(e) => setImageFilter(e.target.value)}
                      className="w-full md:w-1/2 p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-violet-500"
                    >
                      <option value="grayscale">Grayscale</option>
                      <option value="sepia">Sepia</option>
                      <option value="invert">Invert</option>
                      <option value="boost">Color Boost</option>
                    </select>
                  </div>
                )}
                
                {tool.slug === 'compress-image' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Target Max Size (MB)</label>
                      <Input 
                        type="number" 
                        step="0.1"
                        min="0.1"
                        value={maxSize} 
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMaxSize(Number(e.target.value))}
                        className="bg-white dark:bg-slate-800"
                      />
                      <p className="text-[10px] text-slate-500 italic">e.g. 0.5 for 500KB</p>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Max Dimension (Pixels)</label>
                      <Input 
                        type="number" 
                        value={maxDim} 
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMaxDim(Number(e.target.value))}
                        className="bg-white dark:bg-slate-800"
                      />
                      <p className="text-[10px] text-slate-500 italic">Longest side (width or height)</p>
                    </div>
                  </div>
                )}

                {tool.slug === 'resize-image' && (
                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-700 dark:text-slate-300 font-medium">Resize Scale Percentage</span>
                      <span className="font-semibold text-violet-600 dark:text-violet-400">{resizeScale}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="10" 
                      max="100" 
                      value={resizeScale}
                      onChange={(e) => setResizeScale(Number(e.target.value))}
                      className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-violet-600"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>10% (Small)</span>
                      <span>100% (Original size)</span>
                    </div>
                  </div>
                )}

                {tool.slug === 'crop-image' && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Select Crop Aspect Ratio</label>
                    <select 
                      value={cropRatio} 
                      onChange={(e) => setCropRatio(e.target.value)}
                      className="w-full md:w-1/2 p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-violet-500"
                    >
                      <option value="1:1">Square (1:1)</option>
                      <option value="16:9">Widescreen (16:9)</option>
                      <option value="4:5">Portrait (4:5)</option>
                    </select>
                    <p className="text-[10px] text-slate-500 italic mt-1">Crops the center of the image to the specified aspect ratio.</p>
                  </div>
                )}

                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full h-14 text-lg bg-gradient-to-r from-violet-600 to-blue-500 hover:from-violet-700 hover:to-blue-600 text-white transition-all shadow-md shadow-violet-200 dark:shadow-none"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {tool.slug === 'ocr' ? `Scanning... ${processingProgress}%` : 'Processing...'}
                    </span>
                  ) : `Convert ${activeFiles.length > 1 ? activeFiles.length + " files" : activeFiles[0]?.name}`}
                </Button>
              </motion.div>
            )}
          </form>
        ) : (
          /* Download Result */
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="rounded-3xl border-2 border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/50 dark:bg-emerald-900/10 p-8 md:p-12 text-center"
          >
            <div className="flex flex-col items-center justify-center space-y-6">
              <div className="h-20 w-20 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2">
                <CheckCircle size={40} />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Success!</h3>
                <p className="text-slate-600 dark:text-slate-400">Your file has been processed successfully.</p>
              </div>

              {/* AI or OCR Text Result */}
              {(tool.slug === 'ocr' || tool.isAi) && extractedText && (
                <div className="w-full max-w-2xl text-left mt-6 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm relative group">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-semibold text-slate-800 dark:text-slate-200">Extracted Text</h4>
                    <Button variant="ghost" size="sm" onClick={copyToClipboard} className="text-slate-500 hover:text-violet-600 dark:hover:text-violet-400">
                      {copied ? <CheckCircle className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                      {copied ? "Copied!" : "Copy Text"}
                    </Button>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl max-h-64 overflow-y-auto border border-slate-100 dark:border-slate-800">
                    <p className="whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-300 font-mono">
                      {extractedText}
                    </p>
                  </div>
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md mt-6">
                <a 
                  href={processedUrl} 
                  download={`processed_${activeFiles[0]?.name?.split('.')[0] || 'file'}${
                    (tool.slug === 'ocr' || tool.isAi) ? '.txt' :
                    tool.slug === 'pdf-to-word' ? '.doc' :
                    tool.slug.includes('-to-jpg') || tool.slug === 'heic-converter' ? '.jpg' :
                    tool.slug.includes('-to-png') ? '.png' :
                    tool.slug.includes('webp-converter') ? '.webp' :
                    tool.category === 'Image' ? '' :
                    '.pdf'
                  }`}
                  className="flex-1 h-14 text-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200 dark:shadow-none inline-flex items-center justify-center rounded-lg font-medium"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Download File
                </a>
                <Button 
                  variant="outline" 
                  size="lg" 
                  onClick={handleReset}
                  className="h-14"
                >
                  Process Another
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
      )}

      {/* SEO Information & Content */}
      <div className="prose prose-slate dark:prose-invert max-w-none mb-16">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">How to use {tool.title}</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Using our {tool.title.toLowerCase()} tool is simple, fast, and secure. Just drag and drop your file into the designated area above, or click to browse your device. Once uploaded, click the convert button, and our powerful cloud servers will process your file in seconds.
        </p>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Why use AayuDocs?</h3>
        <ul className="space-y-2 text-slate-600 dark:text-slate-400 list-disc list-inside">
          <li><strong>Bank-Grade Security:</strong> All files are encrypted using 256-bit SSL.</li>
          <li><strong>Privacy First:</strong> Files are automatically deleted from our servers after 2 hours.</li>
          <li><strong>Cross-Platform:</strong> Works on Windows, Mac, Linux, iOS, and Android.</li>
          <li><strong>Zero Installation:</strong> Completely online based, no software to download.</li>
        </ul>
      </div>

      {/* Related Tools */}
      {relatedTools.length > 0 && (
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Related Tools</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedTools.map((relatedTool) => {
              const RelatedIcon = relatedTool.icon;
              return (
                <Link
                  key={relatedTool.id}
                  href={`/tools/${relatedTool.slug}`}
                  className="group bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center"
                >
                  <div className={`h-12 w-12 rounded-xl flex items-center justify-center mb-4 ${relatedTool.color}`}>
                    <RelatedIcon size={24} />
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                    {relatedTool.title}
                  </h3>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Dynamic FAQ */}
      <FAQ />
    </div>
  );
}
