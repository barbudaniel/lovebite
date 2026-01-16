"use client";

import { motion, useScroll, useTransform } from "motion/react";
import Link from "next/link";
import { ArrowRight, MousePointer, TrendingUp } from "lucide-react";
import { AnimatedSection } from "@/components/motion/animated-section";
import Image from "next/image";
import { useRef } from "react";

const features = [
  "Custom themes",
  "Click tracking",
  "Revenue attribution",
  "Mobile-optimized",
];

export function LovdashBio() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Parallax: image moves up as you scroll down
  // Small range (100px total) to prevent revealing edges
  const imageY = useTransform(scrollYProgress, [0, 1], [30, -100]);

  return (
    <section ref={containerRef} className="relative py-12 sm:py-16 lg:py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 sm:gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div>
            <AnimatedSection>
              <span className="font-medium text-xs sm:text-sm uppercase tracking-wider bg-brand-50 text-brand-700 rounded-full px-3 py-1">
                Easy to create profile
              </span>
              <h2 className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
                Full control.
              </h2>
              <p className="mt-4 sm:mt-6 text-base sm:text-lg text-slate-600 leading-relaxed">
                Build a profile page that actually tells you what&apos;s working. Custom themes. 
                Click analytics. Revenue attribution. See exactly which post drive fans to pay.
              </p>
            </AnimatedSection>

            {/* Feature Pills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mt-6 sm:mt-8 flex flex-wrap gap-2"
            >
              {features.map((feature, i) => (
                <motion.span
                  key={feature}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                  className="px-3 py-1.5 bg-brand-50 text-brand-700 text-sm font-medium rounded-full"
                >
                  {feature}
                </motion.span>
              ))}
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mt-8"
            >
              <Link
                href="/bio"
                className="inline-flex items-center gap-2 text-brand-600 hover:text-brand-700 font-medium transition-colors group"
              >
                Create your profile
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>

          {/* Right - Phone Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative flex justify-center"
          >
            {/* Phone Frame Container */}
            <div className="relative w-full max-w-md aspect-[3/4] rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-300/50 border border-slate-200/60">
              {/* Parallax Image - extra 150px height for scroll buffer */}
              <motion.div 
                className="absolute -top-[50px] left-0 right-0 h-[calc(100%+150px)]"
                style={{ y: imageY }}
              >
                <Image
                  src="/homepage/Alison_Profile.png"
                  alt="Alison Lov"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 768px) 100vw, 448px"
                  priority
                />
              </motion.div>
              
              {/* Gradient Overlays - fixed position while image scrolls behind */}
              <div className="pointer-events-none absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-white/70 via-white/30 to-transparent z-10" />
              <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white/80 via-white/40 to-transparent z-10" />
            </div>

            {/* Floating Stats Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="absolute -bottom-4 left-0 bg-white rounded-xl p-4 border border-slate-200 shadow-lg z-50"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <MousePointer className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Total clicks</p>
                  <p className="text-lg font-bold text-slate-900">2,847</p>
                </div>
              </div>
            </motion.div>

            {/* Floating Revenue Card */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="absolute -top-4 right-0 bg-white rounded-xl p-4 border border-slate-200 shadow-lg z-50"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-brand-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Conversion</p>
                  <p className="text-lg font-bold text-slate-900">12.4%</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
