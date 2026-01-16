"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { ArrowRight, Sparkles, Tag, FileText, Shield, Search, Wand2, Bot } from "lucide-react";
import { AnimatedSection } from "@/components/motion/animated-section";
import Image from "next/image";

const features = [
  "Auto-tagging",
  "Smart descriptions",
  "NSFW detection",
  "Similarity search",
  "Platform-ready captions",
  "Blurred photos",
  "Duplicate content detection",
];

export function LovdashAI() {
  return (
    <section className="py-12 sm:py-16 lg:py-24 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 sm:gap-12 lg:gap-16 items-center">
          {/* Left - Visual */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 p-6 relative ">
              {/* Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-brand-500 rounded-xl flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Bites <span className="text-slate-500 font-light">Analysis</span></p>
                  <p className="text-xs text-slate-500">Processing complete</p>
                </div>
              </div>

              {/* Mock Image with Tags */}
              <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl mb-4 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  
                  <Image src="/homepage/Alison_analysis.png" alt="Bites Analysis" fill className="w-full h-full object-cover" />
                </div>
              </div>

              {/* Generated Tags */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Tag className="w-4 h-4 text-violet-500" />
                  <span className="text-slate-600">Tags:</span>
                  <div className="flex flex-wrap gap-1">
                    <span className="px-2 py-0.5 bg-violet-100 text-violet-700 text-xs rounded-md">Lifestyle</span>
                    <span className="px-2 py-0.5 bg-violet-100 text-violet-700 text-xs rounded-md">Outfit</span>
                    <span className="px-2 py-0.5 bg-violet-100 text-violet-700 text-xs rounded-md">Travel</span>
                  </div>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <Sparkles className="w-4 h-4 text-brand-500 mt-0.5" />
                  <span className="text-slate-600">Description:</span>
                  <span className="text-slate-900 flex-1">Taking a little break to enjoy the day—comfy fit, fresh air, and good vibes 🤍✨</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span className="text-slate-600">Safety:</span>
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-md">Approved</span>
                </div>
              </div>
            </div>

            {/* Floating Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="absolute -bottom-4 -right-4 bg-white rounded-xl p-4 border border-slate-200 shadow-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center">
                  <Search className="w-5 h-5 text-violet-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Similar content</p>
                  <p className="text-sm font-semibold text-slate-900">12 matches found</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content */}
          <div>
            <AnimatedSection>
              
              <h2 className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
                Your content, understood
              </h2>
              <p className="mt-4 sm:mt-6 text-base sm:text-lg text-slate-600 leading-relaxed">
                Bites your personal AI assistant analyzes every piece of media you upload. Automatic tags. Smart descriptions. 
                Content safety flags. Similar content search. Everything you need to manage a growing library—without the busywork.
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

            {/* Disclaimer */}
            <p className="mt-4 text-xs text-slate-500">
              AI-generated tags and descriptions are assistive and may require review.
            </p>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mt-8"
            >
              <Link
                href="/ai"
                className="inline-flex items-center gap-2 text-brand-600 hover:text-brand-700 font-medium transition-colors group"
              >
                About Bites
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
