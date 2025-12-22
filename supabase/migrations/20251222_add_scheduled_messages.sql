-- ============================================
-- SCHEDULED WHATSAPP MESSAGES
-- ============================================
-- Table for scheduling one-time and recurring WhatsApp messages

CREATE TABLE IF NOT EXISTS public.whatsapp_scheduled_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id UUID REFERENCES public.whatsapp_message_templates(id) ON DELETE SET NULL,
    group_id UUID REFERENCES public.whatsapp_groups(id) ON DELETE CASCADE,
    message_content TEXT NOT NULL,
    
    -- Scheduling options
    schedule_type TEXT NOT NULL DEFAULT 'once' CHECK (schedule_type IN ('once', 'daily', 'weekly', 'monthly')),
    scheduled_at TIMESTAMPTZ, -- For 'once' type: when to send
    schedule_time TIME, -- For recurring: time of day to send (e.g., '09:00:00')
    schedule_day_of_week INTEGER CHECK (schedule_day_of_week IS NULL OR (schedule_day_of_week >= 0 AND schedule_day_of_week <= 6)), -- 0=Sunday for 'weekly'
    schedule_day_of_month INTEGER CHECK (schedule_day_of_month IS NULL OR (schedule_day_of_month >= 1 AND schedule_day_of_month <= 31)), -- For 'monthly'
    timezone TEXT DEFAULT 'Europe/Bucharest',
    
    -- Status tracking
    is_active BOOLEAN DEFAULT true,
    last_sent_at TIMESTAMPTZ,
    next_run_at TIMESTAMPTZ,
    send_count INTEGER DEFAULT 0,
    
    -- Metadata
    created_by UUID REFERENCES public.dashboard_users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_scheduled_messages_next_run ON public.whatsapp_scheduled_messages(next_run_at) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_scheduled_messages_group_id ON public.whatsapp_scheduled_messages(group_id);
CREATE INDEX IF NOT EXISTS idx_scheduled_messages_created_by ON public.whatsapp_scheduled_messages(created_by);

-- Update trigger
CREATE OR REPLACE FUNCTION public.update_scheduled_messages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_scheduled_messages_updated_at ON public.whatsapp_scheduled_messages;
CREATE TRIGGER trigger_update_scheduled_messages_updated_at
BEFORE UPDATE ON public.whatsapp_scheduled_messages
FOR EACH ROW
EXECUTE FUNCTION public.update_scheduled_messages_updated_at();

-- Function to calculate next run time
CREATE OR REPLACE FUNCTION public.calculate_next_run(
    p_schedule_type TEXT,
    p_schedule_time TIME,
    p_day_of_week INTEGER,
    p_day_of_month INTEGER,
    p_timezone TEXT
) RETURNS TIMESTAMPTZ AS $$
DECLARE
    v_now TIMESTAMPTZ := NOW() AT TIME ZONE COALESCE(p_timezone, 'UTC');
    v_today_at_time TIMESTAMPTZ;
    v_result TIMESTAMPTZ;
BEGIN
    IF p_schedule_type = 'once' THEN
        RETURN NULL; -- One-time schedules don't have next_run after execution
    END IF;
    
    -- Calculate today at the scheduled time
    v_today_at_time := (DATE(v_now) + p_schedule_time) AT TIME ZONE COALESCE(p_timezone, 'UTC');
    
    IF p_schedule_type = 'daily' THEN
        IF v_today_at_time > NOW() THEN
            RETURN v_today_at_time;
        ELSE
            RETURN v_today_at_time + INTERVAL '1 day';
        END IF;
    ELSIF p_schedule_type = 'weekly' THEN
        -- Find next occurrence of day_of_week
        v_result := v_today_at_time + ((p_day_of_week - EXTRACT(DOW FROM v_now))::INTEGER % 7) * INTERVAL '1 day';
        IF v_result <= NOW() THEN
            v_result := v_result + INTERVAL '7 days';
        END IF;
        RETURN v_result;
    ELSIF p_schedule_type = 'monthly' THEN
        -- Find next occurrence of day_of_month
        v_result := (DATE_TRUNC('month', v_now) + (p_day_of_month - 1) * INTERVAL '1 day' + p_schedule_time) AT TIME ZONE COALESCE(p_timezone, 'UTC');
        IF v_result <= NOW() THEN
            v_result := (DATE_TRUNC('month', v_now) + INTERVAL '1 month' + (p_day_of_month - 1) * INTERVAL '1 day' + p_schedule_time) AT TIME ZONE COALESCE(p_timezone, 'UTC');
        END IF;
        RETURN v_result;
    END IF;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-calculate next_run_at on insert/update
CREATE OR REPLACE FUNCTION public.set_next_run_at()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.schedule_type = 'once' THEN
        NEW.next_run_at := NEW.scheduled_at;
    ELSE
        NEW.next_run_at := public.calculate_next_run(
            NEW.schedule_type,
            NEW.schedule_time,
            NEW.schedule_day_of_week,
            NEW.schedule_day_of_month,
            NEW.timezone
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_set_next_run_at ON public.whatsapp_scheduled_messages;
CREATE TRIGGER trigger_set_next_run_at
BEFORE INSERT OR UPDATE ON public.whatsapp_scheduled_messages
FOR EACH ROW
EXECUTE FUNCTION public.set_next_run_at();

-- Enable RLS
ALTER TABLE public.whatsapp_scheduled_messages ENABLE ROW LEVEL SECURITY;

-- Admin full access
CREATE POLICY "Admin full access to scheduled_messages"
ON public.whatsapp_scheduled_messages
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

-- Business users can manage their own scheduled messages
CREATE POLICY "Business can manage own scheduled_messages"
ON public.whatsapp_scheduled_messages
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.dashboard_users du
        WHERE du.auth_user_id = auth.uid()
        AND du.role = 'business'
        AND du.enabled = true
        AND public.whatsapp_scheduled_messages.created_by = du.id
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.dashboard_users du
        WHERE du.auth_user_id = auth.uid()
        AND du.role = 'business'
        AND du.enabled = true
    )
);

-- Comments
COMMENT ON TABLE public.whatsapp_scheduled_messages IS 'Stores scheduled and recurring WhatsApp messages';
COMMENT ON COLUMN public.whatsapp_scheduled_messages.schedule_type IS 'Type of schedule: once, daily, weekly, monthly';
COMMENT ON COLUMN public.whatsapp_scheduled_messages.schedule_day_of_week IS 'Day of week for weekly schedules (0=Sunday, 6=Saturday)';
COMMENT ON COLUMN public.whatsapp_scheduled_messages.next_run_at IS 'Calculated next execution time';

