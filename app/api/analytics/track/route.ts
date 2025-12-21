import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

// Create Supabase client with service role for inserting analytics
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Hash IP address for privacy
function hashIP(ip: string): string {
  return crypto.createHash("sha256").update(ip + "lovebite-salt").digest("hex").slice(0, 16);
}

// Parse user agent to get device info
function parseUserAgent(ua: string): { deviceType: string; browser: string; os: string } {
  const deviceType = /mobile/i.test(ua) 
    ? "mobile" 
    : /tablet|ipad/i.test(ua) 
    ? "tablet" 
    : "desktop";

  let browser = "unknown";
  if (/chrome/i.test(ua) && !/edge|edg/i.test(ua)) browser = "Chrome";
  else if (/firefox/i.test(ua)) browser = "Firefox";
  else if (/safari/i.test(ua) && !/chrome/i.test(ua)) browser = "Safari";
  else if (/edge|edg/i.test(ua)) browser = "Edge";
  else if (/opera|opr/i.test(ua)) browser = "Opera";

  let os = "unknown";
  if (/windows/i.test(ua)) os = "Windows";
  else if (/macintosh|mac os/i.test(ua)) os = "macOS";
  else if (/linux/i.test(ua)) os = "Linux";
  else if (/android/i.test(ua)) os = "Android";
  else if (/iphone|ipad|ipod/i.test(ua)) os = "iOS";

  return { deviceType, browser, os };
}

// Get country from IP using a free API (fallback to header)
async function getGeoFromIP(ip: string): Promise<{ country: string; city: string; region: string }> {
  try {
    // Use ip-api.com (free, no API key needed, 45 requests/minute)
    const response = await fetch(`http://ip-api.com/json/${ip}?fields=country,city,regionName`);
    if (response.ok) {
      const data = await response.json();
      return {
        country: data.country || "Unknown",
        city: data.city || "Unknown",
        region: data.regionName || "Unknown",
      };
    }
  } catch (e) {
    console.error("Geo lookup failed:", e);
  }
  return { country: "Unknown", city: "Unknown", region: "Unknown" };
}

// Resolve bioLinkId from slug if not provided directly
async function resolveBioLinkId(bioLinkId: string | undefined, creatorSlug: string | undefined): Promise<string | null> {
  // If we already have a valid bioLinkId, use it
  if (bioLinkId) {
    return bioLinkId;
  }
  
  // If we have a creatorSlug, try to look up the bio_link
  if (creatorSlug) {
    const { data: bioLink } = await supabase
      .from("bio_links")
      .select("id")
      .ilike("slug", creatorSlug)
      .maybeSingle();
    
    if (bioLink?.id) {
      return bioLink.id;
    }
    
    // Also try custom_domain lookup in case slug matches a domain
    const { data: bioByDomain } = await supabase
      .from("bio_links")
      .select("id")
      .ilike("custom_domain", creatorSlug)
      .maybeSingle();
    
    if (bioByDomain?.id) {
      return bioByDomain.id;
    }
  }
  
  return null;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, bioLinkId: providedBioLinkId, creatorSlug, linkItemId, linkLabel, linkUrl, visitorId, referrer } = body;
    
    // Resolve the bioLinkId - either from provided value or lookup by slug
    const bioLinkId = await resolveBioLinkId(providedBioLinkId, creatorSlug);
    
    if (!bioLinkId) {
      // No bio link found - cannot track without a valid bio_link_id
      // This happens for legacy creators not yet in the database
      console.log(`Analytics: No bio_link found for slug "${creatorSlug}", skipping tracking`);
      return NextResponse.json({ success: true, skipped: true });
    }

    // Get client IP
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : request.headers.get("x-real-ip") || "unknown";
    const ipHash = hashIP(ip);

    // Get user agent info
    const userAgent = request.headers.get("user-agent") || "";
    const { deviceType, browser, os } = parseUserAgent(userAgent);

    // Get geo info (skip for localhost)
    let geo = { country: "Unknown", city: "Unknown", region: "Unknown" };
    if (ip !== "unknown" && !ip.startsWith("127.") && !ip.startsWith("192.168.") && ip !== "::1") {
      geo = await getGeoFromIP(ip);
    }

    if (type === "page_view") {
      // Track page view
      const { error } = await supabase.from("bio_page_views").insert({
        bio_link_id: bioLinkId,
        visitor_id: visitorId,
        ip_hash: ipHash,
        country: geo.country,
        city: geo.city,
        region: geo.region,
        referrer: referrer || request.headers.get("referer") || null,
        user_agent: userAgent,
        device_type: deviceType,
        browser: browser,
        os: os,
      });

      if (error) {
        console.error("Error tracking page view:", error);
        return NextResponse.json({ error: "Failed to track" }, { status: 500 });
      }
    } else if (type === "link_click") {
      // Track link click
      const { error } = await supabase.from("bio_link_clicks").insert({
        bio_link_id: bioLinkId,
        bio_link_item_id: linkItemId || null,
        link_label: linkLabel,
        link_url: linkUrl,
        visitor_id: visitorId,
        ip_hash: ipHash,
        country: geo.country,
        referrer: referrer || null,
        device_type: deviceType,
      });

      if (error) {
        console.error("Error tracking link click:", error);
        return NextResponse.json({ error: "Failed to track" }, { status: 500 });
      }
    } else {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Analytics tracking error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}



