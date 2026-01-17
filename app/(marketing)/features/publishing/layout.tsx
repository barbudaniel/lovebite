import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Multi-Platform Publishing",
  description: "Post to OnlyFans, Fansly, LoyalFans, Twitter, Instagram, and more from one place. One-click publishing with SFW/NSFW routing.",
  keywords: ["multi-platform publishing", "cross-posting", "content distribution", "social media publishing", "OnlyFans tools"],
  openGraph: {
    title: "Multi-Platform Publishing - Lovdash Creator Operating System",
    description: "Post to OnlyFans, Fansly, LoyalFans, Twitter, Instagram, and more from one place with automatic content routing.",
    type: "website",
    url: "https://lovdash.com/features/publishing",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Lovdash Multi-Platform Publishing",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Multi-Platform Publishing - Lovdash Creator Operating System",
    description: "Post to OnlyFans, Fansly, LoyalFans, Twitter, Instagram, and more from one place with automatic content routing.",
    images: ["/og-image.png"],
  },
};

export default function PublishingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
