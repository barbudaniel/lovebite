import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Analytics Dashboard",
  description: "Track revenue, engagement, and growth across all platforms in one dashboard. Content attribution and cross-creator insights for agencies.",
  keywords: ["creator analytics", "revenue tracking", "engagement metrics", "content performance", "growth analytics"],
  openGraph: {
    title: "Analytics Dashboard - Lovdash Creator Operating System",
    description: "Track revenue, engagement, and growth across all platforms in one dashboard with content attribution.",
    type: "website",
    url: "https://lovdash.com/features/analytics",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Lovdash Analytics Dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Analytics Dashboard - Lovdash Creator Operating System",
    description: "Track revenue, engagement, and growth across all platforms in one dashboard with content attribution.",
    images: ["/og-image.png"],
  },
};

export default function AnalyticsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
