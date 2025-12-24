"use client";

import { motion } from "motion/react";
import { Check, Heart, Users, DollarSign, Lock, ArrowRight } from "lucide-react";
import Image from "next/image";
import { AnimatedSection } from "@/components/motion/animated-section";

const features = [
  { icon: Users, text: "We bring traffic to your profile" },
  { icon: Heart, text: "We fully manage your profile" },
  { icon: DollarSign, text: "We respond to customers and monetize" },
  { icon: Lock, text: "Complete privacy guaranteed" },
];

const benefits = [
  "Enjoy love of your fans",
  "Monthly payments",
  "Weekly content basis",
  "We handle the rest",
];

export function About() {
  return (
    <section id="about" className="py-16 sm:py-20 lg:py-24 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 sm:gap-12 lg:gap-16 items-center">
          {/* Left - Visual */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="relative order-2 lg:order-1"
          >
            {/* Background Shape */}
            <div className="absolute inset-0 bg-brand-200 rounded-2xl sm:rounded-3xl transform -rotate-2 scale-[1.02]" />
            
            {/* Main Image */}
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-brand-100">
              <Image
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80"
                alt="Content Creator Lifestyle"
                width={500}
                height={600}
                className="w-full h-auto object-cover aspect-[4/5]"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 500px"
              />
            </div>

            {/* Floating Feature Cards - Visible on tablet+ */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="hidden md:block absolute -right-2 lg:-right-4 top-1/4 bg-white rounded-xl p-3 border border-slate-200 max-w-[160px] shadow-lg float cursor-default hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-start gap-2">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-xs">Weekly Content</p>
                  <p className="text-[10px] text-slate-500">You choose the day</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="hidden md:block absolute -left-2 lg:-left-4 bottom-1/4 bg-white rounded-xl p-3 border border-slate-200 max-w-[160px] shadow-lg float-delayed cursor-default hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-start gap-2">
                <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <DollarSign className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-xs">Monthly Payout</p>
                  <p className="text-[10px] text-slate-500">Reliable payments</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right - Content */}
          <div className="order-1 lg:order-2">
            <AnimatedSection>
              <span className="text-brand-600 font-semibold text-xs sm:text-sm uppercase tracking-wider">
                Why Lovdash
              </span>
              <h2 className="mt-2 sm:mt-3 text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-tight">
                Let's break it <span className="text-brand-600">down</span>
              </h2>
              <p className="mt-4 sm:mt-6 text-base sm:text-lg text-slate-600 leading-relaxed">
                The way it works is smart. See for yourself the benefits of cooperation
                where you just make money with what you enjoy and we take care of everything else.
              </p>
            </AnimatedSection>

            {/* Benefits List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mt-6 sm:mt-8 grid grid-cols-2 gap-3 sm:gap-4"
            >
              {benefits.map((benefit, i) => (
                <div key={i} className="flex items-center gap-2 sm:gap-3">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-brand-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
                  </div>
                  <span className="text-slate-700 font-medium text-sm sm:text-base">{benefit}</span>
                </div>
              ))}
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mt-8 sm:mt-10 space-y-3"
            >
              {features.map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  whileHover={{ x: 4, boxShadow: "0 4px 12px -2px rgba(0, 0, 0, 0.08)" }}
                  className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white rounded-lg sm:rounded-xl hover:bg-brand-50 transition-all duration-200 group border border-slate-100 cursor-default"
                >
                  <div className="w-10 h-10 sm:w-11 sm:h-11 bg-brand-50 rounded-lg flex items-center justify-center group-hover:bg-brand-100 transition-all duration-200 flex-shrink-0">
                    <feature.icon className="w-5 h-5 text-brand-600 transition-transform duration-200 group-hover:scale-110 group-hover:rotate-6" />
                  </div>
                  <span className="text-slate-700 font-medium text-sm sm:text-base transition-colors duration-200 group-hover:text-brand-700">{feature.text}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="mt-8 sm:mt-10"
            >
              <motion.a
                href="#contact"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-6 sm:px-8 py-3 sm:py-3.5 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base transition-all duration-200 group relative overflow-hidden shadow-md hover:shadow-lg"
              >
                <span className="relative z-10">Leave your contact</span>
                <ArrowRight className="w-4 h-4 relative z-10 transition-transform duration-200 group-hover:translate-x-1" />
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
              </motion.a>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
