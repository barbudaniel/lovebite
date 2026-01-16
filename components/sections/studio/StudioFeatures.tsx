"use client";

import { motion } from "motion/react";
import { LayoutDashboard, Shield, FileText, TrendingUp, Activity, Layers } from "lucide-react";

const features = [
  {
    icon: LayoutDashboard,
    title: "Multi-Creator Dashboard",
    description: "See all creators at a glance. Filter by status, platform, or performance. Switch between accounts in one click.",
  },
  {
    icon: Shield,
    title: "Role-Based Access",
    description: "Admins, managers, uploaders—set permissions for every role. Control who sees what and who can do what.",
  },
  {
    icon: FileText,
    title: "Template Library",
    description: "Create posting templates once. Apply them across creators with one click. Consistent branding, faster execution.",
  },
  {
    icon: TrendingUp,
    title: "Cross-Creator Analytics",
    description: "Compare performance across your roster. Identify top performers. Spot trends before they disappear.",
  },
  {
    icon: Activity,
    title: "Activity Logs",
    description: "See who did what, when. Full accountability for your team. No more \"I thought you posted that.\"",
  },
  {
    icon: Layers,
    title: "Bulk Operations",
    description: "Upload, tag, and schedule for multiple creators at once. What took hours now takes minutes.",
  },
];

export function StudioFeatures() {
  return (
    <section id="studio-features" className="py-20 lg:py-28 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm font-semibold text-brand-600 uppercase tracking-wider mb-4"
          >
            Built for Scale
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4"
          >
            Tools designed for multi-creator operations
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-600"
          >
            Everything you need to manage your roster efficiently.
          </motion.p>
        </div>

        {/* 3-column Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-brand-300 hover:shadow-lg transition-all duration-200"
            >
              {/* Icon Container */}
              <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-brand-600" />
              </div>
              
              <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
              <p className="text-slate-600 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
