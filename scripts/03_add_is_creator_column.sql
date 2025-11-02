-- Add is_creator column to event_responses if it doesn't exist
ALTER TABLE public.event_responses 
ADD COLUMN IF NOT EXISTS is_creator BOOLEAN DEFAULT FALSE;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_event_responses_is_creator ON public.event_responses(event_id, is_creator);
