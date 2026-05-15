"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Marketing Manager",
    content: "AayuDocs has completely transformed how our team handles documents. The batch processing feature alone saves me hours every week. It's simply the best tool out there.",
    rating: 5,
    avatar: "S"
  },
  {
    name: "Michael Chen",
    role: "Freelance Designer",
    content: "The image compression is incredible. I can reduce file sizes by 80% without any noticeable loss in quality. Plus, the UI is absolutely beautiful and a joy to use.",
    rating: 5,
    avatar: "M"
  },
  {
    name: "Emily Rodriguez",
    role: "Legal Assistant",
    content: "Security is paramount in my field. Knowing that AayuDocs uses bank-grade encryption and automatically deletes my files gives me complete peace of mind. Highly recommended.",
    rating: 5,
    avatar: "E"
  }
];

export function Testimonials() {
  return (
    <section className="py-20 md:py-32 bg-white dark:bg-slate-950">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6"
          >
            Loved by thousands
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-600 dark:text-slate-400"
          >
            Don't just take our word for it. Here's what our users have to say.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-slate-50 dark:bg-slate-900/50 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 hover:shadow-xl dark:hover:shadow-none hover:border-violet-100 dark:hover:border-violet-900 transition-all duration-300"
            >
              <div className="flex text-amber-400 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-current" />
                ))}
              </div>
              <p className="text-slate-700 dark:text-slate-300 text-lg mb-8 leading-relaxed italic">
                "{testimonial.content}"
              </p>
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-violet-600 to-blue-500 text-white flex items-center justify-center text-xl font-bold mr-4">
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">{testimonial.name}</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
