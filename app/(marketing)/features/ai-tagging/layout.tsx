import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Tagging | Lovdash Features",
  description: "Automatically tag and describe your content with AI. Smart tagging, instant search, and content insights for creators.",
  keywords: ["AI tagging", "content tagging", "auto tags", "media organization", "content management"],
  openGraph: {
    title: "AI Tagging | Lovdash",
    description: "Automatically tag and describe your content with AI.",
    type: "website",
    url: "https://lovdash.com/features/ai-tagging",
  },
};

export default function AITaggingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
