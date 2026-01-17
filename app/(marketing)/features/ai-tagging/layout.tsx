import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Tagging",
  description: "Automatically tag and describe your content with AI. Smart tagging with SFW/NSFW classification, instant search, and content insights.",
  keywords: ["AI tagging", "content tagging", "auto tags", "media organization", "content management"],
  openGraph: {
    title: "AI Tagging - Lovdash Creator Operating System",
    description: "Automatically tag and describe your content with AI. Smart tagging with SFW/NSFW classification.",
    type: "website",
    url: "https://lovdash.com/features/ai-tagging",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Lovdash AI Tagging",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Tagging - Lovdash Creator Operating System",
    description: "Automatically tag and describe your content with AI. Smart tagging with SFW/NSFW classification.",
    images: ["/og-image.png"],
  },
};

export default function AITaggingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
