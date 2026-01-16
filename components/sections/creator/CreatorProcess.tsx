"use client";

import { motion } from "motion/react";

// COMPLIANCE EDIT C2: Changed "We handle the rest" to "Lovdash handles the posting"
const steps = [
  {
    number: "01",
    title: "Upload",
    description: "Drop your photos and videos into Lovdash. AI organizes everything automatically.",
  },
  {
    number: "02",
    title: "Schedule",
    description: "Pick your platforms and set your posting times. Lovdash handles the posting.",
  },
  {
    number: "03",
    title: "Grow",
    description: "Watch your analytics. See what's working. Create more of what your audience loves.",
  },
];

export function CreatorProcess() {
  return (
    <section id="process" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm font-semibold text-brand-600 uppercase tracking-wider mb-4"
          >
            How it works
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl font-bold text-slate-900"
          >
            Three steps to freedom
          </motion.h2>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting Line (desktop only) */}
          <div className="hidden lg:block absolute top-7 left-1/4 right-1/4 h-0.5 bg-slate-200" />

          <div className="flex flex-col lg:flex-row lg:justify-center gap-8 lg:gap-16">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative flex-1 max-w-xs mx-auto lg:mx-0 text-center"
              >
                {/* Step Number Circle */}
                <div className="w-14 h-14 bg-brand-500 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4 relative z-10">
                  {step.number}
                </div>
                
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-slate-600 leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
