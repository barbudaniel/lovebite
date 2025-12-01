"use client";

import { motion, useInView } from "motion/react";
import { useRef, useEffect, useState } from "react";

interface StatItemProps {
  value: string;
  label: string;
  prefix?: string;
  delay?: number;
}

function AnimatedCounter({
  targetValue,
  prefix = "",
}: {
  targetValue: string;
  prefix?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [displayValue, setDisplayValue] = useState(`${prefix}0`);

  useEffect(() => {
    if (!isInView) return;

    // Parse the target value
    const numericPart = parseFloat(targetValue.replace(/[^0-9.]/g, ""));
    const suffix = targetValue.replace(/[0-9.]/g, "");

    const start = 0;
    const duration = 2000;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out quad
      const easeProgress = 1 - (1 - progress) * (1 - progress);
      const current = start + (numericPart - start) * easeProgress;

      // Format the number
      let formattedNumber;
      if (numericPart >= 1) {
        formattedNumber = current.toLocaleString("en-US", {
          maximumFractionDigits: numericPart % 1 !== 0 ? 1 : 0,
        });
      } else {
        formattedNumber = current.toFixed(1);
      }

      setDisplayValue(prefix + formattedNumber + suffix);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, targetValue, prefix]);

  return (
    <span
      ref={ref}
      className="text-4xl lg:text-5xl font-extrabold text-white mb-2 block"
    >
      {displayValue}
    </span>
  );
}

function StatItem({ value, label, prefix = "", delay = 0 }: StatItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.05, y: -4 }}
      className="p-4 text-center cursor-default group"
    >
      <AnimatedCounter targetValue={value} prefix={prefix} />
      <p className="text-brand-400 font-medium transition-colors duration-200 group-hover:text-brand-300">{label}</p>
    </motion.div>
  );
}

export function Stats() {
  const stats = [
    { value: "335+", label: "Active Creators" },
    { value: "3.1M+", label: "Total Fans" },
    { value: "18M+", label: "Paid to Models", prefix: "$" },
    { value: "15", label: "Countries" },
  ];

  return (
    <section className="bg-slate-900 py-12 border-y border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`${
                index < stats.length - 1 ? "lg:border-r lg:border-slate-800" : ""
              }`}
            >
              <StatItem
                value={stat.value}
                label={stat.label}
                prefix={"prefix" in stat ? stat.prefix : ""}
                delay={index * 0.1}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

