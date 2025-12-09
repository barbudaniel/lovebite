import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Creator Bio | Lovebite",
  description: "Exclusive content and live experiences. Join me on Lovebite.",
  openGraph: {
    title: "Creator Bio | Lovebite",
    description: "Exclusive content and live experiences.",
    type: "website",
  },
};

export default function CreatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

