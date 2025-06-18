
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { UserSession } from '@/types/lottery';

export const useLiveMonitoring = () => {
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [peakUsers, setPeakUsers] = useState(0);
  const [sessionId] = useState(() => crypto.randomUUID());
  const channelRef = useRef<any>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Update user session
    const updateSession = async () => {
      try {
        await supabase
          .from('user_sessions')
          .upsert({ 
            session_id: sessionId, 
            last_seen: new Date().toISOString() 
          });
      } catch (error) {
        console.log('Session update error:', error);
      }
    };

    // Clean old sessions and count active ones
    const countActiveSessions = async () => {
      try {
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
        
        // Remove old sessions
        await supabase
          .from('user_sessions')
          .delete()
          .lt('last_seen', fiveMinutesAgo);

        // Count active sessions
        const { data } = await supabase
          .from('user_sessions')
          .select('*')
          .gte('last_seen', fiveMinutesAgo);

        const activeCount = data?.length || 0;
        setOnlineUsers(activeCount);
        setPeakUsers(prev => Math.max(prev, activeCount));
      } catch (error) {
        console.log('Count sessions error:', error);
      }
    };

    // Initial setup
    updateSession();
    countActiveSessions();

    // Update every 30 seconds
    intervalRef.current = setInterval(() => {
      updateSession();
      countActiveSessions();
    }, 30000);

    // Create and subscribe to realtime channel only if not already created
    if (!channelRef.current) {
      channelRef.current = supabase
        .channel(`user-sessions-${sessionId}`)
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'user_sessions' },
          () => {
            // Use setTimeout to prevent blocking the callback
            setTimeout(() => countActiveSessions(), 0);
          }
        )
        .subscribe((status) => {
          console.log('Channel subscription status:', status);
        });
    }

    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      
      if (channelRef.current) {
        console.log('Cleaning up channel subscription');
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [sessionId]);

  return { onlineUsers, peakUsers };
};
