"use client";

import { motion } from "motion/react";
import { UserPlus, Upload, Calendar, LineChart } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: UserPlus,
    title: "Onboard Creators",
    description: "Add creators to your roster in seconds. Set permissions for each team member. Everyone sees exactly what they need.",
  },
  {
    number: "02",
    icon: Upload,
    title: "Upload Everything",
    description: "Bulk upload media for any creator. AI automatically tags, describes, and organizes. No manual sorting.",
  },
  {
    number: "03",
    icon: Calendar,
    title: "Schedule at Scale",
    description: "Create posting schedules and templates. Apply them across your roster. Consistent output, less effort.",
  },
  {
    number: "04",
    icon: LineChart,
    title: "Track Performance",
    description: "Real-time analytics across all creators. Cross-roster reports. Know what's working.",
  },
];

export function StudioProcess() {
  return (
    <section id="studio-process" className="py-20 lg:py-28 bg-white">
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
            From chaos to clarity in four steps
          </motion.h2>
        </div>

        {/* Steps Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-md transition-shadow"
            >
              {/* Step Number */}
              <div className="absolute -top-3 left-6">
                <span className="inline-flex items-center justify-center w-8 h-8 bg-brand-500 text-white text-sm font-bold rounded-full">
                  {step.number}
                </span>
              </div>
              
              {/* Icon */}
              <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center mt-4 mb-4">
                <step.icon className="w-6 h-6 text-brand-600" />
              </div>
              
              <h3 className="text-lg font-semibold text-slate-900 mb-2">{step.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
