"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Zap } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function Hero() {
  return (
    <section className="relative min-h-[100svh] flex items-center pt-16 sm:pt-20 overflow-hidden bg-white">
      {/* Subtle Background */}
      <div className="absolute inset-0 bg-brand-50/50" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 w-full">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center lg:text-left order-2 lg:order-1"
          >
            

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-black tracking-tight mb-4 sm:mb-6"
            >
              <span className="text-slate-900">Make your <span className="text-brand-600">buzz</span></span>
              
              
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-base sm:text-lg md:text-xl text-slate-600 max-w-lg mx-auto lg:mx-0 mb-6 sm:mb-8 leading-relaxed"
            >
              Start earning from your content today. Easily and effectively.
              We handle the marketing, management, and monetization—you just bring the heat.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start"
            >
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  asChild
                  size="lg"
                  className="bg-brand-600 hover:bg-brand-700 text-white px-6 sm:px-8 h-12 sm:h-14 text-base sm:text-lg rounded-full group relative overflow-hidden"
                >
                  <Link href="#contact">
                    <span className="relative z-10">Become a Creator</span>
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  </Link>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-2 border-slate-200 hover:border-brand-400 hover:bg-brand-50 h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg rounded-full group"
                >
                  <Link href="#process">
                    <span>How it Works</span>
                    <ArrowRight className="w-4 h-4 ml-1 transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                </Button>
              </motion.div>
            </motion.div>

            {/* AI Banner */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="mt-6 sm:mt-8"
            >
              <Link
                href="/ai"
                className="inline-flex items-center gap-3 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl transition-all duration-200 group hover:shadow-lg hover:-translate-y-0.5"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-lg flex items-center justify-center transition-transform duration-200 group-hover:scale-110 group-hover:rotate-3">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-xs text-slate-400">New: Lovdash AI</p>
                  <p className="text-sm font-medium flex items-center gap-1">
                    Join the waitlist
                    <ArrowRight className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-1" />
                  </p>
                </div>
              </Link>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-6 sm:mt-8 flex flex-wrap gap-4 sm:gap-6 justify-center lg:justify-start text-xs sm:text-sm text-slate-500"
            >
              <div className="flex items-center gap-2 group cursor-default">
                <div className="w-2 h-2 rounded-full bg-green-500 pulse-dot" />
                <span className="transition-colors duration-200 group-hover:text-slate-700">100% Online</span>
              </div>
              <div className="flex items-center gap-2 group cursor-default">
                <div className="w-2 h-2 rounded-full bg-green-500 pulse-dot" style={{ animationDelay: '0.3s' }} />
                <span className="transition-colors duration-200 group-hover:text-slate-700">Complete Privacy</span>
              </div>
              <div className="flex items-center gap-2 group cursor-default">
                <div className="w-2 h-2 rounded-full bg-green-500 pulse-dot" style={{ animationDelay: '0.6s' }} />
                <span className="transition-colors duration-200 group-hover:text-slate-700">Weekly Payouts</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative order-1 lg:order-2"
          >
            {/* Main Image Container */}
            <div className="relative max-w-xs sm:max-w-sm md:max-w-md mx-auto lg:max-w-none">
              {/* Background Shape */}
              <div className="absolute inset-0 bg-brand-200 rounded-2xl sm:rounded-3xl transform rotate-2 scale-[1.02]" />
              
              {/* Image */}
              <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-brand-100">
                <Image
                  src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80"
                  alt="Content Creator"
                  width={500}
                  height={600}
                  className="w-full h-auto object-cover aspect-[4/5]"
                  priority
                  sizes="(max-width: 640px) 280px, (max-width: 768px) 384px, (max-width: 1024px) 448px, 500px"
                />
              </div>

              {/* Floating Card - Earnings */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="hidden sm:block absolute -left-4 md:-left-8 bottom-16 sm:bottom-20 bg-white rounded-xl p-3 sm:p-4 border border-slate-200 shadow-lg float cursor-default hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 bg-green-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-base sm:text-lg">💰</span>
                  </div>
                  <div>
                    <p className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-wide">Monthly</p>
                    <p className="text-sm sm:text-base font-bold text-slate-900">$400-$800+</p>
                  </div>
                </div>
              </motion.div>

              {/* Floating Card - Status */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="hidden sm:block absolute -right-4 md:-right-6 top-12 sm:top-16 bg-white rounded-xl p-3 sm:p-4 border border-slate-200 shadow-lg float-delayed cursor-default hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 bg-brand-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-base sm:text-lg">🔥</span>
                  </div>
                  <div>
                    <p className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-wide">Status</p>
                    <p className="text-sm sm:text-base font-bold text-slate-900">Boss Mode</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
