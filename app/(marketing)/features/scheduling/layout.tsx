import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Content Scheduling | Lovdash Features",
  description: "Schedule posts across all your platforms. Multi-platform queues, optimal timing, and bulk scheduling for creators.",
  keywords: ["content scheduling", "post scheduler", "social media scheduler", "multi-platform posting", "content calendar"],
  openGraph: {
    title: "Content Scheduling | Lovdash",
    description: "Schedule posts across all your platforms with optimal timing.",
    type: "website",
    url: "https://lovdash.com/features/scheduling",
  },
};

export default function SchedulingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
