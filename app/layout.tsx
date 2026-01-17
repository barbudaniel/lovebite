import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: {
    default: "Lovdash - Creator Operating System | AI-Powered Content Management",
    template: "%s | Lovdash - Creator Operating System",
  },
  description:
    "Upload once, publish everywhere. Lovdash is the AI-powered operating system for creators and agencies. Organize media, schedule posts, and track engagement across every platform.",
  keywords: [
    "creator operating system",
    "AI media management",
    "content scheduling",
    "multi-platform publishing",
    "creator tools",
    "studio management",
  ],
  metadataBase: new URL("https://lovdash.com"),
  openGraph: {
    title: "Lovdash - Creator Operating System",
    description:
      "Upload once, publish everywhere. AI-powered media management for creators and agencies.",
    type: "website",
    siteName: "Lovdash",
    url: "https://lovdash.com",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Lovdash - Creator Operating System",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lovdash - Creator Operating System",
    description:
      "Upload once, publish everywhere. AI-powered media management for creators and agencies.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://lovdash.com",
  },
};

// Organization schema for SEO
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Lovdash",
  url: "https://lovdash.com",
  logo: "https://lovdash.com/logo.png",
  description:
    "Lovdash is the AI-powered operating system for creators and agencies. Upload once, publish everywhere, track what works.",
  foundingDate: "2025",
  sameAs: [
    "https://twitter.com/lovdash",
    "https://instagram.com/lovdash",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    email: "hello@lovdash.com",
    contactType: "customer service",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
      </head>
      <body
        className={`${outfit.variable} font-sans text-slate-800 antialiased selection:bg-brand-200 selection:text-brand-900`}
      >
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  );
}


