import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const BOT_API_URL = process.env.NEXT_PUBLIC_BOT_API_URL || "http://143.110.128.83:3001";

// Use service role for cron jobs
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * GET /api/whatsapp/cron
 * 
 * This endpoint processes scheduled messages.
 * It should be called by a cron job every minute.
 * 
 * For Vercel, add to vercel.json:
 * {
 *   "crons": [{
 *     "path": "/api/whatsapp/cron",
 *     "schedule": "* * * * *"
 *   }]
 * }
 */
export async function GET(request: NextRequest) {
  try {
    // Verify cron secret for security
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;
    
    // Allow local development without secret
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      // Also check for Vercel's cron header
      const vercelCronHeader = request.headers.get("x-vercel-cron");
      if (!vercelCronHeader) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const now = new Date().toISOString();
    
    // Find all messages that should be sent now
    const { data: dueMessages, error: fetchError } = await supabase
      .from("whatsapp_scheduled_messages")
      .select(`
        id,
        template_id,
        group_id,
        message_content,
        schedule_type,
        schedule_time,
        schedule_day_of_week,
        schedule_day_of_month,
        timezone,
        group:whatsapp_groups(whatsapp_id, name)
      `)
      .eq("is_active", true)
      .lte("next_run_at", now)
      .order("next_run_at", { ascending: true })
      .limit(10); // Process max 10 at a time to prevent timeout

    if (fetchError) {
      console.error("Error fetching due messages:", fetchError);
      return NextResponse.json({ error: "Failed to fetch scheduled messages" }, { status: 500 });
    }

    if (!dueMessages || dueMessages.length === 0) {
      return NextResponse.json({ 
        success: true, 
        message: "No messages due",
        processed: 0 
      });
    }

    console.log(`📅 Processing ${dueMessages.length} scheduled message(s)`);

    const results: { id: string; success: boolean; error?: string }[] = [];

    for (const msg of dueMessages) {
      try {
        const group = msg.group as any;
        
        if (!group?.whatsapp_id) {
          console.error(`No WhatsApp ID for scheduled message ${msg.id}`);
          results.push({ id: msg.id, success: false, error: "No WhatsApp group ID" });
          continue;
        }

        // Send the message via the bot
        const response = await fetch(`${BOT_API_URL}/send-message`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            groupId: group.whatsapp_id,
            message: msg.message_content,
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          console.error(`Failed to send scheduled message ${msg.id}:`, result.error);
          results.push({ id: msg.id, success: false, error: result.error });
          continue;
        }

        console.log(`✅ Sent scheduled message ${msg.id} to ${group.name || group.whatsapp_id}`);

        // Log to history
        await supabase.from("whatsapp_message_history").insert({
          template_id: msg.template_id,
          group_id: msg.group_id,
          whatsapp_group_id: group.whatsapp_id,
          message_content: msg.message_content,
          status: "sent",
          metadata: {
            scheduled: true,
            schedule_type: msg.schedule_type,
          },
        });

        // Update the scheduled message
        if (msg.schedule_type === "once") {
          // One-time message: deactivate after sending
          await supabase
            .from("whatsapp_scheduled_messages")
            .update({
              is_active: false,
              last_sent_at: now,
              send_count: 1,
            })
            .eq("id", msg.id);
        } else {
          // Recurring message: update counts and next_run_at will be auto-calculated by trigger
          await supabase
            .from("whatsapp_scheduled_messages")
            .update({
              last_sent_at: now,
              send_count: (msg as any).send_count + 1,
            })
            .eq("id", msg.id);
        }

        results.push({ id: msg.id, success: true });
      } catch (err) {
        console.error(`Error processing scheduled message ${msg.id}:`, err);
        results.push({ 
          id: msg.id, 
          success: false, 
          error: err instanceof Error ? err.message : "Unknown error" 
        });
      }
    }

    const successful = results.filter((r) => r.success).length;
    const failed = results.filter((r) => !r.success).length;

    return NextResponse.json({
      success: true,
      message: `Processed ${dueMessages.length} messages: ${successful} sent, ${failed} failed`,
      processed: dueMessages.length,
      results,
    });
  } catch (error) {
    console.error("Cron error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

