import {
  Navigation,
  Hero,
  ProblemStatement,
  Process,
  Features,
  LovdashAI,
  LovdashBio,
  AudienceFork,
  AgencySection,
  FAQ,
  CTA,
  Footer,
} from "@/components/sections";
import { ScrollProgress } from "@/components/motion/smooth-scroll";
import Script from "next/script";

// FAQPage Schema for SEO
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What platforms does Lovdash support?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Lovdash integrates with major creator platforms including OnlyFans, Fansly, Twitter/X, Instagram, TikTok, and more. We support both SFW and NSFW creators and are constantly adding new integrations. View platforms <a href='/platforms'>here</a>",
        html: true,
      },
    },
    {
      "@type": "Question",
      name: "Is my content secure?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Privacy is core to Lovdash. Your media is encrypted at rest and in transit. We never sell or share your content for marketing purposes. You retain full ownership of everything you upload.",
      },
    },
    {
      "@type": "Question",
      name: "How does AI tagging work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "When you upload media, our AI analyzes it to generate tags, descriptions, and safety flags. This makes your library instantly searchable and ready to post. You can always review and adjust any AI-generated content before publishing.",
      },
    },
    {
      "@type": "Question",
      name: "Can I use Lovdash for multiple accounts?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Absolutely. Lovdash is built for scale—whether you're managing 2 accounts or 200. Agencies get role-based access, templates, and cross-account reporting.",
      },
    },
    {
      "@type": "Question",
      name: "What happens if a platform changes its rules?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We actively monitor platform policies and update our integrations accordingly. You'll be notified of any changes that affect your workflow.",
      },
    },
    {
      "@type": "Question",
      name: "Is there a free trial?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We're currently in invite-only early access. Join the waitlist to be among the first to try Lovdash when we launch. Pricing details will be shared with early access users.",
      },
    },
  ],
};

// Organization Schema
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Lovdash",
  url: "https://lovdash.com",
  logo: "https://lovdash.com/logo.png",
  description:
    "The AI-powered operating system for creators and agencies. Upload once, publish everywhere.",
  sameAs: [],
};

// SoftwareApplication Schema
const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Lovdash",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description:
    "AI-powered media management platform for creators and agencies. Organize, schedule, and track content across multiple platforms.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    description: "Early access waitlist",
  },
};

export default function Home() {
  return (
    <>
      {/* Structured Data for SEO */}
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Script
        id="org-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <Script
        id="software-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      
      {/* <ScrollProgress /> */}
      <Navigation />
      <main>
        <Hero />
        <ProblemStatement />
        <Process />
        <Features />
        <LovdashAI />
        <LovdashBio />
        <AudienceFork />
        <AgencySection />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
