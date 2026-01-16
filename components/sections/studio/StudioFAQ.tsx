"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown } from "lucide-react";

// COMPLIANCE EDITS APPLIED per DEC-014:
// - FAQ Q1: Removed "no hard limit"
// - FAQ Q3: Changed "available" to "planned"
// - FAQ Q4: Removed data export claim
// - FAQ Q5: Changed "can be migrated" to "assistance available"
const faqs = [
  {
    question: "How many creators can I manage?",
    answer: "Lovdash is built for agencies managing anywhere from 2 to 200+ creators. Your plan determines how many active creator accounts you can add.",
  },
  {
    question: "How do permissions work?",
    answer: "You assign roles to team members: Admin (full access), Manager (can schedule and view analytics), or Uploader (media upload only). Each role has clear boundaries—no accidental deletions or unauthorized posts.",
  },
  {
    question: "Can I white-label or use my own branding?",
    answer: "Custom branding options are planned for enterprise plans. This includes custom domains for bio links and branded reporting dashboards. Contact sales to discuss your requirements.",
  },
  {
    question: "Is there a contract or commitment?",
    answer: "No long-term contracts. Pay monthly or annually (with a discount). Cancel anytime.",
  },
  {
    question: "How do I onboard my existing creators?",
    answer: "You can invite creators via email or add them manually. Bulk import is available for agencies with large rosters. Migration assistance is available—talk to our team for details.",
  },
  {
    question: "What platforms does it support?",
    answer: "Lovdash integrates with major creator platforms including OnlyFans, Fansly, Twitter/X, Instagram, TikTok, and more. We support both SFW and NSFW creators and are constantly adding new integrations.",
  },
];

export function StudioFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="studio-faq" className="py-20 lg:py-28 bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm font-semibold text-brand-600 uppercase tracking-wider mb-4"
          >
            Questions & Answers
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl font-bold text-slate-900"
          >
            Agency FAQs
          </motion.h2>
        </div>

        {/* Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="bg-white border border-slate-200 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 transition-colors"
              >
                <span className="font-semibold text-slate-900">{faq.question}</span>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${openIndex === i ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-5 text-slate-600 leading-relaxed">{faq.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
