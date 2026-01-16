"use client";

import { motion } from "motion/react";
import { Share2, Sparkles, Link, BarChart3 } from "lucide-react";

const features = [
  {
    icon: Share2,
    title: "One-Click Publishing",
    description: "Upload once, post to all your connected platforms. Same content, multiple destinations, zero extra work.",
  },
  {
    icon: Sparkles,
    title: "AI That Gets You",
    description: "Smart tagging, automatic descriptions, and content suggestions. Let AI handle the tedious stuff while you stay creative.",
  },
  {
    icon: Link,
    title: "Bio Link That Converts",
    description: "Create a beautiful link-in-bio page in minutes. Track every click. See where your fans actually go.",
  },
  {
    icon: BarChart3,
    title: "Know What Works",
    description: "Real-time analytics across all your platforms. See which content drives engagement, traffic, and revenue.",
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
            Built for Creators
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4"
          >
            Everything you need to grow—without the grind
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-600"
          >
            Simple tools that save you time and help you reach more fans.
          </motion.p>
        </div>

        {/* 2x2 Grid */}
        <div className="grid sm:grid-cols-2 gap-6 lg:gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white border border-slate-200 rounded-2xl p-8 hover:border-brand-300 hover:shadow-lg transition-all duration-200"
            >
              {/* Icon Container */}
              <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-brand-600" />
              </div>
              
              <h3 className="text-xl font-semibold text-slate-900 mb-2">{feature.title}</h3>
              <p className="text-slate-600 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
