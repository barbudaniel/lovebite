"use client";

import { useScroll, useSpring, motion, useTransform } from "motion/react";
import { useRef, ReactNode } from "react";

interface ParallaxProps {
  children: ReactNode;
  offset?: number;
  className?: string;
}

export function Parallax({ children, offset = 50, className = "" }: ParallaxProps) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset]);

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-brand-500  z-[100] origin-left"
      style={{ scaleX }}
    />
  );
}

export function FloatingElement({
  children,
  className = "",
  duration = 3,
}: {
  children: ReactNode;
  className?: string;
  duration?: number;
}) {
  return (
    <motion.div
      animate={{
        y: [0, -10, 0],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}


