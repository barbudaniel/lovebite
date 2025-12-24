import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase-server";

const BOT_API_URL = process.env.NEXT_PUBLIC_BOT_API_URL || "http://143.110.128.83:3001";

/**
 * Send a message to a WhatsApp group
 */
export async function POST(request: NextRequest) {
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

    // Only admins and business users can send messages
    if (!["admin", "business"].includes(dashboardUser.role)) {
      return NextResponse.json(
        { error: "Permission denied" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { groupId, message, templateId } = body;

    if (!groupId || !message) {
      return NextResponse.json(
        { error: "Missing required fields: groupId and message" },
        { status: 400 }
      );
    }

    // Get the WhatsApp group details
    // groupId can be either UUID or WhatsApp JID (e.g., "120363405507077425@g.us")
    const isWhatsAppJid = groupId.includes("@g.us");
    
    // Try to find in database first
    const { data: group } = await supabase
      .from("whatsapp_groups")
      .select("id, whatsapp_id, name, type")
      .eq(isWhatsAppJid ? "whatsapp_id" : "id", groupId)
      .single();

    // If not in database, allow sending if it's a valid WhatsApp JID
    // This handles cases where groups haven't been synced yet
    const whatsappId = group?.whatsapp_id || (isWhatsAppJid ? groupId : null);
    
    if (!whatsappId) {
      return NextResponse.json(
        { error: "Invalid group ID. Must be a valid WhatsApp group ID (e.g., 123456789@g.us) or a synced group UUID." },
        { status: 400 }
      );
    }

    // For business users, verify they have access to this group (only if group is in database)
    if (dashboardUser.role === "business" && group) {
      // Check if the group belongs to their studio or one of their creators
      // Use the database UUID for access checks
      const { data: hasAccess } = await supabase
        .from("studios")
        .select("id")
        .eq("id", dashboardUser.studio_id)
        .eq("whatsapp_group_id", group.id)
        .single();

      if (!hasAccess) {
        const { data: creatorAccess } = await supabase
          .from("creators")
          .select("id")
          .eq("studio_id", dashboardUser.studio_id)
          .eq("whatsapp_group_id", group.id)
          .limit(1);

        if (!creatorAccess || creatorAccess.length === 0) {
          return NextResponse.json(
            { error: "You don't have access to this group" },
            { status: 403 }
          );
        }
      }
    }

    // Send the message via the bot API
    // Try the new /send-message endpoint first, fall back to /api/messages/send-group
    let botResponse;
    try {
      botResponse = await fetch(`${BOT_API_URL}/send-message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          groupId: whatsappId, // WhatsApp JID like "123456789@g.us"
          message: message,
        }),
      });
      
      // If 404, try the legacy endpoint
      if (botResponse.status === 404) {
        botResponse = await fetch(`${BOT_API_URL}/api/messages/send-group`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            groupId: whatsappId,
            message: message,
          }),
        });
      }
    } catch (fetchError) {
      console.error("Failed to connect to WhatsApp bot:", fetchError);
      return NextResponse.json(
        { error: "Failed to connect to WhatsApp bot" },
        { status: 503 }
      );
    }

    const botResult = await botResponse.json();

    // Log the message in history (only if we have a group record)
    if (group) {
      const { error: historyError } = await supabase
        .from("whatsapp_message_history")
        .insert({
          template_id: templateId || null,
          group_id: group.id, // Use the UUID from database
          whatsapp_group_id: group.whatsapp_id,
          sent_by: dashboardUser.id,
          message_content: message,
          status: botResponse.ok ? "sent" : "failed",
          error_message: botResponse.ok ? null : botResult.error,
          metadata: {
            group_name: group.name,
            group_type: group.type,
          },
        });

      if (historyError) {
        console.error("Failed to log message history:", historyError);
      }
    }

    // Update template use count if a template was used
    if (templateId) {
      await supabase.rpc("increment_template_use_count", { template_id: templateId });
    }

    if (!botResponse.ok) {
      return NextResponse.json(
        { error: botResult.error || "Failed to send message" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Message sent successfully",
      groupName: group?.name || whatsappId,
    });
  } catch (error) {
    console.error("Error sending WhatsApp message:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}


