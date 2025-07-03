-- Phase 1: Database Cleanup & Constraints

-- 1. Clean up stale live_draws that are stuck
DELETE FROM public.live_draws 
WHERE status = 'countdown' 
AND created_at < NOW() - INTERVAL '1 hour';

-- 2. Reset draw_status to clean state
UPDATE public.draw_status 
SET is_active = false, current_draw_id = null 
WHERE is_active = true;

-- 3. Ensure only one event can be active at a time (trigger)
CREATE OR REPLACE FUNCTION public.ensure_single_active_event()
RETURNS TRIGGER AS $$
BEGIN
  -- If trying to set an event as active
  IF NEW.active = true THEN
    -- Deactivate all other events first
    UPDATE public.events 
    SET active = false 
    WHERE id != NEW.id AND active = true;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for single active event
DROP TRIGGER IF EXISTS ensure_single_active_event_trigger ON public.events;
CREATE TRIGGER ensure_single_active_event_trigger
  BEFORE UPDATE ON public.events
  FOR EACH ROW
  EXECUTE FUNCTION public.ensure_single_active_event();

-- 4. Add unique constraint for user sessions to prevent duplicates
CREATE UNIQUE INDEX IF NOT EXISTS user_sessions_session_id_unique 
ON public.user_sessions (session_id);

-- 5. Create a cleanup function for old user sessions
CREATE OR REPLACE FUNCTION public.cleanup_old_user_sessions()
RETURNS void AS $$
BEGIN
  DELETE FROM public.user_sessions 
  WHERE last_seen < NOW() - INTERVAL '5 minutes';
END;
$$ LANGUAGE plpgsql;

-- 6. Create function to reset all draw state (for emergency reset)
CREATE OR REPLACE FUNCTION public.emergency_reset_draws()
RETURNS void AS $$
BEGIN
  -- Delete all live draws
  DELETE FROM public.live_draws;
  
  -- Reset draw status
  UPDATE public.draw_status 
  SET is_active = false, current_draw_id = null;
  
  -- Clean old user sessions
  PERFORM public.cleanup_old_user_sessions();
END;
$$ LANGUAGE plpgsql;