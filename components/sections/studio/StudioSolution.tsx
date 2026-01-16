"use client";

import { motion } from "motion/react";

export function StudioSolution() {
  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Kicker */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-sm font-semibold text-brand-600 uppercase tracking-wider mb-4"
        >
          The Agency Operating System
        </motion.p>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-4xl lg:text-[40px] font-bold text-slate-900 mb-6"
        >
          One platform for your entire operation.
        </motion.h2>

        {/* Body */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed mb-12"
        >
          Upload, organize, schedule, and track—for every creator on your roster. Lovdash replaces your spreadsheets, shared drives, and guesswork with a single source of truth. Every team member sees what they need. Every creator stays on schedule. Every post gets tracked.
        </motion.p>

        {/* Dashboard Placeholder */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="max-w-5xl mx-auto"
        >
          <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl shadow-2xl border border-slate-200 flex items-center justify-center">
            <span className="text-slate-400 text-sm">Agency Dashboard Preview</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
