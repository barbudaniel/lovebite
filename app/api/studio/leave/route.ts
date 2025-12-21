import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getSupabaseServerClient } from "@/lib/supabase/server";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// POST - Leave current studio (for models)
export async function POST(request: NextRequest) {
  try {
    const supabase = await getSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get dashboard user
    const { data: dashboardUser } = await supabaseAdmin
      .from("dashboard_users")
      .select("id, role, creator_id")
      .eq("auth_user_id", user.id)
      .single();

    if (!dashboardUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (dashboardUser.role !== "model" || !dashboardUser.creator_id) {
      return NextResponse.json({ error: "Only models can leave studios" }, { status: 403 });
    }

    // Get creator's current studio
    const { data: creator } = await supabaseAdmin
      .from("creators")
      .select("id, username, studio_id, studio:studios(id, name)")
      .eq("id", dashboardUser.creator_id)
      .single();

    if (!creator) {
      return NextResponse.json({ error: "Creator not found" }, { status: 404 });
    }

    if (!creator.studio_id) {
      return NextResponse.json({ error: "You are not part of any studio" }, { status: 400 });
    }

    const studioId = creator.studio_id;
    const studioName = (creator.studio as any)?.name || "the studio";

    // Remove from studio
    await supabaseAdmin
      .from("creators")
      .update({ studio_id: null })
      .eq("id", dashboardUser.creator_id);

    // Notify the studio
    const { data: studioUsers } = await supabaseAdmin
      .from("dashboard_users")
      .select("id")
      .eq("studio_id", studioId)
      .eq("role", "studio");

    if (studioUsers) {
      for (const studioUser of studioUsers) {
        await supabaseAdmin.from("notifications").insert({
          user_id: studioUser.id,
          type: "model_left",
          title: "Model Left Studio",
          message: `${creator.username} has left ${studioName}.`,
          data: { creator_id: creator.id, creator_username: creator.username },
        });
      }
    }

    return NextResponse.json({ success: true, message: `You have left ${studioName}` });
  } catch (error: any) {
    console.error("Error leaving studio:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

