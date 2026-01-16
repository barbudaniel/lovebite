# Lovdash Analytics & SEO/AEO Setup Guide

This guide covers where to configure analytics, SEO, and AEO (Answer Engine Optimization) for the Lovdash marketing website.

---

## Table of Contents

1. [Google Analytics (GA4)](#google-analytics-ga4)
2. [Google Search Console](#google-search-console)
3. [SEO Configuration](#seo-configuration)
4. [AEO Configuration (AI/LLM)](#aeo-configuration)
5. [Additional Analytics Platforms](#additional-analytics-platforms)
6. [Monitoring & Verification](#monitoring--verification)

---

## Google Analytics (GA4)

### Current Setup
Google Analytics is already configured in:

```
components/analytics/google-analytics.tsx
```

**Current Measurement ID**: `G-J2323PR01P`

### To Change the GA4 Measurement ID

1. Open `components/analytics/google-analytics.tsx`
2. Update the `GA_MEASUREMENT_ID` constant:

```typescript
const GA_MEASUREMENT_ID = "G-YOUR-NEW-ID";
```

### Tracking Custom Events

The component exports helper functions you can import anywhere:

```typescript
import { trackEvent, trackPageView } from "@/components/analytics/google-analytics";

// Track custom events
trackEvent("signup_click", "conversion", "homepage_cta");

// Track page views manually (automatic in most cases)
trackPageView("/custom-page");
```

### Enhanced Ecommerce (Future)
When ready, add to `google-analytics.tsx`:

```typescript
export function trackPurchase(transactionId: string, value: number, currency: string = 'USD') {
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", "purchase", {
      transaction_id: transactionId,
      value: value,
      currency: currency,
    });
  }
}
```

---

## Google Search Console

### Setup Steps

1. **Verify ownership** at [Google Search Console](https://search.google.com/search-console)
2. Add property for `https://lovdash.com`
3. Use HTML meta tag verification (add to `app/layout.tsx`):

```tsx
export const metadata: Metadata = {
  // ... existing metadata
  verification: {
    google: "YOUR_GOOGLE_VERIFICATION_CODE",
  },
};
```

### Submit Sitemap
After verification:
1. Go to "Sitemaps" in Search Console
2. Submit: `https://lovdash.com/sitemap.xml`

The sitemap is auto-generated at `app/sitemap.ts`.

---

## SEO Configuration

### Global Metadata
Edit `app/layout.tsx` for site-wide SEO:

```typescript
export const metadata: Metadata = {
  title: {
    default: "Lovdash — The Creator Operating System",
    template: "%s | Lovdash",
  },
  description: "Your site description...",
  keywords: ["keyword1", "keyword2"],
  metadataBase: new URL("https://lovdash.com"),
  openGraph: { /* ... */ },
  twitter: { /* ... */ },
  robots: { /* ... */ },
};
```

### Page-Level Metadata
Each page can export its own metadata:

```typescript
// app/(marketing)/features/page.tsx
export const metadata: Metadata = {
  title: "Features",
  description: "Explore all Lovdash features...",
};
```

### Sitemap Configuration
Edit `app/sitemap.ts` to:
- Add new pages
- Adjust priorities
- Change update frequencies

```typescript
{
  url: `${baseUrl}/new-page`,
  lastModified: currentDate,
  changeFrequency: 'weekly',
  priority: 0.8,
}
```

### Robots.txt Configuration
Edit `app/robots.ts` to:
- Allow/disallow paths
- Add new bot rules
- Update sitemap URL

---

## AEO Configuration

### What is AEO?
Answer Engine Optimization ensures AI assistants (ChatGPT, Claude, Perplexity, etc.) can understand and recommend your site.

### Files Created

| File | Purpose |
|------|---------|
| `public/llms.txt` | Concise summary for AI crawlers |
| `public/llms-full.txt` | Detailed documentation for AI |
| `public/.well-known/ai-plugin.json` | AI plugin manifest |
| `app/robots.ts` | Bot permissions (includes AI bots) |

### Updating LLM Content

**For quick updates**: Edit `public/llms.txt`
- Keep it under 5KB
- Focus on key facts, features, FAQs
- Use clear, structured format

**For comprehensive info**: Edit `public/llms-full.txt`
- Include all product details
- Technical specifications
- Detailed feature descriptions

### AI Bot Permissions
The `robots.ts` file allows these AI crawlers:
- GPTBot (OpenAI)
- ChatGPT-User
- Claude-Web (Anthropic)
- PerplexityBot
- Bytespider (ByteDance)

To modify permissions, edit `app/robots.ts`.

### Structured Data (JSON-LD)
Add to pages for rich results. Example in homepage:

```typescript
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Lovdash",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web",
      "description": "AI-powered creator management platform",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    })
  }}
/>
```

---

## Additional Analytics Platforms

### Microsoft Clarity (Heatmaps)
Add to `app/layout.tsx`:

```tsx
<Script id="microsoft-clarity" strategy="afterInteractive">
  {`
    (function(c,l,a,r,i,t,y){
      c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
      t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
      y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "YOUR_CLARITY_ID");
  `}
</Script>
```

### Hotjar
Add to `app/layout.tsx`:

```tsx
<Script id="hotjar" strategy="afterInteractive">
  {`
    (function(h,o,t,j,a,r){
      h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
      h._hjSettings={hjid:YOUR_HJID,hjsv:6};
      a=o.getElementsByTagName('head')[0];
      r=o.createElement('script');r.async=1;
      r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
      a.appendChild(r);
    })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
  `}
</Script>
```

### Plausible Analytics (Privacy-focused)
Add to `app/layout.tsx`:

```tsx
<Script
  defer
  data-domain="lovdash.com"
  src="https://plausible.io/js/script.js"
/>
```

### Meta Pixel (Facebook/Instagram Ads)
Add to `app/layout.tsx`:

```tsx
<Script id="meta-pixel" strategy="afterInteractive">
  {`
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', 'YOUR_PIXEL_ID');
    fbq('track', 'PageView');
  `}
</Script>
```

### Google Tag Manager (Alternative)
If you prefer GTM to manage all tags:

```tsx
// In app/layout.tsx <head>
<Script id="gtm" strategy="afterInteractive">
  {`
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','GTM-XXXXXXX');
  `}
</Script>

// In app/layout.tsx <body> (first child)
<noscript>
  <iframe
    src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXX"
    height="0"
    width="0"
    style={{ display: 'none', visibility: 'hidden' }}
  />
</noscript>
```

---

## Monitoring & Verification

### SEO Checklist
- [ ] Sitemap submitted to Google Search Console
- [ ] robots.txt verified (visit https://lovdash.com/robots.txt)
- [ ] All pages have unique titles and descriptions
- [ ] Open Graph images configured
- [ ] Structured data validated at schema.org validator

### AEO Checklist
- [ ] llms.txt accessible at https://lovdash.com/llms.txt
- [ ] AI bot access verified in robots.txt
- [ ] ai-plugin.json at /.well-known/ai-plugin.json
- [ ] Content is factual and up-to-date

### Analytics Verification
1. **Real-time reports**: Check GA4 real-time to verify tracking
2. **Debug mode**: Add `?debug_mode=true` to URL for GA debug
3. **Tag Assistant**: Use Chrome extension to verify tags

### Useful Tools
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Schema Markup Validator](https://validator.schema.org/)
- [Ahrefs/SEMrush](https://ahrefs.com) - SEO analysis
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [Bing Webmaster Tools](https://www.bing.com/webmasters)

---

## Environment Variables (If Using)

For sensitive IDs, use environment variables:

```env
# .env.local
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_CLARITY_ID=xxxxxxxxxx
NEXT_PUBLIC_HOTJAR_ID=0000000
NEXT_PUBLIC_META_PIXEL_ID=0000000000000000
```

Then update components:

```typescript
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
```

---

## Summary: Where to Put What

| Type | Location |
|------|----------|
| Google Analytics ID | `components/analytics/google-analytics.tsx` |
| Global SEO metadata | `app/layout.tsx` |
| Page-specific SEO | Each `page.tsx` file |
| Sitemap pages | `app/sitemap.ts` |
| Robots rules | `app/robots.ts` |
| LLM/AEO content | `public/llms.txt` & `public/llms-full.txt` |
| AI plugin manifest | `public/.well-known/ai-plugin.json` |
| Additional tracking scripts | `app/layout.tsx` (after GoogleAnalytics) |
| Google verification | `app/layout.tsx` metadata.verification |
| Structured data (JSON-LD) | Individual page components |

---

*Last Updated: January 2026*
