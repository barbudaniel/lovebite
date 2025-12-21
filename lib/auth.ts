// ============================================
// AUTHENTICATION UTILITIES
// ============================================
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

// Server-side auth client
export async function createServerAuthClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  const cookieStore = await cookies();
  
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
    global: {
      headers: {
        cookie: cookieStore.toString(),
      },
    },
  });
}

// Get current session user
export async function getCurrentUser() {
  const supabase = await createServerAuthClient();
  
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    return null;
  }

  // Get dashboard user profile
  const { data: dashboardUser } = await supabase
    .from('dashboard_users')
    .select(`
      *,
      creator:creators(*),
      studio:studios(*)
    `)
    .eq('auth_user_id', user.id)
    .single();

  return {
    authUser: user,
    dashboardUser,
  };
}

// Check if user has required role
export function hasRole(userRole: string | null, requiredRoles: string[]): boolean {
  if (!userRole) return false;
  return requiredRoles.includes(userRole);
}

// Check if user can access creator
export function canAccessCreator(
  userRole: string,
  userCreatorId: string | null,
  userStudioId: string | null,
  targetCreatorId: string,
  targetStudioId: string | null
): boolean {
  // Admins can access everything
  if (userRole === 'admin') return true;
  
  // Models can only access their own creator
  if (userRole === 'model') {
    return userCreatorId === targetCreatorId;
  }
  
  // Studios can access creators in their studio
  if (userRole === 'studio') {
    return userStudioId === targetStudioId;
  }
  
  return false;
}

// ============================================
// AUTH TYPES
// ============================================

export interface DashboardUser {
  id: string;
  auth_user_id: string;
  email: string | null;
  phone: string | null;
  role: 'admin' | 'studio' | 'model';
  creator_id: string | null;
  studio_id: string | null;
  display_name: string | null;
  avatar_url: string | null;
  enabled: boolean;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
  creator?: {
    id: string;
    username: string;
    storage_folder: string;
    enabled: boolean;
    bio_link: string | null;
    studio_id: string | null;
  } | null;
  studio?: {
    id: string;
    name: string;
    enabled: boolean;
  } | null;
}

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: DashboardUser | null;
  error: string | null;
}

