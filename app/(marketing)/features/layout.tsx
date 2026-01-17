import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Features",
  description: "Everything you need to grow your creator business. Media library, AI tagging, scheduling, analytics, and multi-platform publishing tools.",
  keywords: ["creator tools", "content management", "AI tagging", "scheduling", "analytics", "multi-platform"],
  openGraph: {
    title: "Features - Lovdash Creator Operating System",
    description: "Everything you need to grow your creator business. Media library, AI tagging, scheduling, analytics, and publishing.",
    type: "website",
    url: "https://lovdash.com/features",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Lovdash Features",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Features - Lovdash Creator Operating System",
    description: "Everything you need to grow your creator business. Media library, AI tagging, scheduling, analytics, and publishing.",
    images: ["/og-image.png"],
  },
};

export default function FeaturesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
