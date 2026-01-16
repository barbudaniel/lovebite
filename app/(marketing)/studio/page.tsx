import { Metadata } from "next";
import {
  StudioHero,
  PainPoints,
  StudioSolution,
  StudioFeatures,
  StudioProcess,
  StudioFAQ,
  StudioCTA,
} from "@/components/sections/studio";
import { Navigation, Footer } from "@/components/sections";
import { ScrollProgress } from "@/components/motion/smooth-scroll";

export const metadata: Metadata = {
  title: "Lovdash for Agencies | Multi-Creator Management Platform",
  description:
    "Manage every creator from one dashboard. Organize, schedule, and track content across your entire roster with role-based access and cross-creator analytics.",
  keywords: [
    "creator management platform",
    "agency creator tools",
    "multi-creator dashboard",
    "agency management software",
    "creator agency software",
  ],
  openGraph: {
    title: "Lovdash for Agencies | Multi-Creator Management",
    description: "Manage every creator from one dashboard.",
    type: "website",
    url: "https://lovdash.com/studio",
  },
};

// FAQPage schema for rich results
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How many creators can I manage?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Lovdash is built for agencies managing anywhere from 2 to 200+ creators. Your plan determines how many active creator accounts you can add."
      }
    },
    {
      "@type": "Question",
      "name": "How do permissions work?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "You assign roles to team members: Admin (full access), Manager (can schedule and view analytics), or Uploader (media upload only). Each role has clear boundaries."
      }
    },
    {
      "@type": "Question",
      "name": "Can I white-label or use my own branding?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Custom branding options are planned for enterprise plans. This includes custom domains for bio links and branded reporting dashboards. Contact sales to discuss your requirements."
      }
    },
    {
      "@type": "Question",
      "name": "Is there a contract or commitment?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No long-term contracts. Pay monthly or annually (with a discount). Cancel anytime."
      }
    },
    {
      "@type": "Question",
      "name": "How do I onboard my existing creators?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "You can invite creators via email or add them manually. Bulk import is available for agencies with large rosters. Migration assistance is available—talk to our team for details."
      }
    },
    {
      "@type": "Question",
      "name": "What platforms does Lovdash support?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Lovdash integrates with major creator platforms including OnlyFans, Fansly, Twitter/X, Instagram, TikTok, and more. We support both SFW and NSFW creators and are constantly adding new integrations. View platforms <a href='/platforms'>here</a>",
        html: true,
      }
    }
  ]
};

export default function StudioPage() {
  return (
    <>
      {/* Schema markup for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      
      {/* <ScrollProgress /> */}
      <Navigation />
      <main>
        <StudioHero />
        <PainPoints />
        <StudioSolution />
        <StudioFeatures />
        <StudioProcess />
        {/* Social Proof: SKIPPED per DEC-014 until real studio testimonials collected */}
        {/* Pricing: Use "Book a Demo" CTA instead */}
        <StudioFAQ />
        <StudioCTA />
      </main>
      <Footer />
    </>
  );
}
