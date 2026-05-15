"use client";

import { motion } from "framer-motion";
import { Shield, Zap, RefreshCw, Cloud, Smartphone, Globe } from "lucide-react";

const features = [
  {
    icon: <Shield className="h-6 w-6" />,
    title: "Bank-Grade Security",
    description: "Your files are encrypted using 256-bit SSL and automatically deleted from our servers after 2 hours."
  },
  {
    icon: <Zap className="h-6 w-6" />,
    title: "Lightning Fast",
    description: "Our dedicated processing servers ensure your files are converted and ready to download in seconds."
  },
  {
    icon: <RefreshCw className="h-6 w-6" />,
    title: "Batch Processing",
    description: "Save time by processing multiple files at once. Perfect for large projects and massive document conversions."
  },
  {
    icon: <Cloud className="h-6 w-6" />,
    title: "Cloud Integration",
    description: "Directly import and save your files to Google Drive, Dropbox, or OneDrive with a single click."
  },
  {
    icon: <Smartphone className="h-6 w-6" />,
    title: "Mobile Friendly",
    description: "Fully responsive design means you can work on your documents from your phone, tablet, or desktop."
  },
  {
    icon: <Globe className="h-6 w-6" />,
    title: "Works Anywhere",
    description: "No installation required. Access all our tools directly from your web browser on any operating system."
  }
];

export function Features() {
  return (
    <section id="features" className="py-20 md:py-32 bg-background dark:bg-slate-950 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-violet-50/50 dark:bg-violet-900/10 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-blue-50/50 dark:bg-blue-900/10 blur-3xl"></div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6"
          >
            Why choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-blue-500">AayuDocs</span>?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-600 dark:text-slate-400"
          >
            We've built our platform from the ground up to be the fastest, most secure, and easiest way to manage all your document needs.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-card dark:bg-slate-900 rounded-2xl p-8 border border-border dark:border-slate-800 shadow-sm hover:shadow-xl dark:hover:shadow-none hover:-translate-y-1 transition-all duration-300"
            >
              <div className="h-12 w-12 rounded-xl bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{feature.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
