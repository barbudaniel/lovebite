import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { getSupabaseAdminClient } from "@/lib/supabase-server";
import { getPasswordResetHtml } from "@/lib/email-templates";

const resend = new Resend(process.env.RESEND_API_KEY);
const supabase = getSupabaseAdminClient();

// Generate a 6-digit verification code
function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Check if user exists
    const { data: dashboardUser } = await supabase
      .from("dashboard_users")
      .select("id, display_name, email")
      .eq("email", email)
      .maybeSingle();

    // Always return success to prevent email enumeration attacks
    // But only send email if user exists
    if (!dashboardUser) {
      return NextResponse.json({
        success: true,
        message: "If an account exists with this email, you will receive a password reset code",
      });
    }

    // Check rate limit
    const { data: existingCode } = await supabase
      .from("verification_codes")
      .select("*")
      .eq("email", email)
      .eq("type", "password_reset")
      .is("used_at", null)
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (existingCode) {
      const createdAt = new Date(existingCode.created_at);
      const now = new Date();
      const secondsSinceLastCode = (now.getTime() - createdAt.getTime()) / 1000;
      
      if (secondsSinceLastCode < 60) {
        return NextResponse.json(
          { error: "Please wait before requesting another code", retryAfter: Math.ceil(60 - secondsSinceLastCode) },
          { status: 429 }
        );
      }
    }

    // Generate new code
    const code = generateCode();
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

    // Save to database
    const { error: insertError } = await supabase
      .from("verification_codes")
      .insert({
        email,
        code,
        type: "password_reset",
        expires_at: expiresAt.toISOString(),
        user_id: dashboardUser.id,
        metadata: { name: dashboardUser.display_name },
      });

    if (insertError) {
      console.error("Error saving reset code:", insertError);
      return NextResponse.json({ error: "Failed to generate reset code" }, { status: 500 });
    }

    // Generate reset link with code
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://lovdash.com";
    const resetLink = `${baseUrl}/dashboard/login/reset-password?email=${encodeURIComponent(email)}&code=${code}`;

    // Send email
    const htmlContent = getPasswordResetHtml(code, resetLink, dashboardUser.display_name);
    const { error: emailError } = await resend.emails.send({
      from: "Lovdash <security@lovdash.com>",
      to: email,
      subject: `${code} - Reset your Lovdash password`,
      html: htmlContent,
    });

    if (emailError) {
      console.error("Resend error:", emailError);
      return NextResponse.json({ error: "Failed to send reset email" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "If an account exists with this email, you will receive a password reset code",
      expiresAt: expiresAt.toISOString(),
    });
  } catch (error) {
    console.error("Error sending password reset:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

