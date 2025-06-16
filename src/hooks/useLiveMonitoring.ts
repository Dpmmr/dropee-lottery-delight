
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { UserSession } from '@/types/lottery';

export const useLiveMonitoring = () => {
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [peakUsers, setPeakUsers] = useState(0);
  const [sessionId] = useState(() => crypto.randomUUID());

  useEffect(() => {
    // Update user session
    const updateSession = async () => {
      await supabase
        .from('user_sessions')
        .upsert({ 
          session_id: sessionId, 
          last_seen: new Date().toISOString() 
        });
    };

    // Clean old sessions and count active ones
    const countActiveSessions = async () => {
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
    };

    // Initial setup
    updateSession();
    countActiveSessions();

    // Update every 30 seconds
    const interval = setInterval(() => {
      updateSession();
      countActiveSessions();
    }, 30000);

    // Listen to realtime changes
    const channel = supabase
      .channel('user-sessions')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'user_sessions' },
        () => countActiveSessions()
      )
      .subscribe();

    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, [sessionId]);

  return { onlineUsers, peakUsers };
};
