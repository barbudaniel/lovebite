-- ============================================
-- WHATSAPP MESSAGE TEMPLATES & HISTORY
-- ============================================
-- This migration creates tables for managing WhatsApp message templates
-- and tracking message history sent to groups

-- Create the whatsapp_message_templates table
CREATE TABLE IF NOT EXISTS public.whatsapp_message_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT DEFAULT 'general' CHECK (category IN ('general', 'announcement', 'reminder', 'promotion', 'urgent')),
    variables JSONB DEFAULT '[]'::jsonb, -- Array of variable placeholders like ["{{name}}", "{{date}}"]
    is_active BOOLEAN DEFAULT true,
    use_count INTEGER DEFAULT 0,
    created_by UUID REFERENCES public.dashboard_users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create the whatsapp_message_history table
CREATE TABLE IF NOT EXISTS public.whatsapp_message_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id UUID REFERENCES public.whatsapp_message_templates(id) ON DELETE SET NULL,
    group_id UUID REFERENCES public.whatsapp_groups(id) ON DELETE SET NULL,
    whatsapp_group_id TEXT, -- The actual WhatsApp JID for reference
    sent_by UUID REFERENCES public.dashboard_users(id) ON DELETE SET NULL,
    message_content TEXT NOT NULL,
    status TEXT DEFAULT 'sent' CHECK (status IN ('pending', 'sent', 'delivered', 'failed')),
    error_message TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_whatsapp_templates_category ON public.whatsapp_message_templates(category);
CREATE INDEX IF NOT EXISTS idx_whatsapp_templates_is_active ON public.whatsapp_message_templates(is_active);
CREATE INDEX IF NOT EXISTS idx_whatsapp_templates_created_by ON public.whatsapp_message_templates(created_by);
CREATE INDEX IF NOT EXISTS idx_whatsapp_history_template_id ON public.whatsapp_message_history(template_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_history_group_id ON public.whatsapp_message_history(group_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_history_sent_by ON public.whatsapp_message_history(sent_by);
CREATE INDEX IF NOT EXISTS idx_whatsapp_history_created_at ON public.whatsapp_message_history(created_at DESC);

-- Add trigger to update updated_at timestamp for templates
CREATE OR REPLACE FUNCTION public.update_whatsapp_templates_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_whatsapp_templates_updated_at ON public.whatsapp_message_templates;
CREATE TRIGGER trigger_update_whatsapp_templates_updated_at
BEFORE UPDATE ON public.whatsapp_message_templates
FOR EACH ROW
EXECUTE FUNCTION public.update_whatsapp_templates_updated_at();

-- Create function to increment template use count
CREATE OR REPLACE FUNCTION public.increment_template_use_count(template_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE public.whatsapp_message_templates
    SET use_count = use_count + 1
    WHERE id = template_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS
ALTER TABLE public.whatsapp_message_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_message_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for whatsapp_message_templates
-- Admin can do anything
CREATE POLICY "Admin full access to whatsapp_message_templates"
ON public.whatsapp_message_templates
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

-- Business users can view active templates
CREATE POLICY "Business can view active templates"
ON public.whatsapp_message_templates
FOR SELECT
TO authenticated
USING (
    is_active = true
    AND EXISTS (
        SELECT 1 FROM public.dashboard_users
        WHERE auth_user_id = auth.uid()
        AND role = 'business'
        AND enabled = true
    )
);

-- RLS Policies for whatsapp_message_history
-- Admin can see all history
CREATE POLICY "Admin full access to whatsapp_message_history"
ON public.whatsapp_message_history
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

-- Business users can see history for their studio's groups
CREATE POLICY "Business can view own message history"
ON public.whatsapp_message_history
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.dashboard_users du
        JOIN public.studios s ON s.id = du.studio_id
        JOIN public.whatsapp_groups wg ON wg.id = s.whatsapp_group_id
        WHERE du.auth_user_id = auth.uid()
        AND du.role = 'business'
        AND du.enabled = true
        AND public.whatsapp_message_history.group_id = wg.id
    )
    OR
    EXISTS (
        SELECT 1 FROM public.dashboard_users du
        JOIN public.creators c ON c.studio_id = du.studio_id
        JOIN public.whatsapp_groups wg ON wg.id = c.whatsapp_group_id
        WHERE du.auth_user_id = auth.uid()
        AND du.role = 'business'
        AND du.enabled = true
        AND public.whatsapp_message_history.group_id = wg.id
    )
);

-- Add comments for documentation
COMMENT ON TABLE public.whatsapp_message_templates IS 'Stores reusable WhatsApp message templates';
COMMENT ON COLUMN public.whatsapp_message_templates.variables IS 'JSON array of variable placeholders used in the template';
COMMENT ON COLUMN public.whatsapp_message_templates.category IS 'Template category for organization';
COMMENT ON TABLE public.whatsapp_message_history IS 'Logs all WhatsApp messages sent to groups';
COMMENT ON COLUMN public.whatsapp_message_history.whatsapp_group_id IS 'The actual WhatsApp JID stored for historical reference';







