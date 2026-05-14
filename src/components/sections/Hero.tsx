"use client";

import { motion } from "framer-motion";
import { Upload, FileUp, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 right-0 -z-10 h-[500px] w-full bg-gradient-to-b from-violet-50/80 via-white to-white"></div>
      <div className="absolute top-[-10%] right-[-5%] -z-10 w-[600px] h-[600px] rounded-full bg-violet-200/40 blur-3xl opacity-60"></div>
      <div className="absolute top-[20%] left-[-10%] -z-10 w-[500px] h-[500px] rounded-full bg-blue-200/40 blur-3xl opacity-60"></div>

      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center rounded-full border border-violet-200 bg-white/50 px-3 py-1 text-sm text-violet-600 mb-6 backdrop-blur-sm shadow-sm">
              <Sparkles className="mr-2 h-4 w-4" />
              <span>The all-in-one document workspace</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 mb-6 leading-tight"
          >
            Every tool you need to work with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-blue-500">
              Files & PDFs
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto"
          >
            Compress, edit, merge, convert, and sign your documents easily. Fast, secure, and completely free to start.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="relative max-w-3xl mx-auto"
          >
            {/* Upload Dropzone */}
            <div className="group relative rounded-3xl border-2 border-dashed border-violet-200 bg-white/80 backdrop-blur-xl p-12 transition-all hover:border-violet-400 hover:bg-violet-50/50 shadow-xl shadow-violet-100/50">
              <div className="flex flex-col items-center justify-center space-y-6">
                <div className="h-20 w-20 rounded-2xl bg-violet-100 text-violet-600 flex items-center justify-center group-hover:scale-110 group-hover:bg-violet-600 group-hover:text-white transition-all duration-300 shadow-sm">
                  <FileUp size={40} strokeWidth={1.5} />
                </div>
                <div className="space-y-2 text-center">
                  <h3 className="text-2xl font-semibold text-slate-900">Drag & drop files here</h3>
                  <p className="text-slate-500">or click to browse your computer</p>
                </div>
                <Button size="lg" className="h-14 px-8 text-lg rounded-xl bg-gradient-to-r from-violet-600 to-blue-500 hover:from-violet-700 hover:to-blue-600 shadow-lg shadow-violet-200 hover:shadow-violet-300 transition-all">
                  <Upload className="mr-2 h-5 w-5" />
                  Select Files
                </Button>
                <p className="text-xs text-slate-400 font-medium">Supports PDF, Word, JPG, PNG, and 50+ formats</p>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -left-12 top-1/2 hidden lg:block animate-bounce" style={{ animationDuration: '3s' }}>
              <div className="rounded-xl bg-white p-3 shadow-lg shadow-blue-100 border border-blue-50">
                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 font-bold">PDF</div>
              </div>
            </div>
            <div className="absolute -right-8 -top-8 hidden lg:block animate-bounce" style={{ animationDuration: '4s' }}>
              <div className="rounded-xl bg-white p-3 shadow-lg shadow-violet-100 border border-violet-50">
                <div className="h-10 w-10 rounded-lg bg-violet-100 flex items-center justify-center text-violet-600 font-bold">DOC</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
