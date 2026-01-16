"use client";

import { motion } from "motion/react";
import { Table2, EyeOff, DollarSign } from "lucide-react";

const painPoints = [
  {
    icon: Table2,
    title: "Spreadsheets everywhere",
    description: "Schedules in Google Docs. Content in Dropbox. Analytics in... somewhere. You're losing hours to tab-switching.",
  },
  {
    icon: EyeOff,
    title: "No visibility",
    description: "You don't know what your team posted yesterday. Or what's scheduled for tomorrow. Every update requires a Slack message.",
  },
  {
    icon: DollarSign,
    title: "Missed revenue",
    description: "Content sitting in folders isn't making money. Inconsistent posting means inconsistent growth.",
  },
];

export function PainPoints() {
  return (
    <section className="py-20 lg:py-28 bg-slate-50">
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
              className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
            >
              {/* Icon */}
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
                <point.icon className="w-6 h-6 text-red-500" />
              </div>
              
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
          className="text-xl text-brand-600 text-center font-semibold"
        >
          There&apos;s a better way.
        </motion.p>
      </div>
    </section>
  );
}
