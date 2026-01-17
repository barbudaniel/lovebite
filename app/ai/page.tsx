"use client";

import { useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navigation, Footer } from "@/components/sections";
import {
  Tag,
  Brain,
  MessageSquare,
  TrendingUp,
  FileText,
  DollarSign,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  Info,
} from "lucide-react";

const features = [
  {
    icon: Tag,
    title: "Smart Tagging",
    description:
      "Automatically categorizes your content with AI-powered tags. SFW/NSFW classification, themes, and more — all organized instantly.",
  },
  {
    icon: MessageSquare,
    title: "Chat Intelligence",
    description:
      "Context-aware suggestions that understand your fans, remember conversations, and help you respond faster with your authentic voice.",
  },
  {
    icon: TrendingUp,
    title: "Performance Insights",
    description:
      "Know exactly what content converts. Track engagement, revenue attribution, and identify your top-performing media.",
  },
  {
    icon: FileText,
    title: "Auto-Descriptions",
    description:
      "Generate captions, descriptions, and hashtags automatically. Bite learns your style and writes copy that sounds like you.",
  },
  {
    icon: DollarSign,
    title: "PPV Optimization",
    description:
      "Know the perfect moment to make offers. Bite identifies when fans are engaged and suggests optimal pricing strategies.",
  },
  {
    icon: RefreshCw,
    title: "Continuous Learning",
    description:
      "Bite gets smarter the more you use it. It learns your voice, your fans, and what converts — improving over time.",
  },
];

const comparisons = [
  { feature: "Natural Conversations", Lovdash: true, others: false },
  { feature: "No Repetitive Loops", Lovdash: true, others: false },
  { feature: "Fan Memory", Lovdash: "Unlimited", others: "Limited" },
  { feature: "Understands Feelings", Lovdash: true, others: false },
  { feature: "Always Online", Lovdash: true, others: "Sometimes" },
  { feature: "Priority Support", Lovdash: true, others: false },
];

export default function LovdashAIPage() {
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
      <Navigation variant="dark" />

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
            className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-full px-4 py-2 mb-8"
          >
            <Sparkles className="w-4 h-4 text-violet-400" />
            <span className="text-sm text-violet-300 font-medium">
              Introducing Bite
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-6"
          >
            <span className="text-white">The AI that manages</span>
            <br />
            <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              your entire creator business
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Meet Bite — your AI-powered business partner that handles tagging, 
            chat intelligence, and content optimization. Less busywork, more creating.
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
                  We&apos;ll notify you when Lovdash AI launches. Get ready to transform your creator business.
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
              The Lovdash Difference
            </p>
            <p className="text-lg sm:text-xl text-slate-300 leading-relaxed">
              Lovdash understands the full conversation—past, present, and where it&apos;s heading. 
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
            <span className="text-violet-400 font-semibold text-sm uppercase tracking-wider">
              Bite AI Capabilities
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-bold text-white">
              Everything Bite Can Do
            </h2>
            <p className="mt-4 text-slate-400 max-w-2xl mx-auto">
              Six powerful AI capabilities working together to run your creator business smarter.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 sm:p-6 hover:border-violet-500/30 transition-colors group"
              >
                <div className="w-10 h-10 bg-violet-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-violet-500/20 transition-colors">
                  <feature.icon className="w-5 h-5 text-violet-400" />
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

          {/* AI Disclaimer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-10 flex items-start gap-3 bg-slate-800/50 border border-slate-700 rounded-xl p-4 max-w-2xl mx-auto"
          >
            <Info className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-slate-400 leading-relaxed">
              AI-generated content is assistive and may require review. Bite provides suggestions to help you work smarter, but you remain in control of all final decisions.
            </p>
          </motion.div>
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
              <div className="text-center text-product-400">Lovdash AI</div>
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
                  {row.Lovdash === true ? (
                    <CheckCircle2 className="w-5 h-5 text-green-400 mx-auto" />
                  ) : (
                    <span className="text-product-400 font-medium">{row.Lovdash}</span>
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
                Reclaim your sleep. Lovdash handles the night shift with more charm than 
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

      <Footer variant="dark" />
    </div>
  );
}
