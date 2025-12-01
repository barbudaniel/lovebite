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
    question: "How does the collaboration work?",
    answer:
      "It's simple—you focus on creating content, we handle everything else. That means account setup, verification, marketing, profile management, and monetizing your content. Your only job is to deliver quality content on schedule.",
  },
  {
    question: "What content do I need to provide?",
    answer:
      "We start with an Initial Content package to launch your profile. Once live, you'll deliver fresh content weekly on a day that works best for you. We keep it flexible.",
  },
  {
    question: "What if there's content I'm not comfortable creating?",
    answer:
      "Before we begin, you'll fill out a preferences form telling us exactly what you're comfortable with—and what's off limits. We tailor our proposal around your boundaries.",
  },
  {
    question: "Can I maintain my existing account?",
    answer:
      "Possibly—it depends on platform terms and conditions. Let's discuss your situation and find the right setup together.",
  },
  {
    question: "Do I need to show my face?",
    answer:
      "For our full management service, we currently work with models who show their face. That said, there are other ways to earn without revealing your identity—reach out and we can explore options.",
  },
  {
    question: "How do I send you my content?",
    answer:
      "Through a secure Google Drive folder we set up for you. You'll get access after signing our agreement—just upload and we take it from there.",
  },
  {
    question: "Do I need professional equipment or a studio?",
    answer:
      "Not at all. Fans love authentic, homemade content—mirror selfies, bedroom shots, casual videos. Your smartphone is all you need.",
  },
  {
    question: "Will anything be sent to my home address?",
    answer:
      "Never. Everything is 100% digital. No paperwork, no packages—complete discretion.",
  },
  {
    question: "How and when do I get paid?",
    answer:
      "Monthly via bank transfer (IBAN) or alternative payment methods depending on your location. Rates are based on your profile, experience, and the model you choose.",
  },
  {
    question: "Can I end the partnership if I want to?",
    answer:
      "Yes. There's a standard notice period (typically 1 month) due to platform requirements, but we're flexible—just talk to us.",
  },
  {
    question: "How soon will I see earnings?",
    answer:
      "After delivering your Initial Content, expect your first payout within 1-2 months as we build and optimize your profile.",
  },
  {
    question: "Can I hide my profile from certain countries?",
    answer:
      "Absolutely. We can geoblock any region you choose—your home country, specific areas, wherever you need privacy.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="py-16 sm:py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-10 sm:mb-12">
          <span className="text-brand-600 font-semibold text-xs sm:text-sm uppercase tracking-wider">
            Questions & Answers
          </span>
          <h2 className="mt-2 sm:mt-3 text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900">
            FAQ
          </h2>
        </AnimatedSection>

        <div className="max-w-2xl mx-auto">
          <Accordion type="single" collapsible className="space-y-2 sm:space-y-3">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ delay: Math.min(index * 0.03, 0.2) }}
                whileHover={{ scale: 1.01 }}
              >
                <AccordionItem
                  value={`item-${index}`}
                  className="bg-slate-50 hover:bg-brand-50/50 rounded-xl border-none px-4 sm:px-5 transition-all duration-200 data-[state=open]:bg-brand-50 data-[state=open]:shadow-sm hover:shadow-sm"
                >
                  <AccordionTrigger className="text-left font-semibold text-slate-900 hover:text-brand-600 py-4 hover:no-underline [&[data-state=open]]:text-brand-600 text-sm sm:text-base gap-3">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 pb-4 leading-relaxed text-sm sm:text-base pr-4">
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
