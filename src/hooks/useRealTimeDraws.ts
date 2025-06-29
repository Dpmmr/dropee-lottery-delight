
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { LiveDraw, DrawStatus } from '@/types/lottery';

export const useRealTimeDraws = (isAdmin: boolean) => {
  const [activeDraw, setActiveDraw] = useState<LiveDraw | null>(null);
  const [drawStatus, setDrawStatus] = useState<DrawStatus | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    console.log('Setting up real-time draw listeners');

    // Initial data fetch
    const fetchInitialData = async () => {
      try {
        // Get current draw status
        const { data: statusData } = await supabase
          .from('draw_status')
          .select('*')
          .single();
        
        if (statusData) {
          setDrawStatus(statusData);

          // If there's an active draw, fetch it
          if (statusData.is_active && statusData.current_draw_id) {
            const { data: drawData } = await supabase
              .from('live_draws')
              .select('*')
              .eq('id', statusData.current_draw_id)
              .single();
            
            if (drawData) {
              setActiveDraw(drawData as LiveDraw);
            }
          }
        }
        setIsConnected(true);
      } catch (error) {
        console.error('Error fetching initial draw data:', error);
      }
    };

    fetchInitialData();

    // Set up real-time subscriptions
    const drawStatusChannel = supabase
      .channel('draw-status-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'draw_status'
      }, (payload) => {
        console.log('Draw status changed:', payload);
        setDrawStatus(payload.new as DrawStatus);
      })
      .subscribe();

    const liveDrawsChannel = supabase
      .channel('live-draws-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'live_draws'
      }, (payload) => {
        console.log('Live draw changed:', payload);
        if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
          setActiveDraw(payload.new as LiveDraw);
        } else if (payload.eventType === 'DELETE') {
          setActiveDraw(null);
        }
      })
      .subscribe();

    return () => {
      console.log('Cleaning up real-time draw listeners');
      supabase.removeChannel(drawStatusChannel);
      supabase.removeChannel(liveDrawsChannel);
    };
  }, []);

  // Admin functions for managing draws
  const startCountdownDraw = async (eventId: string, prizes: string[], duration: number, participantCount: number) => {
    try {
      console.log('Starting countdown draw:', { eventId, prizes, duration, participantCount });

      // Create new live draw
      const { data: newDraw, error: drawError } = await supabase
        .from('live_draws')
        .insert({
          event_id: eventId,
          status: 'countdown',
          countdown_duration: duration,
          prizes,
          total_participants: participantCount
        })
        .select()
        .single();

      if (drawError) throw drawError;

      // Update draw status to active
      const { error: statusError } = await supabase
        .from('draw_status')
        .update({
          is_active: true,
          current_draw_id: newDraw.id
        })
        .eq('id', drawStatus?.id);

      if (statusError) throw statusError;

      return newDraw;
    } catch (error) {
      console.error('Error starting countdown draw:', error);
      throw error;
    }
  };

  const updateDrawStatus = async (drawId: string, newStatus: LiveDraw['status'], winners?: string[]) => {
    try {
      const updateData: any = { status: newStatus };
      if (winners) {
        updateData.current_winners = winners;
      }

      const { error } = await supabase
        .from('live_draws')
        .update(updateData)
        .eq('id', drawId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating draw status:', error);
      throw error;
    }
  };

  const completeDraw = async (drawId: string) => {
    try {
      // Update draw to completed
      await supabase
        .from('live_draws')
        .update({ status: 'completed' })
        .eq('id', drawId);

      // Set draw status to inactive
      await supabase
        .from('draw_status')
        .update({
          is_active: false,
          current_draw_id: null
        })
        .eq('id', drawStatus?.id);

    } catch (error) {
      console.error('Error completing draw:', error);
      throw error;
    }
  };

  return {
    activeDraw,
    drawStatus,
    isConnected,
    startCountdownDraw: isAdmin ? startCountdownDraw : undefined,
    updateDrawStatus: isAdmin ? updateDrawStatus : undefined,
    completeDraw: isAdmin ? completeDraw : undefined
  };
};
