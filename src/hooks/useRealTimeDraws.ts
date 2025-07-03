
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { LiveDraw, DrawStatus } from '@/types/lottery';

export const useRealTimeDraws = (isAdmin: boolean) => {
  const [activeDraw, setActiveDraw] = useState<LiveDraw | null>(null);
  const [drawStatus, setDrawStatus] = useState<DrawStatus | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  
  // Refs to track subscriptions and prevent duplicates
  const channelsRef = useRef<any[]>([]);
  const isSubscribedRef = useRef(false);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const cleanup = () => {
    console.log('Cleaning up real-time draw listeners');
    
    // Clear retry timeout
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
    
    // Remove all channels
    channelsRef.current.forEach(channel => {
      try {
        supabase.removeChannel(channel);
      } catch (error) {
        console.log('Error removing channel:', error);
      }
    });
    channelsRef.current = [];
    isSubscribedRef.current = false;
  };

  const setupSubscriptions = async () => {
    if (isSubscribedRef.current) {
      console.log('Already subscribed, skipping setup');
      return;
    }

    try {
      console.log('Setting up real-time draw listeners');
      setConnectionError(null);

      // Create unique channel names to prevent conflicts
      const timestamp = Date.now();
      const drawStatusChannelName = `draw-status-${timestamp}`;
      const liveDrawsChannelName = `live-draws-${timestamp}`;

      // Set up draw status subscription
      const drawStatusChannel = supabase
        .channel(drawStatusChannelName)
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'draw_status'
        }, (payload) => {
          console.log('Draw status changed:', payload);
          if (payload.new) {
            setDrawStatus(payload.new as DrawStatus);
          }
        })
        .subscribe((status) => {
          console.log('Draw status channel status:', status);
          if (status === 'SUBSCRIBED') {
            setIsConnected(true);
          } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
            setConnectionError('Draw status subscription failed');
            scheduleRetry();
          }
        });

      // Set up live draws subscription
      const liveDrawsChannel = supabase
        .channel(liveDrawsChannelName)
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
        .subscribe((status) => {
          console.log('Live draws channel status:', status);
          if (status === 'SUBSCRIBED') {
            setIsConnected(true);
          } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
            setConnectionError('Live draws subscription failed');
            scheduleRetry();
          }
        });

      // Store channels for cleanup
      channelsRef.current = [drawStatusChannel, liveDrawsChannel];
      isSubscribedRef.current = true;

    } catch (error) {
      console.error('Error setting up subscriptions:', error);
      setConnectionError('Failed to setup real-time subscriptions');
      scheduleRetry();
    }
  };

  const scheduleRetry = () => {
    if (retryTimeoutRef.current) return;
    
    // Exponential backoff with circuit breaker
    const retryCount = useRef(0);
    const maxRetries = 3;
    const baseDelay = 5000;
    
    if (retryCount.current >= maxRetries) {
      console.log('Max retries reached, stopping reconnection attempts');
      setConnectionError('Connection failed after multiple attempts');
      return;
    }
    
    const delay = baseDelay * Math.pow(2, retryCount.current);
    console.log(`Scheduling subscription retry in ${delay/1000} seconds (attempt ${retryCount.current + 1})`);
    
    retryTimeoutRef.current = setTimeout(() => {
      cleanup();
      retryTimeoutRef.current = null;
      retryCount.current++;
      setupSubscriptions();
    }, delay);
  };

  const fetchInitialData = async () => {
    try {
      console.log('Fetching initial draw data');

      // Get current draw status (use maybeSingle to handle no records)
      const { data: statusData, error: statusError } = await supabase
        .from('draw_status')
        .select('*')
        .maybeSingle();
      
      if (statusError) {
        console.error('Error fetching draw status:', statusError);
        setConnectionError('Failed to fetch draw status');
        return;
      }

      if (statusData) {
        console.log('Found draw status:', statusData);
        setDrawStatus(statusData);

        // If there's an active draw, fetch it
        if (statusData.is_active && statusData.current_draw_id) {
          const { data: drawData, error: drawError } = await supabase
            .from('live_draws')
            .select('*')
            .eq('id', statusData.current_draw_id)
            .maybeSingle();
          
          if (drawError) {
            console.error('Error fetching active draw:', drawError);
            setConnectionError('Failed to fetch active draw');
          } else if (drawData) {
            console.log('Found active draw:', drawData);
            setActiveDraw(drawData as LiveDraw);
          }
        }
      } else {
        console.log('No draw status found, creating default');
        // Create default draw status if none exists
        const { data: newStatus, error: createError } = await supabase
          .from('draw_status')
          .insert({ is_active: false, current_draw_id: null })
          .select()
          .single();

        if (createError) {
          console.error('Error creating default draw status:', createError);
          setConnectionError('Failed to initialize draw status');
        } else {
          setDrawStatus(newStatus);
        }
      }
    } catch (error) {
      console.error('Error in fetchInitialData:', error);
      setConnectionError('Failed to load initial data');
    }
  };

  useEffect(() => {
    fetchInitialData();
    setupSubscriptions();

    return cleanup;
  }, []);

  // Admin functions for managing draws
  const startCountdownDraw = async (eventId: string, prizes: string[], duration: number, participantCount: number) => {
    if (!isAdmin) throw new Error('Admin access required');

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
          total_participants: participantCount,
          current_winners: []
        })
        .select()
        .single();

      if (drawError) throw drawError;

      // Update or create draw status
      const { error: statusError } = await supabase
        .from('draw_status')
        .upsert({
          id: drawStatus?.id || crypto.randomUUID(),
          is_active: true,
          current_draw_id: newDraw.id
        });

      if (statusError) throw statusError;

      console.log('Successfully started countdown draw:', newDraw);
      return newDraw;
    } catch (error) {
      console.error('Error starting countdown draw:', error);
      throw error;
    }
  };

  const updateDrawStatus = async (drawId: string, newStatus: LiveDraw['status'], winners?: string[]) => {
    if (!isAdmin) throw new Error('Admin access required');

    try {
      console.log('Updating draw status:', { drawId, newStatus, winners });

      const updateData: any = { status: newStatus };
      if (winners) {
        updateData.current_winners = winners;
      }

      const { error } = await supabase
        .from('live_draws')
        .update(updateData)
        .eq('id', drawId);

      if (error) throw error;
      console.log('Successfully updated draw status');
    } catch (error) {
      console.error('Error updating draw status:', error);
      throw error;
    }
  };

  const completeDraw = async (drawId: string) => {
    if (!isAdmin) throw new Error('Admin access required');

    try {
      console.log('Completing draw:', drawId);

      // Update draw to completed
      await supabase
        .from('live_draws')
        .update({ status: 'completed' })
        .eq('id', drawId);

      // Set draw status to inactive
      await supabase
        .from('draw_status')
        .upsert({
          id: drawStatus?.id || crypto.randomUUID(),
          is_active: false,
          current_draw_id: null
        });

      console.log('Successfully completed draw');
    } catch (error) {
      console.error('Error completing draw:', error);
      throw error;
    }
  };

  // Test functions for admins
  const createTestDraw = async () => {
    if (!isAdmin) throw new Error('Admin access required');

    try {
      console.log('Creating test draw');
      
      // First, get or create a test event
      let testEventId;
      const { data: existingEvent } = await supabase
        .from('events')
        .select('id')
        .eq('name', 'Test Event')
        .maybeSingle();
      
      if (existingEvent) {
        testEventId = existingEvent.id;
      } else {
        const { data: newEvent, error: eventError } = await supabase
          .from('events')
          .insert({
            name: 'Test Event',
            winners_count: 3,
            event_date: new Date().toISOString().split('T')[0],
            active: false
          })
          .select()
          .single();
        
        if (eventError) throw eventError;
        testEventId = newEvent.id;
      }
      
      const testDraw = {
        event_id: testEventId,
        status: 'countdown' as const,
        countdown_duration: 10,
        prizes: ['Test Prize 1', 'Test Prize 2', 'Test Prize 3'],
        total_participants: 25,
        current_winners: []
      };

      const { data: newDraw, error: drawError } = await supabase
        .from('live_draws')
        .insert(testDraw)
        .select()
        .single();

      if (drawError) throw drawError;

      await supabase
        .from('draw_status')
        .upsert({
          id: drawStatus?.id || crypto.randomUUID(),
          is_active: true,
          current_draw_id: newDraw.id
        });

      console.log('Test draw created successfully');
      return newDraw;
    } catch (error) {
      console.error('Error creating test draw:', error);
      throw error;
    }
  };

  const clearAllDraws = async () => {
    if (!isAdmin) throw new Error('Admin access required');

    try {
      console.log('Clearing all draws');
      
      await supabase.from('live_draws').delete().neq('id', '');
      await supabase
        .from('draw_status')
        .upsert({
          id: drawStatus?.id || crypto.randomUUID(),
          is_active: false,
          current_draw_id: null
        });

      console.log('All draws cleared');
    } catch (error) {
      console.error('Error clearing draws:', error);
      throw error;
    }
  };

  const emergencyReset = async () => {
    if (!isAdmin) throw new Error('Admin access required');

    try {
      console.log('Performing emergency reset');
      
      // Call the database function for emergency reset
      const { error } = await supabase.rpc('emergency_reset_draws');
      if (error) throw error;
      
      // Reset local state
      setActiveDraw(null);
      setDrawStatus(null);
      setConnectionError(null);
      
      console.log('Emergency reset completed');
    } catch (error) {
      console.error('Error during emergency reset:', error);
      throw error;
    }
  };

  return {
    activeDraw,
    drawStatus,
    isConnected,
    connectionError,
    startCountdownDraw: isAdmin ? startCountdownDraw : undefined,
    updateDrawStatus: isAdmin ? updateDrawStatus : undefined,
    completeDraw: isAdmin ? completeDraw : undefined,
    createTestDraw: isAdmin ? createTestDraw : undefined,
    clearAllDraws: isAdmin ? clearAllDraws : undefined,
    emergencyReset: isAdmin ? emergencyReset : undefined
  };
};
