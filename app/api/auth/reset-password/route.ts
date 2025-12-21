import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { getSupabaseServiceRoleClient } from "@/lib/supabase";
import { getPasswordChangedHtml } from "@/lib/email-templates";

const resend = new Resend(process.env.RESEND_API_KEY);
const supabase = getSupabaseServiceRoleClient();

export async function POST(request: NextRequest) {
  try {
    const { email, code, newPassword } = await request.json();

    if (!email || !code || !newPassword) {
      return NextResponse.json({ error: "Email, code, and new password are required" }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    // Find the verification code
    const { data: verificationCode, error: findError } = await supabase
      .from("verification_codes")
      .select("*, user_id")
      .eq("email", email)
      .eq("code", code)
      .eq("type", "password_reset")
      .is("used_at", null)
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (findError || !verificationCode) {
      return NextResponse.json({ error: "Invalid or expired reset code" }, { status: 400 });
    }

    // Get the dashboard user to find the auth user
    const { data: dashboardUser, error: userError } = await supabase
      .from("dashboard_users")
      .select("id, auth_user_id, display_name, email")
      .eq("email", email)
      .maybeSingle();

    if (userError || !dashboardUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!dashboardUser.auth_user_id) {
      return NextResponse.json({ error: "User authentication not configured" }, { status: 400 });
    }

    // Update password in Supabase Auth
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      dashboardUser.auth_user_id,
      { password: newPassword }
    );

    if (updateError) {
      console.error("Error updating password:", updateError);
      return NextResponse.json({ error: "Failed to update password" }, { status: 500 });
    }

    // Mark code as used
    await supabase
      .from("verification_codes")
      .update({ used_at: new Date().toISOString() })
      .eq("id", verificationCode.id);

    // Invalidate all other password reset codes for this email
    await supabase
      .from("verification_codes")
      .update({ used_at: new Date().toISOString() })
      .eq("email", email)
      .eq("type", "password_reset")
      .is("used_at", null);

    // Send confirmation email
    const name = dashboardUser.display_name || "User";
    const htmlContent = getPasswordChangedHtml(name);
    await resend.emails.send({
      from: "Lovebite <security@lovebite.fans>",
      to: email,
      subject: "Your Lovebite password has been changed",
      html: htmlContent,
    }).catch(err => {
      console.error("Failed to send password changed email:", err);
      // Don't fail the reset for this
    });

    return NextResponse.json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Error resetting password:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Verify code without resetting (for UI validation)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    const code = searchParams.get("code");

    if (!email || !code) {
      return NextResponse.json({ error: "Email and code are required" }, { status: 400 });
    }

    const { data: verificationCode } = await supabase
      .from("verification_codes")
      .select("id")
      .eq("email", email)
      .eq("code", code)
      .eq("type", "password_reset")
      .is("used_at", null)
      .gt("expires_at", new Date().toISOString())
      .limit(1)
      .maybeSingle();

    return NextResponse.json({
      valid: !!verificationCode,
    });
  } catch (error) {
    console.error("Error verifying code:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

