import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { getSupabaseAdminClient } from "@/lib/supabase-server";
import { getWelcomeHtml } from "@/lib/email-templates";

const resend = new Resend(process.env.RESEND_API_KEY);
const supabase = getSupabaseAdminClient();

export async function POST(request: NextRequest) {
  try {
    const { email, code, sendWelcome = true } = await request.json();

    if (!email || !code) {
      return NextResponse.json({ error: "Email and code are required" }, { status: 400 });
    }

    // Find the verification code
    const { data: verificationCode, error: findError } = await supabase
      .from("verification_codes")
      .select("*")
      .eq("email", email)
      .eq("code", code)
      .eq("type", "email_verification")
      .is("used_at", null)
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (findError || !verificationCode) {
      return NextResponse.json({ error: "Invalid or expired verification code" }, { status: 400 });
    }

    // Mark code as used
    const { error: updateError } = await supabase
      .from("verification_codes")
      .update({ used_at: new Date().toISOString() })
      .eq("id", verificationCode.id);

    if (updateError) {
      console.error("Error marking code as used:", updateError);
    }

    // Update dashboard_user as verified
    const { data: dashboardUser, error: userError } = await supabase
      .from("dashboard_users")
      .update({
        email_verified: true,
        email_verified_at: new Date().toISOString(),
      })
      .eq("email", email)
      .select()
      .maybeSingle();

    if (userError) {
      console.error("Error updating user verification:", userError);
      // Don't fail - the code was verified, user might not exist yet
    }

    // Send welcome email if requested and user exists
    if (sendWelcome && dashboardUser) {
      const name = dashboardUser.display_name || "Creator";
      const dashboardUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "https://lovebite.fans"}/dashboard`;
      
      const htmlContent = getWelcomeHtml(name, dashboardUrl);
      await resend.emails.send({
        from: "Lovebite <welcome@lovebite.fans>",
        to: email,
        subject: `Welcome to Lovebite, ${name}! 🎉`,
        html: htmlContent,
      }).catch(err => {
        console.error("Failed to send welcome email:", err);
        // Don't fail the verification for this
      });
    }

    return NextResponse.json({
      success: true,
      message: "Email verified successfully",
      verified: true,
    });
  } catch (error) {
    console.error("Error verifying email:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

