import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { sendWhatsAppMessage } from "@/lib/twilio";

/**
 * POST /api/twilio/send-message
 * 
 * Send a WhatsApp message via Twilio to a creator/studio/user
 * 
 * Body:
 * - entityType: 'creator' | 'studio' | 'user'
 * - entityId: string (UUID)
 * - message: string
 * - mediaUrl?: string (optional)
 * 
 * OR
 * 
 * - phoneNumber: string (direct phone number)
 * - message: string
 * - mediaUrl?: string (optional)
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Check authentication
    const {
      data: { session },
    } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Get user role
    const { data: user } = await supabase
      .from("dashboard_users")
      .select("role")
      .eq("auth_user_id", session.user.id)
      .single();
    
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Only administrators can send messages" },
        { status: 403 }
      );
    }
    
    const body = await request.json();
    const { entityType, entityId, phoneNumber, message, mediaUrl } = body;
    
    if (!message) {
      return NextResponse.json(
        { success: false, error: "Message is required" },
        { status: 400 }
      );
    }
    
    let targetPhone: string | null = null;
    let targetName: string | null = null;
    
    // If direct phone number is provided, use it
    if (phoneNumber) {
      targetPhone = phoneNumber;
      targetName = phoneNumber;
    } else if (entityType && entityId) {
      // Look up phone number from database
      let query;
      
      if (entityType === "creator") {
        query = supabase
          .from("creators")
          .select("phone_number, username")
          .eq("id", entityId)
          .single();
      } else if (entityType === "studio") {
        query = supabase
          .from("studios")
          .select("phone_number, name")
          .eq("id", entityId)
          .single();
      } else if (entityType === "user") {
        query = supabase
          .from("dashboard_users")
          .select("phone_number, email")
          .eq("id", entityId)
          .single();
      } else {
        return NextResponse.json(
          { success: false, error: "Invalid entity type" },
          { status: 400 }
        );
      }
      
      const { data, error } = await query;
      
      if (error || !data) {
        return NextResponse.json(
          { success: false, error: "Entity not found" },
          { status: 404 }
        );
      }
      
      targetPhone = data.phone_number;
      targetName = data.username || data.name || data.email;
      
      if (!targetPhone) {
        return NextResponse.json(
          { success: false, error: "No phone number configured for this entity" },
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json(
        { success: false, error: "Either phoneNumber or (entityType + entityId) is required" },
        { status: 400 }
      );
    }
    
    // Send message via Twilio
    const result = await sendWhatsAppMessage(targetPhone, message, mediaUrl);
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      messageId: result.messageId,
      sentTo: targetName,
    });
  } catch (error: any) {
    console.error("Send message error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to send message" },
      { status: 500 }
    );
  }
}

