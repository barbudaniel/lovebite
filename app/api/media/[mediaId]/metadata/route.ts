import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// ============================================
// TYPES
// ============================================

interface MediaMetadata {
  id?: string;
  media_id: string;
  creator_id?: string;
  media_type: string;
  is_nsfw: boolean;
  style: string | null;
  source_type: string;
  body_focus: string[];
  content_tags: string[];
  photo_description: string | null;
  categories: string[];
  storage_url: string;
  thumbnail_url?: string | null;
  original_filename?: string | null;
  pinecone_id?: string | null;
  pinecone_synced_at?: string | null;
  rerank_score?: number;
}

interface PineconeMatch {
  id: string;
  score: number;
  metadata: {
    body_focus?: string[];
    content_tags?: string[];
    creator_username?: string;
    is_nsfw?: boolean;
    media_type?: string;
    photo_description?: string;
    rerank_score?: number;
    source_type?: string;
    style?: string;
    url?: string;
  };
}

// ============================================
// PINECONE CLIENT
// ============================================

const PINECONE_API_KEY = process.env.PINECONE_API_KEY || "pcsk_4iVFme_UbLJhwjUvfrHysQNCXrLvM8kaxgShCoXm93xaNTV1ZokR1iWi3BpsbpW9nnFMR4";
const PINECONE_INDEX_HOST = process.env.PINECONE_INDEX_HOST || "https://media-qb2hny3.svc.aped-4627-b74a.pinecone.io";

// Generate vector ID from URL (same as main API)
function getVectorIdFromUrl(storageUrl: string): string {
  const crypto = require('crypto');
  return crypto.createHash('md5').update(storageUrl).digest('hex');
}

async function queryPineconeByUrl(url: string): Promise<PineconeMatch | null> {
  try {
    // First try to fetch by vector ID (faster)
    const vectorId = getVectorIdFromUrl(url);
    
    const response = await fetch(`${PINECONE_INDEX_HOST}/vectors/fetch?ids=${vectorId}`, {
      method: "GET",
      headers: {
        "Api-Key": PINECONE_API_KEY,
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      if (data.vectors && data.vectors[vectorId]) {
        return {
          id: vectorId,
          score: 1,
          metadata: data.vectors[vectorId].metadata,
        };
      }
    }

    // Fallback: Query by metadata filter
    const queryResponse = await fetch(`${PINECONE_INDEX_HOST}/query`, {
      method: "POST",
      headers: {
        "Api-Key": PINECONE_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        topK: 1,
        filter: {
          url: { "$eq": url },
        },
        includeMetadata: true,
        includeValues: false,
        vector: new Array(1536).fill(0), // Dummy vector for metadata-only query
      }),
    });

    if (!queryResponse.ok) {
      console.error("Pinecone query failed:", await queryResponse.text());
      return null;
    }

    const queryData = await queryResponse.json();
    if (queryData.matches && queryData.matches.length > 0) {
      return queryData.matches[0];
    }
    return null;
  } catch (error) {
    console.error("Error querying Pinecone:", error);
    return null;
  }
}

async function updatePineconeMetadata(
  pineconeId: string,
  metadata: Partial<PineconeMatch["metadata"]>
): Promise<boolean> {
  try {
    const response = await fetch(`${PINECONE_INDEX_HOST}/vectors/update`, {
      method: "POST",
      headers: {
        "Api-Key": PINECONE_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: pineconeId,
        setMetadata: metadata,
      }),
    });

    if (!response.ok) {
      console.error("Pinecone update failed:", await response.text());
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error updating Pinecone:", error);
    return false;
  }
}

// ============================================
// GET - Fetch metadata from Supabase/Pinecone
// ============================================

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ mediaId: string }> }
) {
  const { mediaId } = await params;
  const { searchParams } = new URL(request.url);
  const storageUrl = searchParams.get("url");

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    // First check if metadata exists in Supabase
    const { data: existingMetadata, error } = await supabase
      .from("media_metadata")
      .select("*")
      .eq("media_id", mediaId)
      .maybeSingle();

    if (error && error.code !== "PGRST116") {
      throw error;
    }

    if (existingMetadata) {
      return NextResponse.json({
        success: true,
        data: existingMetadata,
        source: "supabase",
      });
    }

    // If not in Supabase, try to fetch from Pinecone
    if (storageUrl) {
      const pineconeMatch = await queryPineconeByUrl(storageUrl);

      if (pineconeMatch) {
        const metadata: MediaMetadata = {
          media_id: mediaId,
          media_type: pineconeMatch.metadata.media_type || "photo",
          is_nsfw: pineconeMatch.metadata.is_nsfw || false,
          style: pineconeMatch.metadata.style || null,
          source_type: pineconeMatch.metadata.source_type || "upload",
          body_focus: pineconeMatch.metadata.body_focus || [],
          content_tags: pineconeMatch.metadata.content_tags || [],
          photo_description: pineconeMatch.metadata.photo_description || null,
          categories: [], // Will be populated from content_tags
          storage_url: storageUrl,
          pinecone_id: pineconeMatch.id,
          pinecone_synced_at: new Date().toISOString(),
          rerank_score: pineconeMatch.metadata.rerank_score || pineconeMatch.score,
        };

        // Extract categories from content_tags
        const categoryKeywords = ["lingerie", "bikini", "nude", "feet", "casual", "cosplay", "fitness", "outdoor", "indoor", "professional", "selfie", "ppv"];
        metadata.categories = (pineconeMatch.metadata.content_tags || [])
          .filter(tag => categoryKeywords.some(kw => tag.toLowerCase().includes(kw)))
          .map(tag => tag.charAt(0).toUpperCase() + tag.slice(1).toLowerCase());

        // Save to Supabase for future queries
        const { data: savedMetadata, error: saveError } = await supabase
          .from("media_metadata")
          .insert(metadata)
          .select()
          .single();

        if (saveError) {
          console.error("Error saving metadata to Supabase:", saveError);
          // Return Pinecone data anyway
          return NextResponse.json({
            success: true,
            data: metadata,
            source: "pinecone",
          });
        }

        return NextResponse.json({
          success: true,
          data: savedMetadata,
          source: "pinecone_synced",
        });
      }
    }

    // No metadata found anywhere
    return NextResponse.json({
      success: true,
      data: null,
      source: "none",
    });
  } catch (error: any) {
    console.error("Error fetching metadata:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch metadata" },
      { status: 500 }
    );
  }
}

