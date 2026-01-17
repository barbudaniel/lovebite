"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Navigation, Footer } from "@/components/sections";
import { PlatformLogosRow } from "@/components/ui/platform-logos";
import { BarChart3, TrendingUp, DollarSign, Link2, Users, Target, ArrowRight, Sparkles, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const benefits = [
  { icon: DollarSign, title: "Revenue Tracking", description: "See earnings from all platforms in one unified view. Track tips, subscriptions, and PPV with full attribution." },
  { icon: Target, title: "Content Attribution", description: "Know exactly which content drives revenue. Connect every sale back to the post that made it happen." },
  { icon: Link2, title: "Bio Link Analytics", description: "Track every click, tap, and conversion from your bio links. See which links drive the most traffic." },
  { icon: Users, title: "Cross-Creator Comparison", description: "Compare performance across your roster. Identify top performers and growth opportunities." },
  { icon: TrendingUp, title: "Trend Identification", description: "Spot patterns in your data. See what&apos;s working, what&apos;s not, and where to focus next." },
  { icon: BarChart3, title: "Custom Reports", description: "Build reports for the metrics that matter to you. Export anytime." },
];

export default function AnalyticsPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-white">
        {/* Hero */}
        <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-amber-50 via-white to-white" />
          <motion.div 
            className="absolute top-20 right-1/3 w-96 h-96 bg-amber-100/50 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-20 h-20 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-amber-200/50"
            >
              <BarChart3 className="w-10 h-10 text-amber-500" />
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-900 mb-6"
            >
              Know Your Numbers,{" "}
              <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                Grow Your Business
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto mb-8"
            >
              Stop guessing. See exactly which content drives revenue, track attribution across platforms, and make data-driven decisions that grow your business.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-10"
            >
              <Button asChild size="lg" className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-full px-8 shadow-lg shadow-emerald-500/25">
                <Link href="/join">
                  Start Free Trial
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
              <p className="text-sm text-slate-500 mb-4">Track performance across all platforms</p>
              <PlatformLogosRow 
                platforms={["onlyfans", "fansly", "loyalfans", "twitter", "instagram"]} 
                size="lg"
                variant="color"
                showLabels
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
              Everything You Need to Track
            </motion.h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((item, i) => (
                <motion.div 
                  key={item.title} 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg hover:border-amber-200 transition-all"
                >
                  <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-4">
                    <item.icon className="w-6 h-6 text-amber-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Agency Section */}
        <section className="py-16 sm:py-24 bg-slate-900">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6"
              >
                <Building2 className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-medium text-emerald-400">For Agencies</span>
              </motion.div>
              
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-2xl sm:text-3xl font-bold text-white mb-4"
              >
                Compare creator performance at a glance
              </motion.h2>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-slate-400 max-w-2xl mx-auto"
              >
                Managing multiple creators? See everyone&apos;s performance in one dashboard. Identify top performers, spot trends across your roster, and make strategic decisions backed by data.
              </motion.p>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="grid sm:grid-cols-3 gap-6 mb-12"
            >
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-emerald-400 mb-2">50+</div>
                <div className="text-slate-400 text-sm">Creators Managed</div>
              </div>
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-emerald-400 mb-2">$2M+</div>
                <div className="text-slate-400 text-sm">Revenue Tracked</div>
              </div>
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-emerald-400 mb-2">99.9%</div>
                <div className="text-slate-400 text-sm">Uptime</div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="text-center"
            >
              <Button asChild size="lg" className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-full px-8 shadow-lg shadow-emerald-500/25">
                <Link href="/contact?type=demo">
                  Book a Demo
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-gradient-to-br from-emerald-500 to-emerald-600">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Sparkles className="w-10 h-10 text-white/80 mx-auto mb-4" />
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Ready to understand your growth?</h2>
            <p className="text-white/80 mb-8">Get insights that help you earn more and grow faster.</p>
            <Button asChild size="lg" className="bg-white text-emerald-600 hover:bg-white/90 rounded-full px-8">
              <Link href="/join">Start Free Trial</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
