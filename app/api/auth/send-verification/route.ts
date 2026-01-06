import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { getSupabaseAdminClient } from "@/lib/supabase-server";
import { getEmailVerificationHtml } from "@/lib/email-templates";

const resend = new Resend(process.env.RESEND_API_KEY);
const supabase = getSupabaseAdminClient();

// Generate a 6-digit verification code
function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Check if there's a recent unexpired code
    const { data: existingCode } = await supabase
      .from("verification_codes")
      .select("*")
      .eq("email", email)
      .eq("type", "email_verification")
      .is("used_at", null)
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    // Rate limit: don't allow new code if one was sent in last 60 seconds
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
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Save to database
    const { error: insertError } = await supabase
      .from("verification_codes")
      .insert({
        email,
        code,
        type: "email_verification",
        expires_at: expiresAt.toISOString(),
        metadata: { name },
      });

    if (insertError) {
      console.error("Error saving verification code:", insertError);
      return NextResponse.json({ error: "Failed to generate verification code" }, { status: 500 });
    }

    // Send email
    const htmlContent = getEmailVerificationHtml(code, name);
    const { error: emailError } = await resend.emails.send({
      from: "Lovdash <noreply@lovdash.com>",
      to: email,
      subject: `${code} is your Lovdash verification code`,
      html: htmlContent,
    });

    if (emailError) {
      console.error("Resend error:", emailError);
      return NextResponse.json({ error: "Failed to send verification email" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Verification code sent",
      expiresAt: expiresAt.toISOString(),
    });
  } catch (error) {
    console.error("Error sending verification:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

