import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { sendVerificationCode, isValidPhoneNumber, formatPhoneNumber } from "@/lib/twilio";

/**
 * POST /api/twilio/verify-phone
 * 
 * Send a verification code to a phone number
 * 
 * Body:
 * - phoneNumber: string (in E.164 format)
 * - entityType: 'creator' | 'studio' | 'user'
 * - entityId: string (UUID)
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
    
    const body = await request.json();
    const { phoneNumber, entityType, entityId } = body;
    
    if (!phoneNumber || !entityType || !entityId) {
      return NextResponse.json(
        { success: false, error: "phoneNumber, entityType, and entityId are required" },
        { status: 400 }
      );
    }
    
    // Format and validate phone number
    const formattedPhone = formatPhoneNumber(phoneNumber);
    
    if (!isValidPhoneNumber(formattedPhone)) {
      return NextResponse.json(
        { success: false, error: "Invalid phone number format. Use E.164 format (e.g., +40712345678)" },
        { status: 400 }
      );
    }
    
    // Check authorization - user must be admin or must own the entity
    const { data: user } = await supabase
      .from("dashboard_users")
      .select("role, creator_id, studio_id")
      .eq("auth_user_id", session.user.id)
      .single();
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }
    
    // Authorization check
    const isAdmin = user.role === "admin";
    const isOwner =
      (entityType === "creator" && user.creator_id === entityId) ||
      (entityType === "studio" && user.studio_id === entityId) ||
      (entityType === "user" && user.auth_user_id === session.user.id);
    
    if (!isAdmin && !isOwner) {
      return NextResponse.json(
        { success: false, error: "You don't have permission to verify this phone number" },
        { status: 403 }
      );
    }
    
    // Generate and send verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    const result = await sendVerificationCode(formattedPhone);
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }
    
    // Store verification code in database with expiry
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    
    await supabase.from("phone_verifications").insert({
      phone_number: formattedPhone,
      verification_code: verificationCode,
      entity_type: entityType,
      entity_id: entityId,
      expires_at: expiresAt.toISOString(),
      attempts: 0,
    });
    
    return NextResponse.json({
      success: true,
      message: "Verification code sent",
      expiresAt: expiresAt.toISOString(),
    });
  } catch (error: any) {
    console.error("Verify phone error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to send verification code" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/twilio/verify-phone
 * 
 * Verify a phone number with the code
 * 
 * Body:
 * - phoneNumber: string
 * - code: string (6-digit code)
 * - entityType: 'creator' | 'studio' | 'user'
 * - entityId: string (UUID)
 */
export async function PUT(request: NextRequest) {
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
    
    const body = await request.json();
    const { phoneNumber, code, entityType, entityId } = body;
    
    if (!phoneNumber || !code || !entityType || !entityId) {
      return NextResponse.json(
        { success: false, error: "phoneNumber, code, entityType, and entityId are required" },
        { status: 400 }
      );
    }
    
    const formattedPhone = formatPhoneNumber(phoneNumber);
    
    // Check for verification record
    const { data: verification, error: verifyError } = await supabase
      .from("phone_verifications")
      .select("*")
      .eq("phone_number", formattedPhone)
      .eq("entity_type", entityType)
      .eq("entity_id", entityId)
      .eq("verified", false)
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(1)
      .single();
    
    if (verifyError || !verification) {
      return NextResponse.json(
        { success: false, error: "No active verification found or code expired" },
        { status: 404 }
      );
    }
    
    // Check attempts
    if (verification.attempts >= 3) {
      return NextResponse.json(
        { success: false, error: "Too many failed attempts. Please request a new code." },
        { status: 429 }
      );
    }
    
    // Verify code
    if (verification.verification_code !== code) {
      // Increment attempts
      await supabase
        .from("phone_verifications")
        .update({ attempts: verification.attempts + 1 })
        .eq("id", verification.id);
      
      return NextResponse.json(
        { success: false, error: "Invalid verification code" },
        { status: 400 }
      );
    }
    
    // Mark verification as complete
    await supabase
      .from("phone_verifications")
      .update({ verified: true, verified_at: new Date().toISOString() })
      .eq("id", verification.id);
    
    // Update entity with verified phone number
    const updateData = {
      phone_number: formattedPhone,
      phone_number_verified: true,
      phone_number_verified_at: new Date().toISOString(),
    };
    
    if (entityType === "creator") {
      await supabase.from("creators").update(updateData).eq("id", entityId);
    } else if (entityType === "studio") {
      await supabase.from("studios").update(updateData).eq("id", entityId);
    } else if (entityType === "user") {
      await supabase.from("dashboard_users").update(updateData).eq("id", entityId);
    }
    
    return NextResponse.json({
      success: true,
      message: "Phone number verified successfully",
    });
  } catch (error: any) {
    console.error("Verify code error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to verify code" },
      { status: 500 }
    );
  }
}

