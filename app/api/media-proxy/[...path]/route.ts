import { NextRequest, NextResponse } from "next/server";

// Media API URL (server-side only - not exposed to client)
const MEDIA_API_URL = process.env.NEXT_PUBLIC_MEDIA_API_URL || "http://143.110.128.83:3002";

/**
 * Proxy all requests to the Media API
 * This avoids mixed content errors (HTTPS site -> HTTP media API)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const pathString = path.join("/");
  const url = new URL(request.url);
  const queryString = url.search;
  
  // Get API key from request headers
  const apiKey = request.headers.get("X-API-Key");
  
  try {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    
    if (apiKey) {
      headers["X-API-Key"] = apiKey;
    }
    
    const response = await fetch(`${MEDIA_API_URL}/${pathString}${queryString}`, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.error || "Media API error", success: false },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(`Media API proxy error [GET /${pathString}]:`, error);
    return NextResponse.json(
      { error: "Cannot connect to Media API", success: false },
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
  
  // Get API key from request headers
  const apiKey = request.headers.get("X-API-Key");
  const contentType = request.headers.get("content-type") || "";
  
  try {
    const headers: HeadersInit = {};
    
    if (apiKey) {
      headers["X-API-Key"] = apiKey;
    }
    
    let body: FormData | string;
    
    // Handle multipart form data (file uploads)
    if (contentType.includes("multipart/form-data")) {
      body = await request.formData();
      // Don't set Content-Type - let fetch set it with boundary
    } else if (contentType.includes("application/json")) {
      headers["Content-Type"] = "application/json";
      body = JSON.stringify(await request.json());
    } else {
      headers["Content-Type"] = "application/json";
      body = await request.text();
    }

    const response = await fetch(`${MEDIA_API_URL}/${pathString}`, {
      method: "POST",
      headers,
      body,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.error || "Media API error", success: false },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(`Media API proxy error [POST /${pathString}]:`, error);
    return NextResponse.json(
      { error: "Cannot connect to Media API", success: false },
      { status: 503 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const pathString = path.join("/");
  
  const apiKey = request.headers.get("X-API-Key");
  
  try {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    
    if (apiKey) {
      headers["X-API-Key"] = apiKey;
    }
    
    const body = await request.json();

    const response = await fetch(`${MEDIA_API_URL}/${pathString}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.error || "Media API error", success: false },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(`Media API proxy error [PATCH /${pathString}]:`, error);
    return NextResponse.json(
      { error: "Cannot connect to Media API", success: false },
      { status: 503 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const pathString = path.join("/");
  
  const apiKey = request.headers.get("X-API-Key");
  const contentType = request.headers.get("content-type") || "";
  
  try {
    const headers: HeadersInit = {};
    
    if (apiKey) {
      headers["X-API-Key"] = apiKey;
    }
    
    let fetchOptions: RequestInit = {
      method: "DELETE",
      headers,
    };
    
    // Handle body for batch deletes
    if (contentType.includes("application/json")) {
      headers["Content-Type"] = "application/json";
      const body = await request.json();
      fetchOptions.body = JSON.stringify(body);
    }

    const response = await fetch(`${MEDIA_API_URL}/${pathString}`, fetchOptions);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.error || "Media API error", success: false },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(`Media API proxy error [DELETE /${pathString}]:`, error);
    return NextResponse.json(
      { error: "Cannot connect to Media API", success: false },
      { status: 503 }
    );
  }
}

