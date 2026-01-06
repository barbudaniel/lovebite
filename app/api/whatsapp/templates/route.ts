import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase-server";

/**
 * GET - List all message templates
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await getSupabaseServerClient();
    
    // Get authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get dashboard user to check permissions
    const { data: dashboardUser, error: userError } = await supabase
      .from("dashboard_users")
      .select("id, role")
      .eq("auth_user_id", user.id)
      .eq("enabled", true)
      .single();

    if (userError || !dashboardUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 403 }
      );
    }

    // Build query based on role
    let query = supabase
      .from("whatsapp_message_templates")
      .select(`
        id,
        name,
        content,
        category,
        variables,
        is_active,
        use_count,
        created_by,
        created_at,
        updated_at
      `)
      .order("created_at", { ascending: false });

    // Non-admins only see active templates
    if (dashboardUser.role !== "admin") {
      query = query.eq("is_active", true);
    }

    const { data: templates, error } = await query;

    if (error) {
      console.error("Error fetching templates:", error);
      return NextResponse.json(
        { error: "Failed to fetch templates" },
        { status: 500 }
      );
    }

    return NextResponse.json({ templates });
  } catch (error) {
    console.error("Error in templates GET:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST - Create a new message template
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await getSupabaseServerClient();
    
    // Get authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get dashboard user to check permissions
    const { data: dashboardUser, error: userError } = await supabase
      .from("dashboard_users")
      .select("id, role")
      .eq("auth_user_id", user.id)
      .eq("enabled", true)
      .single();

    if (userError || !dashboardUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 403 }
      );
    }

    // Only admins can create templates
    if (dashboardUser.role !== "admin") {
      return NextResponse.json(
        { error: "Only admins can create templates" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, content, category = "general", variables = [] } = body;

    if (!name || !content) {
      return NextResponse.json(
        { error: "Missing required fields: name and content" },
        { status: 400 }
      );
    }

    const { data: template, error } = await supabase
      .from("whatsapp_message_templates")
      .insert({
        name,
        content,
        category,
        variables,
        created_by: dashboardUser.id,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating template:", error);
      return NextResponse.json(
        { error: "Failed to create template" },
        { status: 500 }
      );
    }

    return NextResponse.json({ template }, { status: 201 });
  } catch (error) {
    console.error("Error in templates POST:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PUT - Update a message template
 */
export async function PUT(request: NextRequest) {
  try {
    const supabase = await getSupabaseServerClient();
    
    // Get authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get dashboard user to check permissions
    const { data: dashboardUser, error: userError } = await supabase
      .from("dashboard_users")
      .select("id, role")
      .eq("auth_user_id", user.id)
      .eq("enabled", true)
      .single();

    if (userError || !dashboardUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 403 }
      );
    }

    // Only admins can update templates
    if (dashboardUser.role !== "admin") {
      return NextResponse.json(
        { error: "Only admins can update templates" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { id, name, content, category, variables, is_active } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Missing template ID" },
        { status: 400 }
      );
    }

    const updateData: Record<string, unknown> = {};
    if (name !== undefined) updateData.name = name;
    if (content !== undefined) updateData.content = content;
    if (category !== undefined) updateData.category = category;
    if (variables !== undefined) updateData.variables = variables;
    if (is_active !== undefined) updateData.is_active = is_active;

    const { data: template, error } = await supabase
      .from("whatsapp_message_templates")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating template:", error);
      return NextResponse.json(
        { error: "Failed to update template" },
        { status: 500 }
      );
    }

    return NextResponse.json({ template });
  } catch (error) {
    console.error("Error in templates PUT:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE - Delete a message template
 */
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await getSupabaseServerClient();
    
    // Get authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get dashboard user to check permissions
    const { data: dashboardUser, error: userError } = await supabase
      .from("dashboard_users")
      .select("id, role")
      .eq("auth_user_id", user.id)
      .eq("enabled", true)
      .single();

    if (userError || !dashboardUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 403 }
      );
    }

    // Only admins can delete templates
    if (dashboardUser.role !== "admin") {
      return NextResponse.json(
        { error: "Only admins can delete templates" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing template ID" },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("whatsapp_message_templates")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting template:", error);
      return NextResponse.json(
        { error: "Failed to delete template" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in templates DELETE:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}





