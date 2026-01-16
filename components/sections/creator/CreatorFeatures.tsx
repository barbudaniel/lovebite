"use client";

import { motion } from "motion/react";
import { Clock, TrendingUp, Target, Shield } from "lucide-react";

const valueProps = [
  {
    icon: Clock,
    title: "Save Time",
    stat: "5+ hours saved every week",
    description: "On content management. Upload once, organize automatically, and reclaim your creative time.",
  },
  {
    icon: TrendingUp,
    title: "Earn More",
    stat: "Know exactly what content converts",
    description: "Track performance across platforms. Double down on what works. Grow your revenue.",
  },
  {
    icon: Target,
    title: "Post Smarter",
    stat: "Right content, right platform, right time",
    description: "AI-powered scheduling suggests optimal posting times. Reach more fans when they're active.",
  },
  {
    icon: Shield,
    title: "Stay Secure",
    stat: "Your content, your control",
    description: "Bank-level encryption. Private by default. You decide who sees what, always.",
  },
];

export function CreatorFeatures() {
  return (
    <section id="features" className="py-20 lg:py-28 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm font-semibold text-brand-600 uppercase tracking-wider mb-4"
          >
            Why Creators Choose Lovdash
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4"
          >
            The ROI you&apos;ll feel every week
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-600"
          >
            Real benefits that make a real difference in your creator business.
          </motion.p>
        </div>

        {/* 2x2 Value Props Grid */}
        <div className="grid sm:grid-cols-2 gap-6 lg:gap-8">
          {valueProps.map((prop, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white border border-slate-200 rounded-2xl p-8 hover:border-brand-300 hover:shadow-lg transition-all duration-200"
            >
              {/* Icon Container */}
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                <prop.icon className="w-6 h-6 text-emerald-600" />
              </div>
              
              <h3 className="text-xl font-semibold text-slate-900 mb-1">{prop.title}</h3>
              <p className="text-sm font-medium text-emerald-600 mb-3">{prop.stat}</p>
              <p className="text-slate-600 leading-relaxed">{prop.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
