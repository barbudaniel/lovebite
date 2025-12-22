import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

// Service role client for bypassing RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    
    // Create auth client to verify the session
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          },
        },
      }
    );

    // Get the authenticated user
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

    if (authError || !authUser) {
      return NextResponse.json(
        { error: "Not authenticated", details: authError?.message },
        { status: 401 }
      );
    }

    // Use service role to fetch user profile (bypasses RLS)
    // First try by auth_user_id
    let dashboardUser = null;
    
    const { data: userByAuthId, error: authIdError } = await supabaseAdmin
      .from("dashboard_users")
      .select("*")
      .eq("auth_user_id", authUser.id)
      .maybeSingle();

    if (userByAuthId) {
      dashboardUser = userByAuthId;
    } else {
      // Fallback: try by email
      const { data: userByEmail, error: emailError } = await supabaseAdmin
        .from("dashboard_users")
        .select("*")
        .eq("email", authUser.email)
        .maybeSingle();

      if (emailError) {
        console.error("Error fetching dashboard user by email:", emailError);
      }
      
      if (userByEmail) {
        dashboardUser = userByEmail;
        // Link auth_user_id if found by email
        await supabaseAdmin
          .from("dashboard_users")
          .update({ auth_user_id: authUser.id })
          .eq("id", userByEmail.id);
        
        dashboardUser.auth_user_id = authUser.id;
      }
    }

    if (authIdError && !dashboardUser) {
      console.error("Error fetching dashboard user:", authIdError);
      return NextResponse.json(
        { error: "Database error", details: authIdError.message },
        { status: 500 }
      );
    }

    if (!dashboardUser) {
      return NextResponse.json(
        { error: "User not found", needsSetup: true },
        { status: 404 }
      );
    }

    if (!dashboardUser.enabled) {
      return NextResponse.json(
        { error: "Account disabled" },
        { status: 403 }
      );
    }

    // Also fetch creator data if available
    let creator = null;
    if (dashboardUser.creator_id) {
      const { data: creatorData } = await supabaseAdmin
        .from("creators")
        .select("*")
        .eq("id", dashboardUser.creator_id)
        .single();
      
      creator = creatorData;
    }

    // Fetch API key based on role
    let apiKey = null;
    if (dashboardUser.role === "admin") {
      const { data: apiUser } = await supabaseAdmin
        .from("api_users")
        .select("api_key")
        .eq("role", "admin")
        .eq("enabled", true)
        .limit(1)
        .maybeSingle();
      
      apiKey = apiUser?.api_key || null;
    } else if (dashboardUser.role === "independent" && dashboardUser.creator_id) {
      const { data: apiUser } = await supabaseAdmin
        .from("api_users")
        .select("api_key")
        .eq("creator_id", dashboardUser.creator_id)
        .eq("enabled", true)
        .limit(1)
        .maybeSingle();
      
      if (apiUser?.api_key) {
        apiKey = apiUser.api_key;
      } else if (dashboardUser.studio_id) {
        const { data: studioApiUser } = await supabaseAdmin
          .from("api_users")
          .select("api_key")
          .eq("studio_id", dashboardUser.studio_id)
          .eq("enabled", true)
          .limit(1)
          .maybeSingle();
        
        apiKey = studioApiUser?.api_key || null;
      }
    } else if (dashboardUser.role === "business" && dashboardUser.studio_id) {
      const { data: apiUser } = await supabaseAdmin
        .from("api_users")
        .select("api_key")
        .eq("studio_id", dashboardUser.studio_id)
        .eq("enabled", true)
        .limit(1)
        .maybeSingle();
      
      apiKey = apiUser?.api_key || null;
    }

    return NextResponse.json({
      user: dashboardUser,
      creator,
      apiKey,
    });
  } catch (err) {
    console.error("Error in /api/auth/me:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

