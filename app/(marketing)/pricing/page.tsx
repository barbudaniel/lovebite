"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Navigation, Footer } from "@/components/sections";
import { PlatformLogosRow } from "@/components/ui/platform-logos";
import { CheckCircle2, ArrowRight, Sparkles, Building2, Users, Zap, Shield, Clock, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const starterFeatures = [
  "Media library + AI tagging",
  "Bio link with analytics",
  "Basic chat suggestions",
  "1 platform",
  "Basic analytics",
  "Email support",
];

const proFeatures = [
  "Everything in Starter",
  "Full AI chat assistant",
  "AI training on your voice",
  "Unlimited platforms",
  "Gamification features",
  "Advanced analytics",
  "Priority support",
];

const agencyFeatures = [
  "Everything in Pro",
  "Multi-creator dashboard",
  "Team management",
  "Cross-creator analytics",
  "Activity feed",
  "Dedicated account manager",
];

export default function PricingPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-white" />
          <motion.div 
            className="absolute top-20 left-1/4 w-96 h-96 bg-green-100/50 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div 
            className="absolute bottom-0 right-1/4 w-80 h-80 bg-brand-100/50 rounded-full blur-3xl"
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity, delay: 1 }}
          />

          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-full px-4 py-1.5 text-sm font-medium text-emerald-700 mb-6">
                <Sparkles className="w-4 h-4" />
                7-Day Free Trial
              </span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-900 mb-6"
            >
              Simple pricing that{" "}
              <span className="bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent">
                scales with you
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto mb-8"
            >
              Start with a 7-day free trial. Choose the plan that fits your needs—cancel anytime.
            </motion.p>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap justify-center gap-6 mb-10 text-sm text-slate-600"
            >
              {[
                { icon: Shield, text: "No credit card required" },
                { icon: Clock, text: "Cancel anytime" },
                { icon: Star, text: "7-day free trial" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <item.icon className="w-4 h-4 text-emerald-500" />
                  <span>{item.text}</span>
                </div>
              ))}
            </motion.div>

            {/* Platform logos */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col items-center"
            >
              <p className="text-xs text-slate-400 mb-4 uppercase tracking-wider font-medium">
                Works with all major platforms
              </p>
              <PlatformLogosRow 
                platforms={["onlyfans", "fansly", "twitter", "instagram"]} 
                size="md"
                variant="color"
              />
            </motion.div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-16 sm:py-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Starter Plan */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white border-2 border-slate-200 rounded-2xl p-8 hover:border-emerald-300 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-slate-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Starter</h3>
                    <p className="text-sm text-slate-500">For individual creators</p>
                  </div>
                </div>
                <p className="text-slate-600 mb-6">Essential tools to organize your content and start growing.</p>
                
                <div className="mb-6">
                  <span className="text-5xl font-black text-slate-900">$39</span>
                  <span className="text-slate-500 ml-2 text-lg">/creator/mo</span>
                </div>
                
                <Button asChild size="lg" className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl mb-8 h-12 shadow-lg shadow-emerald-500/25">
                  <Link href="/join">
                    Start Free Trial
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                
                <ul className="space-y-3">
                  {starterFeatures.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm text-slate-700">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Pro Plan */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="relative bg-slate-900 border-2 border-emerald-500 rounded-2xl p-8 text-white overflow-hidden shadow-xl shadow-emerald-500/10"
              >
                {/* Popular badge */}
                <div className="absolute top-4 right-4">
                  <span className="bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    MOST POPULAR
                  </span>
                </div>
                
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                    <Zap className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Pro</h3>
                    <p className="text-sm text-slate-400">For serious creators</p>
                  </div>
                </div>
                <p className="text-slate-400 mb-6">Full AI power to maximize your content and revenue.</p>
                
                <div className="mb-6">
                  <span className="text-5xl font-black">$59</span>
                  <span className="text-slate-400 ml-2 text-lg">/creator/mo</span>
                </div>
                
                <Button asChild size="lg" className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl mb-8 h-12 shadow-lg shadow-emerald-500/25">
                  <Link href="/join">
                    Start Free Trial
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                
                <ul className="space-y-3">
                  {proFeatures.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm text-slate-300">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Agency Plan */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-white border-2 border-slate-200 rounded-2xl p-8 hover:border-emerald-300 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-slate-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Agency</h3>
                    <p className="text-sm text-slate-500">For teams & agencies</p>
                  </div>
                </div>
                <p className="text-slate-600 mb-6">Multi-creator management with advanced team features.</p>
                
                <div className="mb-6">
                  <span className="text-5xl font-black text-slate-900">Custom</span>
                  <span className="text-slate-500 ml-2 text-lg">pricing</span>
                </div>
                
                <Button asChild size="lg" variant="outline" className="w-full border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-emerald-400 rounded-xl mb-8 h-12">
                  <Link href="/contact?type=demo">
                    Book a Demo
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                
                <ul className="space-y-3">
                  {agencyFeatures.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm text-slate-700">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-slate-50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center mb-10">Pricing Questions</h2>
              <div className="space-y-6">
                <div className="bg-white rounded-xl p-6 border border-slate-200">
                  <h3 className="font-semibold text-slate-900 mb-2">How does the free trial work?</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">Start with a 7-day free trial on any plan—no credit card required. Explore all features and decide if Lovdash is right for you.</p>
                </div>
                <div className="bg-white rounded-xl p-6 border border-slate-200">
                  <h3 className="font-semibold text-slate-900 mb-2">What&apos;s the difference between Starter and Pro?</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">Starter gives you the essentials: media library, AI tagging, and one platform. Pro unlocks the full AI chat assistant, unlimited platforms, advanced analytics, and gamification features.</p>
                </div>
                <div className="bg-white rounded-xl p-6 border border-slate-200">
                  <h3 className="font-semibold text-slate-900 mb-2">How does Agency pricing work?</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">Agency pricing is customized based on the number of creators you manage. Book a demo and we&apos;ll create a quote tailored to your needs.</p>
                </div>
                <div className="bg-white rounded-xl p-6 border border-slate-200">
                  <h3 className="font-semibold text-slate-900 mb-2">Can I switch plans later?</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">Yes! Upgrade or downgrade anytime. Changes take effect on your next billing cycle, and we&apos;ll prorate any differences.</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
