import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase-server";

/**
 * GET - List scheduled messages
 */
export async function GET() {
  try {
    const supabase = await getSupabaseServerClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: dashboardUser, error: userError } = await supabase
      .from("dashboard_users")
      .select("id, role, studio_id")
      .eq("auth_user_id", user.id)
      .eq("enabled", true)
      .single();

    if (userError || !dashboardUser) {
      return NextResponse.json({ error: "User not found" }, { status: 403 });
    }

    let query = supabase
      .from("whatsapp_scheduled_messages")
      .select(`
        id,
        template_id,
        group_id,
        message_content,
        schedule_type,
        scheduled_at,
        schedule_time,
        schedule_day_of_week,
        schedule_day_of_month,
        timezone,
        is_active,
        last_sent_at,
        next_run_at,
        send_count,
        created_at,
        template:whatsapp_message_templates(name, category),
        group:whatsapp_groups(name, type, whatsapp_id)
      `)
      .order("next_run_at", { ascending: true });

    // Non-admins only see their own scheduled messages
    if (dashboardUser.role !== "admin") {
      query = query.eq("created_by", dashboardUser.id);
    }

    const { data: scheduled, error } = await query;

    if (error) {
      console.error("Error fetching scheduled messages:", error);
      return NextResponse.json({ error: "Failed to fetch scheduled messages" }, { status: 500 });
    }

    return NextResponse.json({ scheduled });
  } catch (error) {
    console.error("Error in scheduled GET:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * POST - Create a scheduled message
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await getSupabaseServerClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: dashboardUser, error: userError } = await supabase
      .from("dashboard_users")
      .select("id, role")
      .eq("auth_user_id", user.id)
      .eq("enabled", true)
      .single();

    if (userError || !dashboardUser) {
      return NextResponse.json({ error: "User not found" }, { status: 403 });
    }

    if (!["admin", "business"].includes(dashboardUser.role)) {
      return NextResponse.json({ error: "Permission denied" }, { status: 403 });
    }

    const body = await request.json();
    const {
      groupId,
      message,
      templateId,
      scheduleType = "once",
      scheduledAt,
      scheduleTime,
      scheduleDayOfWeek,
      scheduleDayOfMonth,
      timezone = "Europe/Bucharest",
    } = body;

    if (!groupId || !message) {
      return NextResponse.json(
        { error: "Missing required fields: groupId and message" },
        { status: 400 }
      );
    }

    // Validate schedule type requirements
    if (scheduleType === "once" && !scheduledAt) {
      return NextResponse.json(
        { error: "scheduledAt is required for one-time schedules" },
        { status: 400 }
      );
    }

    if (["daily", "weekly", "monthly"].includes(scheduleType) && !scheduleTime) {
      return NextResponse.json(
        { error: "scheduleTime is required for recurring schedules" },
        { status: 400 }
      );
    }

    if (scheduleType === "weekly" && scheduleDayOfWeek === undefined) {
      return NextResponse.json(
        { error: "scheduleDayOfWeek is required for weekly schedules" },
        { status: 400 }
      );
    }

    if (scheduleType === "monthly" && !scheduleDayOfMonth) {
      return NextResponse.json(
        { error: "scheduleDayOfMonth is required for monthly schedules" },
        { status: 400 }
      );
    }

    const { data: scheduled, error } = await supabase
      .from("whatsapp_scheduled_messages")
      .insert({
        template_id: templateId || null,
        group_id: groupId,
        message_content: message,
        schedule_type: scheduleType,
        scheduled_at: scheduledAt || null,
        schedule_time: scheduleTime || null,
        schedule_day_of_week: scheduleDayOfWeek ?? null,
        schedule_day_of_month: scheduleDayOfMonth ?? null,
        timezone,
        created_by: dashboardUser.id,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating scheduled message:", error);
      return NextResponse.json({ error: "Failed to create scheduled message" }, { status: 500 });
    }

    return NextResponse.json({ scheduled }, { status: 201 });
  } catch (error) {
    console.error("Error in scheduled POST:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * PUT - Update a scheduled message
 */
export async function PUT(request: NextRequest) {
  try {
    const supabase = await getSupabaseServerClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: dashboardUser } = await supabase
      .from("dashboard_users")
      .select("id, role")
      .eq("auth_user_id", user.id)
      .eq("enabled", true)
      .single();

    if (!dashboardUser || !["admin", "business"].includes(dashboardUser.role)) {
      return NextResponse.json({ error: "Permission denied" }, { status: 403 });
    }

    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing scheduled message ID" }, { status: 400 });
    }

    // Map camelCase to snake_case
    const dbUpdateData: Record<string, unknown> = {};
    if (updateData.message !== undefined) dbUpdateData.message_content = updateData.message;
    if (updateData.scheduleType !== undefined) dbUpdateData.schedule_type = updateData.scheduleType;
    if (updateData.scheduledAt !== undefined) dbUpdateData.scheduled_at = updateData.scheduledAt;
    if (updateData.scheduleTime !== undefined) dbUpdateData.schedule_time = updateData.scheduleTime;
    if (updateData.scheduleDayOfWeek !== undefined) dbUpdateData.schedule_day_of_week = updateData.scheduleDayOfWeek;
    if (updateData.scheduleDayOfMonth !== undefined) dbUpdateData.schedule_day_of_month = updateData.scheduleDayOfMonth;
    if (updateData.timezone !== undefined) dbUpdateData.timezone = updateData.timezone;
    if (updateData.isActive !== undefined) dbUpdateData.is_active = updateData.isActive;

    const { data: scheduled, error } = await supabase
      .from("whatsapp_scheduled_messages")
      .update(dbUpdateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating scheduled message:", error);
      return NextResponse.json({ error: "Failed to update scheduled message" }, { status: 500 });
    }

    return NextResponse.json({ scheduled });
  } catch (error) {
    console.error("Error in scheduled PUT:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * DELETE - Delete a scheduled message
 */
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await getSupabaseServerClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: dashboardUser } = await supabase
      .from("dashboard_users")
      .select("id, role")
      .eq("auth_user_id", user.id)
      .eq("enabled", true)
      .single();

    if (!dashboardUser || !["admin", "business"].includes(dashboardUser.role)) {
      return NextResponse.json({ error: "Permission denied" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing scheduled message ID" }, { status: 400 });
    }

    const { error } = await supabase
      .from("whatsapp_scheduled_messages")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting scheduled message:", error);
      return NextResponse.json({ error: "Failed to delete scheduled message" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in scheduled DELETE:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

