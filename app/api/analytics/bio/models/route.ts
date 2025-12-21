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

    // Get page views for all bio links
    const { data: pageViews } = await serviceClient
      .from("bio_page_views")
      .select("bio_link_id, visitor_id, ip_hash")
      .in("bio_link_id", bioLinkIds)
      .gte("created_at", startDate.toISOString());

    // Get link clicks for all bio links
    const { data: linkClicks } = await serviceClient
      .from("bio_link_clicks")
      .select("bio_link_id")
      .in("bio_link_id", bioLinkIds)
      .gte("created_at", startDate.toISOString());

    // Aggregate stats by creator
    const creatorStatsMap = new Map<string, { views: number; clicks: number; visitorSet: Set<string> }>();

    // Initialize all creators
    creators.forEach((c) => {
      creatorStatsMap.set(c.id, { views: 0, clicks: 0, visitorSet: new Set() });
    });

    // Process page views
    (pageViews || []).forEach((pv) => {
      const creatorId = bioLinkToCreator.get(pv.bio_link_id);
      if (creatorId) {
        const stats = creatorStatsMap.get(creatorId);
        if (stats) {
          stats.views += 1;
          stats.visitorSet.add(pv.visitor_id || pv.ip_hash || "unknown");
        }
      }
    });

    // Process link clicks
    (linkClicks || []).forEach((lc) => {
      const creatorId = bioLinkToCreator.get(lc.bio_link_id);
      if (creatorId) {
        const stats = creatorStatsMap.get(creatorId);
        if (stats) {
          stats.clicks += 1;
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

    return NextResponse.json({
      totalViews,
      totalClicks,
      totalUniqueVisitors: allVisitors.size,
      modelStats,
    });
  } catch (error) {
    console.error("Model bio analytics error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

