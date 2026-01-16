"use client";

import { motion } from "motion/react";

const painPoints = [
  {
    title: "Platform juggling",
    description: "Posting to 5 platforms means 5 logins, 5 uploads, 5 captions. By the time you're done, you've lost hours—and your creative energy.",
  },
  {
    title: "Time drain",
    description: "You didn't become a creator to spend your days formatting posts and checking analytics dashboards. Yet here we are.",
  },
  {
    title: "Growth guesswork",
    description: "You're posting consistently, but is it working? Without real data, you're flying blind and hoping for the best.",
  },
];

export function CreatorPainPoints() {
  return (
    <section id="pain" className="py-20 lg:py-28 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Kicker */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-sm font-semibold text-brand-600 uppercase tracking-wider text-center mb-12"
        >
          Sound familiar?
        </motion.p>

        {/* Pain Point Cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {painPoints.map((point, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white border border-slate-200 border-l-[3px] border-l-brand-400 rounded-xl p-6 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
            >
              <h3 className="text-lg font-semibold text-slate-900 mb-2">{point.title}</h3>
              <p className="text-slate-600 leading-relaxed">{point.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Transition Line */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-lg text-slate-700 text-center font-medium"
        >
          Sound exhausting? There&apos;s a better way.
        </motion.p>
      </div>
    </section>
  );
}
