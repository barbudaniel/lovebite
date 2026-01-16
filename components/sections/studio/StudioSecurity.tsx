"use client";

import { motion } from "motion/react";
import { 
  Shield, 
  Lock, 
  Server, 
  KeyRound, 
  FileSearch,
  BadgeCheck
} from "lucide-react";

const securityFeatures = [
  {
    icon: Lock,
    title: "Bank-Level Encryption",
    description: "All data encrypted at rest and in transit using AES-256 and TLS 1.3. Your content is protected by the same standards used by financial institutions.",
  },
  {
    icon: Server,
    title: "Isolated Environments",
    description: "Each creator account is completely isolated. No cross-contamination of data, no shared access between accounts.",
  },
  {
    icon: KeyRound,
    title: "Instant Access Revocation",
    description: "Remove team member access with one click. Changes take effect immediately across all connected platforms and services.",
  },
  {
    icon: FileSearch,
    title: "Complete Audit Trails",
    description: "Every action logged with timestamp and user. Full accountability for compliance, disputes, and security reviews.",
  },
  {
    icon: BadgeCheck,
    title: "SOC 2 Compliance",
    description: "Currently on our roadmap. We're building toward enterprise-grade compliance standards for agencies that require it.",
    badge: "Roadmap",
  },
];

export function StudioSecurity() {
  return (
    <section id="studio-security" className="py-20 lg:py-28 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-6"
          >
            <Shield className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-medium text-emerald-400">Enterprise Security</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4"
          >
            Security your agency can trust
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-400 max-w-2xl mx-auto"
          >
            Your creators trust you with their business. We take that responsibility seriously with enterprise-grade security at every layer.
          </motion.p>
        </div>

        {/* Security Feature Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {securityFeatures.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="bg-slate-800/50 border border-slate-700 hover:border-emerald-500/50 rounded-2xl p-6 h-full transition-colors duration-300"
              >
                {/* Icon Container */}
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-emerald-400" />
                  </div>
                  {feature.badge && (
                    <span className="px-2 py-1 text-xs font-medium text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-full">
                      {feature.badge}
                    </span>
                  )}
                </div>
                
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Trust Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-slate-800/50 border border-slate-700 rounded-full">
            <Lock className="w-5 h-5 text-emerald-400" />
            <span className="text-slate-300">
              Your data. Your control. Always.
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
