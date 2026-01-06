-- Fix infinite recursion in dashboard_users RLS policies and update platform check constraint

-- ========================================
-- FIX 1: Helper functions with SECURITY DEFINER
-- We need to drop CASCADE and recreate the dependent policies
-- ========================================

-- First, save the policy definitions and drop functions with CASCADE
DROP FUNCTION IF EXISTS public.get_my_role() CASCADE;
DROP FUNCTION IF EXISTS public.get_my_studio_id() CASCADE;
DROP FUNCTION IF EXISTS public.is_admin() CASCADE;

-- Recreate get_my_role with SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS user_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM dashboard_users WHERE auth_user_id = auth.uid() LIMIT 1;
$$;

-- Recreate get_my_studio_id with SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.get_my_studio_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT studio_id FROM dashboard_users WHERE auth_user_id = auth.uid() LIMIT 1;
$$;

-- Recreate is_admin with SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM dashboard_users 
    WHERE auth_user_id = auth.uid() AND role = 'admin'
  );
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.get_my_role() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_my_studio_id() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- ========================================
-- Recreate all dropped policies
-- ========================================

-- dashboard_users policies
CREATE POLICY "Business can read team members" ON dashboard_users
FOR SELECT TO public
USING (
  (get_my_role() = 'business'::user_role) AND 
  (
    ((role = 'independent'::user_role) AND (EXISTS (
      SELECT 1 FROM creators c
      WHERE c.id = dashboard_users.creator_id AND c.studio_id = get_my_studio_id()
    )))
    OR ((role = 'business'::user_role) AND (studio_id = get_my_studio_id()))
  )
);

CREATE POLICY "Business can update team members" ON dashboard_users
FOR UPDATE TO public
USING (
  is_admin() OR (
    (get_my_role() = 'business'::user_role) AND 
    (
      ((role = 'independent'::user_role) AND (EXISTS (
        SELECT 1 FROM creators c
        WHERE c.id = dashboard_users.creator_id AND c.studio_id = get_my_studio_id()
      )))
      OR ((role = 'business'::user_role) AND (studio_id = get_my_studio_id()))
    )
  )
);

CREATE POLICY "Business can delete team members" ON dashboard_users
FOR DELETE TO public
USING (
  is_admin() OR (
    (get_my_role() = 'business'::user_role) AND 
    (
      ((role = 'independent'::user_role) AND (EXISTS (
        SELECT 1 FROM creators c
        WHERE c.id = dashboard_users.creator_id AND c.studio_id = get_my_studio_id()
      )))
      OR ((role = 'business'::user_role) AND (studio_id = get_my_studio_id()))
    )
  )
);

-- activity_logs policy
CREATE POLICY "Business can read their activity" ON activity_logs
FOR SELECT TO public
USING (
  EXISTS (
    SELECT 1 FROM dashboard_users du
    WHERE du.auth_user_id = auth.uid()
    AND du.role = 'business'::user_role
    AND du.studio_id = activity_logs.studio_id
  )
);

-- bio_links policy
CREATE POLICY "Creators and business can manage bio links" ON bio_links
FOR ALL TO public
USING (
  EXISTS (
    SELECT 1 FROM dashboard_users du
    LEFT JOIN creators c ON c.id = bio_links.creator_id
    WHERE du.auth_user_id = auth.uid()
    AND (
      du.role = 'admin'::user_role
      OR du.creator_id = bio_links.creator_id
      OR (du.role = 'business'::user_role AND du.studio_id = c.studio_id)
    )
  )
);

-- bio_link_items policy
CREATE POLICY "Creators and business can manage bio link items" ON bio_link_items
FOR ALL TO public
USING (
  EXISTS (
    SELECT 1 FROM bio_links bl
    LEFT JOIN dashboard_users du ON du.auth_user_id = auth.uid()
    LEFT JOIN creators c ON c.id = bl.creator_id
    WHERE bl.id = bio_link_items.bio_link_id
    AND (
      du.role = 'admin'::user_role
      OR du.creator_id = bl.creator_id
      OR (du.role = 'business'::user_role AND du.studio_id = c.studio_id)
    )
  )
);

-- bio_social_links policy
CREATE POLICY "Creators and business can manage bio social links" ON bio_social_links
FOR ALL TO public
USING (
  EXISTS (
    SELECT 1 FROM bio_links bl
    LEFT JOIN dashboard_users du ON du.auth_user_id = auth.uid()
    LEFT JOIN creators c ON c.id = bl.creator_id
    WHERE bl.id = bio_social_links.bio_link_id
    AND (
      du.role = 'admin'::user_role
      OR du.creator_id = bl.creator_id
      OR (du.role = 'business'::user_role AND du.studio_id = c.studio_id)
    )
  )
);

-- ========================================
-- FIX 2: Update platform check constraint
-- ========================================

-- Drop the old constraint
ALTER TABLE public.creator_social_accounts 
DROP CONSTRAINT IF EXISTS creator_social_accounts_platform_check;

-- Add new constraint with all platforms
ALTER TABLE public.creator_social_accounts 
ADD CONSTRAINT creator_social_accounts_platform_check 
CHECK (platform = ANY (ARRAY[
  'onlyfans'::text,
  'fansly'::text,
  'loyalfans'::text,
  'feetfinder'::text,
  'reddit'::text,
  'instagram'::text,
  'x'::text,
  'tiktok'::text,
  'redgifs'::text,
  'chaturbate'::text,
  'stripchat'::text,
  'pornhub'::text,
  'manyvids'::text,
  'patreon'::text,
  'twitch'::text,
  'snapchat'::text,
  'telegram'::text,
  'discord'::text,
  'other'::text
]));

-- Drop the unique constraint on creator_id + platform to allow multiple accounts per platform
ALTER TABLE public.creator_social_accounts 
DROP CONSTRAINT IF EXISTS creator_social_accounts_creator_id_platform_key;

-- Add a new unique index that includes label
DROP INDEX IF EXISTS creator_social_accounts_creator_platform_label_idx;
CREATE UNIQUE INDEX creator_social_accounts_creator_platform_label_idx 
ON public.creator_social_accounts (creator_id, platform, COALESCE(label, ''));
