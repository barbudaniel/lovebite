import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { getWelcomeHtml, getAccountCreatedHtml } from "@/lib/email-templates";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { to, name, tempPassword, dashboardUrl, type = "welcome" } = await request.json();

    if (!to || !name) {
      return NextResponse.json({ error: "Recipient email and name are required" }, { status: 400 });
    }

    const baseUrl = dashboardUrl || `${process.env.NEXT_PUBLIC_SITE_URL || "https://lovdash.com"}/dashboard`;
    
    let htmlContent: string;
    let subject: string;

    if (type === "account_created" && tempPassword) {
      // Account created with temporary password
      htmlContent = getAccountCreatedHtml(name, to, tempPassword, baseUrl);
      subject = `Your Lovdash account is ready!`;
    } else {
      // Regular welcome email
      htmlContent = getWelcomeHtml(name, baseUrl);
      subject = `Welcome to Lovdash, ${name}! 🎉`;
    }

    const { error: emailError } = await resend.emails.send({
      from: "Lovdash <welcome@lovdash.com>",
      to,
      subject,
      html: htmlContent,
    });

    if (emailError) {
      console.error("Resend error:", emailError);
      return NextResponse.json({ error: "Failed to send welcome email" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Welcome email sent",
    });
  } catch (error) {
    console.error("Error sending welcome email:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

