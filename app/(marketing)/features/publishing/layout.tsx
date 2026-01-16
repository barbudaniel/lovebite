import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Multi-Platform Publishing | Lovdash Features",
  description: "Post to OnlyFans, Fansly, Twitter, Instagram, and more—all from one place. One-click publishing for creators.",
  keywords: ["multi-platform publishing", "cross-posting", "content distribution", "social media publishing", "OnlyFans tools"],
  openGraph: {
    title: "Multi-Platform Publishing | Lovdash",
    description: "Post to all your platforms with one click.",
    type: "website",
    url: "https://lovdash.com/features/publishing",
  },
};

export default function PublishingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
