import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

// ============================================
// PINECONE CONFIG
// ============================================

const PINECONE_API_KEY = process.env.PINECONE_API_KEY || "pcsk_4iVFme_UbLJhwjUvfrHysQNCXrLvM8kaxgShCoXm93xaNTV1ZokR1iWi3BpsbpW9nnFMR4";
const PINECONE_INDEX_HOST = process.env.PINECONE_INDEX_HOST || "https://media-qb2hny3.svc.aped-4627-b74a.pinecone.io";

// Generate vector ID from URL (same as main API)
function getVectorIdFromUrl(storageUrl: string): string {
  return crypto.createHash('md5').update(storageUrl).digest('hex');
}

interface PineconeVector {
  id: string;
  metadata?: {
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

async function fetchPineconeVectors(ids: string[]): Promise<Record<string, PineconeVector>> {
  if (ids.length === 0) return {};
  
  try {
    const response = await fetch(`${PINECONE_INDEX_HOST}/vectors/fetch?${ids.map(id => `ids=${id}`).join('&')}`, {
      method: "GET",
      headers: {
        "Api-Key": PINECONE_API_KEY,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error("Pinecone fetch failed:", await response.text());
      return {};
    }

    const data = await response.json();
    return data.vectors || {};
  } catch (error) {
    console.error("Error fetching from Pinecone:", error);
    return {};
  }
}

// ============================================
// POST - Batch sync media from Pinecone to Supabase
// ============================================

export async function POST(request: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    const body = await request.json();
    const { limit = 100, offset = 0, creator_id } = body;

    // Get media uploads that don't have metadata yet
    let query = supabase
      .from("media_uploads")
      .select("id, storage_url, category, creator_id, media_type, file_name")
      .range(offset, offset + limit - 1);
    
    if (creator_id) {
      query = query.eq("creator_id", creator_id);
    }

    const { data: mediaList, error: mediaError } = await query;

    if (mediaError) throw mediaError;

    if (!mediaList || mediaList.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No media to sync",
        synced: 0,
        notFound: 0,
      });
    }

    // Generate vector IDs for all media
    const vectorIds = mediaList.map((m) => getVectorIdFromUrl(m.storage_url));
    
    // Batch fetch from Pinecone (max 100 at a time)
    const batchSize = 100;
    const allVectors: Record<string, PineconeVector> = {};
    
    for (let i = 0; i < vectorIds.length; i += batchSize) {
      const batch = vectorIds.slice(i, i + batchSize);
      const vectors = await fetchPineconeVectors(batch);
      Object.assign(allVectors, vectors);
    }

    // Check which media already have metadata
    const { data: existingMetadata } = await supabase
      .from("media_metadata")
      .select("media_id")
      .in("media_id", mediaList.map(m => m.id));

    const existingMediaIds = new Set(existingMetadata?.map(m => m.media_id) || []);

    // Process results
    let synced = 0;
    let notFound = 0;
    let skipped = 0;
    const metadataToInsert: any[] = [];

    for (let i = 0; i < mediaList.length; i++) {
      const media = mediaList[i];
      const vectorId = vectorIds[i];
      const pineconeData = allVectors[vectorId];

      // Skip if already has metadata
      if (existingMediaIds.has(media.id)) {
        skipped++;
        continue;
      }

      if (pineconeData && pineconeData.metadata) {
        const metadata = pineconeData.metadata;
        
        // Extract categories from content_tags
        const categoryKeywords = ["lingerie", "bikini", "nude", "feet", "casual", "cosplay", "fitness", "outdoor", "indoor", "professional", "selfie", "ppv"];
        const categories = (metadata.content_tags || [])
          .filter(tag => categoryKeywords.some(kw => tag.toLowerCase().includes(kw)))
          .map(tag => tag.charAt(0).toUpperCase() + tag.slice(1).toLowerCase());

        metadataToInsert.push({
          media_id: media.id,
          creator_id: media.creator_id,
          media_type: media.media_type === "image" ? "photo" : media.media_type,
          is_nsfw: metadata.is_nsfw || false,
          style: metadata.style || null,
          source_type: metadata.source_type || "upload",
          body_focus: metadata.body_focus || [],
          content_tags: metadata.content_tags || [],
          photo_description: metadata.photo_description || null,
          categories: categories.length > 0 ? categories : (media.category ? [media.category] : []),
          storage_url: media.storage_url,
          pinecone_id: vectorId,
          pinecone_synced_at: new Date().toISOString(),
          rerank_score: metadata.rerank_score || 0,
        });
        synced++;
      } else {
        // Create basic metadata from existing data
        metadataToInsert.push({
          media_id: media.id,
          creator_id: media.creator_id,
          media_type: media.media_type === "image" ? "photo" : media.media_type,
          is_nsfw: false,
          style: null,
          source_type: "upload",
          body_focus: [],
          content_tags: media.category ? [media.category] : [],
          photo_description: null,
          categories: media.category ? [media.category] : [],
          storage_url: media.storage_url,
          pinecone_id: null,
          pinecone_synced_at: null,
          rerank_score: 0,
        });
        notFound++;
      }
    }

    // Batch insert metadata
    if (metadataToInsert.length > 0) {
      const { error: insertError } = await supabase
        .from("media_metadata")
        .insert(metadataToInsert);

      if (insertError) {
        console.error("Error inserting metadata:", insertError);
        throw insertError;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Synced ${synced} media with Pinecone, ${notFound} not found in Pinecone, ${skipped} already had metadata`,
      synced,
      notFound,
      skipped,
      total: mediaList.length,
    });
  } catch (error: any) {
    console.error("Error syncing media:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to sync media" },
      { status: 500 }
    );
  }
}

// ============================================
// GET - Get sync status
// ============================================

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    // Get total media count
    const { count: totalMedia } = await supabase
      .from("media_uploads")
      .select("*", { count: "exact", head: true });

    // Get synced metadata count
    const { count: syncedMedia } = await supabase
      .from("media_metadata")
      .select("*", { count: "exact", head: true });

    // Get metadata with Pinecone ID count
    const { count: withPinecone } = await supabase
      .from("media_metadata")
      .select("*", { count: "exact", head: true })
      .not("pinecone_id", "is", null);

    return NextResponse.json({
      success: true,
      data: {
        totalMedia: totalMedia || 0,
        syncedMetadata: syncedMedia || 0,
        withPinecone: withPinecone || 0,
        pending: (totalMedia || 0) - (syncedMedia || 0),
      },
    });
  } catch (error: any) {
    console.error("Error getting sync status:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to get sync status" },
      { status: 500 }
    );
  }
}



