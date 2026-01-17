import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bite AI",
  description: "Meet Bite - your AI-powered business partner that handles tagging, chat intelligence, and content optimization for creators. 24/7 automation.",
  keywords: ["AI assistant", "creator AI", "chat automation", "content AI", "PPV optimization", "Bite AI"],
  openGraph: {
    title: "Bite AI - Lovdash Creator Operating System",
    description: "Meet Bite - your AI-powered business partner that handles tagging, chat intelligence, and content optimization.",
    type: "website",
    url: "https://lovdash.com/ai",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Bite AI - Lovdash",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bite AI - Lovdash Creator Operating System",
    description: "Meet Bite - your AI-powered business partner that handles tagging, chat intelligence, and content optimization.",
    images: ["/og-image.png"],
  },
};

export default function AILayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
