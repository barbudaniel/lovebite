-- ============================================
-- TWILIO INTEGRATION TABLES
-- ============================================
-- Tables for storing Twilio WhatsApp messages and phone verifications

-- Table for storing WhatsApp messages (both inbound and outbound)
CREATE TABLE IF NOT EXISTS public.whatsapp_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    from_number TEXT NOT NULL,
    to_number TEXT NOT NULL,
    message_body TEXT,
    media_urls TEXT[],
    message_sid TEXT UNIQUE, -- Twilio message SID
    direction TEXT NOT NULL CHECK (direction IN ('inbound', 'outbound')),
    status TEXT DEFAULT 'queued', -- queued, sent, delivered, read, failed, undelivered
    created_at TIMESTAMPTZ DEFAULT NOW(),
    sent_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    read_at TIMESTAMPTZ,
    received_at TIMESTAMPTZ,
    error_message TEXT,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Table for phone number verifications
CREATE TABLE IF NOT EXISTS public.phone_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone_number TEXT NOT NULL,
    verification_code TEXT NOT NULL,
    entity_type TEXT NOT NULL CHECK (entity_type IN ('creator', 'studio', 'user')),
    entity_id UUID NOT NULL,
    verified BOOLEAN DEFAULT FALSE,
    verified_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ NOT NULL,
    attempts INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for whatsapp_messages
CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_from ON public.whatsapp_messages(from_number);
CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_to ON public.whatsapp_messages(to_number);
CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_direction ON public.whatsapp_messages(direction);
CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_status ON public.whatsapp_messages(status);
CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_created_at ON public.whatsapp_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_sid ON public.whatsapp_messages(message_sid);

-- Indexes for phone_verifications
CREATE INDEX IF NOT EXISTS idx_phone_verifications_phone ON public.phone_verifications(phone_number);
CREATE INDEX IF NOT EXISTS idx_phone_verifications_entity ON public.phone_verifications(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_phone_verifications_verified ON public.phone_verifications(verified);
CREATE INDEX IF NOT EXISTS idx_phone_verifications_expires ON public.phone_verifications(expires_at);

-- Enable RLS
ALTER TABLE public.whatsapp_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.phone_verifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for whatsapp_messages
-- Admin can see all messages
CREATE POLICY "Admin full access to whatsapp_messages"
ON public.whatsapp_messages
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.dashboard_users
        WHERE auth_user_id = auth.uid()
        AND role = 'admin'
        AND enabled = true
    )
);

-- Creators can see their own messages
CREATE POLICY "Creators can view own whatsapp_messages"
ON public.whatsapp_messages
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.dashboard_users du
        JOIN public.creators c ON c.id = du.creator_id
        WHERE du.auth_user_id = auth.uid()
        AND du.role = 'independent'
        AND du.enabled = true
        AND (c.phone_number = public.whatsapp_messages.from_number 
             OR c.phone_number = public.whatsapp_messages.to_number)
    )
);

-- Studios can see messages from their creators
CREATE POLICY "Studios can view creators whatsapp_messages"
ON public.whatsapp_messages
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.dashboard_users du
        JOIN public.creators c ON c.studio_id = du.studio_id
        WHERE du.auth_user_id = auth.uid()
        AND du.role = 'business'
        AND du.enabled = true
        AND (c.phone_number = public.whatsapp_messages.from_number 
             OR c.phone_number = public.whatsapp_messages.to_number)
    )
    OR
    EXISTS (
        SELECT 1 FROM public.dashboard_users du
        JOIN public.studios s ON s.id = du.studio_id
        WHERE du.auth_user_id = auth.uid()
        AND du.role = 'business'
        AND du.enabled = true
        AND (s.phone_number = public.whatsapp_messages.from_number 
             OR s.phone_number = public.whatsapp_messages.to_number)
    )
);

-- RLS Policies for phone_verifications
-- Admin can see all verifications
CREATE POLICY "Admin full access to phone_verifications"
ON public.phone_verifications
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.dashboard_users
        WHERE auth_user_id = auth.uid()
        AND role = 'admin'
        AND enabled = true
    )
);

-- Users can manage their own verifications
CREATE POLICY "Users can manage own phone_verifications"
ON public.phone_verifications
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.dashboard_users du
        WHERE du.auth_user_id = auth.uid()
        AND du.enabled = true
        AND (
            (entity_type = 'creator' AND du.creator_id = entity_id)
            OR (entity_type = 'studio' AND du.studio_id = entity_id)
            OR (entity_type = 'user' AND du.id = entity_id)
        )
    )
);

-- Function to clean up expired verifications
CREATE OR REPLACE FUNCTION public.cleanup_expired_verifications()
RETURNS void AS $$
BEGIN
    DELETE FROM public.phone_verifications
    WHERE expires_at < NOW() - INTERVAL '1 day';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comments
COMMENT ON TABLE public.whatsapp_messages IS 'Stores all WhatsApp messages sent and received via Twilio';
COMMENT ON TABLE public.phone_verifications IS 'Stores phone number verification codes';
COMMENT ON COLUMN public.whatsapp_messages.direction IS 'inbound = received, outbound = sent';
COMMENT ON COLUMN public.whatsapp_messages.message_sid IS 'Twilio message identifier';
COMMENT ON COLUMN public.phone_verifications.entity_type IS 'Type of entity being verified: creator, studio, or user';

