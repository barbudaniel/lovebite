"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { PlatformLogosRow } from "@/components/ui/platform-logos";
import { ArrowUpRight } from "lucide-react";

const footerLinks = [
  { href: "/#features", label: "Features" },
  { href: "/#process", label: "How it Works" },
  { href: "/ai", label: "Lovdash AI" },
  { href: "/bio", label: "Lovdash Bio" },
  { href: "/#faq", label: "FAQ" },
];

const legalLinks = [
  { href: "/terms", label: "Terms & Conditions" },
  { href: "/privacy", label: "Privacy Policy" },
];

export function Footer() {
  return (
    <footer className="py-12 sm:py-16 bg-slate-50 border-t border-slate-200 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-100/30 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-violet-100/30 rounded-full blur-3xl" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Main Footer Content */}
        <div className="flex flex-col items-center text-center">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Logo 
              variant="light" 
              size="lg"
              animated={true}
            />
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-sm text-slate-600 max-w-md mt-4 mb-8"
          >
            The operating system for creators and agencies. Upload once, publish everywhere, track what works.
          </motion.p>

          {/* Platform Logos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="mb-8"
          >
            <p className="text-xs text-slate-500 mb-3 uppercase tracking-wider">
              Integrates with
            </p>
            <PlatformLogosRow 
              platforms={["twitter", "instagram", "tiktok", "onlyfans"]} 
              size="sm"
              
            />
          </motion.div>

          {/* Navigation Links */}
          <motion.nav
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-8"
          >
            {footerLinks.map((link, i) => (
              <motion.div
                key={link.href}
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Link
                  href={link.href}
                  className="text-sm text-slate-600 hover:text-brand-500 transition-colors flex items-center gap-1 group"
                >
                  {link.label}
                  {link.href.startsWith("/") && !link.href.startsWith("/#") && (
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                  )}
                </Link>
              </motion.div>
            ))}
          </motion.nav>

          {/* Legal Links */}
          <motion.nav
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25 }}
            className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-8"
          >
            {legalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-slate-500 hover:text-brand-500 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </motion.nav>

          {/* Divider */}
          <div className="w-full max-w-xs h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent mb-8" />

          {/* Disclaimers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="space-y-3 text-center"
          >
            <p className="text-xs text-slate-400 max-w-lg">
              Lovdash is an independent software platform. Platform integrations are subject to third-party terms and may change. 
              Individual results vary based on content, audience, and effort.
            </p>
          </motion.div>

          {/* Copyright */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.35 }}
            className="text-xs text-slate-400 mt-8"
          >
            © {new Date().getFullYear()} TRUST CHARGE SOLUTIONS LTD (Company No. 16584325). All rights reserved.
          </motion.p>
        </div>
      </div>
    </footer>
  );
}
