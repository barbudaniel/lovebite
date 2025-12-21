import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { getCreatorByDomain } from '@/lib/creators';

export async function middleware(request: NextRequest) {
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

  // ============================================
  // SUPABASE SESSION REFRESH (for dashboard routes)
  // ============================================

  // Only process dashboard routes for auth
  if (pathname.startsWith('/dashboard')) {
    let response = NextResponse.next({
      request,
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => {
              request.cookies.set(name, value);
            });
            response = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options);
            });
          },
        },
      }
    );

    // Refresh session if expired - this is the key for keeping users logged in
    const { data: { session } } = await supabase.auth.getSession();

    // Protected routes - redirect to login if no session
    const isLoginPage = pathname === '/dashboard/login';
    const isSetupPage = pathname === '/dashboard/setup';
    
    if (!session && !isLoginPage && !isSetupPage) {
      const loginUrl = new URL('/dashboard/login', request.url);
      return NextResponse.redirect(loginUrl);
    }

    // If logged in and trying to access login page, redirect to dashboard
    if (session && isLoginPage) {
      const dashboardUrl = new URL('/dashboard', request.url);
      return NextResponse.redirect(dashboardUrl);
    }

    return response;
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
