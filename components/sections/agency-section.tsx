"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { 
  Building2, 
  Users, 
  ShieldCheck, 
  FileText, 
  BarChart3, 
  Trophy,
  ArrowRight,
  Lock,
  UserCog,
  Eye
} from "lucide-react";
import { AnimatedSection } from "@/components/motion/animated-section";

const agencyFeatures = [
  {
    icon: Building2,
    title: "Multi-Creator Dashboard",
    description: "Manage all your creators from one unified dashboard. See performance at a glance.",
  },
  {
    icon: Users,
    title: "Team Management",
    description: "Add team members with customizable permissions. Collaborate without chaos.",
  },
  {
    icon: UserCog,
    title: "Role-Based Access",
    description: "Control who sees what. Managers, editors, and viewers get tailored access.",
  },
  {
    icon: FileText,
    title: "Audit Logs",
    description: "Complete activity trails. Know exactly who did what and when.",
  },
  {
    icon: BarChart3,
    title: "Cross-Creator Analytics",
    description: "Compare performance across creators. Identify trends and top performers.",
  },
  {
    icon: Trophy,
    title: "Gamification",
    description: "Motivate your team with leaderboards, goals, and performance tracking.",
  },
];

const securityFeatures = [
  { icon: Lock, text: "Bank-level encryption" },
  { icon: UserCog, text: "Role-based access" },
  { icon: Eye, text: "Complete audit logs" },
];

export function AgencySection() {
  return (
    <section id="for-agencies" className="py-20 lg:py-28 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <AnimatedSection className="text-center mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-6">
            <Building2 className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-medium text-emerald-400">For Agencies</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            Built for teams who manage creators
          </h2>
          <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
            Scale your agency without the chaos. Lovdash gives you the tools to manage multiple creators, coordinate your team, and track everything.
          </p>
        </AnimatedSection>

        {/* Security Badges */}
        <AnimatedSection className="flex flex-wrap justify-center gap-4 mb-12">
          {securityFeatures.map((feature, index) => (
            <motion.div
              key={feature.text}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-full"
            >
              <feature.icon className="w-4 h-4 text-emerald-400" />
              <span className="text-sm text-slate-300">{feature.text}</span>
            </motion.div>
          ))}
        </AnimatedSection>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {agencyFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="bg-slate-800/50 border border-slate-700 hover:border-emerald-500/50 rounded-2xl p-6 h-full transition-colors duration-300"
              >
                <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <AnimatedSection className="text-center">
          <div className="bg-gradient-to-br from-slate-800 to-slate-800/50 border border-slate-700 rounded-2xl p-8 lg:p-12 max-w-2xl mx-auto">
            <ShieldCheck className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-3">
              Ready to scale your agency?
            </h3>
            <p className="text-slate-400 mb-6">
              See how Lovdash can streamline your operations and help your creators grow.
            </p>
            
            {/* CTA Button */}
            <Link
              href="/contact?type=demo"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold rounded-full shadow-lg shadow-emerald-500/25 transition-all duration-300 group"
            >
              Book a Demo
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            {/* Trust Signal */}
            <p className="mt-6 text-sm text-slate-500">
              No credit card required. See the platform before you commit.
            </p>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
