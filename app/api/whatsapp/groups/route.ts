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
    let botOnline = false;

    // Try to fetch live groups from the WhatsApp bot first
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      
      const botResponse = await fetch(`${BOT_API_URL}/groups`, {
        signal: controller.signal,
        cache: "no-store",
      });
      clearTimeout(timeout);
      
      if (botResponse.ok) {
        const botData = await botResponse.json();
        botOnline = true;
        
        // Transform bot groups to our format
        if (botData.groups && Array.isArray(botData.groups)) {
          groups = botData.groups.map((g: { id: string; name?: string; type?: string; participants?: number; participantCount?: number }) => ({
            id: g.id, // Use the WhatsApp JID as the ID for sending messages
            whatsapp_id: g.id,
            name: g.name || "Unnamed Group",
            type: g.type || "creator",
            participant_count: g.participants || g.participantCount || 0,
          }));
        }
      }
    } catch (botError) {
      console.log("Bot offline, falling back to database:", botError);
    }

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

    // For business users with bot online, filter to their groups
    if (botOnline && dashboardUser.role === "business" && dashboardUser.studio_id) {
      // Get allowed group IDs from database
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

      // Get the whatsapp_id values for allowed groups
      const allowedGroupDbIds = [
        studioGroups?.whatsapp_group_id,
        ...(creatorGroups?.map((c: { whatsapp_group_id: string | null }) => c.whatsapp_group_id) || []),
      ].filter(Boolean);

      // Get the actual whatsapp_ids from the database
      const { data: allowedGroups } = await supabase
        .from("whatsapp_groups")
        .select("whatsapp_id")
        .in("id", allowedGroupDbIds);

      const allowedWhatsAppIds = new Set(allowedGroups?.map((g: { whatsapp_id: string }) => g.whatsapp_id) || []);
      
      groups = groups.filter((g) => allowedWhatsAppIds.has(g.whatsapp_id));
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

