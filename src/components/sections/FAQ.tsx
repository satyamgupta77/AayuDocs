"use client";

import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Are my files safe and secure?",
    answer: "Absolutely. We use 256-bit SSL encryption to ensure your files are completely secure during transfer. Additionally, all files are automatically and permanently deleted from our servers 2 hours after processing."
  },
  {
    question: "Is AayuDocs really free to use?",
    answer: "Yes! The core features of AayuDocs are 100% free to use. We don't require an account or credit card for basic document processing. We do offer premium plans for power users who need higher file size limits or batch processing."
  },
  {
    question: "Do I need to install any software?",
    answer: "No, AayuDocs is entirely cloud-based. You can access all our tools directly from your web browser on any device (Windows, Mac, Linux, iOS, Android) without installing anything."
  },
  {
    question: "What is the maximum file size limit?",
    answer: "Free users can upload files up to 50MB per document. If you upgrade to our Pro plan, you can process files up to 1GB and process multiple files simultaneously."
  },
  {
    question: "Does it work on mobile devices?",
    answer: "Yes, our website is fully optimized for mobile devices. You can easily process documents directly from your iPhone, iPad, or Android device using just your mobile browser."
  }
];

export function FAQ() {
  return (
    <section id="faq" className="py-20 md:py-32 bg-slate-50 dark:bg-slate-950/50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6"
          >
            Frequently Asked Questions
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-600 dark:text-slate-400"
          >
            Everything you need to know about the product and billing.
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="max-w-3xl mx-auto bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-10 shadow-sm border border-slate-100 dark:border-slate-800"
        >
          <Accordion className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-b-slate-100 dark:border-b-slate-800 py-2">
                <AccordionTrigger className="text-left text-lg font-semibold text-slate-900 dark:text-white hover:text-violet-600 dark:hover:text-violet-400 hover:no-underline data-[state=open]:text-violet-600 dark:data-[state=open]:text-violet-400">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 dark:text-slate-400 text-base leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
