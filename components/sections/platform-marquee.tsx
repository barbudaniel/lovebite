"use client";

import { motion } from "motion/react";

const platforms = [
  "OnlyFans",
  "Chaturbate",
  "Fansly",
  "LoyalFans",
  "ManyVids",
  "Stripchat",
  "CamSoda",
  "Pornhub",
];

export function PlatformMarquee() {
  return (
    <div className="w-full py-8">
      <p className="text-slate-500 text-sm mb-6 uppercase tracking-wider text-center">
        Integrated with your favorite platforms
      </p>
      
      <div 
        className="relative overflow-hidden"
        style={{
          maskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
          WebkitMaskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)"
        }}
      >
        <motion.div
          className="flex gap-10 sm:gap-14 lg:gap-20 whitespace-nowrap"
          animate={{
            x: ["0%", "-50%"],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 25,
              ease: "linear",
            },
          }}
        >
          {[...platforms, ...platforms, ...platforms, ...platforms].map((item, i) => (
            <span
              key={i}
              className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-600 hover:text-slate-400 transition-colors select-none"
            >
              {item}
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}








