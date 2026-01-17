import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Media Library",
  description: "Upload, organize, and manage all your content in one place. Unlimited storage with AI auto-tagging and instant search for creators.",
  keywords: ["media library", "content storage", "file management", "creator tools", "media organization"],
  openGraph: {
    title: "Media Library - Lovdash Creator Operating System",
    description: "Upload, organize, and manage all your content in one place. Unlimited storage with AI auto-tagging.",
    type: "website",
    url: "https://lovdash.com/features/media-library",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Lovdash Media Library",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Media Library - Lovdash Creator Operating System",
    description: "Upload, organize, and manage all your content in one place. Unlimited storage with AI auto-tagging.",
    images: ["/og-image.png"],
  },
};

export default function MediaLibraryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
