import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Analytics Dashboard | Lovdash Features",
  description: "Track engagement, revenue, and growth across all platforms in one dashboard. Real-time data and custom reports for creators.",
  keywords: ["creator analytics", "revenue tracking", "engagement metrics", "content performance", "growth analytics"],
  openGraph: {
    title: "Analytics Dashboard | Lovdash",
    description: "Track engagement, revenue, and growth across all platforms.",
    type: "website",
    url: "https://lovdash.com/features/analytics",
  },
};

export default function AnalyticsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
