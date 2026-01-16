"use client";

import { motion } from "motion/react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AnimatedSection } from "@/components/motion/animated-section";

const faqs = [
  {
    question: "What platforms does Lovdash support?",
    answer: "Lovdash integrates with major creator platforms including OnlyFans, Fansly, Twitter/X, Instagram, TikTok, and more. We support both SFW and NSFW creators and are constantly adding new integrations. View platforms <a href='/platforms'>here</a>",
    html: true,
  },
  {
    question: "Is my content secure?",
    answer: "Privacy is core to Lovdash. Your media is encrypted at rest and in transit. We never sell or share your content for marketing purposes. You retain full ownership of everything you upload.",
  },
  {
    question: "How does AI tagging work?",
    answer: "When you upload media, our AI analyzes it to generate tags, descriptions, and safety flags. This makes your library instantly searchable and ready to post. You can always review and adjust any AI-generated content before publishing.",
  },
  {
    question: "Can I use Lovdash for multiple accounts?",
    answer: "Absolutely. Lovdash is built for scale—whether you're managing 2 accounts or 200. Agencies get role-based access, templates, and cross-account reporting.",
  },
  {
    question: "What happens if a platform changes its rules?",
    answer: "We actively monitor platform policies and update our integrations accordingly. You'll be notified of any changes that affect your workflow.",
  },
  {
    question: "Is there a free trial?",
    answer: "We're currently in invite-only early access. Join the waitlist to be among the first to try Lovdash when we launch. Pricing details will be shared with early access users.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="py-12 sm:py-16 lg:py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-10 sm:mb-12">
          <span className="text-brand-600 font-medium text-xs sm:text-sm uppercase tracking-wider">
            Questions & Answers
          </span>
          <h2 className="mt-2 sm:mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900">
            Frequently asked questions
          </h2>
          <p className="mt-3 sm:mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
            Everything you need to know about Lovdash.
          </p>
        </AnimatedSection>

        <div className="max-w-2xl mx-auto">
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ delay: index * 0.05 }}
              >
                <AccordionItem
                  value={`item-${index}`}
                  className="bg-white hover:bg-brand-50/50 rounded-xl border border-slate-200 px-5 transition-all duration-200 data-[state=open]:bg-brand-50/50 data-[state=open]:border-brand-200"
                >
                  <AccordionTrigger className="text-left font-semibold text-slate-900 hover:text-brand-600 py-4 hover:no-underline [&[data-state=open]]:text-brand-600 text-base gap-3">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 pb-4 leading-relaxed pr-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
