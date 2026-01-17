import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://lovdash.com"),
  title: {
    absolute: "Lovdash - Creator Operating System | AI-Powered Content Management",
  },
  description:
    "Upload once, publish everywhere. Lovdash is the AI-powered operating system for creators and agencies. Organize media, schedule posts, and track engagement.",
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
    title: "Lovdash - Creator Operating System",
    description:
      "Upload once, publish everywhere. AI-powered media management for creators and agencies.",
    type: "website",
    url: "https://lovdash.com",
    siteName: "Lovdash",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Lovdash - Creator Operating System",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lovdash - Creator Operating System",
    description:
      "Upload once, publish everywhere. AI-powered media management for creators and agencies.",
    creator: "@lovdash",
    images: ["/og-image.png"],
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
