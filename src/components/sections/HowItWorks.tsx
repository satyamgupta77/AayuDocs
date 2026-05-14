"use client";

import { motion } from "framer-motion";
import { UploadCloud, Settings2, DownloadCloud } from "lucide-react";

const steps = [
  {
    icon: <UploadCloud className="h-8 w-8" />,
    title: "1. Upload your file",
    description: "Drag and drop your document into our tool or select it from your computer or cloud storage."
  },
  {
    icon: <Settings2 className="h-8 w-8" />,
    title: "2. Choose your options",
    description: "Select the specific tool you need and adjust any necessary settings or parameters for your file."
  },
  {
    icon: <DownloadCloud className="h-8 w-8" />,
    title: "3. Download the result",
    description: "Wait just a few seconds for the process to complete, then download your newly optimized file."
  }
];

export function HowItWorks() {
  return (
    <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-violet-600/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold mb-6"
          >
            How it works
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-300"
          >
            Three simple steps is all it takes to transform your documents.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting line (desktop only) */}
          <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-transparent via-violet-500/50 to-transparent -z-10"></div>

          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="flex flex-col items-center text-center relative"
            >
              <div className="h-24 w-24 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center mb-8 relative z-10 text-violet-400 shadow-xl shadow-violet-900/20">
                {step.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
              <p className="text-slate-400 leading-relaxed max-w-sm">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
