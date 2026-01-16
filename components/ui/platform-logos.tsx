"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

// Real official platform SVG logos
export const PlatformIcons = {
  // OnlyFans official logo - concentric circles (the "O" icon)
  onlyfans: ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={cn("w-6 h-6", className)} fill="currentColor">
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm0 3.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zm0 2.5a4 4 0 110 8 4 4 0 010-8zm0 1.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5z"/>
    </svg>

    
  ),
  // Fansly official logo - stylized F with heart
  fansly: ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={cn("w-6 h-6", className)} fill="currentColor">
      <path d="M20.89 3.11a5.95 5.95 0 00-8.42 0L12 3.58l-.47-.47a5.95 5.95 0 00-8.42 8.42l.47.47L12 20.42 20.42 12l.47-.47a5.95 5.95 0 000-8.42zM8.5 14l-2-2 1.41-1.41L8.5 11.17V8h2v3.17l.59-.58L12.5 12l-2 2H8.5z"/>
    </svg>
  ),
  // X (Twitter) official logo - the X mark
  twitter: ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={cn("w-6 h-6", className)} fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  ),
  // Instagram official logo - camera with rounded square
  instagram: ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={cn("w-6 h-6", className)} fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </svg>
  ),
  // TikTok official logo - musical note "d"
  tiktok: ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={cn("w-6 h-6", className)} fill="currentColor">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
    </svg>
  ),
  // Reddit official logo - snoo face
  reddit: ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={cn("w-6 h-6", className)} fill="currentColor">
      <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
    </svg>
  ),
  // Chaturbate logo - simplified
  chaturbate: ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={cn("w-6 h-6", className)} fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
    </svg>
  ),
};

// Brand colors for each platform
export const platformBrandColors: Record<keyof typeof PlatformIcons, { bg: string; text: string; hex: string }> = {
  onlyfans: { bg: "bg-[#00AFF0]", text: "text-[#00AFF0]", hex: "#00AFF0" },
  fansly: { bg: "bg-[#009FEB]", text: "text-[#009FEB]", hex: "#009FEB" },
  twitter: { bg: "bg-black", text: "text-black", hex: "#000000" },
  instagram: { bg: "bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737]", text: "text-[#E4405F]", hex: "#E4405F" },
  tiktok: { bg: "bg-black", text: "text-black", hex: "#000000" },
  reddit: { bg: "bg-[#FF4500]", text: "text-[#FF4500]", hex: "#FF4500" },
  chaturbate: { bg: "bg-[#F47321]", text: "text-[#F47321]", hex: "#F47321" },
};

interface PlatformLogoProps {
  platform: keyof typeof PlatformIcons;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  variant?: "color" | "mono" | "outline";
  className?: string;
  showBg?: boolean;
}

const sizeClasses = {
  xs: { container: "w-6 h-6", icon: "w-3.5 h-3.5" },
  sm: { container: "w-8 h-8", icon: "w-4 h-4" },
  md: { container: "w-10 h-10", icon: "w-5 h-5" },
  lg: { container: "w-12 h-12", icon: "w-6 h-6" },
  xl: { container: "w-14 h-14", icon: "w-7 h-7" },
};

export function PlatformLogo({ 
  platform, 
  size = "md", 
  variant = "color", 
  className,
  showBg = true,
}: PlatformLogoProps) {
  const Icon = PlatformIcons[platform];
  const colors = platformBrandColors[platform];
  const sizes = sizeClasses[size];
  
  if (!showBg) {
    return (
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className={cn("flex items-center justify-center", className)}
      >
        <Icon className={cn(
          sizes.icon,
          variant === "color" ? colors.text : variant === "mono" ? "text-slate-600" : "text-current"
        )} />
      </motion.div>
    );
  }
  
  return (
    <motion.div
      whileHover={{ scale: 1.1, y: -2 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "rounded-xl flex items-center justify-center transition-all",
        sizes.container,
        variant === "color" 
          ? `${colors.bg} text-white shadow-lg` 
          : variant === "mono" 
            ? "bg-slate-100 text-slate-600" 
            : "bg-white/10 text-white border border-white/20",
        "hover:shadow-xl cursor-pointer",
        className
      )}
    >
      <Icon className={sizes.icon} />
    </motion.div>
  );
}

