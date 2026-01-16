"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Navigation, Footer } from "@/components/sections";
import { PlatformLogosRow } from "@/components/ui/platform-logos";
import { Brain, Tag, FileText, Search, Sparkles, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const benefits = [
  { icon: Tag, title: "Auto-Generated Tags", description: "AI analyzes your content and adds relevant, searchable tags automatically." },
  { icon: FileText, title: "Smart Descriptions", description: "Generate captions and descriptions ready for posting on any platform." },
  { icon: Search, title: "Better Search", description: "Find exactly what you need with AI-enhanced search across your library." },
  { icon: Sparkles, title: "Content Insights", description: "Understand what content performs best with AI-powered analysis." },
  { icon: Brain, title: "Learns Your Style", description: "Our AI adapts to your preferences and improves over time." },
  { icon: Zap, title: "Instant Processing", description: "Tags appear seconds after upload. No waiting, no manual work." },
];

export default function AITaggingPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-white">
        {/* Hero */}
        <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-violet-50 via-white to-white" />
          <motion.div 
            className="absolute top-20 right-1/4 w-96 h-96 bg-violet-100/50 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-20 h-20 bg-violet-100 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-violet-200/50"
            >
              <Brain className="w-10 h-10 text-violet-500" />
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-900 mb-6"
            >
              AI That{" "}
              <span className="bg-gradient-to-r from-violet-500 to-purple-500 bg-clip-text text-transparent">
                Understands Your Content
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto mb-8"
            >
              Upload your content and let our AI handle the rest. Automatic tags, descriptions, and categorization—no manual work required.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-10"
            >
              <Button asChild size="lg" className="bg-violet-500 hover:bg-violet-600 text-white rounded-full px-8 shadow-lg shadow-violet-500/25">
                <Link href="/#cta">
                  Try AI Tagging
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
              <p className="text-sm text-slate-500 mb-4">AI-tagged content for all platforms</p>
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
              How AI Tagging Works
            </motion.h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((item, i) => (
                <motion.div 
                  key={item.title} 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg hover:border-violet-200 transition-all"
                >
                  <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center mb-4">
                    <item.icon className="w-6 h-6 text-violet-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-gradient-to-br from-violet-500 to-purple-500">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Sparkles className="w-10 h-10 text-white/80 mx-auto mb-4" />
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Let AI do the heavy lifting</h2>
            <p className="text-white/80 mb-8">Save hours on manual tagging. Let Lovdash AI organize your content automatically.</p>
            <Button asChild size="lg" className="bg-white text-violet-600 hover:bg-white/90 rounded-full px-8">
              <Link href="/#cta">Get Started Free</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
