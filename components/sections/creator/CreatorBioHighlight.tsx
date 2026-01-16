"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function CreatorBioHighlight() {
  return (
    <section className="py-20 lg:py-28 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white border border-slate-200 rounded-[20px] p-8 lg:p-12"
        >
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Content - Left on desktop */}
            <div className="text-center lg:text-left">
              <span className="inline-block px-3 py-1.5 bg-brand-100 text-brand-700 rounded-md text-xs font-semibold uppercase tracking-wider mb-4">
                Lovdash Bio
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
                One link for all your platforms
              </h3>
              <p className="text-slate-600 leading-relaxed mb-6">
                Give your fans one place to find everything. Customize your bio link page, add all your platforms and content, and track every click with real analytics.
              </p>
              <Button asChild variant="link" className="text-brand-600 hover:text-brand-700 p-0 h-auto font-semibold">
                <Link href="/bio">
                  Create Your Bio
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </div>

            {/* Visual - Right on desktop */}
            <div>
              <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center">
                <span className="text-slate-400 text-sm">Bio Feature Visual</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
