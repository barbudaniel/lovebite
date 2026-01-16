"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Loader2, Mail, MessageSquare } from "lucide-react";

// COMPLIANCE EDIT per DEC-014: Changed "Join studios already managing" to "Be among the first agencies"
// COMPLIANCE EDIT per DEC-014: Changed response time to "typically respond within 1-2 business days"
export function StudioCTA() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    
    // Simulate API call - replace with actual demo booking submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    setStatus("success");
  };

  return (
    <section id="studio-cta" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-brand-600 to-brand-700 rounded-3xl px-6 sm:px-8 lg:px-12 py-16 lg:py-20"
        >
          <div className="max-w-3xl mx-auto text-center">
            {/* Kicker */}
            <p className="text-white/80 text-sm font-medium uppercase tracking-wider mb-4">
              Get started
            </p>

            {/* Headline */}
            <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-bold text-white mb-4">
              Ready to scale your agency?
            </h2>

            {/* Subheadline - COMPLIANCE EDIT APPLIED */}
            <p className="text-lg text-white/90 max-w-xl mx-auto mb-8">
              Be among the first agencies to manage your roster with Lovdash. Book a demo and see how it works for your team.
            </p>

            {status === "success" ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-3"
              >
                <CheckCircle className="w-12 h-12 text-white" />
                <p className="text-xl font-semibold text-white">Demo request received!</p>
                <p className="text-white/80">We typically respond within 1-2 business days.</p>
              </motion.div>
            ) : (
              <>
                <form onSubmit={handleSubmit} className="max-w-md mx-auto mb-6">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your work email"
                      required
                      className="flex-1 h-14 px-5 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-white/50"
                    />
                    <Button 
                      type="submit" 
                      size="lg" 
                      disabled={status === "loading"}
                      className="bg-white text-brand-600 hover:bg-slate-50 h-14 px-8 text-lg rounded-xl shadow-lg"
                    >
                      {status === "loading" ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          Book a Demo
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                </form>

                {/* Secondary CTA */}
                <div className="flex items-center justify-center gap-4">
                  <Button variant="link" className="text-white/80 hover:text-white p-0 h-auto">
                    <Mail className="w-4 h-4 mr-2" />
                    Talk to Sales
                  </Button>
                  <span className="text-white/40">or</span>
                  <Button variant="link" className="text-white/80 hover:text-white p-0 h-auto">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Live Chat
                  </Button>
                </div>
              </>
            )}

            {/* Trust Line */}
            <p className="mt-6 text-white/70 text-sm">
              No credit card required. See the platform before you commit.
            </p>

            {/* Privacy Note - COMPLIANCE EDIT APPLIED */}
            <p className="mt-2 text-white/50 text-xs">
              Your information is secure. We typically respond within 1-2 business days.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
