import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

// Get authenticated user's Supabase client
async function getAuthenticatedClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll() {},
      },
    }
  );
}

interface RouteParams {
  params: Promise<{ bioLinkId: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { bioLinkId } = await params;
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "7d"; // 7d, 30d, 90d, all

    const supabase = await getAuthenticatedClient();

    // Verify user has access to this bio link
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user owns this bio link or is admin
    const { data: bioLink } = await supabase
      .from("bio_links")
      .select("id, creator_id")
      .eq("id", bioLinkId)
      .single();

    if (!bioLink) {
      return NextResponse.json({ error: "Bio link not found" }, { status: 404 });
    }

    const { data: dashboardUser } = await supabase
      .from("dashboard_users")
      .select("role, creator_id, studio_id")
      .or(`auth_user_id.eq.${user.id},email.eq.${user.email}`)
      .single();

    if (!dashboardUser) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Admin can access all
    const isAdmin = dashboardUser.role === "admin";
    // Model can access their own
    const isOwnBioLink = dashboardUser.creator_id === bioLink.creator_id;
    
    // Studio can access their models' bio links
    let isStudioModel = false;
    if (dashboardUser.role === "studio" && dashboardUser.studio_id) {
      // Check if the bio link's creator belongs to this studio
      const { data: creator } = await supabase
        .from("creators")
        .select("studio_id")
        .eq("id", bioLink.creator_id)
        .single();
      isStudioModel = creator?.studio_id === dashboardUser.studio_id;
    }

    if (!isAdmin && !isOwnBioLink && !isStudioModel) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Calculate date range
    let startDate: Date;
    const now = new Date();
    switch (period) {
      case "7d":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "30d":
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case "90d":
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(0); // All time
    }

    // Use service role for analytics queries (RLS can be complex for aggregations)
    const serviceClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Get page views
    const { data: pageViews, error: pvError } = await serviceClient
      .from("bio_page_views")
      .select("*")
      .eq("bio_link_id", bioLinkId)
      .gte("created_at", startDate.toISOString())
      .order("created_at", { ascending: false });

    if (pvError) {
      console.error("Page views error:", pvError);
    }

    // Get link clicks
    const { data: linkClicks, error: lcError } = await serviceClient
      .from("bio_link_clicks")
      .select("*")
      .eq("bio_link_id", bioLinkId)
      .gte("created_at", startDate.toISOString())
      .order("created_at", { ascending: false });

    if (lcError) {
      console.error("Link clicks error:", lcError);
    }

    // Calculate aggregations
    const views = pageViews || [];
    const clicks = linkClicks || [];

    // Unique visitors (by visitor_id or ip_hash)
    const uniqueVisitors = new Set(views.map((v) => v.visitor_id || v.ip_hash)).size;

    // Views by day
    const viewsByDay: Record<string, number> = {};
    views.forEach((v) => {
      const day = v.created_at.split("T")[0];
      viewsByDay[day] = (viewsByDay[day] || 0) + 1;
    });

    // Clicks by day
    const clicksByDay: Record<string, number> = {};
    clicks.forEach((c) => {
      const day = c.created_at.split("T")[0];
      clicksByDay[day] = (clicksByDay[day] || 0) + 1;
    });

    // Views by country
    const viewsByCountry: Record<string, number> = {};
    views.forEach((v) => {
      const country = v.country || "Unknown";
      viewsByCountry[country] = (viewsByCountry[country] || 0) + 1;
    });

    // Views by device
    const viewsByDevice: Record<string, number> = {};
    views.forEach((v) => {
      const device = v.device_type || "unknown";
      viewsByDevice[device] = (viewsByDevice[device] || 0) + 1;
    });

    // Views by browser
    const viewsByBrowser: Record<string, number> = {};
    views.forEach((v) => {
      const browser = v.browser || "unknown";
      viewsByBrowser[browser] = (viewsByBrowser[browser] || 0) + 1;
    });

    // Top referrers
    const referrerCounts: Record<string, number> = {};
    views.forEach((v) => {
      if (v.referrer) {
        try {
          const url = new URL(v.referrer);
          const domain = url.hostname;
          referrerCounts[domain] = (referrerCounts[domain] || 0) + 1;
        } catch {
          referrerCounts[v.referrer] = (referrerCounts[v.referrer] || 0) + 1;
        }
      }
    });
    const topReferrers = Object.entries(referrerCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([referrer, count]) => ({ referrer, count }));

    // Clicks by link
    const clicksByLink: Record<string, { label: string; url: string; count: number }> = {};
    clicks.forEach((c) => {
      const key = c.link_label;
      if (!clicksByLink[key]) {
        clicksByLink[key] = { label: c.link_label, url: c.link_url, count: 0 };
      }
      clicksByLink[key].count += 1;
    });
    const topLinks = Object.values(clicksByLink).sort((a, b) => b.count - a.count);

    // Recent activity
    const recentViews = views.slice(0, 20).map((v) => ({
      type: "view",
      country: v.country,
      device: v.device_type,
      referrer: v.referrer,
      createdAt: v.created_at,
    }));

    const recentClicks = clicks.slice(0, 20).map((c) => ({
      type: "click",
      label: c.link_label,
      country: c.country,
      device: c.device_type,
      createdAt: c.created_at,
    }));

    return NextResponse.json({
      summary: {
        totalViews: views.length,
        uniqueVisitors,
        totalClicks: clicks.length,
        clickThroughRate: views.length > 0 ? ((clicks.length / views.length) * 100).toFixed(1) : "0",
      },
      viewsByDay,
      clicksByDay,
      viewsByCountry,
      viewsByDevice,
      viewsByBrowser,
      topReferrers,
      topLinks,
      recentActivity: [...recentViews, ...recentClicks]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 30),
    });
  } catch (error) {
    console.error("Analytics fetch error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}



