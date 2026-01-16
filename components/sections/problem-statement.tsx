"use client";

import { motion } from "motion/react";

const painPoints = [
  {
    emoji: "❌",
    text: "Files everywhere",
  },
  {
    emoji: "❌",
    text: "Hours wasted organizing",
  },
  {
    emoji: "❌",
    text: "Platform-hopping to post",
  },
  {
    emoji: "❌",
    text: "Flying blind on what converts",
  },
];

export function ProblemStatement() {
  return (
    <section id="problem" className="py-20 lg:py-28 bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-12"
        >
          Running a creator business shouldn&apos;t feel like chaos.
        </motion.h2>

        {/* Pain Points Grid */}
        <div className="grid sm:grid-cols-2 gap-6 lg:gap-8 max-w-2xl mx-auto">
          {painPoints.map((point, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl p-5 text-left"
            >
              <span className="text-2xl" role="img" aria-label="Problem">
                {point.emoji}
              </span>
              <span className="text-lg font-medium text-slate-700">
                {point.text}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Transition */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-lg text-slate-600"
        >
          There&apos;s a better way.
        </motion.p>
      </div>
    </section>
  );
}
