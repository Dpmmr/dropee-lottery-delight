
-- Create live_draws table to manage draw states and real-time communication
CREATE TABLE public.live_draws (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES public.events(id) NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('waiting', 'countdown', 'drawing', 'revealing', 'completed')),
  countdown_duration INTEGER DEFAULT 10,
  prizes TEXT[] DEFAULT '{}',
  current_winners TEXT[] DEFAULT '{}',
  total_participants INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create draw_status table to track overall system state
CREATE TABLE public.draw_status (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  is_active BOOLEAN NOT NULL DEFAULT false,
  current_draw_id UUID REFERENCES public.live_draws(id),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert initial draw status record
INSERT INTO public.draw_status (is_active) VALUES (false);

-- Enable Row Level Security
ALTER TABLE public.live_draws ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.draw_status ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Anyone can view live_draws" ON public.live_draws FOR SELECT USING (true);
CREATE POLICY "Anyone can view draw_status" ON public.draw_status FOR SELECT USING (true);

-- Create policies for insert/update/delete (admin functionality)
CREATE POLICY "Anyone can insert live_draws" ON public.live_draws FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update live_draws" ON public.live_draws FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete live_draws" ON public.live_draws FOR DELETE USING (true);
CREATE POLICY "Anyone can update draw_status" ON public.draw_status FOR UPDATE USING (true);

-- Enable realtime for live monitoring
ALTER TABLE public.live_draws REPLICA IDENTITY FULL;
ALTER TABLE public.draw_status REPLICA IDENTITY FULL;
ALTER publication supabase_realtime ADD TABLE public.live_draws;
ALTER publication supabase_realtime ADD TABLE public.draw_status;

-- Create function to automatically update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_live_draws_updated_at BEFORE UPDATE ON public.live_draws
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_draw_status_updated_at BEFORE UPDATE ON public.draw_status
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
