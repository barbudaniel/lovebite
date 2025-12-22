-- Enable Supabase Realtime on bio_page_views table for live traffic visualization

-- First check if the table is already in the publication
DO $$
BEGIN
    -- Add bio_page_views to the supabase_realtime publication if not already added
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND tablename = 'bio_page_views'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.bio_page_views;
    END IF;
END $$;

-- Also enable for bio_link_clicks for potential future use
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND tablename = 'bio_link_clicks'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.bio_link_clicks;
    END IF;
END $$;

-- Create an index for faster filtering by bio_link_id for realtime queries
CREATE INDEX IF NOT EXISTS idx_bio_page_views_bio_link_id_created 
ON public.bio_page_views (bio_link_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_bio_link_clicks_bio_link_id_created 
ON public.bio_link_clicks (bio_link_id, created_at DESC);


