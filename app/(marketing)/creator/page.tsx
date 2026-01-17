import { Metadata } from "next";
import {
  CreatorHero,
  CreatorPainPoints,
  CreatorSolution,
  CreatorFeatures,
  CreatorAIHighlight,
  CreatorBioHighlight,
  CreatorProcess,
  CreatorFAQ,
  CreatorCTA,
} from "@/components/sections/creator";
import { Navigation, Footer } from "@/components/sections";
import { ScrollProgress } from "@/components/motion/smooth-scroll";

export const metadata: Metadata = {
  title: "For Creators",
  description: "Simplify your content workflow. Upload once and publish to all your platforms with AI-powered organization, scheduling, and analytics.",
  keywords: ["content creator tools", "multi-platform publishing", "creator workflow", "content scheduling", "bio link builder"],
  openGraph: {
    title: "Lovdash for Creators - Upload Once, Publish Everywhere",
    description: "Simplify your content workflow. Upload once and publish to all your platforms with AI-powered organization.",
    type: "website",
    url: "https://lovdash.com/creator",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Lovdash for Creators",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lovdash for Creators - Upload Once, Publish Everywhere",
    description: "Simplify your content workflow. Upload once and publish to all your platforms with AI-powered organization.",
    images: ["/og-image.png"],
  },
};

// FAQPage schema for rich results
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How much does Lovdash cost?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We're currently in early access. Lovdash Bio is free to use. Our full platform pricing will be shared with waitlist members first."
      }
    },
    {
      "@type": "Question",
      "name": "Which platforms does Lovdash work with?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Lovdash integrates with major creator platforms including OnlyFans, Fansly, Twitter/X, Instagram, TikTok, and more. We support both SFW and NSFW creators and are constantly adding new integrations. View platforms <a href='/platforms'>here</a>",
        html: true,
      }
    },
    {
      "@type": "Question",
      "name": "Is my content private and secure?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Absolutely. Your content is stored securely with industry-standard protection. We never sell or share your media for marketing purposes. You control who sees what."
      }
    },
    {
      "@type": "Question",
      "name": "How does the AI tagging work?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "When you upload content, our AI analyzes it to generate relevant tags, descriptions, and categories. This makes your library searchable and ready to post. You can always review and edit anything the AI creates."
      }
    },
    {
      "@type": "Question",
      "name": "Can I still post manually if I want?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Lovdash gives you control. Use our scheduling features when you want, or post manually anytime. It's your workflow—we just make it easier."
      }
    },
    {
      "@type": "Question",
      "name": "What if I want to cancel?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No problem. There are no long-term contracts. Cancel anytime from your dashboard. Your content remains yours."
      }
    }
  ]
};

export default function CreatorPage() {
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
        <CreatorHero />
        <CreatorPainPoints />
        <CreatorSolution />
        <CreatorFeatures />
        <CreatorAIHighlight />
        <CreatorBioHighlight />
        <CreatorProcess />
        {/* Testimonials: SKIPPED until real testimonials collected */}
        {/* Pricing: SKIPPED until pricing finalized */}
        <CreatorFAQ />
        <CreatorCTA />
      </main>
      <Footer />
    </>
  );
}
