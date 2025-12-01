"use client";

import { motion } from "motion/react";

const marqueeItems = [
  "Your Screen",
  "Your Body",
  "Your Choice",
  "•",
  "Earn Smart",
  "Live Free",
  "•",
  "Content Creator",
  "Boss Mode",
  "•",
];

export function Marquee() {
  return (
    <section className="relative py-4 sm:py-5 bg-brand-600 overflow-hidden">
      <div className="flex">
        <motion.div
          className="flex gap-4 sm:gap-6 lg:gap-8 whitespace-nowrap"
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
          {[...marqueeItems, ...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, i) => (
            <span
              key={i}
              className={`text-sm sm:text-base md:text-lg lg:text-xl font-bold uppercase tracking-wider ${
                item === "•" ? "text-white/40" : "text-white"
              }`}
            >
              {item}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
