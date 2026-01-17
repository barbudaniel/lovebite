"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Navigation, Footer } from "@/components/sections";
import { PlatformLogosRow, PlatformBadge, PlatformLogo } from "@/components/ui/platform-logos";
import { cn } from "@/lib/utils";
import { Globe, Share2, Settings, Zap, Shield, CheckCircle2, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const benefits = [
  { icon: Share2, title: "One-Click Publishing", description: "Select your platforms, click publish, and your content goes everywhere." },
  { icon: Settings, title: "Platform Optimization", description: "Auto-format content for each platform's requirements and best practices." },
  { icon: Shield, title: "SFW/NSFW Content Routing", description: "AI automatically routes content to the right platforms based on classification—SFW to Instagram, NSFW to adult platforms." },
  { icon: Globe, title: "6 Platforms & Growing", description: "Connect OnlyFans, Fansly, LoyalFans, X/Twitter, Instagram—and TikTok coming soon." },
  { icon: Zap, title: "Instant Sync", description: "Changes reflect immediately. No delays between platforms." },
  { icon: CheckCircle2, title: "Post Verification", description: "Confirm your posts went live with status tracking for each platform." },
];

const platforms = [
  { name: "OnlyFans", platform: "onlyfans" as const, status: "active" },
  { name: "Fansly", platform: "fansly" as const, status: "active" },
  { name: "LoyalFans", platform: "loyalfans" as const, status: "active" },
  { name: "X/Twitter", platform: "twitter" as const, status: "active" },
  { name: "Instagram", platform: "instagram" as const, status: "active" },
  { name: "TikTok", platform: "tiktok" as const, status: "coming" },
];

export default function PublishingPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-white">
        {/* Hero */}
        <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-pink-50 via-white to-white" />
          <motion.div 
            className="absolute top-20 left-1/4 w-96 h-96 bg-pink-100/50 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-20 h-20 bg-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-pink-200/50"
            >
              <Globe className="w-10 h-10 text-pink-500" />
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-900 mb-6"
            >
              Post Everywhere{" "}
              <span className="bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
                in One Click
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto mb-8"
            >
              Why post the same content five times? With Lovdash, select your platforms and publish everywhere at once.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-10"
            >
              <Button asChild size="lg" className="bg-pink-500 hover:bg-pink-600 text-white rounded-full px-8 shadow-lg shadow-pink-500/25">
                <Link href="/#cta">
                  Try Publishing
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </motion.div>

            {/* Platform logos - prominent display */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col items-center"
            >
              <p className="text-sm text-slate-500 mb-6">Publish to all major platforms</p>
              <PlatformLogosRow 
                platforms={["onlyfans", "fansly", "loyalfans", "twitter", "instagram"]} 
                size="xl"
                variant="color"
                showLabels
              />
            </motion.div>
          </div>
        </section>

        {/* Supported Platforms Section */}
        <section className="py-16 sm:py-24 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
                Supported Platforms
              </h2>
              <p className="text-slate-600 max-w-xl mx-auto">
                Connect all your platforms and publish everywhere from one dashboard.
              </p>
            </motion.div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {platforms.map((item, i) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className={cn(
                    "flex items-center gap-3 p-4 rounded-xl border transition-all",
                    item.status === "active" 
                      ? "bg-white border-slate-200 hover:border-emerald-300 hover:shadow-md" 
                      : "bg-slate-50 border-slate-200"
                  )}
                >
                  <PlatformLogo platform={item.platform} size="md" variant="color" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-900">{item.name}</span>
                      {item.status === "active" ? (
                        <span className="text-emerald-500 text-lg">✅</span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-700">
                          🔜 Coming Soon
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Content Routing Explanation */}
        <section className="py-16 sm:py-20 bg-gradient-to-br from-slate-900 to-slate-800">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 mb-6">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-medium text-emerald-400">Smart Content Routing</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                SFW/NSFW Content Routing
              </h2>
              <p className="text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed">
                Our AI automatically classifies your content and routes it to the right platforms. 
                SFW content goes to Instagram and X/Twitter, while adult content stays on OnlyFans, 
                Fansly, and LoyalFans. No manual sorting required.
              </p>
              <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
                  <div className="text-emerald-400 font-semibold mb-2">SFW Content</div>
                  <p className="text-slate-400 text-sm">Auto-routes to Instagram, X/Twitter, TikTok</p>
                </div>
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
                  <div className="text-pink-400 font-semibold mb-2">Adult Content</div>
                  <p className="text-slate-400 text-sm">Auto-routes to OnlyFans, Fansly, LoyalFans</p>
                </div>
              </div>
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
              Why Cross-Post with Lovdash?
            </motion.h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((item, i) => (
                <motion.div 
                  key={item.title} 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg hover:border-pink-200 transition-all"
                >
                  <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mb-4">
                    <item.icon className="w-6 h-6 text-pink-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-gradient-to-br from-pink-500 to-rose-500">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Sparkles className="w-10 h-10 text-white/80 mx-auto mb-4" />
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Ready to reach every platform?</h2>
            <p className="text-white/80 mb-8">Publish once, reach everywhere. It's that simple.</p>
            <Button asChild size="lg" className="bg-white text-pink-600 hover:bg-white/90 rounded-full px-8">
              <Link href="/#cta">Get Started Free</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
