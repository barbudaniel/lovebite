-- Add missing columns to creators table that the dashboard expects
-- These columns are needed for the models page functionality

-- Add bio column for storing creator bio/description
ALTER TABLE public.creators 
ADD COLUMN IF NOT EXISTS bio TEXT;

-- Add display_name column for the public-facing name
ALTER TABLE public.creators 
ADD COLUMN IF NOT EXISTS display_name TEXT;

-- Add email column for creator contact email
ALTER TABLE public.creators 
ADD COLUMN IF NOT EXISTS email TEXT;

-- Add comments for documentation
COMMENT ON COLUMN public.creators.bio IS 'Short biography/description of the creator';
COMMENT ON COLUMN public.creators.display_name IS 'Public display name (different from username)';
COMMENT ON COLUMN public.creators.email IS 'Creator contact email address';




