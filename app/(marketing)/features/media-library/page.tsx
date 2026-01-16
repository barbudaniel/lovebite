"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Navigation, Footer } from "@/components/sections";
import { PlatformLogosRow } from "@/components/ui/platform-logos";
import { Upload, Search, FolderOpen, Cloud, Shield, Zap, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const benefits = [
  { icon: Cloud, title: "Unlimited Storage", description: "Upload as much content as you need. No limits, no extra fees." },
  { icon: Search, title: "Instant Search", description: "Find any file instantly with AI-powered search by tags, dates, or descriptions." },
  { icon: FolderOpen, title: "Smart Folders", description: "Auto-organize content into collections based on type, date, or custom rules." },
  { icon: Shield, title: "Secure & Private", description: "Enterprise-grade encryption. Your content stays yours." },
  { icon: Zap, title: "Fast Uploads", description: "Bulk upload hundreds of files at once with drag-and-drop simplicity." },
  { icon: Upload, title: "Any File Type", description: "Photos, videos, GIFs, documents—we support everything." },
];

export default function MediaLibraryPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-white">
        {/* Hero */}
        <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-50 via-white to-white" />
          <motion.div 
            className="absolute top-20 left-1/4 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-blue-200/50"
            >
              <Upload className="w-10 h-10 text-blue-500" />
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-900 mb-6"
            >
              Your Content,{" "}
              <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                Perfectly Organized
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto mb-8"
            >
              Stop losing files across devices and platforms. Lovdash Media Library keeps everything in one searchable, organized space.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-10"
            >
              <Button asChild size="lg" className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-8 shadow-lg shadow-blue-500/25">
                <Link href="/#cta">
                  Try Media Library Free
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </motion.div>

            {/* Platform logos */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col items-center"
            >
              <p className="text-sm text-slate-500 mb-4">Publish organized content to</p>
              <PlatformLogosRow 
                platforms={["onlyfans", "fansly", "twitter", "instagram"]} 
                size="md"
                variant="color"
              />
            </motion.div>
          </div>
        </section>

        {/* Benefits Grid */}
        <section className="py-16 sm:py-24 bg-slate-50/50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-2xl sm:text-3xl font-bold text-slate-900 text-center mb-12"
            >
              Why Creators Love Our Media Library
            </motion.h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((item, i) => (
                <motion.div 
                  key={item.title} 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg hover:border-blue-200 transition-all"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                    <item.icon className="w-6 h-6 text-blue-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-gradient-to-br from-blue-500 to-cyan-500">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Sparkles className="w-10 h-10 text-white/80 mx-auto mb-4" />
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Ready to organize your content?</h2>
            <p className="text-white/80 mb-8">Join creators who keep their content organized with Lovdash.</p>
            <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-white/90 rounded-full px-8">
              <Link href="/#cta">Get Started Free</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
