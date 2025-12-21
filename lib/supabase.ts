import { createBrowserClient } from '@supabase/ssr'

// ============================================
// BROWSER CLIENT (Client Components)
// ============================================

// Singleton browser client for client-side usage
let browserClient: ReturnType<typeof createBrowserClient> | null = null

export const getSupabaseBrowserClient = () => {
  if (browserClient) {
    return browserClient
  }

  browserClient = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  return browserClient
}

// Legacy export for backward compatibility
export const createBrowserClient_legacy = getSupabaseBrowserClient