interface PlatformLogosRowProps {
  platforms?: (keyof typeof PlatformIcons)[];
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  variant?: "color" | "mono" | "stacked" | "minimal";
  className?: string;
  showLabels?: boolean;
  animated?: boolean;
}

export function PlatformLogosRow({ 
  platforms = ["onlyfans", "fansly", "twitter", "instagram"],
  size = "md",
  variant = "color",
  className,
  showLabels = false,
  animated = true,
}: PlatformLogosRowProps) {
  const sizes = sizeClasses[size];

  // Stacked variant - overlapping circles
  if (variant === "stacked") {
    return (
      <div className={cn("flex items-center", className)}>
        {platforms.map((platform, i) => {
          const Icon = PlatformIcons[platform];
          const colors = platformBrandColors[platform];
          return (
            <motion.div
              key={platform}
              initial={animated ? { opacity: 0, x: -10 } : false}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className={cn(
                "-ml-2 first:ml-0 rounded-full border-2 border-white flex items-center justify-center",
                colors.bg,
                "text-white shadow-md",
                sizes.container
              )}
              style={{ zIndex: platforms.length - i }}
              whileHover={{ scale: 1.15, zIndex: 100 }}
            >
              <Icon className={sizes.icon} />
            </motion.div>
          );
        })}
      </div>
    );
  }

  // Minimal variant - just icons, no backgrounds
  if (variant === "minimal") {
    return (
      <div className={cn("flex items-center gap-4", className)}>
        {platforms.map((platform, i) => {
          const Icon = PlatformIcons[platform];
          const colors = platformBrandColors[platform];
          return (
            <motion.div
              key={platform}
              initial={animated ? { opacity: 0, y: 10 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.2, y: -2 }}
              className="flex flex-col items-center gap-1.5 cursor-pointer"
            >
              <Icon className={cn("w-6 h-6", colors.text)} />
              {showLabels && (
                <span className="text-xs text-slate-500 capitalize font-medium">{platform === "twitter" ? "X" : platform}</span>
              )}
            </motion.div>
          );
        })}
      </div>
    );
  }

  // Default row with backgrounds
  return (
    <div className={cn("flex items-center gap-3", className)}>
      {platforms.map((platform, i) => (
        <motion.div
          key={platform}
          initial={animated ? { opacity: 0, y: 10 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="flex flex-col items-center gap-1.5"
        >
          <PlatformLogo 
            platform={platform} 
            size={size} 
            variant={variant === "mono" ? "mono" : "color"} 
          />
          {showLabels && (
            <span className="text-xs text-slate-500 capitalize font-medium">
              {platform === "twitter" ? "X" : platform}
            </span>
          )}
        </motion.div>
      ))}
    </div>
  );
}

// Platform badge with name
export function PlatformBadge({ 
  platform, 
  className 
}: { 
  platform: keyof typeof PlatformIcons; 
  className?: string 
}) {
  const Icon = PlatformIcons[platform];
  const colors = platformBrandColors[platform];
  
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium",
        colors.bg,
        "text-white shadow-md",
        className
      )}
    >
      <Icon className="w-4 h-4" />
      <span className="capitalize">{platform === "twitter" ? "X" : platform}</span>
    </motion.div>
  );
}

// Animated platform marquee
export function PlatformMarquee({ className }: { className?: string }) {
  const platforms: (keyof typeof PlatformIcons)[] = ["onlyfans", "fansly", "twitter", "instagram", "tiktok", "reddit"];
  
  return (
    <div className={cn("overflow-hidden", className)}>
      <motion.div
        animate={{ x: [0, -50 * platforms.length] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="flex gap-8 items-center"
      >
        {[...platforms, ...platforms].map((platform, i) => {
          const Icon = PlatformIcons[platform];
          const colors = platformBrandColors[platform];
          return (
            <div key={i} className="flex items-center gap-3 hover:scale-105 transition-transform cursor-pointer">
              <Icon className={cn("w-6 h-6", colors.text)} />
              <span className="text-sm font-medium text-slate-600 whitespace-nowrap capitalize">
                {platform === "twitter" ? "X" : platform}
              </span>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}
