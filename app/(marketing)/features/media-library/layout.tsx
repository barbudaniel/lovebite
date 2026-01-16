import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Media Library | Lovdash Features",
  description: "Upload, organize, and manage all your content in one place. Unlimited storage, smart folders, and instant search for creators.",
  keywords: ["media library", "content storage", "file management", "creator tools", "media organization"],
  openGraph: {
    title: "Media Library | Lovdash",
    description: "Upload, organize, and manage all your content in one place.",
    type: "website",
    url: "https://lovdash.com/features/media-library",
  },
};

export default function MediaLibraryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
