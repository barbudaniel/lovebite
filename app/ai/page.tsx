"use client";

import { useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Zap,
  Brain,
  MessageCircle,
  TrendingUp,
  Clock,
  Shield,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Heart,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Natural Conversations",
    description:
      "Never loops or repeats. Lovebite remembers every conversation detail and builds genuine connections.",
  },
  {
    icon: MessageCircle,
    title: "Remembers Everything",
    description:
      "Remembers fan preferences, past purchases, and personal details from months ago.",
  },
  {
    icon: TrendingUp,
    title: "Smart Timing",
    description:
      "Knows the perfect moment to make offers, when fans are most engaged and ready to buy.",
  },
  {
    icon: Clock,
    title: "24/7 Engagement",
    description:
      "Your fans never sleep. Now neither does your response rate. Earn while you rest.",
  },
  {
    icon: Shield,
    title: "Safe & Secure",
    description:
      "Built with safety first. Human-like timing, works with all major platforms.",
  },
  {
    icon: Zap,
    title: "VIP Detection",
    description:
      "Instantly identifies your biggest fans and gives them special attention.",
  },
];

const comparisons = [
  { feature: "Natural Conversations", lovebite: true, others: false },
  { feature: "No Repetitive Loops", lovebite: true, others: false },
  { feature: "Fan Memory", lovebite: "Unlimited", others: "Limited" },
  { feature: "Understands Feelings", lovebite: true, others: false },
  { feature: "Always Online", lovebite: true, others: "Sometimes" },
  { feature: "Priority Support", lovebite: true, others: false },
];

