"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Navigation, Footer } from "@/components/sections";
import { PlatformLogosRow } from "@/components/ui/platform-logos";
import { CheckCircle2, ArrowRight, Sparkles, Building2, Users, Zap, Shield, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const creatorFeatures = [
  "Unlimited media uploads",
  "AI tagging & descriptions",
  "Multi-platform publishing",
  "Content scheduling",
  "Analytics dashboard",
  "Lovdash Bio link",
  "Priority support",
];

const studioFeatures = [
  "Everything in Creator",
  "Unlimited team members",
  "Role-based permissions",
  "Multi-creator management",
  "Cross-creator analytics",
  "White-label options (planned)",
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
              <span className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-4 py-1.5 text-sm font-medium text-green-700 mb-6">
                <Sparkles className="w-4 h-4" />
                Early Access — Free to Join
              </span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-900 mb-6"
            >
              Simple pricing that{" "}
              <span className="bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
                scales with you
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto mb-8"
            >
              We're currently in early access. Join the waitlist to get free access when we launch, plus early adopter pricing locked in forever.
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
                { icon: Zap, text: "Instant access" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <item.icon className="w-4 h-4 text-green-500" />
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
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Creator Plan */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white border-2 border-slate-200 rounded-2xl p-8 hover:border-brand-300 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-brand-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">For Creators</h3>
                    <p className="text-sm text-slate-500">Individual creators</p>
                  </div>
                </div>
                <p className="text-slate-600 mb-6">Everything you need to manage your content and grow your audience.</p>
                
                <div className="mb-6">
                  <span className="text-5xl font-black text-slate-900">Free</span>
                  <span className="text-slate-500 ml-2 text-lg">during early access</span>
                </div>
                
                <Button asChild size="lg" className="w-full bg-brand-500 hover:bg-brand-600 text-white rounded-xl mb-8 h-12 shadow-lg shadow-brand-500/25">
                  <Link href="/#cta">
                    Join Waitlist
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                
                <ul className="space-y-3">
                  {creatorFeatures.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm text-slate-700">
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Studio Plan */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="relative bg-slate-900 border-2 border-slate-800 rounded-2xl p-8 text-white overflow-hidden"
              >
                {/* Popular badge */}
                <div className="absolute top-4 right-4">
                  <span className="bg-brand-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    POPULAR
                  </span>
                </div>
                
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">For Agencies</h3>
                    <p className="text-sm text-slate-400">Agencies & teams</p>
                  </div>
                </div>
                <p className="text-slate-400 mb-6">Multi-creator management with team collaboration and advanced analytics.</p>
                
                <div className="mb-6">
                  <span className="text-5xl font-black">Custom</span>
                  <span className="text-slate-400 ml-2 text-lg">based on roster size</span>
                </div>
                
                <Button asChild size="lg" variant="outline" className="w-full border-white/30 text-white hover:bg-white/10 rounded-xl mb-8 h-12">
                  <Link href="/studio#studio-cta">
                    Book a Demo
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                
                <ul className="space-y-3">
                  {studioFeatures.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm text-slate-300">
                      <CheckCircle2 className="w-5 h-5 text-brand-400 flex-shrink-0" />
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
                  <h3 className="font-semibold text-slate-900 mb-2">Is it really free during early access?</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">Yes. Join the waitlist and get full access to all creator features for free when we launch. Early adopters will also lock in discounted pricing for life.</p>
                </div>
                <div className="bg-white rounded-xl p-6 border border-slate-200">
                  <h3 className="font-semibold text-slate-900 mb-2">What happens after early access?</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">We'll introduce tiered pricing based on usage. Early access users get grandfathered rates that never increase.</p>
                </div>
                <div className="bg-white rounded-xl p-6 border border-slate-200">
                  <h3 className="font-semibold text-slate-900 mb-2">How does studio pricing work?</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">Studio pricing is based on the number of creators you manage. Book a demo and we'll create a custom quote for your needs.</p>
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
