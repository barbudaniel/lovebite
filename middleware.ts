import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { getCreatorByDomain } from '@/lib/creators';

// Check Supabase for custom domain (no caching - real-time data)
async function getCreatorSlugByDomain(domain: string): Promise<string | null> {
  // Remove www. prefix if present
  const cleanDomain = domain.replace(/^www\./, "").toLowerCase();
  
  // First check local cache (instant, no network call) - fallback only
  const localCreator = getCreatorByDomain(cleanDomain);
  if (localCreator) {
    return localCreator.id;
  }
  
  // Check Supabase for custom domains - no caching for real-time data
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/bio_links?custom_domain=ilike.${cleanDomain}&is_published=eq.true&select=slug`,
      {
        headers: {
          'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
        },
        cache: 'no-store',
      }
    );
    
    if (response.ok) {
      const data = await response.json();
      if (data && data.length > 0 && data[0].slug) {
        return data[0].slug;
      }
    }
  } catch (e) {
    // Silent fail - will fall through to normal routing
    console.error('Error checking custom domain:', e);
  }
  
  return null;
}

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const pathname = request.nextUrl.pathname;

  // ============================================
  // CUSTOM DOMAIN ROUTING
  // ============================================

  // Check if this is a creator's custom domain (local cache + Supabase)
  const creatorSlug = await getCreatorSlugByDomain(hostname);
  if (creatorSlug) {
    // Root path -> show creator profile
    if (pathname === '/') {
      return NextResponse.rewrite(new URL(`/creator/${creatorSlug}`, request.url));
    }
    
    // Allow API routes to pass through (for analytics tracking, etc.)
    if (pathname.startsWith('/api/')) {
      return NextResponse.next();
    }
    
    // Any other path -> redirect to root
    return NextResponse.redirect(new URL('/', request.url));
  }

  // bites.bio/:username -> /creator/:username
  if (hostname.includes('bites.bio')) {
    // Root path -> redirect to Lovdash.fans
    if (pathname === '/') {
      return NextResponse.redirect('https://Lovdash.fans');
    }
    
    // API routes should be handled locally (no redirect) to avoid CORS issues
    if (pathname.startsWith('/api/')) {
      return NextResponse.next();
    }
    
    // System routes should redirect to Lovdash.fans
    const systemRoutes = ['/dashboard', '/admin', '/join', '/register', '/bio', '/creator', '/_next'];
    const isSystemRoute = systemRoutes.some(route => pathname.startsWith(route));
    
    if (isSystemRoute) {
      // Redirect system routes to Lovdash.fans
      return NextResponse.redirect(`https://Lovdash.fans${pathname}`);
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
    const isForgotPasswordPage = pathname === '/dashboard/login/forgot-password';
    const isResetPasswordPage = pathname === '/dashboard/login/reset-password';
    const isPublicAuthPage = isLoginPage || isSetupPage || isForgotPasswordPage || isResetPasswordPage;
    
    if (!session && !isPublicAuthPage) {
      const loginUrl = new URL('/dashboard/login', request.url);
      return NextResponse.redirect(loginUrl);
    }

    // If logged in and trying to access login page (but not reset-password), redirect to dashboard
    if (session && isLoginPage && !isResetPasswordPage) {
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
