import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET - Fetch activity logs
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const creatorId = searchParams.get("creatorId");
    const studioId = searchParams.get("studioId");
    const source = searchParams.get("source");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    let query = supabase
      .from("activity_logs")
      .select(`
        *,
        user:dashboard_users(display_name, email),
        creator:creators(username)
      `)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (userId) query = query.eq("user_id", userId);
    if (creatorId) query = query.eq("creator_id", creatorId);
    if (studioId) query = query.eq("studio_id", studioId);
    if (source) query = query.eq("source", source);

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json({ data });
  } catch (error: any) {
    console.error("Error fetching activity:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - Log an activity
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, creatorId, studioId, action, description, metadata, source } = body;

    if (!action || !description) {
      return NextResponse.json(
        { error: "action and description are required" },
        { status: 400 }
      );
    }

    const { data: log, error } = await supabase
      .from("activity_logs")
      .insert({
        user_id: userId || null,
        creator_id: creatorId || null,
        studio_id: studioId || null,
        action,
        description,
        metadata: metadata || {},
        source: source || "dashboard",
      })
      .select()
      .single();

    if (error) throw error;

    // If it's a media upload, notify the studio
    if (action === "media_upload" && creatorId) {
      await notifyStudioOfUpload(creatorId, description, metadata);
    }

    return NextResponse.json({ data: log });
  } catch (error: any) {
    console.error("Error logging activity:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Helper function to notify studio of media uploads
async function notifyStudioOfUpload(
  creatorId: string,
  description: string,
  metadata: Record<string, unknown>
) {
  try {
    // Get creator's studio
    const { data: creator } = await supabase
      .from("creators")
      .select("studio_id, username")
      .eq("id", creatorId)
      .single();

    if (!creator?.studio_id) return;

    // Get studio users to notify
    const { data: studioUsers } = await supabase
      .from("dashboard_users")
      .select("id")
      .eq("studio_id", creator.studio_id)
      .eq("role", "business");

    if (!studioUsers || studioUsers.length === 0) return;

    // Create notifications for each studio user
    const notifications = studioUsers.map((user) => ({
      user_id: user.id,
      type: "media_upload",
      title: "New Media Upload",
      message: `@${creator.username} uploaded new media`,
      data: { creatorId, ...metadata },
    }));

    await supabase.from("notifications").insert(notifications);
  } catch (error) {
    console.error("Error notifying studio:", error);
  }
}



