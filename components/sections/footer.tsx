"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { Heart } from "lucide-react";

const footerLinks = [
  { href: "#about", label: "Who We Are" },
  { href: "#process", label: "How it Works" },
  { href: "#models", label: "Earnings" },
  { href: "/ai", label: "Lovebite AI" },
  { href: "#faq", label: "FAQ" },
  { href: "#contact", label: "Contact" },
];

export function Footer() {
  return (
    <footer className="bg-white border-t border-slate-100 py-10 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Centered Content */}
        <div className="flex flex-col items-center text-center">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
              <div className="w-9 h-9 bg-brand-600 rounded-lg flex items-center justify-center text-white transition-transform duration-200 group-hover:scale-110 group-active:scale-95">
                <Heart className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" strokeWidth={2.5} />
              </div>
              <span className="font-bold text-xl text-slate-900 transition-colors duration-200 group-hover:text-brand-600">Lovebite</span>
            </Link>
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 text-sm max-w-md mb-6"
          >
            Lovebite Entertainment helps independent models earn money by
            selling self-made content on subscription platforms. Your safety
            and growth are our priority.
          </motion.p>

          {/* Navigation Links */}
          <motion.nav
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-x-5 gap-y-2 mb-8"
          >
            {footerLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="relative text-slate-500 hover:text-brand-600 transition-colors text-sm font-medium group"
              >
                {link.label}
                <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-brand-500 transition-all duration-200 group-hover:w-full" />
              </Link>
            ))}
          </motion.nav>

          {/* Divider */}
          <div className="w-full max-w-xs h-px bg-slate-100 mb-6" />

          {/* Bottom Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-3 text-xs sm:text-sm"
          >
            <p className="text-slate-400">&copy; 2025 Lovebite Entertainment. All rights reserved.</p>
            <span className="hidden sm:inline text-slate-300">•</span>
            <p className="text-brand-500 font-semibold uppercase tracking-wider text-xs">
              18+ Only
            </p>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}
