import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase-server";

const BOT_API_URL = process.env.NEXT_PUBLIC_BOT_API_URL || "http://143.110.128.83:3001";

/**
 * GET - List all WhatsApp groups
 * 
 * This endpoint:
 * 1. Tries to fetch live groups from the WhatsApp bot
 * 2. Falls back to database if bot is offline
 * 3. Returns groups with proper permissions for the user
 */
export async function GET() {
  try {
    const supabase = await getSupabaseServerClient();
    
    // Get authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get dashboard user to check permissions
    const { data: dashboardUser, error: userError } = await supabase
      .from("dashboard_users")
      .select("id, role, studio_id")
      .eq("auth_user_id", user.id)
      .eq("enabled", true)
      .single();

    if (userError || !dashboardUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 403 }
      );
    }

    interface WhatsAppGroup {
      id: string;
      whatsapp_id: string;
      name: string;
      type: string;
      participant_count: number;
    }
    let groups: WhatsAppGroup[] = [];
    // Skip bot call from Vercel servers (HTTP to external IP often fails)
    // Always use database for now
    const botOnline = false;

    // If bot is offline, fetch from database
    if (!botOnline) {
      let query = supabase
        .from("whatsapp_groups")
        .select("id, whatsapp_id, name, type, participant_count, created_at")
        .order("name", { ascending: true });

      // For business users, only return groups they have access to
      if (dashboardUser.role === "business" && dashboardUser.studio_id) {
        const { data: studioGroups } = await supabase
          .from("studios")
          .select("whatsapp_group_id")
          .eq("id", dashboardUser.studio_id)
          .single();

        const { data: creatorGroups } = await supabase
          .from("creators")
          .select("whatsapp_group_id")
          .eq("studio_id", dashboardUser.studio_id)
          .not("whatsapp_group_id", "is", null);

        const groupIds = [
          studioGroups?.whatsapp_group_id,
          ...(creatorGroups?.map((c: { whatsapp_group_id: string | null }) => c.whatsapp_group_id) || []),
        ].filter(Boolean);

        if (groupIds.length > 0) {
          query = query.in("id", groupIds);
        } else {
          return NextResponse.json({ groups: [], bot_online: false });
        }
      }

      const { data: dbGroups, error } = await query;

      if (error) {
        console.error("Error fetching groups from database:", error);
        return NextResponse.json(
          { error: "Failed to fetch groups" },
          { status: 500 }
        );
      }

      groups = (dbGroups || []).map((g: { id: string; whatsapp_id: string; name: string | null; type: string; participant_count: number | null }) => ({
        ...g,
        name: g.name || "Unnamed Group",
        participant_count: g.participant_count || 0,
        id: g.whatsapp_id, // Use whatsapp_id for sending messages
      }));
    }

    return NextResponse.json({ 
      groups,
      bot_online: botOnline,
    });
  } catch (error) {
    console.error("Error in groups GET:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}




