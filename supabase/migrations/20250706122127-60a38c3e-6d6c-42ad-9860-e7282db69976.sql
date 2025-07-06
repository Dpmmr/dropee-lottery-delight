-- Phase 2: Database Cleanup for Production
-- Clear all test/dummy data for clean deployment

-- 1. Clear all test winner records
DELETE FROM public.winners;

-- 2. Clear all test customers
DELETE FROM public.customers;

-- 3. Clear all test draws
DELETE FROM public.draws;

-- 4. Clear all live draws (remove stuck countdown draws)
DELETE FROM public.live_draws;

-- 5. Reset draw status to clean state
UPDATE public.draw_status 
SET is_active = false, current_draw_id = null;

-- 6. Clear old user sessions
DELETE FROM public.user_sessions;

-- 7. Keep events structure but you can remove test events if needed
-- Only clear test events - keep the proper event structure
DELETE FROM public.events WHERE name LIKE '%Test%' OR name LIKE '%test%';

-- 8. Optional: Reset any auto-incrementing sequences if they exist
-- This ensures clean numbering for new production data