// ============================================
// PUT - Update metadata in Supabase and Pinecone
// ============================================

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ mediaId: string }> }
) {
  const { mediaId } = await params;
  const body = await request.json();

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    // Get existing metadata
    const { data: existingMetadata, error: fetchError } = await supabase
      .from("media_metadata")
      .select("*")
      .eq("media_id", mediaId)
      .maybeSingle();

    if (fetchError && fetchError.code !== "PGRST116") {
      throw fetchError;
    }

    const updateData: Partial<MediaMetadata> = {
      is_nsfw: body.is_nsfw,
      style: body.style,
      body_focus: body.body_focus || [],
      content_tags: body.content_tags || [],
      photo_description: body.photo_description,
      categories: body.categories || [],
    };

    let savedMetadata;

    if (existingMetadata) {
      // Update existing metadata
      const { data, error } = await supabase
        .from("media_metadata")
        .update(updateData)
        .eq("media_id", mediaId)
        .select()
        .single();

      if (error) throw error;
      savedMetadata = data;

      // Update Pinecone if we have a pinecone_id
      if (existingMetadata.pinecone_id) {
        await updatePineconeMetadata(existingMetadata.pinecone_id, {
          is_nsfw: body.is_nsfw,
          style: body.style,
          body_focus: body.body_focus || [],
          content_tags: body.content_tags || [],
          photo_description: body.photo_description,
        });
      }
    } else {
      // Insert new metadata
      const insertData: MediaMetadata = {
        media_id: mediaId,
        media_type: body.media_type || "photo",
        storage_url: body.storage_url || "",
        ...updateData,
      };

      const { data, error } = await supabase
        .from("media_metadata")
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;
      savedMetadata = data;
    }

    return NextResponse.json({
      success: true,
      data: savedMetadata,
    });
  } catch (error: any) {
    console.error("Error updating metadata:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update metadata" },
      { status: 500 }
    );
  }
}

// ============================================
// POST - Sync metadata from Pinecone
// ============================================

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ mediaId: string }> }
) {
  const { mediaId } = await params;
  const body = await request.json();
  const { storageUrl, forceSync } = body;

  if (!storageUrl) {
    return NextResponse.json(
      { success: false, error: "storageUrl is required" },
      { status: 400 }
    );
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    // Check if metadata already exists
    if (!forceSync) {
      const { data: existingMetadata } = await supabase
        .from("media_metadata")
        .select("*")
        .eq("media_id", mediaId)
        .maybeSingle();

      if (existingMetadata) {
        return NextResponse.json({
          success: true,
          data: existingMetadata,
          source: "supabase_cached",
        });
      }
    }

    // Query Pinecone
    const pineconeMatch = await queryPineconeByUrl(storageUrl);

    if (!pineconeMatch) {
      return NextResponse.json({
        success: true,
        data: null,
        source: "pinecone_not_found",
        message: "No metadata found in Pinecone for this media",
      });
    }

    // Prepare metadata
    const metadata: MediaMetadata = {
      media_id: mediaId,
      media_type: pineconeMatch.metadata.media_type || "photo",
      is_nsfw: pineconeMatch.metadata.is_nsfw || false,
      style: pineconeMatch.metadata.style || null,
      source_type: pineconeMatch.metadata.source_type || "upload",
      body_focus: pineconeMatch.metadata.body_focus || [],
      content_tags: pineconeMatch.metadata.content_tags || [],
      photo_description: pineconeMatch.metadata.photo_description || null,
      categories: [],
      storage_url: storageUrl,
      pinecone_id: pineconeMatch.id,
      pinecone_synced_at: new Date().toISOString(),
      rerank_score: pineconeMatch.metadata.rerank_score || pineconeMatch.score,
    };

    // Extract categories
    const categoryKeywords = ["lingerie", "bikini", "nude", "feet", "casual", "cosplay", "fitness", "outdoor", "indoor", "professional", "selfie", "ppv"];
    metadata.categories = (pineconeMatch.metadata.content_tags || [])
      .filter(tag => categoryKeywords.some(kw => tag.toLowerCase().includes(kw)))
      .map(tag => tag.charAt(0).toUpperCase() + tag.slice(1).toLowerCase());

    // Upsert to Supabase
    const { data: savedMetadata, error } = await supabase
      .from("media_metadata")
      .upsert(metadata, { onConflict: "media_id" })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data: savedMetadata,
      source: "pinecone_synced",
    });
  } catch (error: any) {
    console.error("Error syncing metadata:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to sync metadata" },
      { status: 500 }
    );
  }
}

