"use client";

import { motion } from "motion/react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  variant?: "light" | "dark" | "auto";
  size?: "sm" | "md" | "lg";
  className?: string;
  animated?: boolean;
}

const sizeConfig = {
  sm: { width: 100, height: 24 },
  md: { width: 125, height: 30 },
  lg: { width: 150, height: 36 },
};

export function Logo({ 
  variant = "auto", 
  size = "md", 
  className,
  animated = true,
}: LogoProps) {
  const config = sizeConfig[size];
  
  // Determine if we should invert the logo
  // Dark variant = white logo (for dark backgrounds)
  // Light variant = original logo (for light backgrounds)
  const shouldInvert = variant === "dark";

  const Wrapper = animated ? motion.div : "div";
  const wrapperProps = animated ? {
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 },
  } : {};

  return (
    <Link href="/" className={cn("inline-flex items-center group", className)}>
      <Wrapper {...wrapperProps} className="relative">
        <Image
          src="/logo.png"
          alt="Lovdash"
          width={config.width}
          height={config.height}
          className={cn(
            "transition-all duration-300",
            shouldInvert && "brightness-0 invert"
          )}
          priority
        />
      </Wrapper>
    </Link>
  );
}

// Icon-only logo (using the real logo cropped to icon)
export function LogoIcon({ 
  size = "md",
  className,
  variant = "auto",
}: { 
  size?: "sm" | "md" | "lg";
  variant?: "light" | "dark" | "auto";
  className?: string;
}) {
  const iconSizes = {
    sm: { width: 24, height: 24 },
    md: { width: 32, height: 32 },
    lg: { width: 40, height: 40 },
  };

  const config = iconSizes[size];
  const shouldInvert = variant === "dark";

  return (
    <Link href="/" className={cn("inline-flex items-center justify-center", className)}>
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400 }}
      >
        <Image
          src="/logo.png"
          alt="Lovdash"
          width={config.width}
          height={config.height}
          className={cn(
            "transition-all duration-300",
            shouldInvert && "brightness-0 invert"
          )}
        />
      </motion.div>
    </Link>
  );
}
