-- Create users table (extends Supabase auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  timezone TEXT DEFAULT 'UTC',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create events table
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  duration_minutes INTEGER DEFAULT 60,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create event responses (people who submitted availability)
CREATE TABLE IF NOT EXISTS public.event_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  responder_name TEXT NOT NULL,
  responder_email TEXT,
  timezone TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create availability slots (hourly slots for each day of the week)
CREATE TABLE IF NOT EXISTS public.availability_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  response_id UUID NOT NULL REFERENCES public.event_responses(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sunday, 6=Saturday
  hour INTEGER NOT NULL CHECK (hour BETWEEN 0 AND 23),
  is_available BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_events_creator ON public.events(creator_id);
CREATE INDEX IF NOT EXISTS idx_event_responses_event ON public.event_responses(event_id);
CREATE INDEX IF NOT EXISTS idx_availability_response ON public.availability_slots(response_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.availability_slots ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can read own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for events
CREATE POLICY "Events are readable by creator" ON public.events
  FOR SELECT USING (auth.uid() = creator_id);

CREATE POLICY "Events are creatable by authenticated users" ON public.events
  FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Events are updatable by creator" ON public.events
  FOR UPDATE USING (auth.uid() = creator_id);

-- RLS Policies for event_responses (anyone can view/create)
CREATE POLICY "Event responses are readable by anyone" ON public.event_responses
  FOR SELECT USING (true);

CREATE POLICY "Event responses are creatable by anyone" ON public.event_responses
  FOR INSERT WITH CHECK (true);

-- RLS Policies for availability_slots
CREATE POLICY "Availability slots are readable by anyone" ON public.availability_slots
  FOR SELECT USING (true);

CREATE POLICY "Availability slots are creatable by anyone" ON public.availability_slots
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Availability slots are updatable by creator" ON public.availability_slots
  FOR UPDATE USING (
    auth.uid() = (SELECT creator_id FROM public.events WHERE id = 
      (SELECT event_id FROM public.event_responses WHERE id = 
        (SELECT response_id FROM public.availability_slots WHERE id = availability_slots.id)))
  );
