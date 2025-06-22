
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useCountdown = (isAdmin: boolean) => {
  const [showUserCountdown, setShowUserCountdown] = useState(false);
  const [countdownDuration, setCountdownDuration] = useState(10);
  const [currentPrizes, setCurrentPrizes] = useState<string[]>([]);
  const countdownChannelRef = useRef<any>(null);

  // Listen for countdown broadcasts from admin (only for non-admin users)
  useEffect(() => {
    if (!isAdmin) {
      console.log('Setting up countdown listener for users');
      
      const setupCountdownListener = async () => {
        // Remove any existing channel first
        if (countdownChannelRef.current) {
          supabase.removeChannel(countdownChannelRef.current);
        }

        countdownChannelRef.current = supabase
          .channel('lottery-countdown-public', {
            config: {
              broadcast: { self: false }
            }
          })
          .on('broadcast', { event: 'countdown-start' }, (payload) => {
            console.log('User received countdown broadcast:', payload);
            if (payload.payload) {
              setCountdownDuration(payload.payload.duration || 10);
              setCurrentPrizes(payload.payload.prizes || []);
              setShowUserCountdown(true);
            }
          })
          .subscribe((status) => {
            console.log('User countdown channel status:', status);
          });
      };

      setupCountdownListener();

      return () => {
        if (countdownChannelRef.current) {
          console.log('Cleaning up user countdown channel');
          supabase.removeChannel(countdownChannelRef.current);
          countdownChannelRef.current = null;
        }
      };
    }
  }, [isAdmin]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (countdownChannelRef.current) {
        console.log('Cleaning up countdown channel on unmount');
        supabase.removeChannel(countdownChannelRef.current);
        countdownChannelRef.current = null;
      }
    };
  }, []);

  const handleUserCountdownComplete = () => {
    console.log('User countdown completed, starting crystal balls animation');
    setShowUserCountdown(false);
    return true; // Signal to start crystal balls
  };

  return {
    showUserCountdown,
    setShowUserCountdown,
    countdownDuration,
    currentPrizes,
    setCurrentPrizes,
    handleUserCountdownComplete
  };
};
