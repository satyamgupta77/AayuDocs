"use client";

import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toolsConfig } from "@/config/tools";
import Link from "next/link";

export function ToolGrid() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTools = toolsConfig.filter(tool => 
    tool.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    tool.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <section id="tools" className="py-20 bg-slate-50 dark:bg-slate-900/50 relative">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Most Popular Tools</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Everything you need to manage your documents, in one place. Explore our most used features below.
            </p>
          </div>
          <div className="w-full md:w-80 mt-6 md:mt-0 relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input 
                type="text" 
                placeholder="Search tools..." 
                className="pl-10 h-12 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl focus-visible:ring-violet-500 shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {filteredTools.length > 0 ? (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6"
          >
            {filteredTools.map((tool) => {
              const Icon = tool.icon;
              return (
              <motion.div variants={itemVariants} key={tool.slug}>
                <Link
                  href={`/tools/${tool.slug}`}
                  className={`group h-full relative rounded-2xl p-6 border shadow-sm transition-all duration-500 flex flex-col items-center text-center hover:-translate-y-1 overflow-hidden ${
                    tool.isAi 
                      ? 'bg-slate-900 border-violet-500/30 hover:border-violet-500 hover:shadow-[0_0_30px_-5px_rgba(139,92,246,0.3)]' 
                      : 'bg-card dark:bg-slate-900 border-border dark:border-slate-800 hover:shadow-xl hover:border-violet-100 dark:hover:border-violet-900'
                  }`}
                >
                  {/* Glowing AI background effect */}
                  {tool.isAi && (
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 via-transparent to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  )}

                  <div className={`h-14 w-14 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-500 group-hover:scale-110 relative z-10 ${tool.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>

                  <h3 className={`text-lg font-semibold mb-2 transition-colors relative z-10 ${
                    tool.isAi
                      ? 'text-white group-hover:text-violet-300'
                      : 'text-slate-900 dark:text-white group-hover:text-violet-700 dark:group-hover:text-violet-400'
                  }`}>
                    {tool.title}
                  </h3>
                  
                  <p className={`text-sm relative z-10 ${
                    tool.isAi ? 'text-slate-400' : 'text-slate-500 dark:text-slate-400'
                  }`}>
                    {tool.description}
                  </p>
                  
                  {/* AI Badge */}
                  {tool.isAi && (
                    <div className="absolute top-3 right-3 bg-gradient-to-r from-violet-600 to-blue-600 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full shadow-[0_0_10px_rgba(139,92,246,0.5)]">
                      AI Powered
                    </div>
                  )}

                  {/* Standard Hover gradient border effect */}
                  {!tool.isAi && (
                    <div className="absolute inset-0 border-2 border-transparent rounded-2xl group-hover:border-violet-500/10 dark:group-hover:border-violet-500/20 transition-colors pointer-events-none"></div>
                  )}
                </Link>
              </motion.div>
            )})}
          </motion.div>
        ) : (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mb-4">
              <Search className="h-10 w-10" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">No tools found</h3>
            <p className="text-slate-500 dark:text-slate-400">Try adjusting your search query to find what you're looking for.</p>
          </div>
        )}
      </div>
    </section>
  );
}
