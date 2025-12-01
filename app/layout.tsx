import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Lovebite | Monetize Your Influence - Creator Management Agency",
  description:
    "Stop giving away 50% of your earnings. Lovebite is a content creator management agency that helps you earn smart. We handle the tech, marketing, and management—you just bring the heat.",
  keywords: [
    "content creator",
    "OnlyFans management",
    "creator agency",
    "influencer management",
    "content monetization",
  ],
  openGraph: {
    title: "Lovebite | Monetize Your Influence",
    description:
      "Your Screen. Your Empire. Stop working hard for algorithms. Start earning smart with Lovebite.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${outfit.variable} font-sans text-slate-800 antialiased selection:bg-brand-200 selection:text-brand-900`}
      >
        {children}
        <Toaster 
          position="top-center" 
          richColors 
          closeButton
          toastOptions={{
            style: {
              fontFamily: 'var(--font-outfit)',
            },
          }}
        />
      </body>
    </html>
  );
}


