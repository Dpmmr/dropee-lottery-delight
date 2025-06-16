
-- Create customers table
CREATE TABLE public.customers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create events table
CREATE TABLE public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  winners_count INTEGER NOT NULL DEFAULT 3,
  event_date DATE NOT NULL,
  active BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create winners table
CREATE TABLE public.winners (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES public.customers(id) NOT NULL,
  event_id UUID REFERENCES public.events(id) NOT NULL,
  prize_description TEXT NOT NULL,
  won_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create draws table to track draw history
CREATE TABLE public.draws (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES public.events(id) NOT NULL,
  total_participants INTEGER NOT NULL,
  conducted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create external_links table
CREATE TABLE public.external_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create footer_content table
CREATE TABLE public.footer_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  description TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_sessions table for live monitoring
CREATE TABLE public.user_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL UNIQUE,
  last_seen TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default footer content
INSERT INTO public.footer_content (description) VALUES 
('Experience the thrill of winning with DROPEE UKHRUL! Our weekly lottery draws bring excitement and amazing prizes to our community. Join thousands of happy customers who trust us for quality service and fair draws.');

-- Enable Row Level Security
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.winners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.draws ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.external_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.footer_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (since this is a public lottery)
CREATE POLICY "Anyone can view customers" ON public.customers FOR SELECT USING (true);
CREATE POLICY "Anyone can view events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Anyone can view winners" ON public.winners FOR SELECT USING (true);
CREATE POLICY "Anyone can view draws" ON public.draws FOR SELECT USING (true);
CREATE POLICY "Anyone can view external_links" ON public.external_links FOR SELECT USING (true);
CREATE POLICY "Anyone can view footer_content" ON public.footer_content FOR SELECT USING (true);
CREATE POLICY "Anyone can view user_sessions" ON public.user_sessions FOR SELECT USING (true);

-- Create policies for insert/update/delete (these would be admin only in real app)
CREATE POLICY "Anyone can insert customers" ON public.customers FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can insert events" ON public.events FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can insert winners" ON public.winners FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can insert draws" ON public.draws FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can insert external_links" ON public.external_links FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update footer_content" ON public.footer_content FOR UPDATE USING (true);
CREATE POLICY "Anyone can insert user_sessions" ON public.user_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update user_sessions" ON public.user_sessions FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete user_sessions" ON public.user_sessions FOR DELETE USING (true);
CREATE POLICY "Anyone can update customers" ON public.customers FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete customers" ON public.customers FOR DELETE USING (true);
CREATE POLICY "Anyone can update events" ON public.events FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete events" ON public.events FOR DELETE USING (true);
CREATE POLICY "Anyone can delete external_links" ON public.external_links FOR DELETE USING (true);

-- Enable realtime for live monitoring
ALTER TABLE public.user_sessions REPLICA IDENTITY FULL;
ALTER publication supabase_realtime ADD TABLE public.user_sessions;
ALTER publication supabase_realtime ADD TABLE public.winners;
ALTER publication supabase_realtime ADD TABLE public.draws;
