"use client";

import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { AnimatedSection } from "@/components/motion/animated-section";
import Link from "next/link";
import Image from "next/image";

const steps = [
  {
    number: "01",
    image: "/homepage/lovdash_media_upload.png",
    title: "Upload",
    description: "Drop your photos and videos into Lovdash. Batch upload from any device.",
  },
  {
    number: "02",
    image: "/homepage/lovdash_media_organize.png",
    title: "Organize",
    description: "AI automatically tags, describes, and categorizes your content. No manual sorting.",
  },
  {
    number: "03",
    image: "/homepage/lovdash_media_upload.png",
    title: "Publish",
    description: "Schedule posts across all your platforms. Set your timing, we handle the posting.",
  },
  {
    number: "04",
    image: "/homepage/lovdash_media_upload.png",
    title: "Track",
    description: "See what's working. Real-time analytics across every platform and link.",
  },
];

export function Process() {
  return (
    <section id="process" className="py-12 sm:py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-10 sm:mb-12 lg:mb-16">
          <span className="text-brand-600 font-medium text-xs sm:text-sm uppercase tracking-wider">
            Simple
          </span>
          <h2 className="mt-2 sm:mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900">
            How it works
          </h2>
          <p className="mt-3 sm:mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
            From upload to insights in four simple steps. No complicated setup, no learning curve.
          </p>
        </AnimatedSection>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1 }}
            >
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="group relative bg-white rounded-2xl  h-full   "
              >
                {/* Number Badge */}


                {/* Image */}
                <div className="pb-2">
                  <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-slate-100">
                    <Image
                      src={step.image}
                      alt={step.title}
                      fill
                      className="object-cover object-bottom"
                    />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-slate-900 mb-2 px-2">
                  {step.title}
                </h3>
                <p className="text-slate-600 leading-relaxed px-2 pb-2">
                  {step.description}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-12 sm:mt-16 text-center"
        >
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 bg-slate-50 rounded-2xl p-6 border border-slate-200">
            <p className="text-slate-700">
              <span className="font-semibold">Ready to simplify your workflow?</span>
            </p>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="#cta"
                className="bg-brand-500 hover:bg-brand-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 shadow-lg shadow-brand-500/25 hover:shadow-xl hover:shadow-brand-500/30"
              >
                <span>Join the waitlist</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
