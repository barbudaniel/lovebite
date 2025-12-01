"use client";

import { motion } from "motion/react";
import { FileCheck, Handshake, Settings, Wallet, ArrowRight } from "lucide-react";
import { AnimatedSection } from "@/components/motion/animated-section";

const steps = [
  {
    number: "01",
    icon: FileCheck,
    title: "Application",
    description:
      "Send us examples of your content and tell us what you're comfortable creating. We'll come back with an offer.",
  },
  {
    number: "02",
    icon: Handshake,
    title: "Agreement",
    description:
      "We agree on conditions, you send initial content and sign the contract. Welcome aboard!",
  },
  {
    number: "03",
    icon: Settings,
    title: "Set Up",
    description:
      "We create and verify your accounts on the platforms, then start monetizing your content.",
  },
  {
    number: "04",
    icon: Wallet,
    title: "Cooperation",
    description:
      "You provide weekly content, we pay you monthly based on our agreement. Simple as that.",
  },
];

export function Process() {
  return (
    <section id="process" className="py-16 sm:py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-10 sm:mb-12 lg:mb-16">
          <span className="text-brand-600 font-semibold text-xs sm:text-sm uppercase tracking-wider">
            Simple Process
          </span>
          <h2 className="mt-2 sm:mt-3 text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900">
            How it <span className="text-brand-600">works?</span>
          </h2>
          <p className="mt-3 sm:mt-4 text-base sm:text-lg text-slate-500 max-w-2xl mx-auto">
            Lovebite helps independent models earn money by selling content on
            subscription platforms. The way it works is smart.
          </p>
        </AnimatedSection>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1 }}
            >
              <motion.div
                whileHover={{ y: -6, boxShadow: "0 20px 40px -12px rgba(0, 0, 0, 0.1)" }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="group relative bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 h-full border border-slate-200 hover:border-brand-300 transition-colors cursor-default"
              >
                {/* Number Badge */}
                <div className="absolute -top-3 left-5 sm:left-6">
                  <motion.div 
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-8 h-8 sm:w-9 sm:h-9 bg-brand-600 rounded-lg flex items-center justify-center transition-transform"
                  >
                    <span className="text-white font-bold text-xs sm:text-sm">{step.number}</span>
                  </motion.div>
                </div>

                {/* Icon */}
                <div className="mt-4 mb-3 sm:mb-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-brand-50 rounded-xl flex items-center justify-center group-hover:bg-brand-100 transition-all duration-300">
                    <step.icon className="w-5 h-5 sm:w-6 sm:h-6 text-brand-600 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2 group-hover:text-brand-600 transition-colors duration-200">
                  {step.title}
                </h3>
                <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-10 sm:mt-12 lg:mt-16 text-center"
        >
          <motion.div 
            whileHover={{ scale: 1.01 }}
            className="inline-flex flex-col sm:flex-row items-center gap-4 bg-brand-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-brand-100 transition-shadow duration-300 hover:shadow-lg"
          >
            <p className="text-slate-600 text-sm sm:text-base text-center sm:text-left">
              <span className="font-semibold text-slate-900">Ready to start?</span>
              <span className="hidden sm:inline"> The process takes less than 5 minutes.</span>
            </p>
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="bg-brand-600 hover:bg-brand-700 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-medium text-sm sm:text-base transition-all duration-200 flex items-center gap-2 whitespace-nowrap group relative overflow-hidden"
            >
              <span className="relative z-10">Leave your contact</span>
              <ArrowRight className="w-4 h-4 relative z-10 transition-transform duration-200 group-hover:translate-x-1" />
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
