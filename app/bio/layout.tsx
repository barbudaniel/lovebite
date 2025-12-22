import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lovebite BIO | The Ultimate Bio Link for Adult Creators",
  description: "Create your custom bio link profile. Synced with your live activity on OnlyFans, Chaturbate, and more. Customizable, secure, and built for creators.",
  keywords: [
    "bio link",
    "link in bio",
    "adult creator tools",
    "OnlyFans link",
    "cam model bio",
    "Lovebite BIO",
    "linktree alternative",
  ],
  openGraph: {
    title: "Lovebite BIO | The Ultimate Bio Link for Adult Creators",
    description: "One link for all your platforms. Synced live activity, custom domains, and zero bans.",
    type: "website",
  },
};

export default function BioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}















