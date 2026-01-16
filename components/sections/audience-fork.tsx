"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { ArrowRight, User, Building2 } from "lucide-react";
import { AnimatedSection } from "@/components/motion/animated-section";

const audiences = [
  {
    icon: User,
    title: "I'm a creator",
    description: "Upload once, publish everywhere. AI helps organize the rest.",
    cta: "Join as creator",
    href: "/creator",
    features: ["AI-powered organization", "Multi-platform publishing", "Profile & analytics"],
  },
  {
    icon: Building2,
    title: "I run an agency",
    description: "Manage multiple creators from one dashboard. Scale without chaos.",
    cta: "Learn about agencies",
    href: "/studio",
    features: ["Team management", "Role-based access", "Cross-creator reporting"],
  },
];

export function AudienceFork() {
  return (
    <section id="audience" className="py-12 sm:py-16 lg:py-24 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-10 sm:mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            Built for how you work
          </h2>
          <p className="mt-3 sm:mt-4 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto">
            Whether you&apos;re an independent creator or managing a team, Lovdash fits your workflow.
          </p>
        </AnimatedSection>

        {/* Two Column Cards */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {audiences.map((audience, index) => (
            <motion.div
              key={audience.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="group bg-slate-800/50 border border-slate-700 hover:border-brand-500/50 rounded-2xl p-6 sm:p-8 h-full transition-colors duration-300"
              >
                {/* Icon */}
                <div className="w-12 h-12 bg-brand-500/20 rounded-xl flex items-center justify-center mb-5">
                  <audience.icon className="w-6 h-6 text-brand-400" />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-white mb-3">
                  {audience.title}
                </h3>
                <p className="text-slate-400 mb-6 leading-relaxed">
                  {audience.description}
                </p>

                {/* Feature List */}
                <ul className="space-y-2 mb-8">
                  {audience.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-slate-300">
                      <div className="w-1.5 h-1.5 bg-brand-500 rounded-full" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link
                  href={audience.href}
                  className="inline-flex items-center gap-2 text-brand-400 hover:text-brand-300 font-medium transition-colors group/link"
                >
                  {audience.cta}
                  <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
