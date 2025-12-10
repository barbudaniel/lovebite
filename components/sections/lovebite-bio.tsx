"use client";

import { useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  Link as LinkIcon,
  ArrowRight,
  Globe,
  Activity,
  CheckCircle2,
  Search,
  Lock,
} from "lucide-react";
import { AnimatedSection } from "@/components/motion/animated-section";

const highlights = [
  { icon: Globe, text: "Custom domains" },
  { icon: Activity, text: "Live status sync" },
  { icon: Lock, text: "Adult-friendly" },
];

const platforms = [
  "OnlyFans",
  "Chaturbate",
  "Fansly",
  "LoyalFans",
  "ManyVids",
  "Stripchat",
  "CamSoda",
  "Pornhub",
];

export function LovebiteBio() {
  const [domainQuery, setDomainQuery] = useState("");

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-slate-950 overflow-hidden border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 sm:gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-2xl p-6 sm:p-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-product-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute inset-0 bg-gradient-to-br from-product-500/5 to-brand-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-product-600 to-brand-600 rounded-xl flex items-center justify-center">
                      <Search className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">Find your perfect handle</h3>
                    </div>
                  </div>

                  {/* Mini Domain Search */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-medium select-none">
                        bites.bio/
                      </span>
                      <Input
                        type="text"
                        placeholder=""
                        value={domainQuery}
                        onChange={(e) => setDomainQuery(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                        className="h-11 pl-20 bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-slate-400 focus:ring-0 rounded-lg"
                      />
                    </div>
                    <Button
                      asChild
                      className={cn(
                        "h-11 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold px-6 transition-all duration-300",
                        domainQuery.length > 2 
                          ? "shadow-[0_0_25px_rgba(236,72,153,0.6)]" 
                          : ""
                      )}
                    >
                      <Link href="/bio">
                        Claim Link
                      </Link>
                    </Button>
                  </div>

                  {/* Features Preview */}
                  <div className="mt-6 pt-6 border-t border-slate-700/50">
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-3">
                      Included for free
                    </p>
                    <ul className="space-y-2">
                      {[
                        "Unlimited links & platforms",
                        "Syncs with Cam & OF activity",
                        "Detailed analytics & tracking",
                        "Mobile-first design",
                      ].map((item, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.1 + i * 0.05 }}
                          className="flex items-start gap-2 text-sm text-slate-300"
                        >
                          <CheckCircle2 className="w-4 h-4 text-product-400 mt-0.5 flex-shrink-0" />
                          <span>{item}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Content */}
          <div className="order-1 lg:order-2">
            <AnimatedSection>
              <div className="inline-flex items-center gap-2 bg-product-500/10 border border-product-500/20 rounded-full px-3 py-1.5 mb-4">
                <LinkIcon className="w-3.5 h-3.5 text-product-400" />
                <span className="text-xs sm:text-sm font-medium text-product-300">
                  New Service
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
                Your Digital Identity,{" "}
                <span className="bg-gradient-to-r from-product-400 to-brand-400 bg-clip-text text-transparent">
                  Unified.
                </span>
              </h2>
              <p className="mt-4 sm:mt-6 text-base sm:text-lg text-slate-400 leading-relaxed">
                Meet <span className="text-white font-semibold">Lovebite BIO</span> — the link-in-bio tool built for adult creators. 
                Sync your live status from OnlyFans & Chaturbate, showcase your content, and track every click.
              </p>
            </AnimatedSection>

            {/* Highlights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mt-6 sm:mt-8 flex flex-wrap gap-4"
            >
              {highlights.map((item, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="flex items-center gap-2 text-slate-300 text-sm cursor-default group"
                >
                  <div className="w-6 h-6 bg-product-500/20 rounded-md flex items-center justify-center transition-all duration-200 group-hover:bg-product-500/30">
                    <item.icon className="w-3.5 h-3.5 text-product-400 transition-transform duration-200 group-hover:scale-110" />
                  </div>
                  <span className="transition-colors duration-200 group-hover:text-white">{item.text}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* Learn More Link */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mt-8"
            >
              <Link
                href="/bio"
                className="inline-flex items-center gap-2 text-product-400 hover:text-product-300 font-medium transition-colors group"
              >
                Create your Bio Link
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Platform Marquee - Full Width */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="mt-16 sm:mt-20"
      >
        <p className="text-slate-500 text-sm mb-6 uppercase tracking-wider text-center">
          Integrated with your favorite platforms
        </p>
        
        <div 
          className="relative overflow-hidden"
          style={{
            maskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
            WebkitMaskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)"
          }}
        >
          <motion.div
            className="flex gap-10 sm:gap-14 lg:gap-20 whitespace-nowrap"
            animate={{
              x: ["0%", "-50%"],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 25,
                ease: "linear",
              },
            }}
          >
            {[...platforms, ...platforms, ...platforms, ...platforms].map((item, i) => (
              <span
                key={i}
                className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-700 select-none"
              >
                {item}
              </span>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
