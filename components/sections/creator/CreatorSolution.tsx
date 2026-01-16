"use client";

import { motion } from "motion/react";

export function CreatorSolution() {
  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Kicker */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-sm font-semibold text-brand-600 uppercase tracking-wider mb-4"
        >
          Your Content Operating System
        </motion.p>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-4xl lg:text-[40px] font-bold text-slate-900 mb-6"
        >
          One upload. Every platform. Zero hassle.
        </motion.h2>

        {/* Body */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed"
        >
          Lovdash is your personal content command center. Upload your media once, and we&apos;ll organize it with AI, schedule it across all your platforms, and show you exactly what&apos;s working. Less admin. More creating. Better results.
        </motion.p>

        {/* Product Screenshot Placeholder */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-12 max-w-3xl mx-auto"
        >
          <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl shadow-xl border border-slate-200 flex items-center justify-center">
            <span className="text-slate-400 text-sm">Product Screenshot</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
