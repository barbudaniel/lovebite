import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// ============================================
// SERVER CLIENT (Server Components, Route Handlers)
// ============================================

export const getSupabaseServerClient = async () => {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          } catch {
            // Called from Server Component - ignore cookie setting
            // Mutations should happen in middleware or route handlers
          }
        },
      },
    }
  )
}

// ============================================
// ADMIN CLIENT (Server-side with Service Role)
// ============================================

export const getSupabaseAdminClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error(`Missing Supabase env vars: URL=${!!supabaseUrl}, SERVICE_KEY=${!!supabaseServiceKey}`)
  }

  return createServerClient(supabaseUrl, supabaseServiceKey, {
    cookies: {
      getAll() {
        return []
      },
      setAll() {
        // Admin client doesn't need cookies
      },
    },
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}



