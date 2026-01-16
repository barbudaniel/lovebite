"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function CreatorAIHighlight() {
  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white border border-slate-200 rounded-[20px] p-8 lg:p-12"
        >
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Visual */}
            <div className="order-2 lg:order-1">
              <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center">
                <span className="text-slate-400 text-sm">AI Feature Visual</span>
              </div>
            </div>

            {/* Content */}
            <div className="order-1 lg:order-2 text-center lg:text-left">
              <span className="inline-block px-3 py-1.5 bg-brand-100 text-brand-700 rounded-md text-xs font-semibold uppercase tracking-wider mb-4">
                Lovdash AI
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
                Your content, organized automatically
              </h3>
              <p className="text-slate-600 leading-relaxed mb-6">
                Stop wasting time tagging and describing every piece of content. Lovdash AI analyzes your uploads, generates tags, and writes descriptions—so your library stays organized without the effort.
              </p>
              <Button asChild variant="link" className="text-brand-600 hover:text-brand-700 p-0 h-auto font-semibold">
                <Link href="/ai">
                  Explore Lovdash AI
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Disclaimer */}
        <p className="text-center text-sm text-slate-500 mt-4">
          AI-generated content is assistive and may require review.
        </p>
      </div>
    </section>
  );
}
