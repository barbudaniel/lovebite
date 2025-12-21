import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const PINECONE_API_KEY = process.env.PINECONE_API_KEY || "pcsk_4iVFme_UbLJhwjUvfrHysQNCXrLvM8kaxgShCoXm93xaNTV1ZokR1iWi3BpsbpW9nnFMR4";
const PINECONE_INDEX_HOST = process.env.PINECONE_INDEX_HOST || "https://media-qb2hny3.svc.aped-4627-b74a.pinecone.io";

// ============================================
// GET - Fetch all available labels
// ============================================

export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabase
      .from("media_labels")
      .select("*")
      .order("usage_count", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Error fetching labels:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// ============================================
// POST - Create a new label
// ============================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, color, icon, createdBy } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, error: "Label name is required" },
        { status: 400 }
      );
    }

    // Normalize the label name (capitalize first letter)
    const normalizedName = name.trim().charAt(0).toUpperCase() + name.trim().slice(1).toLowerCase();

    const { data, error } = await supabase
      .from("media_labels")
      .insert({
        name: normalizedName,
        color: color || "#6366f1",
        icon: icon || "tag",
        created_by: createdBy || null,
      })
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          { success: false, error: "Label already exists" },
          { status: 409 }
        );
      }
      throw error;
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Error creating label:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// ============================================
// PUT - Update media labels (sync to all systems)
// ============================================

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { mediaId, labels, storageUrl, pineconeId } = body;

    if (!mediaId) {
      return NextResponse.json(
        { success: false, error: "mediaId is required" },
        { status: 400 }
      );
    }

    const normalizedLabels = (labels || []).map((l: string) => 
      l.trim().charAt(0).toUpperCase() + l.trim().slice(1).toLowerCase()
    );

    // 1. Update Supabase media_uploads category (primary label)
    const primaryLabel = normalizedLabels[0] || null;
    await supabase
      .from("media_uploads")
      .update({ category: primaryLabel })
      .eq("id", mediaId);

    // 2. Update Supabase media_metadata body_focus
    const { data: existingMetadata } = await supabase
      .from("media_metadata")
      .select("id, pinecone_id")
      .eq("media_id", mediaId)
      .maybeSingle();

    if (existingMetadata) {
      await supabase
        .from("media_metadata")
        .update({ 
          body_focus: normalizedLabels,
          updated_at: new Date().toISOString()
        })
        .eq("media_id", mediaId);
    } else {
      // Create metadata record if it doesn't exist
      await supabase
        .from("media_metadata")
        .insert({
          media_id: mediaId,
          body_focus: normalizedLabels,
          storage_url: storageUrl || "",
          media_type: "photo",
          is_nsfw: false,
          source_type: "upload",
          content_tags: [],
          categories: normalizedLabels,
        });
    }

    // 3. Update Pinecone if we have a pinecone_id
    const effectivePineconeId = pineconeId || existingMetadata?.pinecone_id;
    if (effectivePineconeId) {
      try {
        await fetch(`${PINECONE_INDEX_HOST}/vectors/update`, {
          method: "POST",
          headers: {
            "Api-Key": PINECONE_API_KEY,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: effectivePineconeId,
            setMetadata: {
              body_focus: normalizedLabels,
            },
          }),
        });
      } catch (pineconeError) {
        console.error("Error updating Pinecone:", pineconeError);
        // Don't fail the whole operation if Pinecone update fails
      }
    }

    // 4. Update label usage counts
    for (const label of normalizedLabels) {
      await supabase.rpc("increment_label_usage", { label_name: label }).catch(() => {
        // If RPC doesn't exist, update manually
        supabase
          .from("media_labels")
          .update({ usage_count: supabase.rpc("increment", { x: 1 }) })
          .eq("name", label);
      });
    }

    return NextResponse.json({ 
      success: true, 
      data: { 
        mediaId, 
        labels: normalizedLabels,
        pineconeUpdated: !!effectivePineconeId 
      } 
    });
  } catch (error: any) {
    console.error("Error updating labels:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// ============================================
// DELETE - Remove a label
// ============================================

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const labelId = searchParams.get("id");

    if (!labelId) {
      return NextResponse.json(
        { success: false, error: "Label ID is required" },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("media_labels")
      .delete()
      .eq("id", labelId);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting label:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}


