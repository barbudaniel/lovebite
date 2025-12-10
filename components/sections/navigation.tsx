"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { Heart, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks: { href: string; label: string; isNew?: boolean }[] = [
  { href: "#about", label: "About" },
  { href: "#earnings", label: "Earnings" },
  { href: "/ai", label: "AI" },
  { href: "/bio", label: "BIO", isNew: true },
  { href: "#faq", label: "FAQ" },
];

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMobileMenuOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-sm border-b border-slate-200"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group z-10">
              <div className="w-9 h-9 bg-brand-600 rounded-lg flex items-center justify-center text-white transition-transform duration-200 group-hover:scale-110 group-active:scale-95">
                <Heart className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" strokeWidth={2.5} />
              </div>
              <span className="font-bold text-lg sm:text-xl text-slate-900 transition-colors duration-200 group-hover:text-brand-600">Lovebite</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 font-medium transition-all duration-200 rounded-lg group ${
                    link.isNew
                      ? "text-violet-600 hover:text-violet-700 hover:bg-violet-50"
                      : "text-slate-600 hover:text-brand-600 hover:bg-brand-50"
                  }`}
                >
                  <span className="relative">
                    {link.label}
                    <span className={`absolute -bottom-0.5 left-0 h-0.5 w-0 transition-all duration-200 group-hover:w-full ${
                      link.isNew ? "bg-violet-500" : "bg-brand-500"
                    }`} />
                  </span>
                  {link.isNew && (
                    <span className="ml-1.5 text-[10px] bg-violet-100 text-violet-600 px-1.5 py-0.5 rounded-full font-semibold uppercase badge-bounce">
                      New
                    </span>
                  )}
                </Link>
              ))}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center gap-3">
              <Link
                href="/register"
                className="px-4 py-2 font-medium text-slate-600 hover:text-brand-600 transition-colors"
              >
                Apply
              </Link>
              <Button
                asChild
                className="bg-brand-600 hover:bg-brand-700 text-white px-5 rounded-full"
              >
                <Link href="#contact">Contact us</Link>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-brand-100 active:scale-95 transition-all duration-200 z-10"
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
            >
              <span className={`transition-transform duration-200 ${isMobileMenuOpen ? 'rotate-90' : 'rotate-0'}`}>
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5 text-slate-700" />
                ) : (
                  <Menu className="w-5 h-5 text-slate-700" />
                )}
              </span>
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/20"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="absolute top-0 right-0 bottom-0 w-full max-w-xs bg-white border-l border-slate-200"
            >
              <div className="flex flex-col h-full pt-20 pb-6 px-5">
                <nav className="flex-1 space-y-1">
                  {navLinks.map((link, i) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 + 0.1 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`block px-4 py-3.5 text-base font-medium rounded-lg transition-colors ${
                          link.isNew
                            ? "text-violet-600 hover:text-violet-700 hover:bg-violet-50"
                            : "text-slate-700 hover:text-brand-600 hover:bg-brand-50"
                        }`}
                      >
                        {link.label}
                        {link.isNew && (
                          <span className="ml-2 text-[10px] bg-violet-100 text-violet-600 px-1.5 py-0.5 rounded-full font-semibold uppercase">
                            New
                          </span>
                        )}
                      </Link>
                    </motion.div>
                  ))}
                </nav>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="pt-4 border-t border-slate-100 space-y-3"
                >
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="w-full rounded-lg h-12"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Link href="/register">Apply as Model</Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    className="w-full bg-brand-600 hover:bg-brand-700 text-white rounded-lg h-12"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Link href="#contact">Contact us</Link>
                  </Button>
                  <p className="text-center text-xs text-slate-400 pt-2">
                    18+ Only
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
