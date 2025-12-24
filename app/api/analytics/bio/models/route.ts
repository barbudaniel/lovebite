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

export interface ModelBioStats {
  creatorId: string;
  username: string;
  views: number;
  clicks: number;
  uniqueVisitors: number;
}

export interface AggregatedBioStats {
  totalViews: number;
  totalClicks: number;
  totalUniqueVisitors: number;
  modelStats: ModelBioStats[];
  // Aggregated chart data
  viewsByDay: Record<string, number>;
  clicksByDay: Record<string, number>;
  viewsByCountry: Record<string, number>;
  viewsByDevice: Record<string, number>;
  topLinks: Array<{ label: string; count: number; creatorId?: string; modelUsername?: string }>;
  topReferrers: Array<{ referrer: string; count: number }>;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "30d";

    const supabase = await getAuthenticatedClient();

    // Verify user is admin or studio
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: dashboardUser } = await supabase
      .from("dashboard_users")
      .select("role, studio_id")
      .or(`auth_user_id.eq.${user.id},email.eq.${user.email}`)
      .single();

    if (!dashboardUser || (dashboardUser.role !== "admin" && dashboardUser.role !== "business")) {
      return NextResponse.json({ error: "Access denied. Admin or Studio role required." }, { status: 403 });
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
        startDate = new Date(0);
    }

    // Use service role for analytics queries
    const serviceClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Get creators (filtered by studio if studio user)
    let creatorsQuery = serviceClient
      .from("creators")
      .select("id, username")
      .eq("enabled", true);

    if (dashboardUser.role === "business" && dashboardUser.studio_id) {
      creatorsQuery = creatorsQuery.eq("studio_id", dashboardUser.studio_id);
    }

    const { data: creators } = await creatorsQuery.order("username");

    if (!creators || creators.length === 0) {
      return NextResponse.json({
        totalViews: 0,
        totalClicks: 0,
        totalUniqueVisitors: 0,
        modelStats: [],
      });
    }

    // Get bio links for all creators
    const creatorIds = creators.map((c) => c.id);
    const { data: bioLinks } = await serviceClient
      .from("bio_links")
      .select("id, creator_id")
      .in("creator_id", creatorIds);

    if (!bioLinks || bioLinks.length === 0) {
      return NextResponse.json({
        totalViews: 0,
        totalClicks: 0,
        totalUniqueVisitors: 0,
        modelStats: creators.map((c) => ({
          creatorId: c.id,
          username: c.username,
          views: 0,
          clicks: 0,
          uniqueVisitors: 0,
        })),
      });
    }

    const bioLinkIds = bioLinks.map((b) => b.id);
    const bioLinkToCreator = new Map(bioLinks.map((b) => [b.id, b.creator_id]));
    const creatorIdToUsername = new Map(creators.map((c) => [c.id, c.username]));

    // Get page views for all bio links with full details for aggregation
    const { data: pageViews } = await serviceClient
      .from("bio_page_views")
      .select("bio_link_id, visitor_id, ip_hash, country, device_type, referrer, created_at")
      .in("bio_link_id", bioLinkIds)
      .gte("created_at", startDate.toISOString());

    // Get link clicks for all bio links with details
    const { data: linkClicks } = await serviceClient
      .from("bio_link_clicks")
      .select("bio_link_id, link_label, created_at")
      .in("bio_link_id", bioLinkIds)
      .gte("created_at", startDate.toISOString());

    // Aggregate stats by creator + global aggregations
    const creatorStatsMap = new Map<string, { views: number; clicks: number; visitorSet: Set<string> }>();
    const viewsByDay: Record<string, number> = {};
    const clicksByDay: Record<string, number> = {};
    const viewsByCountry: Record<string, number> = {};
    const viewsByDevice: Record<string, number> = {};
    const referrerCounts: Record<string, number> = {};
    const linkClickCounts: Record<string, { count: number; creatorId?: string }> = {};

    // Initialize all creators
    creators.forEach((c) => {
      creatorStatsMap.set(c.id, { views: 0, clicks: 0, visitorSet: new Set() });
    });

    // Process page views
    (pageViews || []).forEach((pv: any) => {
      const creatorId = bioLinkToCreator.get(pv.bio_link_id);
      if (creatorId) {
        const stats = creatorStatsMap.get(creatorId);
        if (stats) {
          stats.views += 1;
          stats.visitorSet.add(pv.visitor_id || pv.ip_hash || "unknown");
        }
      }
      
      // Aggregate by day
      if (pv.created_at) {
        const day = pv.created_at.split("T")[0];
        viewsByDay[day] = (viewsByDay[day] || 0) + 1;
      }
      
      // Aggregate by country
      const country = pv.country || "Unknown";
      viewsByCountry[country] = (viewsByCountry[country] || 0) + 1;
      
      // Aggregate by device
      const device = pv.device_type || "unknown";
      viewsByDevice[device] = (viewsByDevice[device] || 0) + 1;
      
      // Aggregate referrers
      if (pv.referrer) {
        try {
          const url = new URL(pv.referrer);
          const domain = url.hostname.replace("www.", "");
          referrerCounts[domain] = (referrerCounts[domain] || 0) + 1;
        } catch {
          referrerCounts[pv.referrer] = (referrerCounts[pv.referrer] || 0) + 1;
        }
      } else {
        referrerCounts["Direct"] = (referrerCounts["Direct"] || 0) + 1;
      }
    });

    // Process link clicks
    (linkClicks || []).forEach((lc: any) => {
      const creatorId = bioLinkToCreator.get(lc.bio_link_id);
      if (creatorId) {
        const stats = creatorStatsMap.get(creatorId);
        if (stats) {
          stats.clicks += 1;
        }
      }
      
      // Aggregate clicks by day
      if (lc.created_at) {
        const day = lc.created_at.split("T")[0];
        clicksByDay[day] = (clicksByDay[day] || 0) + 1;
      }
      
      // Aggregate link clicks by label (with creator info)
      if (lc.link_label) {
        const creatorId = bioLinkToCreator.get(lc.bio_link_id);
        const existing = linkClickCounts[lc.link_label];
        if (existing) {
          existing.count += 1;
          // Keep the most frequent creator for this label
        } else {
          linkClickCounts[lc.link_label] = { count: 1, creatorId };
        }
      }
    });

    // Build response
    let totalViews = 0;
    let totalClicks = 0;
    const allVisitors = new Set<string>();

    const modelStats: ModelBioStats[] = creators.map((c) => {
      const stats = creatorStatsMap.get(c.id)!;
      totalViews += stats.views;
      totalClicks += stats.clicks;
      stats.visitorSet.forEach((v) => allVisitors.add(v));

      return {
        creatorId: c.id,
        username: c.username,
        views: stats.views,
        clicks: stats.clicks,
        uniqueVisitors: stats.visitorSet.size,
      };
    });

    // Sort by views descending
    modelStats.sort((a, b) => b.views - a.views);
    
    // Convert to sorted arrays (with model info)
    const topLinks = Object.entries(linkClickCounts)
      .map(([label, data]) => ({ 
        label, 
        count: data.count,
        creatorId: data.creatorId,
        modelUsername: data.creatorId ? creatorIdToUsername.get(data.creatorId) : undefined
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
    
    const topReferrers = Object.entries(referrerCounts)
      .map(([referrer, count]) => ({ referrer, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return NextResponse.json({
      totalViews,
      totalClicks,
      totalUniqueVisitors: allVisitors.size,
      modelStats,
      viewsByDay,
      clicksByDay,
      viewsByCountry,
      viewsByDevice,
      topLinks,
      topReferrers,
    });
  } catch (error) {
    console.error("Model bio analytics error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

