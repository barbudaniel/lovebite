"use client";

import { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useDragControls,
  useMotionValue,
  animate,
} from "motion/react";
import Link from "next/link";
import Image from "next/image";
import {
  Menu,
  X,
  Sparkles,
  Link2,
  LayoutGrid,
  Users,
  Building2,
  ArrowRight,
  ChevronRight,
  ChevronDown,
  Plus,
  Image as ImageIcon,
  Calendar,
  BarChart3,
  Send,
  FileText,
  Shield,
  HelpCircle,
  Zap,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Feature items for the dropdown menu
const featureItems = [
  {
    icon: ImageIcon,
    title: "Media Library",
    description: "Organize all your content in one place",
    href: "/features/media-library",
    color: "text-blue-500",
  },
  {
    icon: Sparkles,
    title: "AI Tagging",
    description: "Auto-tag and describe your media",
    href: "/features/ai-tagging",
    color: "text-purple-500",
  },
  {
    icon: Calendar,
    title: "Scheduling",
    description: "Plan your content calendar",
    href: "/features/scheduling",
    color: "text-orange-500",
  },
  {
    icon: Send,
    title: "Publishing",
    description: "Post to multiple platforms at once",
    href: "/features/publishing",
    color: "text-green-500",
  },
  {
    icon: BarChart3,
    title: "Analytics",
    description: "Track performance across platforms",
    href: "/features/analytics",
    color: "text-pink-500",
  },
];

// Quick links for the menu
const quickLinks = [
  { label: "Pricing", href: "/pricing", icon: Zap },
  { label: "AI", href: "/ai", icon: Sparkles },
  { label: "Privacy", href: "/privacy", icon: Shield },
  { label: "Terms", href: "/terms", icon: FileText },
];

interface NavigationProps {
  variant?: "light" | "dark";
}

export function Navigation({ variant = "light" }: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFeaturesOpen, setIsFeaturesOpen] = useState(false);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const featuresDropdownRef = useRef<HTMLDivElement>(null);

  // Drag controls for sheet
  const dragControls = useDragControls();
  const sheetY = useMotionValue(0);

  // Simple scroll handler - only for styling, no hide/show
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
      // Reset sheetY when opening
      sheetY.set(0);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen, sheetY]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMenuOpen(false);
        setIsFeaturesOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  // Close features dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        featuresDropdownRef.current &&
        !featuresDropdownRef.current.contains(e.target as Node)
      ) {
        setIsFeaturesOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Check scroll position of sheet content
  const handleSheetScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const isAtBottom =
      target.scrollHeight - target.scrollTop <= target.clientHeight + 50;
    setShowScrollIndicator(!isAtBottom);
  };

  const handleDragEnd = (
    _: any,
    info: { velocity: { y: number }; offset: { y: number } }
  ) => {
    if (info.velocity.y > 300 || info.offset.y > 150) {
      setIsMenuOpen(false);
    } else {
      // Use tween instead of spring to avoid bounce
      animate(sheetY, 0, { duration: 0.2, ease: "easeOut" });
    }
  };

  return (
    <>
      {/* Desktop Top Navigation - Always visible */}
      <nav className="fixed top-0 left-0 right-0 z-50 hidden lg:block">
        <div
          className={cn(
            "transition-all duration-300",
            isScrolled
              ? "bg-white border-b border-slate-200 shadow-sm"
              : "bg-white/80 backdrop-blur-md"
          )}
        >
          <div className="mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-[72px]">
              {/* Logo */}
              <Link href="/" className="flex-shrink-0">
                <Image
                  src="/logo.png"
                  alt="Lovdash"
                  width={100}
                  height={30}
                  className="transition-all duration-300"
                  priority
                />
              </Link>

              {/* Desktop Navigation - Main Links */}
              <nav className="flex items-center justify-center absolute left-1/2 -translate-x-1/2">
                <div className="flex items-center gap-8">
                  {/* Features Dropdown */}
                  <div ref={featuresDropdownRef} className="relative">
                    <button
                      onClick={() => setIsFeaturesOpen(!isFeaturesOpen)}
                      className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                    >
                      Features
                      <ChevronDown
                        className={cn(
                          "w-4 h-4 transition-transform duration-200",
                          isFeaturesOpen && "rotate-180"
                        )}
                      />
                    </button>

                    {/* Dropdown Menu */}
                    <AnimatePresence>
                      {isFeaturesOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          transition={{ duration: 0.15 }}
                          className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50"
                        >
                          <div className="py-2">
                            {featureItems.map((item) => (
                              <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsFeaturesOpen(false)}
                                className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 transition-colors"
                              >
                                <item.icon
                                  className={cn("w-5 h-5 mt-0.5", item.color)}
                                />
                                <div>
                                  <div className="text-sm font-medium text-slate-900">
                                    {item.title}
                                  </div>
                                  <div className="text-xs text-slate-500">
                                    {item.description}
                                  </div>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <Link
                    href="/pricing"
                    className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    Pricing
                  </Link>
                  <Link
                    href="/creator"
                    className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    For Creators
                  </Link>
                  <Link
                    href="/studio"
                    className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    For Agencies
                  </Link>
                  <Link
                    href="/ai"
                    className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    AI
                  </Link>
                </div>
              </nav>

              {/* Desktop CTAs */}
              <div className="flex items-center gap-3">
                <Link
                  href="/contact?type=demo"
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
                >
                  Book a Demo
                </Link>
                <Link
                  href="/join"
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-full hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 shadow-lg shadow-emerald-500/25"
                >
                  Start Free Trial
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Top Header - Always visible */}
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 lg:hidden transition-all duration-300",
          isScrolled
            ? "bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm"
            : "bg-white/80 backdrop-blur-sm"
        )}
      >
        <div className="flex items-center justify-between h-14 px-4">
          {/* Left - Logo Icon */}
          <Link href="/">
            <motion.div whileTap={{ scale: 0.95 }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 183.37 158.1"
                className="w-8 h-8"
              >
                <path fill="#ef3b4e" d="M168.47,86.82l-15.82,15.82c-2.44,2.44-5.64,3.66-8.84,3.66s-6.4-1.22-8.84-3.66c-4.89-4.88-4.89-12.79-.01-17.68,4.79-4.78,10.67-10.67,15.42-15.42,10-9.99,10.6-26.3.83-36.53-5.1-5.34-12.09-8.2-19.48-7.99-6.75.2-13.13,3.18-17.91,7.96l-14.87,14.88c-4.02,4.02-10.52,4.02-14.54,0l-10.41-10.41-4.87-4.88c-5.98-5.97-14.35-8.66-22.93-7.17-3.6.63-7.04,2.06-10.04,4.16-13.56,9.5-14.76,28.41-3.59,39.57l19.17,19.18.05-.04,26.92,26.92,7.56,7.56,15.44,15.44c1.49,2.07,2.35,4.6,2.35,7.33,0,6.96-5.64,12.59-12.59,12.58-3.26.01-6.23-1.23-8.46-3.26-.05-.05-.1-.09-.15-.13l-.57-.58s-.09-.09-.14-.14l-14.92-14.92-.38-.39s-.09-.09-.14-.14l-5.67-5.67-9.25-9.25-.05.04L14.9,86.81C-4.97,66.95-4.97,34.75,14.9,14.9,24.83,4.96,37.84,0,50.85,0s26.02,4.96,35.95,14.9l4.88,4.87,4.87-4.87C106.49,4.97,119.51,0,132.52,0s26.03,4.96,35.96,14.89c19.86,19.87,19.86,52.05,0,71.92Z" />
              </svg>
            </motion.div>
          </Link>

          {/* Right - Start Free Trial CTA */}
          <Link
            href="/join"
            className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            Start Free Trial
          </Link>
        </div>
      </header>

      {/* Mobile Bottom Navigation - Simple 3 Button Layout */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden pb-[env(safe-area-inset-bottom)]">
        {/* Background blur layer */}
        <div className="absolute inset-0 bg-white/90 backdrop-blur-xl border-t border-slate-200/50" />

        <div className="relative flex items-center justify-between h-20 px-6">
          {/* Menu Button - Left */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMenuOpen(true)}
            className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center"
          >
            <Menu className="w-5 h-5 text-slate-700" />
          </motion.button>

          {/* Center: Start Trial CTA Button */}
          <motion.div whileTap={{ scale: 0.95 }}>
            <Link
              href="/join"
              className="flex items-center gap-2 px-3.5 py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full shadow-lg shadow-emerald-500/30"
            >
              <Plus className="w-5 h-5 text-white" strokeWidth={2.5} />
            </Link>
          </motion.div>

          {/* Sign In Button - Right */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center"
          >
            <User className="w-5 h-5 text-slate-700" />
          </motion.button>
        </div>
      </div>

      {/* Full-Screen Menu Sheet */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm lg:hidden"
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Sheet */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
              drag="y"
              dragControls={dragControls}
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.3 }}
              onDragEnd={handleDragEnd}
              style={{ y: sheetY }}
              className="fixed inset-x-0 bottom-0 z-50 lg:hidden max-h-[90vh] bg-white rounded-t-3xl overflow-hidden"
            >
              {/* Drag Handle */}
              <div
                onPointerDown={(e) => dragControls.start(e)}
                className="flex justify-center py-3 cursor-grab active:cursor-grabbing bg-white sticky top-0 z-10"
              >
                <div className="w-10 h-1 bg-slate-300 rounded-full" />
              </div>

              {/* Sheet Content */}
              <div
                ref={scrollContainerRef}
                onScroll={handleSheetScroll}
                className="overflow-y-auto max-h-[calc(90vh-40px)] overscroll-contain relative"
              >
                {/* Header */}
                <div className="flex items-center justify-between px-5 pb-4">
                  <h2 className="text-xl font-bold text-slate-900">Features</h2>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center"
                  >
                    <X className="w-4 h-4 text-slate-600" />
                  </button>
                </div>

                {/* Feature Grid */}
                <div className="px-4 pb-6">
                  <div className="grid grid-cols-2 gap-3">
                    {featureItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsMenuOpen(false)}
                        className="group relative bg-slate-50 rounded-2xl p-4 hover:bg-slate-100 transition-colors active:scale-[0.98] aspect-video overflow-hidden"
                      >
                        <div className="relative z-20">

                        <h3 className="font-semibold text-black text-sm mb-1 flex items-center gap-2">
                        <item.icon className={cn("w-4 h-4", item.color)}  />
                          {item.title}
                        </h3>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          {item.description}
                        </p>
                        <ChevronRight className="absolute top-4 right-4 w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        
                        
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Divider */}
                <div className="h-2 bg-slate-100" />

                {/* For You Section */}
                <div className="px-5 py-4">
                  <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
                    For You
                  </h3>
                  <div className="space-y-2">
                    <Link
                      href="/creator"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-brand-50 to-white border border-brand-100 hover:border-brand-200 transition-colors"
                    >
                      <div className="w-12 h-12 rounded-xl bg-brand-500 flex items-center justify-center">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900">
                          For Creators
                        </h4>
                        <p className="text-sm text-slate-500">
                          Manage your content empire
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-400" />
                    </Link>

                    <Link
                      href="/studio"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-slate-50 to-white border border-slate-200 hover:border-slate-300 transition-colors"
                    >
                      <div className="w-12 h-12 rounded-xl bg-slate-700 flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900">
                          For Agencies
                        </h4>
                        <p className="text-sm text-slate-500">
                          Scale your creator business
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-400" />
                    </Link>
                  </div>
                </div>

                {/* Quick Links */}
                <div className="px-5 py-4 border-t border-slate-100">
                  <div className="flex flex-wrap gap-2">
                    {quickLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
                      >
                        <link.icon className="w-4 h-4 text-slate-500" />
                        <span className="text-sm font-medium text-slate-700">
                          {link.label}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* CTAs */}
                <div className="px-5 pt-4 pb-8 space-y-3">
                  <Link
                    href="/join"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-center gap-2 w-full py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-2xl font-semibold transition-all shadow-lg shadow-emerald-500/25 active:scale-[0.98]"
                  >
                    Start Free Trial
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/contact?type=demo"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-center gap-2 w-full py-4 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-2xl font-semibold transition-all active:scale-[0.98]"
                  >
                    Book a Demo
                  </Link>
                </div>

                {/* Extra padding for safe area */}
                <div className="h-[env(safe-area-inset-bottom)]" />
              </div>

              {/* Scroll Indicator - Gradient fade with arrow */}
              <AnimatePresence>
                {showScrollIndicator && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute bottom-0 left-0 right-0 pointer-events-none"
                  >
                    {/* Gradient */}
                    <div className="h-24 bg-gradient-to-t from-white via-white/90 to-transparent" />

                    {/* Arrow indicator */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
                      <motion.div
                        animate={{ y: [0, 4, 0] }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      </motion.div>
                      <span className="text-[10px] text-slate-400 font-medium">
                        Scroll for more
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
