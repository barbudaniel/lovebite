"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, CheckCircle2, Sparkles, Zap } from "lucide-react";
import { AnimatedSection } from "@/components/motion/animated-section";
import { cn } from "@/lib/utils";

// Pre-computed deterministic particle positions (avoids hydration mismatch)
const PARTICLE_DATA = [
  { startX: 8, endX: 12, scale: 0.7, duration: 18, delay: 0 },
  { startX: 25, endX: 30, scale: 0.55, duration: 22, delay: 1.2 },
  { startX: 42, endX: 38, scale: 0.8, duration: 16, delay: 2.5 },
  { startX: 58, endX: 65, scale: 0.6, duration: 20, delay: 0.8 },
  { startX: 75, endX: 70, scale: 0.75, duration: 19, delay: 3.1 },
  { startX: 92, endX: 88, scale: 0.65, duration: 21, delay: 1.8 },
  { startX: 15, endX: 20, scale: 0.85, duration: 17, delay: 4.2 },
  { startX: 35, endX: 32, scale: 0.5, duration: 23, delay: 2.0 },
  { startX: 50, endX: 55, scale: 0.9, duration: 15, delay: 3.5 },
  { startX: 68, endX: 72, scale: 0.58, duration: 24, delay: 0.5 },
  { startX: 82, endX: 78, scale: 0.72, duration: 18, delay: 4.8 },
  { startX: 5, endX: 10, scale: 0.62, duration: 20, delay: 2.8 },
];

// Floating particles animation with deterministic values
function FloatingParticles() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Return nothing during SSR to avoid hydration mismatch
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {PARTICLE_DATA.map((particle, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-white/20 rounded-full"
          initial={{
            x: `${particle.startX}%`,
            y: "110%",
            scale: particle.scale,
          }}
          animate={{
            y: "-10%",
            x: `calc(${particle.endX}% + ${Math.sin(i) * 50}px)`,
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: "linear",
            delay: particle.delay,
          }}
        />
      ))}
    </div>
  );
}

export function CTA() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

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
    <section id="cta" className="py-12 sm:py-16 lg:py-24 bg-brand-500 overflow-hidden relative">
      {/* Animated Background */}
      <motion.div 
        className="absolute inset-0"
        animate={{

        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Floating Particles */}
      {/* <FloatingParticles /> */}
      
      {/* Background Orbs */}
      <motion.div 
        className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"
        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.15, 0.1] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div 
        className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"
        animate={{ scale: [1, 1.3, 1], opacity: [0.05, 0.1, 0.05] }}
        transition={{ duration: 6, repeat: Infinity, delay: 1 }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center max-w-2xl mx-auto">
          {/* Badge with animation */}
          <motion.div 
            className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-6 backdrop-blur-sm"
            whileHover={{ scale: 1.05, borderColor: "rgba(255,255,255,0.4)" }}
            animate={{ boxShadow: ["0 0 0 0 rgba(255,255,255,0)", "0 0 0 8px rgba(255,255,255,0)", "0 0 0 0 rgba(255,255,255,0)"] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Sparkles className="w-4 h-4 text-white" />
            </motion.div>
            <span className="text-sm font-medium text-white">Early Access</span>
          </motion.div>

          <motion.h2 
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Ready to simplify your content workflow?
          </motion.h2>
          <motion.p 
            className="mt-4 sm:mt-6 text-lg text-white/80 max-w-xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Join the waitlist for early access. Be among the first to experience the creator operating system built for scale.
          </motion.p>
        </AnimatedSection>

        {/* Waitlist Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-10 max-w-md mx-auto"
        >
          <AnimatePresence mode="wait">
            {isSubmitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/20"
              >
                <motion.div 
                  className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, delay: 0.2 }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <CheckCircle2 className="w-8 h-8 text-white" />
                  </motion.div>
                </motion.div>
                <motion.h3 
                  className="text-xl font-bold text-white mb-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  You&apos;re on the list!
                </motion.h3>
                <motion.p 
                  className="text-white/80"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  We&apos;ll be in touch soon with your early access invite.
                </motion.p>

                {/* Celebration particles - deterministic positions */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  {[
                    { x: 15, y: 20 }, { x: 85, y: 25 }, { x: 30, y: 75 }, { x: 70, y: 80 },
                    { x: 10, y: 50 }, { x: 90, y: 45 }, { x: 25, y: 15 }, { x: 75, y: 85 },
                    { x: 45, y: 10 }, { x: 55, y: 90 }, { x: 20, y: 35 }, { x: 80, y: 65 },
                    { x: 35, y: 55 }, { x: 65, y: 40 }, { x: 40, y: 25 }, { x: 60, y: 70 },
                    { x: 5, y: 60 }, { x: 95, y: 35 }, { x: 50, y: 5 }, { x: 48, y: 95 },
                  ].map((pos, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 bg-white rounded-full"
                      initial={{
                        x: "50%",
                        y: "50%",
                        scale: 0,
                      }}
                      animate={{
                        x: `${pos.x}%`,
                        y: `${pos.y}%`,
                        scale: [0, 1, 0],
                        opacity: [0, 1, 0],
                      }}
                      transition={{
                        duration: 1,
                        delay: 0.3 + i * 0.02,
                        ease: "easeOut",
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.form 
                key="form"
                onSubmit={handleSubmit} 
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div 
                  className={`flex flex-col sm:flex-row gap-3 p-1.5 rounded-2xl transition-all duration-300 group/form ${
                    isFocused 
                      ? "bg-white shadow-lg shadow-white/10" 
                      : "bg-white/50"
                  }`}
                  animate={isFocused ? { scale: 1.01 } : { scale: 1 }}
                >
                  <div className="relative flex-1">
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      required
                      className="h-14 bg-transparent border-0 placeholder:text-brand-500 placeholder:font-bold focus:ring-0 focus-visible:ring-0 rounded-xl"
                    />
                    
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="submit"
                      disabled={isLoading}
                      size="lg"
                      className={cn(isFocused ? "bg-brand-500 text-white" : "text-white bg-transparent", "h-14 transition shadow-none border-0  hover:bg-brand-500  px-8 rounded-xl font-semibold whitespace-nowrap relative overflow-hidden group")}
                    >
                      {isLoading ? (
                        <span className="flex items-center gap-2">
                          <motion.span 
                            className="w-4 h-4 border-2 border-brand-600/30 border-t-brand-600 rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          />
                          Joining...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2 relative z-10">
                          Join Waitlist
                          <motion.div
                            animate={{ x: [0, 4, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            <ArrowRight className="w-4 h-4" />
                          </motion.div>
                        </span>
                      )}
                      {/* Button shine effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-100/50 to-transparent -skew-x-12"
                        initial={{ x: "-200%" }}
                        whileHover={{ x: "200%" }}
                        transition={{ duration: 0.6 }}
                      />
                    </Button>
                  </motion.div>
                </motion.div>
                <motion.p 
                  className="text-sm text-white text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  No spam. Unsubscribe anytime.
                </motion.p>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
