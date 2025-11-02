-- Allow anyone to view events that have been created
-- This enables shareable links to work for unauthenticated users
DROP POLICY IF EXISTS "Events are readable by creator" ON public.events;

CREATE POLICY "Events are readable by everyone" ON public.events
  FOR SELECT USING (true);

-- Ensure only creators can update/delete events
CREATE POLICY "Events are updatable by creator only" ON public.events
  FOR UPDATE USING (auth.uid() = creator_id);

CREATE POLICY "Events are deletable by creator only" ON public.events
  FOR DELETE USING (auth.uid() = creator_id);
