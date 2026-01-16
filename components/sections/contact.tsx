"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Send, Heart, Shield, Clock, CheckCircle2, Sparkles, ArrowRight } from "lucide-react";
import { AnimatedSection } from "@/components/motion/animated-section";

const interestOptions = [
  { id: "interested", label: "I am interested", icon: "💫" },
  { id: "advice", label: "I need advice", icon: "💬" },
  { id: "call", label: "Call me", icon: "📞" },
];

const features = [
  { icon: Shield, text: "100% Confidential" },
  { icon: Clock, text: "Response within 24h" },
  { icon: Heart, text: "No obligations" },
];

export function Contact() {
  const [selectedInterest, setSelectedInterest] = useState("interested");
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    social: "",
    message: "",
  });

  return (
    <section id="contact" className="py-16 sm:py-20 lg:py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-10 sm:mb-12">
          <span className="text-brand-600 font-semibold text-xs sm:text-sm uppercase tracking-wider">
            Get Started
          </span>
          <h2 className="mt-2 sm:mt-3 text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900">
            I would like to become a <span className="text-brand-600">model</span>
          </h2>
          <p className="mt-3 sm:mt-4 text-base sm:text-lg text-slate-500 max-w-xl mx-auto">
            Earn money by selling your self-made content on subscription platforms.
            Together we can make it a lucrative reality.
          </p>
          
          {/* Quick Start CTA */}
          <div className="mt-6">
            <Link href="/join">
              <Button size="lg" className="bg-brand-600 hover:bg-brand-700 text-white shadow-lg shadow-brand-600/25 group">
                <Sparkles className="w-4 h-4 mr-2" />
                Create Your Bio Link
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <p className="mt-2 text-sm text-slate-400">
              Get your free bio link page in 2 minutes
            </p>
          </div>
        </AnimatedSection>

        <div className="max-w-xl mx-auto">
          <AnimatedSection delay={0.1}>
            <div className="bg-white rounded-2xl p-5 sm:p-7 lg:p-8 border border-slate-200">
              <form className="space-y-4 sm:space-y-5" autoComplete="off">
                {/* Interest Selection - Tag Style Buttons */}
                <div className="space-y-2">
                  <Label className="text-slate-700 text-sm">What brings you here?</Label>
                  <div className="flex flex-wrap gap-2">
                    {interestOptions.map((option) => (
                      <motion.button
                        key={option.id}
                        type="button"
                        onClick={() => setSelectedInterest(option.id)}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.95 }}
                        className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full font-medium text-xs sm:text-sm transition-all duration-200 ${
                          selectedInterest === option.id
                            ? "bg-brand-600 text-white shadow-md"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:shadow-sm"
                        }`}
                      >
                        <motion.span
                          animate={{ rotate: selectedInterest === option.id ? [0, -10, 10, 0] : 0 }}
                          transition={{ duration: 0.4 }}
                        >
                          {option.icon}
                        </motion.span>
                        <span>{option.label}</span>
                        {selectedInterest === option.id && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 400 }}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 ml-0.5" />
                          </motion.span>
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Name & Email Row */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5 group">
                    <Label htmlFor="name" className="text-slate-700 text-sm transition-colors duration-200 group-focus-within:text-brand-600">Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Your name"
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      autoComplete="off"
                      className="h-11 rounded-lg border-slate-200 focus:border-brand-500 focus:ring-brand-500 text-sm transition-all duration-200 hover:border-slate-300 focus:shadow-[0_0_0_3px_rgba(236,72,153,0.1)]"
                    />
                  </div>
                  <div className="space-y-1.5 group">
                    <Label htmlFor="email" className="text-slate-700 text-sm transition-colors duration-200 group-focus-within:text-brand-600">E-mail *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      required
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      autoComplete="off"
                      className="h-11 rounded-lg border-slate-200 focus:border-brand-500 focus:ring-brand-500 text-sm transition-all duration-200 hover:border-slate-300 focus:shadow-[0_0_0_3px_rgba(236,72,153,0.1)]"
                    />
                  </div>
                </div>

                {/* Social Link */}
                <div className="space-y-1.5 group">
                  <Label htmlFor="social" className="text-slate-700 text-sm transition-colors duration-200 group-focus-within:text-brand-600">Instagram / Social Link</Label>
                  <Input
                    id="social"
                    type="text"
                    placeholder="@yourusername or profile link"
                    value={formState.social}
                    onChange={(e) => setFormState({ ...formState, social: e.target.value })}
                    autoComplete="off"
                    className="h-11 rounded-lg border-slate-200 focus:border-brand-500 focus:ring-brand-500 text-sm transition-all duration-200 hover:border-slate-300 focus:shadow-[0_0_0_3px_rgba(236,72,153,0.1)]"
                  />
                </div>

                {/* Message */}
                <div className="space-y-1.5 group">
                  <Label htmlFor="message" className="text-slate-700 text-sm transition-colors duration-200 group-focus-within:text-brand-600">Your message</Label>
                  <textarea
                    id="message"
                    placeholder="Tell us a bit about yourself..."
                    rows={3}
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    autoComplete="off"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 resize-none transition-all duration-200 hover:border-slate-300 focus:shadow-[0_0_0_3px_rgba(236,72,153,0.1)]"
                  />
                </div>

                {/* Submit Button */}
                <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-brand-600 hover:bg-brand-700 text-white h-12 text-sm sm:text-base rounded-lg group relative overflow-hidden"
                  >
                    <Send className="w-4 h-4 mr-2 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    <span>Send Application</span>
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  </Button>
                </motion.div>

                {/* Privacy Note */}
                <p className="text-center text-xs text-slate-400">
                  By sending this form you agree to our Privacy Policy.
                  This service is intended for adults only.
                </p>
              </form>
            </div>
          </AnimatedSection>

          {/* Trust Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4 sm:gap-6 mt-8"
          >
            {features.map((feature, i) => (
              <motion.div 
                key={i} 
                whileHover={{ scale: 1.05, y: -2 }}
                className="flex items-center gap-2 text-slate-500 text-xs sm:text-sm cursor-default group"
              >
                <feature.icon className="w-4 h-4 text-brand-500 transition-transform duration-200 group-hover:scale-110" />
                <span className="transition-colors duration-200 group-hover:text-slate-700">{feature.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
