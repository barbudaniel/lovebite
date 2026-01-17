import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bio Link",
  description: "Create your custom bio link profile synced with live activity on OnlyFans, Fansly, and more. Custom domains, click analytics, and zero bans.",
  keywords: [
    "bio link",
    "link in bio",
    "adult creator tools",
    "OnlyFans link",
    "cam model bio",
    "Lovdash BIO",
    "linktree alternative",
  ],
  openGraph: {
    title: "Bio Link - Lovdash Creator Operating System",
    description: "Create your custom bio link profile synced with live activity on OnlyFans, Fansly, and more.",
    type: "website",
    url: "https://lovdash.com/bio",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Lovdash Bio Link",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bio Link - Lovdash Creator Operating System",
    description: "Create your custom bio link profile synced with live activity on OnlyFans, Fansly, and more.",
    images: ["/og-image.png"],
  },
};

export default function BioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}























