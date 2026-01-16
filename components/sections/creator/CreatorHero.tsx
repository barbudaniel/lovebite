"use client";

import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Shield, Play, Upload, Zap } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { PlatformLogosRow } from "@/components/ui/platform-logos";
import { useRef } from "react";

// Stock images for media grid
const mediaImages = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop&q=80",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop&q=80",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&h=200&fit=crop&q=80",
];

export function CreatorHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 150 };
  const parallaxX = useSpring(useTransform(mouseX, [0, 1], [-10, 10]), springConfig);
  const parallaxY = useSpring(useTransform(mouseY, [0, 1], [-10, 10]), springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  };

  const content = {
    kicker: "For Creators",
    headline: ["Upload once.", "Publish everywhere.", "Create more."],
    subheadline: "Lovdash handles the boring stuff so you can focus on what you love—creating content that connects.",
    primaryCta: { text: "Join Waitlist", href: "#cta" },
    secondaryCta: { text: "See How It Works", href: "#process" },
  };

  return (
    <section 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-[100svh] flex items-center pt-20 overflow-hidden"
    >
      {/* Animated gradient background */}
      <motion.div 
        className="absolute inset-0"
        animate={{
          background: [
            "linear-gradient(135deg, rgba(255,241,242,1) 0%, white 50%, rgba(248,250,252,1) 100%)",
            "linear-gradient(135deg, rgba(254,226,226,0.8) 0%, white 50%, rgba(255,241,242,1) 100%)",
            "linear-gradient(135deg, rgba(255,241,242,1) 0%, white 50%, rgba(248,250,252,1) 100%)",
          ],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Decorative blobs with parallax */}
      <motion.div 
        style={{ x: parallaxX, y: parallaxY }}
        className="absolute -top-48 -right-48 w-[600px] h-[600px] bg-gradient-radial from-brand-300/20 to-transparent rounded-full" 
      />
      <motion.div 
        style={{ x: useTransform(parallaxX, v => -v), y: useTransform(parallaxY, v => -v) }}
        className="absolute -bottom-32 -left-32 w-[400px] h-[400px] bg-gradient-radial from-brand-200/20 to-transparent rounded-full"
      />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center lg:text-left"
          >
            {/* Kicker badge with pulse */}
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-brand-100 text-brand-700 rounded-full text-sm font-medium mb-6 cursor-default"
            >
              <motion.div
                animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <Sparkles className="w-4 h-4" />
              </motion.div>
              {content.kicker}
            </motion.span>

            {/* Headline with hover effects */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl sm:text-5xl lg:text-[56px] font-bold tracking-tight text-slate-900 leading-tight mb-6"
            >
              {content.headline.map((line, i) => (
                <motion.span 
                  key={i} 
                  className={`inline-block ${i === 2 ? "text-brand-600" : ""}`}
                  whileHover={{ scale: 1.02, x: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  {line}
                  {i < 2 && <br />}
                </motion.span>
              ))}
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-lg sm:text-xl text-slate-600 max-w-xl mx-auto lg:mx-0 mb-8"
            >
              {content.subheadline}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button asChild size="lg" className="bg-brand-500 hover:bg-brand-600 text-white h-14 px-8 text-lg rounded-xl shadow-lg shadow-brand-500/25 group relative overflow-hidden">
                  <Link href={content.primaryCta.href}>
                    <span className="relative z-10">{content.primaryCta.text}</span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-brand-600 to-brand-500"
                      initial={{ x: "100%" }}
                      whileHover={{ x: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                    <ArrowRight className="w-5 h-5 ml-2 relative z-10 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button asChild variant="outline" size="lg" className="border-slate-300 hover:border-brand-400 hover:bg-brand-50 h-14 px-8 text-lg rounded-xl group">
                  <Link href={content.secondaryCta.href}>
                    <Play className="w-4 h-4 mr-2 fill-current" />
                    {content.secondaryCta.text}
                    <ArrowRight className="w-4 h-4 ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </Link>
                </Button>
              </motion.div>
            </motion.div>

            {/* Platform Logos */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-10"
            >
              <p className="text-xs text-slate-400 mb-3 uppercase tracking-wider font-medium">
                Publish to all your platforms
              </p>
              <PlatformLogosRow 
                platforms={["onlyfans", "fansly", "twitter", "instagram", "tiktok"]} 
                size="md"
                variant="colored"
              />
            </motion.div>

            {/* Quick stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-8 flex flex-wrap gap-6 justify-center lg:justify-start"
            >
              {[
                { icon: Upload, label: "Upload once" },
                { icon: Zap, label: "Auto-tag with AI" },
                { icon: Shield, label: "Privacy-first" },
              ].map((item, i) => (
                <motion.div 
                  key={item.label}
                  className="flex items-center gap-2 text-sm text-slate-600 cursor-default"
                  whileHover={{ scale: 1.05, x: 3 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <div className="w-8 h-8 bg-brand-50 rounded-lg flex items-center justify-center">
                    <item.icon className="w-4 h-4 text-brand-500" />
                  </div>
                  {item.label}
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="relative hidden lg:block"
            style={{ x: useTransform(parallaxX, v => v * 0.5), y: useTransform(parallaxY, v => v * 0.5) }}
          >
            {/* Phone mockup with content grid */}
            <motion.div 
              className="relative mx-auto w-72"
              whileHover={{ rotate: 0 }}
              initial={{ rotate: -2 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {/* Phone frame */}
              <div className="bg-slate-900 rounded-[3rem] p-3 shadow-2xl">
                <div className="bg-slate-100 rounded-[2.5rem] overflow-hidden">
                  {/* Status bar */}
                  <div className="bg-white px-6 py-3 flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-500">9:41</span>
                    <div className="w-20 h-6 bg-slate-900 rounded-full" />
                    <div className="flex gap-1">
                      <div className="w-4 h-2 bg-slate-400 rounded-sm" />
                      <div className="w-4 h-2 bg-slate-400 rounded-sm" />
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-4 bg-white">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-brand-500 rounded-full flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">Media Library</p>
                        <p className="text-xs text-slate-500">24 items</p>
                      </div>
                    </div>
                    
                    {/* Media grid */}
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {mediaImages.map((src, i) => (
                        <motion.div
                          key={i}
                          className="aspect-square rounded-xl overflow-hidden relative group cursor-pointer"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.6 + i * 0.1 }}
                          whileHover={{ scale: 1.05, zIndex: 10 }}
                        >
                          <Image
                            src={src}
                            alt={`Content ${i + 1}`}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                            unoptimized
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </motion.div>
                      ))}
                    </div>
                    
                    {/* Upload button */}
                    <motion.div
                      className="bg-brand-500 rounded-xl py-3 text-center cursor-pointer"
                      whileHover={{ scale: 1.02, backgroundColor: "#e11d48" }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="text-white font-medium text-sm flex items-center justify-center gap-2">
                        <Upload className="w-4 h-4" />
                        Upload Content
                      </span>
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Floating notification */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 }}
                whileHover={{ scale: 1.05 }}
                className="absolute -right-16 top-24 bg-white rounded-xl p-3 shadow-lg border border-slate-200 cursor-default"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Zap className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-900">Auto-tagged!</p>
                    <p className="text-[10px] text-slate-500">12 new tags added</p>
                  </div>
                </div>
              </motion.div>

              {/* Publishing indicator */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2 }}
                whileHover={{ scale: 1.05 }}
                className="absolute -left-12 bottom-32 bg-white rounded-xl p-3 shadow-lg border border-slate-200 cursor-default"
              >
                <p className="text-xs font-medium text-slate-700 mb-2">Publishing to</p>
                <PlatformLogosRow 
                  platforms={["onlyfans", "fansly", "twitter"]} 
                  size="sm"
                  variant="stacked"
                />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
