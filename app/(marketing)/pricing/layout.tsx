import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Simple, transparent pricing that scales with your creator business. Start with a 7-day free trial. Starter at $39/mo, Pro at $59/mo.",
  keywords: ["creator pricing", "content management pricing", "creator tools cost", "subscription plans"],
  openGraph: {
    title: "Pricing - Lovdash Creator Operating System",
    description: "Simple, transparent pricing that scales with your creator business. Start with a 7-day free trial.",
    type: "website",
    url: "https://lovdash.com/pricing",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Lovdash Pricing",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing - Lovdash Creator Operating System",
    description: "Simple, transparent pricing that scales with your creator business. Start with a 7-day free trial.",
    images: ["/og-image.png"],
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