export default function LovebiteAIPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitted(true);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/90 backdrop-blur-sm border-b border-slate-800/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              href="/"
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Back to Lovebite</span>
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-product-500 to-brand-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg">Lovebite AI</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-product-500/20 rounded-full blur-[128px]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-brand-500/20 rounded-full blur-[128px]" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-product-500/10 border border-product-500/20 rounded-full px-4 py-2 mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-product-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-product-500"></span>
            </span>
            <span className="text-sm text-product-300 font-medium">
              Coming Soon — Join the Waitlist
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-6"
          >
            <span className="text-white">Your Fans Never Sleep.</span>
            <br />
            <span className="bg-gradient-to-r from-product-400 via-brand-400 to-pink-400 bg-clip-text text-transparent">
              Now, Neither Do You.
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Meet Lovebite AI — your smart assistant that chats with fans, 
            handles messages, and makes sales 24/7. Stop typing. Start living.
          </motion.p>

          {/* Waitlist Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-md mx-auto"
          >
            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-slate-900/50 border border-green-500/30 rounded-2xl p-6"
              >
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  You&apos;re on the list!
                </h3>
                <p className="text-slate-400 text-sm">
                  We&apos;ll notify you when Lovebite AI launches. Get ready to transform your creator business.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="off"
                    className="h-12 bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-product-500 focus:ring-product-500/20 rounded-xl flex-1"
                  />
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="h-12 bg-gradient-to-r from-product-600 to-brand-600 hover:from-product-500 hover:to-brand-500 text-white px-6 rounded-xl font-semibold transition-all"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Joining...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        Join Waitlist
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    )}
                  </Button>
                </div>
                <p className="text-xs text-slate-500">
                  Be first to access. No spam, ever.
                </p>
              </form>
            )}
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap justify-center gap-8 sm:gap-12 mt-16 pt-8 border-t border-slate-800"
          >
            <div className="text-center">
              <p className="text-3xl sm:text-4xl font-bold text-white">24/7</p>
              <p className="text-sm text-slate-500 mt-1">Always On</p>
            </div>
            <div className="text-center">
              <p className="text-3xl sm:text-4xl font-bold text-white">0</p>
              <p className="text-sm text-slate-500 mt-1">Awkward Repeats</p>
            </div>
            <div className="text-center">
              <p className="text-3xl sm:text-4xl font-bold text-white">∞</p>
              <p className="text-sm text-slate-500 mt-1">Fan Memory</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 sm:py-28 bg-slate-900/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
              Tired of bots that sound like robots?
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Other tools get stuck in loops, repeating the same lines until your fans 
              realize they&apos;re talking to a machine. That kills the vibe—and the sale.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-slate-900 rounded-2xl border border-slate-800 p-6 sm:p-8"
          >
            <p className="text-product-400 font-semibold mb-4 text-sm uppercase tracking-wider">
              The Lovebite Difference
            </p>
            <p className="text-lg sm:text-xl text-slate-300 leading-relaxed">
              Lovebite understands the full conversation—past, present, and where it&apos;s heading. 
              Every reply moves things forward naturally. No more embarrassing 
              loops. No more lost sales. Just smooth, real conversations that convert.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <span className="text-product-400 font-semibold text-sm uppercase tracking-wider">
              Features
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-bold text-white">
              Built for Top Creators
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 sm:p-6 hover:border-product-500/30 transition-colors group"
              >
                <div className="w-10 h-10 bg-product-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-product-500/20 transition-colors">
                  <feature.icon className="w-5 h-5 text-product-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 sm:py-28 bg-slate-900/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-product-400 font-semibold text-sm uppercase tracking-wider">
              Comparison
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-white">
              Why Creators Are Switching
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden"
          >
            <div className="grid grid-cols-3 gap-4 p-4 sm:p-6 border-b border-slate-800 text-sm font-semibold">
              <div className="text-slate-500">Feature</div>
              <div className="text-center text-product-400">Lovebite AI</div>
              <div className="text-center text-slate-500">Others</div>
            </div>
            {comparisons.map((row, i) => (
              <div
                key={row.feature}
                className={`grid grid-cols-3 gap-4 p-4 sm:px-6 text-sm ${
                  i !== comparisons.length - 1 ? "border-b border-slate-800/50" : ""
                }`}
              >
                <div className="text-slate-300">{row.feature}</div>
                <div className="text-center">
                  {row.lovebite === true ? (
                    <CheckCircle2 className="w-5 h-5 text-green-400 mx-auto" />
                  ) : (
                    <span className="text-product-400 font-medium">{row.lovebite}</span>
                  )}
                </div>
                <div className="text-center">
                  {row.others === false ? (
                    <span className="text-slate-600">—</span>
                  ) : (
                    <span className="text-slate-500">{row.others}</span>
                  )}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 sm:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <span className="text-violet-400 font-semibold text-sm uppercase tracking-wider">
              Who It&apos;s For
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-white">
              Built for Creators & Agencies
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-product-500/10 to-brand-500/10 border border-product-500/20 rounded-2xl p-6 sm:p-8"
            >
              <div className="text-4xl mb-4">👩‍💻</div>
              <h3 className="text-xl font-bold text-white mb-3">Solo Creators</h3>
              <p className="text-slate-400 leading-relaxed mb-4">
                Reclaim your sleep. Lovebite handles the night shift with more charm than 
                you have at 4 AM. Focus on content, not conversations.
              </p>
              <ul className="space-y-2">
                {["Handle thousands of DMs daily", "Never miss a big spender", "Work-life balance restored"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-product-400 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-brand-500/10 to-pink-500/10 border border-brand-500/20 rounded-2xl p-6 sm:p-8"
            >
              <div className="text-4xl mb-4">🏢</div>
              <h3 className="text-xl font-bold text-white mb-3">Agencies</h3>
              <p className="text-slate-400 leading-relaxed mb-4">
                Scale your revenue, not your headcount. Professional AI that tracks 
                every dollar and never asks for a raise.
              </p>
              <ul className="space-y-2">
                {["Manage multiple creators", "Full reports & insights", "Custom branding available"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-brand-400 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 sm:py-28 bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Business?
            </h2>
            <p className="text-slate-400 text-lg mb-8 max-w-xl mx-auto">
              Join the waitlist and be first to access the smartest 
              assistant for creators ever built.
            </p>

            {isSubmitted ? (
              <div className="inline-flex items-center gap-2 text-green-400">
                <CheckCircle2 className="w-5 h-5" />
                <span>You&apos;re on the waitlist!</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="max-w-md mx-auto" autoComplete="off">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="off"
                    className="h-12 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-product-500 focus:ring-product-500/20 rounded-xl flex-1"
                  />
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="h-12 bg-gradient-to-r from-product-600 to-brand-600 hover:from-product-500 hover:to-brand-500 text-white px-6 rounded-xl font-semibold"
                  >
                    {isLoading ? "Joining..." : "Join Waitlist"}
                  </Button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
                <Heart className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-slate-400">Lovebite</span>
            </Link>
            <p className="text-slate-500 text-sm">
              &copy; 2025 Lovebite Entertainment. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
