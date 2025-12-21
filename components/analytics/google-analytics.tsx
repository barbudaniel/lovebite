"use client";

import Script from "next/script";

const GA_MEASUREMENT_ID = "G-J2323PR01P";

export function GoogleAnalytics() {
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            page_path: window.location.pathname,
          });
        `}
      </Script>
    </>
  );
}

// Helper to track custom events
export function trackEvent(
  action: string,
  category: string,
  label?: string,
  value?: number
) {
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
}

// Track page views
export function trackPageView(url: string) {
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("config", GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
}

// Track bio link clicks
export function trackBioLinkClick(creatorSlug: string, linkLabel: string, linkUrl: string) {
  trackEvent("link_click", "bio_link", `${creatorSlug}:${linkLabel}`, 1);
}

// Track bio page views
export function trackBioPageView(creatorSlug: string) {
  trackEvent("page_view", "bio_page", creatorSlug, 1);
}



