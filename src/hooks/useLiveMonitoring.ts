
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { UserSession } from '@/types/lottery';

export const useLiveMonitoring = () => {
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [peakUsers, setPeakUsers] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  const [sessionId] = useState(() => crypto.randomUUID());
  const channelRef = useRef<any>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const heartbeatRef = useRef<NodeJS.Timeout | null>(null);
  const isSubscribedRef = useRef(false);

  useEffect(() => {
    // Update user session with heartbeat
    const updateSession = async () => {
      try {
        await supabase
          .from('user_sessions')
          .upsert({ 
            session_id: sessionId, 
            last_seen: new Date().toISOString() 
          });
        setConnectionStatus('connected');
      } catch (error) {
        console.log('Session update error:', error);
        setConnectionStatus('disconnected');
      }
    };

    // Clean old sessions and count active ones with deduplication
    const countActiveSessions = async () => {
      try {
        const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000).toISOString();
        
        // Remove old sessions
        await supabase
          .from('user_sessions')
          .delete()
          .lt('last_seen', twoMinutesAgo);

        // Count active unique sessions (deduplicated by session_id)
        const { data } = await supabase
          .from('user_sessions')
          .select('session_id')
          .gte('last_seen', twoMinutesAgo);

        // Deduplicate sessions by session_id
        const uniqueSessions = new Set(data?.map(session => session.session_id) || []);
        const activeCount = uniqueSessions.size;
        
        setOnlineUsers(activeCount);
        setPeakUsers(prev => Math.max(prev, activeCount));
        
        console.log(`Active users: ${activeCount} (from ${data?.length || 0} total sessions)`);
      } catch (error) {
        console.log('Count sessions error:', error);
        setConnectionStatus('disconnected');
      }
    };

    // Initial setup
    updateSession();
    countActiveSessions();

    // Heartbeat every 15 seconds for more responsive updates
    heartbeatRef.current = setInterval(() => {
      updateSession();
    }, 15000);

    // Count sessions every 10 seconds
    intervalRef.current = setInterval(() => {
      countActiveSessions();
    }, 10000);

    // Create and subscribe to realtime channel only if not already created
    if (!channelRef.current && !isSubscribedRef.current) {
      channelRef.current = supabase
        .channel(`user-sessions-monitor-${sessionId}`)
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'user_sessions' },
          () => {
            // Debounced update to prevent too many calls
            setTimeout(() => countActiveSessions(), 500);
          }
        )
        .subscribe((status) => {
          console.log('Live monitoring channel status:', status);
          if (status === 'SUBSCRIBED') {
            isSubscribedRef.current = true;
            setConnectionStatus('connected');
          } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
            setConnectionStatus('disconnected');
            isSubscribedRef.current = false;
          }
        });
    }

    // Cleanup function
    return () => {
      if (heartbeatRef.current) {
        clearInterval(heartbeatRef.current);
        heartbeatRef.current = null;
      }
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      
      if (channelRef.current && isSubscribedRef.current) {
        console.log('Cleaning up live monitoring channel');
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
        isSubscribedRef.current = false;
      }
    };
  }, [sessionId]);

  return { onlineUsers, peakUsers, connectionStatus };
};
