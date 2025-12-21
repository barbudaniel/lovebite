import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase admin client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const BOT_API_URL = process.env.NEXT_PUBLIC_BOT_API_URL || "http://143.110.128.83:3001";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { creatorId, phoneNumber, channelType } = body;

    if (!creatorId || !phoneNumber) {
      return NextResponse.json(
        { error: "Creator ID and phone number are required" },
        { status: 400 }
      );
    }

    // Validate phone number format
    const cleanPhone = phoneNumber.replace(/[^\d+]/g, "");
    if (cleanPhone.length < 10 || !cleanPhone.startsWith("+")) {
      return NextResponse.json(
        { error: "Invalid phone number format. Include country code (e.g., +1234567890)" },
        { status: 400 }
      );
    }

    // Get creator details
    const { data: creator, error: creatorError } = await supabase
      .from("creators")
      .select("id, username, display_name, group_id")
      .eq("id", creatorId)
      .single();

    if (creatorError || !creator) {
      return NextResponse.json(
        { error: "Creator not found" },
        { status: 404 }
      );
    }

    // Format phone for WhatsApp (remove + and spaces)
    const whatsappPhone = cleanPhone.replace("+", "").replace(/\s/g, "");

    let groupId: string | null = null;
    let groupName: string | null = null;

    if (channelType === "group") {
      // Create a WhatsApp group via the bot API
      try {
        const groupResponse = await fetch(`${BOT_API_URL}/api/groups/create`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: `${creator.display_name || creator.username} - Media Upload`,
            participants: [whatsappPhone],
            creatorId: creator.id,
          }),
        });

        const groupData = await groupResponse.json();

        if (groupResponse.ok && groupData.success) {
          groupId = groupData.groupId;
          groupName = groupData.groupName || `${creator.username} - Media Upload`;

          // Update creator's group_id in database
          await supabase
            .from("creators")
            .update({ group_id: groupId })
            .eq("id", creatorId);
        } else {
          console.warn("Group creation failed:", groupData);
          // Continue without group - will use direct messages
        }
      } catch (groupErr) {
        console.error("Error creating group:", groupErr);
        // Continue without group
      }
    }

    // Register the phone number with the bot for direct messaging
    try {
      await fetch(`${BOT_API_URL}/api/creators/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          creatorId: creator.id,
          username: creator.username,
          phoneNumber: whatsappPhone,
          groupId: groupId,
          channelType: channelType,
        }),
      });
    } catch (botErr) {
      console.error("Error registering with bot:", botErr);
      // Continue - settings will be saved locally
    }

    // Save/update settings in Supabase
    const { error: settingsError } = await supabase
      .from("creator_whatsapp_settings")
      .upsert({
        creator_id: creatorId,
        phone_number: cleanPhone,
        channel_type: channelType,
        group_id: groupId,
        group_name: groupName,
        enabled: true,
        auto_upload: true,
        notify_on_upload: true,
      }, {
        onConflict: "creator_id",
      });

    if (settingsError) {
      console.error("Error saving settings:", settingsError);
      return NextResponse.json(
        { error: "Failed to save settings" },
        { status: 500 }
      );
    }

    // Send welcome message
    try {
      const welcomeMessage = channelType === "group"
        ? `✅ *WhatsApp Assistant Activated!*\n\nHi ${creator.display_name || creator.username}! Your media upload group has been created.\n\n📸 Send photos or videos here to upload them to your library.\n👥 You can add team members to help with uploads.\n\nType */help* for available commands.`
        : `✅ *WhatsApp Assistant Activated!*\n\nHi ${creator.display_name || creator.username}! You can now upload media directly.\n\n📸 Send photos or videos to upload them to your library.\n🤖 The bot will analyze and categorize your content automatically.\n\nType */help* for available commands.`;

      if (groupId) {
        await fetch(`${BOT_API_URL}/api/messages/send-group`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            groupId,
            message: welcomeMessage,
          }),
        });
      } else {
        await fetch(`${BOT_API_URL}/api/messages/send`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phone: whatsappPhone,
            message: welcomeMessage,
          }),
        });
      }
    } catch (msgErr) {
      console.warn("Failed to send welcome message:", msgErr);
    }

    return NextResponse.json({
      success: true,
      groupId,
      groupName,
      message: channelType === "group"
        ? "Group created successfully. Check WhatsApp!"
        : "Connected successfully. You can now send media!",
    });

  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Unregister endpoint
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const creatorId = searchParams.get("creatorId");

    if (!creatorId) {
      return NextResponse.json(
        { error: "Creator ID required" },
        { status: 400 }
      );
    }

    // Get current settings
    const { data: settings } = await supabase
      .from("creator_whatsapp_settings")
      .select("*")
      .eq("creator_id", creatorId)
      .single();

    // Notify bot API
    try {
      await fetch(`${BOT_API_URL}/api/creators/unregister`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ creatorId }),
      });
    } catch (err) {
      console.warn("Failed to notify bot:", err);
    }

    // Delete settings
    await supabase
      .from("creator_whatsapp_settings")
      .delete()
      .eq("creator_id", creatorId);

    return NextResponse.json({
      success: true,
      message: "WhatsApp channel disconnected",
    });

  } catch (error) {
    console.error("Unregister error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}



