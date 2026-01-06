-- ============================================
-- MIGRATE FROM WHATSAPP GROUPS TO TWILIO DIRECT MESSAGING
-- ============================================
-- This migration adds phone_number fields to creators and studios tables
-- and deprecates the WhatsApp groups functionality in favor of Twilio direct messaging

-- Add phone_number column to creators table
ALTER TABLE public.creators 
ADD COLUMN IF NOT EXISTS phone_number TEXT,
ADD COLUMN IF NOT EXISTS phone_number_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS phone_number_verified_at TIMESTAMPTZ;

-- Add phone_number column to studios table
ALTER TABLE public.studios 
ADD COLUMN IF NOT EXISTS phone_number TEXT,
ADD COLUMN IF NOT EXISTS phone_number_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS phone_number_verified_at TIMESTAMPTZ;

-- Add phone_number column to dashboard_users table (for developer/admin direct contact)
ALTER TABLE public.dashboard_users 
ADD COLUMN IF NOT EXISTS phone_number TEXT,
ADD COLUMN IF NOT EXISTS phone_number_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS phone_number_verified_at TIMESTAMPTZ;

-- Create indexes for phone numbers (for lookups)
CREATE INDEX IF NOT EXISTS idx_creators_phone_number ON public.creators(phone_number) WHERE phone_number IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_studios_phone_number ON public.studios(phone_number) WHERE phone_number IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_dashboard_users_phone_number ON public.dashboard_users(phone_number) WHERE phone_number IS NOT NULL;

-- Add constraint for phone number format (international format starting with +)
ALTER TABLE public.creators 
ADD CONSTRAINT IF NOT EXISTS check_phone_format_creators 
CHECK (phone_number IS NULL OR phone_number ~ '^\+[1-9]\d{1,14}$');

ALTER TABLE public.studios 
ADD CONSTRAINT IF NOT EXISTS check_phone_format_studios 
CHECK (phone_number IS NULL OR phone_number ~ '^\+[1-9]\d{1,14}$');

ALTER TABLE public.dashboard_users 
ADD CONSTRAINT IF NOT EXISTS check_phone_format_dashboard_users 
CHECK (phone_number IS NULL OR phone_number ~ '^\+[1-9]\d{1,14}$');

-- Drop foreign key constraints from creators and studios to whatsapp_groups
-- (Keeping the columns for now for data migration purposes)
ALTER TABLE public.creators 
DROP CONSTRAINT IF EXISTS creators_whatsapp_group_id_fkey;

ALTER TABLE public.studios 
DROP CONSTRAINT IF EXISTS studios_whatsapp_group_id_fkey;

-- Mark whatsapp_groups table as deprecated
COMMENT ON TABLE public.whatsapp_groups IS 'DEPRECATED: This table is no longer used. Phone numbers are now stored directly on creators/studios tables for Twilio integration.';

-- Add comments for documentation
COMMENT ON COLUMN public.creators.phone_number IS 'WhatsApp phone number in E.164 format (e.g., +40754644016) for Twilio integration';
COMMENT ON COLUMN public.creators.phone_number_verified IS 'Whether the phone number has been verified via Twilio';
COMMENT ON COLUMN public.creators.phone_number_verified_at IS 'Timestamp when phone number was verified';

COMMENT ON COLUMN public.studios.phone_number IS 'WhatsApp phone number in E.164 format (e.g., +40754644016) for Twilio integration';
COMMENT ON COLUMN public.studios.phone_number_verified IS 'Whether the phone number has been verified via Twilio';
COMMENT ON COLUMN public.studios.phone_number_verified_at IS 'Timestamp when phone number was verified';

COMMENT ON COLUMN public.dashboard_users.phone_number IS 'WhatsApp phone number in E.164 format (e.g., +40754644016) for Twilio integration';
COMMENT ON COLUMN public.dashboard_users.phone_number_verified IS 'Whether the phone number has been verified via Twilio';
COMMENT ON COLUMN public.dashboard_users.phone_number_verified_at IS 'Timestamp when phone number was verified';

-- Create a view to show active phone numbers
CREATE OR REPLACE VIEW public.active_phone_numbers AS
SELECT 
    'creator' AS entity_type,
    c.id AS entity_id,
    c.username AS entity_name,
    c.phone_number,
    c.phone_number_verified,
    c.phone_number_verified_at,
    c.enabled AS active
FROM public.creators c
WHERE c.phone_number IS NOT NULL
UNION ALL
SELECT 
    'studio' AS entity_type,
    s.id AS entity_id,
    s.name AS entity_name,
    s.phone_number,
    s.phone_number_verified,
    s.phone_number_verified_at,
    s.enabled AS active
FROM public.studios s
WHERE s.phone_number IS NOT NULL
UNION ALL
SELECT 
    'user' AS entity_type,
    du.id AS entity_id,
    du.email AS entity_name,
    du.phone_number,
    du.phone_number_verified,
    du.phone_number_verified_at,
    du.enabled AS active
FROM public.dashboard_users du
WHERE du.phone_number IS NOT NULL;

COMMENT ON VIEW public.active_phone_numbers IS 'Consolidated view of all active phone numbers for Twilio integration';

