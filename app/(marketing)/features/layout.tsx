import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Features | Lovdash",
  description: "Everything you need to grow your creator business. Media library, AI tagging, scheduling, analytics, and multi-platform publishing.",
  keywords: ["creator tools", "content management", "AI tagging", "scheduling", "analytics", "multi-platform"],
  openGraph: {
    title: "Features | Lovdash",
    description: "Everything you need to grow your creator business.",
    type: "website",
    url: "https://lovdash.com/features",
  },
};

export default function FeaturesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
