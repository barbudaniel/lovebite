import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Content Scheduling",
  description: "Schedule posts across all your platforms with visual calendar, optimal timing suggestions, and bulk scheduling for creators.",
  keywords: ["content scheduling", "post scheduler", "social media scheduler", "multi-platform posting", "content calendar"],
  openGraph: {
    title: "Content Scheduling - Lovdash Creator Operating System",
    description: "Schedule posts across all your platforms with visual calendar, optimal timing, and bulk scheduling.",
    type: "website",
    url: "https://lovdash.com/features/scheduling",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Lovdash Content Scheduling",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Content Scheduling - Lovdash Creator Operating System",
    description: "Schedule posts across all your platforms with visual calendar, optimal timing, and bulk scheduling.",
    images: ["/og-image.png"],
  },
};

export default function SchedulingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
