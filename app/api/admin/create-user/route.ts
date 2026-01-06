import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createServerClient } from "@/lib/supabase";
import { getAccountCreatedHtml } from "@/lib/email-templates";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { email, password, fullName, sendWelcomeEmail = false } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    // Create user with admin API
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        full_name: fullName,
      },
    });

    if (error) {
      console.error("Error creating user:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    // Send welcome email with credentials if requested
    if (sendWelcomeEmail && data.user) {
      const name = fullName || email.split("@")[0];
      const dashboardUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "https://lovdash.com"}/dashboard`;
      
      const htmlContent = getAccountCreatedHtml(name, email, password, dashboardUrl);
      await resend.emails.send({
        from: "Lovdash <welcome@lovdash.com>",
        to: email,
        subject: "Your Lovdash account is ready!",
        html: htmlContent,
      }).catch(err => {
        console.error("Failed to send welcome email:", err);
        // Don't fail the request for email failure
      });
    }

    return NextResponse.json({ user: data.user });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

