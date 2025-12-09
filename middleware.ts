import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getCreatorByDomain } from '@/lib/creators';

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const pathname = request.nextUrl.pathname;

  // ============================================
  // CUSTOM DOMAIN ROUTING
  // ============================================

  // Check if this is a creator's custom domain
  const creator = getCreatorByDomain(hostname);
  if (creator) {
    // Root path -> show creator profile
    if (pathname === '/') {
      return NextResponse.rewrite(new URL(`/creator/${creator.id}`, request.url));
    }
    // Any other path -> redirect to root
    return NextResponse.redirect(new URL('/', request.url));
  }

  // bites.bio/:username -> /creator/:username
  if (hostname.includes('bites.bio')) {
    // Root path -> redirect to lovebite.fans
    if (pathname === '/') {
      return NextResponse.redirect('https://lovebite.fans');
    }
    // /:username -> rewrite to /creator/:username
    const username = pathname.slice(1); // Remove leading slash
    if (username && !username.includes('/')) {
      return NextResponse.rewrite(new URL(`/creator/${username}`, request.url));
    }
  }

  // Default: continue to the requested page
  return NextResponse.next();
}

// Configure which paths the middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

