import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getSupabaseServerClient } from "@/lib/supabase-server";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// PATCH - Accept or decline an invite
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ inviteId: string }> }
) {
  try {
    const { inviteId } = await params;
    const supabase = await getSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { action } = body; // 'accept' or 'decline'

    if (!action || !["accept", "decline"].includes(action)) {
      return NextResponse.json({ error: "Action must be 'accept' or 'decline'" }, { status: 400 });
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

    // Get the invite
    const { data: invite } = await supabaseAdmin
      .from("studio_invites")
      .select("*, studio:studios(id, name)")
      .eq("id", inviteId)
      .single();

    if (!invite) {
      return NextResponse.json({ error: "Invite not found" }, { status: 404 });
    }

    // Check authorization
    const isIndependent = dashboardUser.role === "independent" && dashboardUser.creator_id === invite.creator_id;
    const isBusiness = dashboardUser.role === "business" && dashboardUser.studio_id === invite.studio_id;
    const isAdmin = dashboardUser.role === "admin";

    // Independent users can accept/decline, business users can only cancel
    if (action === "accept" || action === "decline") {
      if (!isIndependent && !isAdmin) {
        return NextResponse.json({ error: "Only the invited creator can respond to this invite" }, { status: 403 });
      }
    }

    if (invite.status !== "pending") {
      return NextResponse.json({ error: "This invite is no longer pending" }, { status: 400 });
    }

    if (action === "accept") {
      // Check if model is already in a studio
      const { data: creator } = await supabaseAdmin
        .from("creators")
        .select("studio_id")
        .eq("id", invite.creator_id)
        .single();

      if (creator?.studio_id) {
        return NextResponse.json({ error: "You are already part of a studio. Leave your current studio first." }, { status: 400 });
      }

      // Accept the invite and add to studio
      await supabaseAdmin
        .from("studio_invites")
        .update({ status: "accepted", responded_at: new Date().toISOString() })
        .eq("id", inviteId);

      await supabaseAdmin
        .from("creators")
        .update({ studio_id: invite.studio_id })
        .eq("id", invite.creator_id);

      // Cancel any other pending invites for this creator
      await supabaseAdmin
        .from("studio_invites")
        .update({ status: "cancelled", responded_at: new Date().toISOString() })
        .eq("creator_id", invite.creator_id)
        .neq("id", inviteId)
        .eq("status", "pending");

      // Notify the business
      const { data: studioUsers } = await supabaseAdmin
        .from("dashboard_users")
        .select("id")
        .eq("studio_id", invite.studio_id)
        .eq("role", "business");

      const { data: creator2 } = await supabaseAdmin
        .from("creators")
        .select("username")
        .eq("id", invite.creator_id)
        .single();

      if (studioUsers && creator2) {
        for (const studioUser of studioUsers) {
          await supabaseAdmin.from("notifications").insert({
            user_id: studioUser.id,
            type: "invite_accepted",
            title: "Invite Accepted",
            message: `${creator2.username} has accepted your invitation to join the studio!`,
            data: { creator_id: invite.creator_id, creator_username: creator2.username },
          });
        }
      }

      return NextResponse.json({ success: true, message: "Invite accepted" });
    } else {
      // Decline the invite
      await supabaseAdmin
        .from("studio_invites")
        .update({ status: "declined", responded_at: new Date().toISOString() })
        .eq("id", inviteId);

      return NextResponse.json({ success: true, message: "Invite declined" });
    }
  } catch (error: any) {
    console.error("Error responding to studio invite:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE - Cancel an invite (studios only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ inviteId: string }> }
) {
  try {
    const { inviteId } = await params;
    const supabase = await getSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get dashboard user
    const { data: dashboardUser } = await supabaseAdmin
      .from("dashboard_users")
      .select("id, role, studio_id")
      .eq("auth_user_id", user.id)
      .single();

    if (!dashboardUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get the invite
    const { data: invite } = await supabaseAdmin
      .from("studio_invites")
      .select("*")
      .eq("id", inviteId)
      .single();

    if (!invite) {
      return NextResponse.json({ error: "Invite not found" }, { status: 404 });
    }

    // Check authorization
    const isBusiness = dashboardUser.role === "business" && dashboardUser.studio_id === invite.studio_id;
    const isAdmin = dashboardUser.role === "admin";

    if (!isBusiness && !isAdmin) {
      return NextResponse.json({ error: "Not authorized to cancel this invite" }, { status: 403 });
    }

    if (invite.status !== "pending") {
      return NextResponse.json({ error: "Only pending invites can be cancelled" }, { status: 400 });
    }

    // Cancel the invite
    await supabaseAdmin
      .from("studio_invites")
      .update({ status: "cancelled", responded_at: new Date().toISOString() })
      .eq("id", inviteId);

    return NextResponse.json({ success: true, message: "Invite cancelled" });
  } catch (error: any) {
    console.error("Error cancelling studio invite:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

