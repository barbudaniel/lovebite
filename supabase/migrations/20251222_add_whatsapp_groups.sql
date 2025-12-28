-- ============================================
-- WHATSAPP GROUPS TABLE AND RELATIONSHIPS
-- ============================================
-- This migration creates a whatsapp_groups table to properly track
-- WhatsApp groups for models and studios, replacing the simple group_id field

-- Create the whatsapp_groups table
CREATE TABLE IF NOT EXISTS public.whatsapp_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    whatsapp_id TEXT NOT NULL UNIQUE, -- The WhatsApp group JID (e.g., "123456789@g.us")
    name TEXT, -- Display name for the group
    type TEXT NOT NULL DEFAULT 'creator' CHECK (type IN ('creator', 'studio', 'admin')),
    participant_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_whatsapp_groups_whatsapp_id ON public.whatsapp_groups(whatsapp_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_groups_type ON public.whatsapp_groups(type);

-- Add whatsapp_group_id column to creators table
ALTER TABLE public.creators 
ADD COLUMN IF NOT EXISTS whatsapp_group_id UUID REFERENCES public.whatsapp_groups(id) ON DELETE SET NULL;

-- Add whatsapp_group_id column to studios table
ALTER TABLE public.studios 
ADD COLUMN IF NOT EXISTS whatsapp_group_id UUID REFERENCES public.whatsapp_groups(id) ON DELETE SET NULL;

-- Create indexes for the foreign keys
CREATE INDEX IF NOT EXISTS idx_creators_whatsapp_group_id ON public.creators(whatsapp_group_id);
CREATE INDEX IF NOT EXISTS idx_studios_whatsapp_group_id ON public.studios(whatsapp_group_id);

-- Migrate existing group_id data to the new structure
-- For creators with existing group_id
INSERT INTO public.whatsapp_groups (whatsapp_id, name, type)
SELECT DISTINCT 
    group_id, 
    'Creator Group - ' || username,
    'creator'
FROM public.creators 
WHERE group_id IS NOT NULL 
  AND group_id != 'default'
  AND group_id != ''
ON CONFLICT (whatsapp_id) DO NOTHING;

-- Update creators to reference the new whatsapp_groups table
UPDATE public.creators c
SET whatsapp_group_id = wg.id
FROM public.whatsapp_groups wg
WHERE c.group_id = wg.whatsapp_id
  AND c.group_id IS NOT NULL 
  AND c.group_id != 'default'
  AND c.group_id != '';

-- For studios with existing group_id
INSERT INTO public.whatsapp_groups (whatsapp_id, name, type)
SELECT DISTINCT 
    group_id, 
    'Studio Group - ' || name,
    'studio'
FROM public.studios 
WHERE group_id IS NOT NULL 
  AND group_id != ''
ON CONFLICT (whatsapp_id) DO UPDATE SET type = 'studio';

-- Update studios to reference the new whatsapp_groups table
UPDATE public.studios s
SET whatsapp_group_id = wg.id
FROM public.whatsapp_groups wg
WHERE s.group_id = wg.whatsapp_id
  AND s.group_id IS NOT NULL 
  AND s.group_id != '';

-- Enable RLS on whatsapp_groups
ALTER TABLE public.whatsapp_groups ENABLE ROW LEVEL SECURITY;

-- RLS Policies for whatsapp_groups
-- Admin can do anything
CREATE POLICY "Admin full access to whatsapp_groups"
ON public.whatsapp_groups
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.dashboard_users
        WHERE auth_user_id = auth.uid()
        AND role = 'admin'
        AND enabled = true
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.dashboard_users
        WHERE auth_user_id = auth.uid()
        AND role = 'admin'
        AND enabled = true
    )
);

-- Business users can view and update their studio's and their models' whatsapp groups
CREATE POLICY "Business can view own whatsapp_groups"
ON public.whatsapp_groups
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.dashboard_users du
        JOIN public.studios s ON s.id = du.studio_id
        WHERE du.auth_user_id = auth.uid()
        AND du.role = 'business'
        AND du.enabled = true
        AND s.whatsapp_group_id = public.whatsapp_groups.id
    )
    OR
    EXISTS (
        SELECT 1 FROM public.dashboard_users du
        JOIN public.creators c ON c.studio_id = du.studio_id
        WHERE du.auth_user_id = auth.uid()
        AND du.role = 'business'
        AND du.enabled = true
        AND c.whatsapp_group_id = public.whatsapp_groups.id
    )
);

-- Independent users can view their own whatsapp group
CREATE POLICY "Independent can view own whatsapp_group"
ON public.whatsapp_groups
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.dashboard_users du
        JOIN public.creators c ON c.id = du.creator_id
        WHERE du.auth_user_id = auth.uid()
        AND du.role = 'independent'
        AND du.enabled = true
        AND c.whatsapp_group_id = public.whatsapp_groups.id
    )
);

-- Add a trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_whatsapp_groups_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_whatsapp_groups_updated_at ON public.whatsapp_groups;
CREATE TRIGGER trigger_update_whatsapp_groups_updated_at
BEFORE UPDATE ON public.whatsapp_groups
FOR EACH ROW
EXECUTE FUNCTION public.update_whatsapp_groups_updated_at();

-- Add comments for documentation
COMMENT ON TABLE public.whatsapp_groups IS 'Stores WhatsApp group information for creators and studios';
COMMENT ON COLUMN public.whatsapp_groups.whatsapp_id IS 'The WhatsApp group JID (e.g., 123456789@g.us)';
COMMENT ON COLUMN public.whatsapp_groups.type IS 'Type of group: creator, studio, or admin';
COMMENT ON COLUMN public.creators.whatsapp_group_id IS 'Reference to the WhatsApp group for this creator';
COMMENT ON COLUMN public.studios.whatsapp_group_id IS 'Reference to the WhatsApp group for this studio';








