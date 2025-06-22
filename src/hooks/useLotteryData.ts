
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Customer, Event, Winner, Draw, ExternalLink } from '@/types/lottery';

export const useLotteryData = () => {
  const { data: customers = [] } = useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const { data, error } = await supabase.from('customers').select('*');
      if (error) throw error;
      return data as Customer[];
    },
    staleTime: 30000,
    gcTime: 300000
  });

  const { data: events = [] } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data, error } = await supabase.from('events').select('*');
      if (error) throw error;
      return data as Event[];
    },
    staleTime: 30000,
    gcTime: 300000
  });

  const { data: winners = [] } = useQuery({
    queryKey: ['winners'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('winners')
        .select(`
          *,
          customer:customers(*),
          event:events(*)
        `)
        .order('won_at', { ascending: false });
      if (error) throw error;
      return data as Winner[];
    },
    staleTime: 15000,
    gcTime: 300000
  });

  const { data: draws = [] } = useQuery({
    queryKey: ['draws'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('draws')
        .select(`
          *,
          event:events(*)
        `)
        .order('conducted_at', { ascending: false });
      if (error) throw error;
      return data as Draw[];
    },
    staleTime: 30000,
    gcTime: 300000
  });

  const { data: externalLinks = [] } = useQuery({
    queryKey: ['external_links'],
    queryFn: async () => {
      const { data, error } = await supabase.from('external_links').select('*');
      if (error) throw error;
      return data as ExternalLink[];
    },
    staleTime: 60000,
    gcTime: 300000
  });

  return {
    customers,
    events,
    winners,
    draws,
    externalLinks
  };
};
