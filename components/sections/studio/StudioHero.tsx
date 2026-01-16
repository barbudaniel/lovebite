"use client";

import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Shield, Building2, BarChart3, Calendar, CheckCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { PlatformLogosRow } from "@/components/ui/platform-logos";
import { useRef } from "react";

// Stock images for creator avatars
const creatorAvatars = [
    "/business/Alison_Lov.png",
    "/business/Alison_Lov.png",
    "/business/Alison_Lov.png",
    "/business/Alison_Lov.png",
    "/business/Alison_Lov.png",
    
];

export function StudioHero() {
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
    kicker: "For Agencies",
    headline: "Manage every creator from one dashboard.",
    subheadline: "Lovdash for Agencies gives you the tools to organize, schedule, and track content across your entire roster—without the chaos.",
    primaryCta: { text: "Book a Demo", href: "#studio-cta" },
    secondaryCta: { text: "See Agency Features", href: "#studio-features" },
    trustBadges: [
      { icon: Users, text: "2 to 200+ creators" },
      { icon: Shield, text: "Role-based access" },
      { icon: Building2, text: "Built for teams" },
    ],
  };

  return (
    <section 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-[100svh] flex items-center pt-20 overflow-hidden bg-gradient-to-b from-slate-50 to-white"
    >
      {/* Animated background glow */}
      <motion.div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-gradient-radial from-brand-100/50 to-transparent rounded-full blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center lg:text-left"
          >
            {/* Kicker badge */}
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              whileHover={{ scale: 1.05, borderColor: "rgba(244,63,94,0.4)" }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-brand-50 border border-brand-200 text-brand-700 rounded-full text-sm font-medium mb-6 cursor-default"
            >
              <motion.div
                animate={{ rotate: [0, -5, 5, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Building2 className="w-4 h-4 text-brand-500" />
              </motion.div>
              {content.kicker}
            </motion.span>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl sm:text-5xl lg:text-[56px] font-bold tracking-tight text-slate-900 leading-tight mb-6"
            >
              <motion.span
                whileHover={{ color: "#f43f5e" }}
                transition={{ duration: 0.3 }}
              >
                {content.headline}
              </motion.span>
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
                      className="absolute inset-0 bg-brand-600"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                    <ArrowRight className="w-5 h-5 ml-2 relative z-10 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button asChild variant="outline" size="lg" className="h-14 px-8 text-lg rounded-xl border-2 border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-brand-300 hover:text-brand-600 transition-all">
                  <Link href={content.secondaryCta.href}>
                    {content.secondaryCta.text}
                  </Link>
                </Button>
              </motion.div>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-10 flex flex-wrap gap-6 justify-center lg:justify-start"
            >
              {content.trustBadges.map((badge, i) => (
                <motion.div
                  key={badge.text}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="flex items-center gap-2 text-sm text-slate-600"
                >
                  <badge.icon className="w-4 h-4 text-brand-500" />
                  <span>{badge.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Dashboard Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative"
            style={{ x: parallaxX, y: parallaxY }}
          >
            {/* Main dashboard card */}
            <motion.div 
              className="relative bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 overflow-hidden"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              {/* Dashboard header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Business Dashboard</h3>
                  <p className="text-sm text-slate-500">5 creators • 3 active</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-xs text-green-600 font-medium">Live</span>
                </div>
              </div>

              {/* Creator roster */}
              <div className="space-y-3 mb-6">
                {creatorAvatars.slice(0, 4).map((avatar, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    whileHover={{ x: 4, backgroundColor: "rgba(244,63,94,0.05)" }}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Image
                        src={avatar}
                        alt={`Creator ${i + 1}`}
                        width={36}
                        height={36}
                        className="rounded-full object-cover object-top w-10 h-10"
                      />
                      <div>
                        <p className="text-sm font-medium text-slate-900">Alison Lov</p>
                        <p className="text-xs text-slate-500">{['Active', 'Onboarding', 'Active', 'Review'][i]}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      
                        <span className="text-xs text-slate-500">View creator </span>
                        <ArrowRight className="w-3 h-3" />
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Quick stats */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Total Posts", value: "247", icon: Calendar },
                  { label: "Engagement", value: "18.2%", icon: BarChart3 },
                  { label: "Revenue", value: "$12.4k", icon: CheckCircle },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + i * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="bg-slate-50 rounded-lg p-3 text-center"
                  >
                    <stat.icon className="w-4 h-4 text-brand-500 mx-auto mb-1" />
                    <p className="text-lg font-bold text-slate-900">{stat.value}</p>
                    <p className="text-xs text-slate-500">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Floating platform card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              whileHover={{ scale: 1.05, rotate: 2 }}
              className="absolute -bottom-4 -left-4 bg-white rounded-xl p-4 border border-slate-200 shadow-lg"
            >
              <p className="text-xs text-slate-500 mb-2">Connected Platforms</p>
              <PlatformLogosRow size="sm" variant="default" />
            </motion.div>

            {/* Team notification */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 }}
              whileHover={{ scale: 1.05, rotate: -1 }}
              className="absolute -top-2 -right-2 bg-brand-500 text-white rounded-xl px-4 py-3 shadow-lg"
            >
              <p className="text-xs font-medium flex items-center gap-2">
                <Users className="w-4 h-4" />
                3 team members online
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
