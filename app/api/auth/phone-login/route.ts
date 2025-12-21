import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export async function POST(request: Request) {
  try {
    const { phone } = await request.json();

    if (!phone) {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 }
      );
    }

    // Clean up phone number (remove non-digits except leading +)
    const cleanPhone = phone.startsWith("+") 
      ? "+" + phone.slice(1).replace(/\D/g, "")
      : phone.replace(/\D/g, "");

    // Look up user by phone in dashboard_users (try multiple formats)
    let dashboardUser = null;
    
    // Try with original format
    const { data: user1 } = await supabaseAdmin
      .from("dashboard_users")
      .select("auth_user_id, email, role, enabled")
      .eq("phone", cleanPhone)
      .single();
    
    if (user1) {
      dashboardUser = user1;
    } else {
      // Try without the + prefix
      const phoneWithoutPlus = cleanPhone.replace(/^\+/, "");
      const { data: user2 } = await supabaseAdmin
        .from("dashboard_users")
        .select("auth_user_id, email, role, enabled")
        .eq("phone", phoneWithoutPlus)
        .single();
      
      if (user2) {
        dashboardUser = user2;
      } else {
        // Try with + prefix if not present
        const phoneWithPlus = cleanPhone.startsWith("+") ? cleanPhone : "+" + cleanPhone;
        const { data: user3 } = await supabaseAdmin
          .from("dashboard_users")
          .select("auth_user_id, email, role, enabled")
          .eq("phone", phoneWithPlus)
          .single();
        
        dashboardUser = user3;
      }
    }

    if (!dashboardUser) {
      return NextResponse.json(
        { error: "No account found with this phone number" },
        { status: 404 }
      );
    }

    if (!dashboardUser.enabled) {
      return NextResponse.json(
        { error: "Account is disabled" },
        { status: 403 }
      );
    }

    if (!dashboardUser.auth_user_id) {
      return NextResponse.json(
        { error: "Account not properly configured" },
        { status: 500 }
      );
    }

    // Generate a session directly for this user using admin API
    const { data: sessionData, error: sessionError } = await supabaseAdmin.auth.admin.generateLink({
      type: "magiclink",
      email: dashboardUser.email,
    });

    if (sessionError) {
      console.error("Session generation error:", sessionError);
      return NextResponse.json(
        { error: "Failed to create session" },
        { status: 500 }
      );
    }

    // Return the hashed token for OTP verification
    const hashedToken = sessionData.properties?.hashed_token;
    
    return NextResponse.json({
      success: true,
      email: dashboardUser.email,
      token: hashedToken,
      type: "magiclink",
    });
  } catch (error) {
    console.error("Phone login error:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}

