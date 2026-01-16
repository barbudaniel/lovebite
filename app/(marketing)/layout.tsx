import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://lovdash.com"),
  title: {
    absolute: "Lovdash — The Creator Operating System | AI-Powered Media Management",
  },
  description:
    "Upload once, publish everywhere. Lovdash is the AI-powered operating system for creators and agencies. Organize media, schedule posts, and track engagement across every platform.",
  keywords: [
    "creator operating system",
    "AI media management",
    "content scheduling",
    "multi-platform publishing",
    "creator tools",
    "studio management",
    "OnlyFans tools",
    "Fansly tools",
  ],
  openGraph: {
    title: "Lovdash — The Creator Operating System",
    description:
      "Upload once, publish everywhere. AI-powered media management for creators and agencies.",
    type: "website",
    url: "https://lovdash.com",
    siteName: "Lovdash",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lovdash — The Creator Operating System",
    description:
      "Upload once, publish everywhere. AI-powered media management for creators and agencies.",
    creator: "@lovdash",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white">
      {children}
    </div>
  );
}
