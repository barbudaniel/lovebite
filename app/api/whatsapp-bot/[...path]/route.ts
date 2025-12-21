import { NextRequest, NextResponse } from "next/server";

// WhatsApp Bot API URL (server-side only - not exposed to client)
const BOT_API_URL = process.env.NEXT_PUBLIC_BOT_API_URL || "http://143.110.128.83:3001";

/**
 * Proxy all requests to the WhatsApp bot API
 * This avoids mixed content errors (HTTPS site -> HTTP bot API)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const pathString = path.join("/");
  const url = new URL(request.url);
  const queryString = url.search;
  
  try {
    const response = await fetch(`${BOT_API_URL}/${pathString}${queryString}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: errorText || "Bot API error" },
        { status: response.status }
      );
    }

    // Check if response is an image (for QR codes)
    const contentType = response.headers.get("content-type") || "";
    
    if (contentType.includes("image/")) {
      const blob = await response.blob();
      return new NextResponse(blob, {
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(`Bot API proxy error [GET /${pathString}]:`, error);
    return NextResponse.json(
      { error: "Cannot connect to WhatsApp bot API", offline: true },
      { status: 503 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const pathString = path.join("/");
  
  try {
    let body;
    const contentType = request.headers.get("content-type") || "";
    
    if (contentType.includes("application/json")) {
      body = await request.json();
    } else {
      body = await request.text();
    }

    const response = await fetch(`${BOT_API_URL}/${pathString}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: typeof body === "string" ? body : JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.error || "Bot API error" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(`Bot API proxy error [POST /${pathString}]:`, error);
    return NextResponse.json(
      { error: "Cannot connect to WhatsApp bot API", offline: true },
      { status: 503 }
    );
  }
}

