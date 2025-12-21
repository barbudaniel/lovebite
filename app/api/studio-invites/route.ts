import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getSupabaseServerClient } from "@/lib/supabase/server";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET - Fetch invites (for studios: sent invites, for models: received invites)
export async function GET(request: NextRequest) {
  try {
    const supabase = await getSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get dashboard user
    const { data: dashboardUser } = await supabaseAdmin
      .from("dashboard_users")
      .select("id, role, creator_id, studio_id")
      .eq("auth_user_id", user.id)
      .single();

    if (!dashboardUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let query = supabaseAdmin.from("studio_invites").select(`
      *,
      studio:studios(id, name),
      creator:creators(id, username),
      invited_by_user:dashboard_users!invited_by(id, display_name, email)
    `);

    if (dashboardUser.role === "studio") {
      // Studios see invites they sent
      query = query.eq("studio_id", dashboardUser.studio_id);
    } else if (dashboardUser.role === "model" && dashboardUser.creator_id) {
      // Models see invites sent to them
      query = query.eq("creator_id", dashboardUser.creator_id);
    } else if (dashboardUser.role !== "admin") {
      return NextResponse.json({ error: "Invalid role" }, { status: 403 });
    }

    const { data, error } = await query.order("created_at", { ascending: false });
    if (error) throw error;

    return NextResponse.json({ data });
  } catch (error: any) {
    console.error("Error fetching studio invites:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - Create a new invite (studio inviting a model)
export async function POST(request: NextRequest) {
  try {
    const supabase = await getSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { creatorId, message } = body;

    if (!creatorId) {
      return NextResponse.json({ error: "creatorId is required" }, { status: 400 });
    }

    // Get dashboard user (must be studio or admin)
    const { data: dashboardUser } = await supabaseAdmin
      .from("dashboard_users")
      .select("id, role, studio_id")
      .eq("auth_user_id", user.id)
      .single();

    if (!dashboardUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (dashboardUser.role !== "studio" && dashboardUser.role !== "admin") {
      return NextResponse.json({ error: "Only studios can send invites" }, { status: 403 });
    }

    if (dashboardUser.role === "studio" && !dashboardUser.studio_id) {
      return NextResponse.json({ error: "Studio ID not found" }, { status: 400 });
    }

    // Check if creator exists and is not already in a studio
    const { data: creator } = await supabaseAdmin
      .from("creators")
      .select("id, username, studio_id")
      .eq("id", creatorId)
      .single();

    if (!creator) {
      return NextResponse.json({ error: "Creator not found" }, { status: 404 });
    }

    if (creator.studio_id) {
      return NextResponse.json({ error: "This creator is already part of a studio" }, { status: 400 });
    }

    // Check for existing pending invite
    const { data: existingInvite } = await supabaseAdmin
      .from("studio_invites")
      .select("id, status")
      .eq("studio_id", dashboardUser.studio_id)
      .eq("creator_id", creatorId)
      .eq("status", "pending")
      .single();

    if (existingInvite) {
      return NextResponse.json({ error: "A pending invite already exists for this creator" }, { status: 400 });
    }

    // Get studio name for notification
    const { data: studio } = await supabaseAdmin
      .from("studios")
      .select("name")
      .eq("id", dashboardUser.studio_id)
      .single();

    // Create the invite
    const { data: invite, error } = await supabaseAdmin
      .from("studio_invites")
      .insert({
        studio_id: dashboardUser.studio_id,
        creator_id: creatorId,
        invited_by: dashboardUser.id,
        message,
      })
      .select()
      .single();

    if (error) throw error;

    // Get the model's dashboard user to send notification
    const { data: modelUser } = await supabaseAdmin
      .from("dashboard_users")
      .select("id")
      .eq("creator_id", creatorId)
      .single();

    if (modelUser) {
      // Create notification for the model
      await supabaseAdmin.from("notifications").insert({
        user_id: modelUser.id,
        type: "studio_invite",
        title: "Studio Invitation",
        message: `${studio?.name || "A studio"} has invited you to join their team!`,
        data: {
          invite_id: invite.id,
          studio_id: dashboardUser.studio_id,
          studio_name: studio?.name,
        },
      });
    }

    return NextResponse.json({ data: invite });
  } catch (error: any) {
    console.error("Error creating studio invite:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

