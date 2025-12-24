"use client";

import { useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sparkles,
  ArrowRight,
  Brain,
  MessageCircle,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { AnimatedSection } from "@/components/motion/animated-section";

const highlights = [
  { icon: Brain, text: "Natural conversations" },
  { icon: MessageCircle, text: "No awkward repeats" },
  { icon: Clock, text: "24/7 engagement" },
];

export function LovdashAI() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitted(true);
    setIsLoading(false);
  };

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-slate-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 sm:gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div>
            <AnimatedSection>
              <div className="inline-flex items-center gap-2 bg-product-500/10 border border-product-500/20 rounded-full px-3 py-1.5 mb-4">
                <Sparkles className="w-3.5 h-3.5 text-product-400" />
                <span className="text-xs sm:text-sm font-medium text-product-300">
                  Coming Soon
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
                Introducing{" "}
                <span className="bg-gradient-to-r from-product-400 to-brand-400 bg-clip-text text-transparent">
                  Lovdash AI
                </span>
              </h2>
              <p className="mt-4 sm:mt-6 text-base sm:text-lg text-slate-400 leading-relaxed">
                Your smart assistant that chats with fans, handles messages, 
                and makes sales 24/7. More than automation—it&apos;s your digital twin.
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
                href="/ai"
                className="inline-flex items-center gap-2 text-product-400 hover:text-product-300 font-medium transition-colors group"
              >
                Learn more about Lovdash AI
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>

          {/* Right - Waitlist Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-product-500 to-brand-500 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Join the Waitlist</h3>
                  <p className="text-slate-400 text-sm">Be first to access</p>
                </div>
              </div>

              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-6"
                >
                  <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-6 h-6 text-green-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">
                    You&apos;re on the list!
                  </h4>
                  <p className="text-slate-400 text-sm">
                    We&apos;ll notify you when Lovdash AI launches.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
                  <div>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="off"
                      className="h-12 bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-product-500 focus:ring-product-500/20 rounded-xl"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 bg-gradient-to-r from-product-600 to-brand-600 hover:from-product-500 hover:to-brand-500 text-white rounded-xl font-semibold"
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
                  <p className="text-xs text-slate-500 text-center">
                    No spam. Unsubscribe anytime.
                  </p>
                </form>
              )}

              {/* Features Preview */}
              <div className="mt-6 pt-6 border-t border-slate-700/50">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-3">
                  What you&apos;ll get
                </p>
                <ul className="space-y-2">
                  {[
                    "Natural conversations that never repeat",
                    "Remembers every fan & their preferences",
                    "24/7 automated engagement",
                    "Knows the perfect time to make offers",
                  ].map((item, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 + i * 0.05 }}
                      whileHover={{ x: 4 }}
                      className="flex items-start gap-2 text-sm text-slate-300 cursor-default group"
                    >
                      <CheckCircle2 className="w-4 h-4 text-product-400 mt-0.5 flex-shrink-0 transition-transform duration-200 group-hover:scale-110" />
                      <span className="transition-colors duration-200 group-hover:text-white">{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

