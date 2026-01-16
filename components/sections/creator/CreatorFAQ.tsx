"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown } from "lucide-react";

// COMPLIANCE EDITS APPLIED:
// - C1a/C1b: "free forever" → "free to use"
// - C3: Softened encryption claim to "stored securely with industry-standard protection"
const faqs = [
  {
    question: "How much does Lovdash cost?",
    answer: "We're currently in early access. Lovdash Bio is free to use. Our full platform pricing will be shared with waitlist members first. Join the waitlist to get early access and exclusive pricing.",
  },
  {
    question: "Which platforms does it work with?",
    answer: "Lovdash integrates with major creator platforms including OnlyFans, Fansly, Twitter/X, Instagram, TikTok, and more. We support both SFW and NSFW creators and are constantly adding new integrations.",
  },
  {
    question: "Is my content private and secure?",
    answer: "Absolutely. Your content is stored securely with industry-standard protection. We never sell or share your media for marketing purposes. You control who sees what.",
  },
  {
    question: "How does the AI tagging work?",
    answer: "When you upload content, our AI analyzes it to generate relevant tags, descriptions, and categories. This makes your library searchable and ready to post. You can always review and edit anything the AI creates.",
  },
  {
    question: "Can I still post manually if I want?",
    answer: "Yes. Lovdash gives you control. Use our scheduling features when you want, or post manually anytime. It's your workflow—we just make it easier.",
  },
  {
    question: "What if I want to cancel?",
    answer: "No problem. There are no long-term contracts. Cancel anytime from your dashboard. Your content remains yours.",
  },
];

export function CreatorFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 lg:py-28 bg-slate-50">
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
            Creator FAQs
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
