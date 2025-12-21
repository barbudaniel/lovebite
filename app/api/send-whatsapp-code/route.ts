import { NextResponse } from "next/server";

const BOT_API_URL = process.env.NEXT_PUBLIC_BOT_API_URL || "http://143.110.128.83:3001";

export async function POST(request: Request) {
  try {
    const { phone, code } = await request.json();

    if (!phone || !code) {
      return NextResponse.json(
        { error: "Phone and code are required" },
        { status: 400 }
      );
    }

    // Check if bot is connected first
    try {
      const healthRes = await fetch(`${BOT_API_URL}/health`, {
        signal: AbortSignal.timeout(5000), // 5 second timeout
      });
      
      if (healthRes.ok) {
        const healthData = await healthRes.json();
        if (!healthData.whatsapp?.connected) {
          console.log("WhatsApp bot not connected");
          return NextResponse.json(
            { error: "WhatsApp bot offline - use dev code", offline: true },
            { status: 503 }
          );
        }
      }
    } catch (healthError) {
      console.log("Could not reach bot health endpoint:", healthError);
      return NextResponse.json(
        { error: "WhatsApp bot offline - use dev code", offline: true },
        { status: 503 }
      );
    }

    // Clean up phone number
    const cleanPhone = phone.replace(/\D/g, "");

    // Send via WhatsApp Bot API
    const response = await fetch(`${BOT_API_URL}/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phone: cleanPhone,
        message: `🔐 *Lovebite Dashboard Login*\n\nYour verification code is:\n\n*${code}*\n\nThis code expires in 5 minutes.\n\n_If you didn't request this, please ignore this message._`,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("WhatsApp API error:", errorData);
      throw new Error(errorData.error || "Failed to send WhatsApp message");
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to send WhatsApp code:", error);
    return NextResponse.json(
      { error: "Failed to send verification code" },
      { status: 500 }
    );
  }
}

