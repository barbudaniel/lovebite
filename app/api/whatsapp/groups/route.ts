import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";

/**
 * GET - List all WhatsApp groups from database
 */
export async function GET() {
  try {
    const supabase = await createServerSupabase();
    
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

    let query = supabase
      .from("whatsapp_groups")
      .select("id, whatsapp_id, name, type, participant_count, created_at")
      .order("name", { ascending: true });

    // For business users, only return groups they have access to
    if (dashboardUser.role === "business" && dashboardUser.studio_id) {
      // Get studio's group and all creator groups under this studio
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
        ...(creatorGroups?.map((c) => c.whatsapp_group_id) || []),
      ].filter(Boolean);

      if (groupIds.length > 0) {
        query = query.in("id", groupIds);
      } else {
        return NextResponse.json({ groups: [] });
      }
    }

    const { data: groups, error } = await query;

    if (error) {
      console.error("Error fetching groups:", error);
      return NextResponse.json(
        { error: "Failed to fetch groups" },
        { status: 500 }
      );
    }

    return NextResponse.json({ groups: groups || [] });
  } catch (error) {
    console.error("Error in groups GET:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

