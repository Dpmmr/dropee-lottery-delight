
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Customer, Event } from '@/types/lottery';

export const useDrawLogic = (customers: Customer[], events: Event[]) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [showCrystalBalls, setShowCrystalBalls] = useState(false);
  const [showWinnerReveal, setShowWinnerReveal] = useState(false);
  const [currentWinners, setCurrentWinners] = useState<string[]>([]);
  const [currentPrizes, setCurrentPrizes] = useState<string[]>([]);

  const queryClient = useQueryClient();

  const conductDraw = async (eventId: string, prizeDescription: string, prizes: string[]) => {
    const event = events.find(e => e.id === eventId);
    if (!event || customers.length === 0) return;

    console.log('Conducting draw for event:', eventId, 'with prizes:', prizes);
    setIsDrawing(true);
    setShowCrystalBalls(true);
    setCurrentPrizes(prizes);

    // Record the draw
    await supabase.from('draws').insert({
      event_id: eventId,
      total_participants: customers.length
    });
  };

  const handleAnimationComplete = async (winnerNames: string[]) => {
    console.log('Animation completed with winners:', winnerNames);
    setShowCrystalBalls(false);
    setCurrentWinners(winnerNames);
    setShowWinnerReveal(true);

    // Save winners to database with individual prizes
    const event = events.find(e => e.active);
    if (event) {
      for (let i = 0; i < winnerNames.length; i++) {
        const winnerName = winnerNames[i];
        const customer = customers.find(c => c.name === winnerName);
        if (customer) {
          const prizeDescription = currentPrizes[i] || 'Participation Prize';
          
          await supabase.from('winners').insert({
            customer_id: customer.id,
            event_id: event.id,
            prize_description: prizeDescription
          });
        }
      }
    }

    // Refresh data
    queryClient.invalidateQueries({ queryKey: ['winners'] });
    queryClient.invalidateQueries({ queryKey: ['draws'] });
  };

  const closeWinnerReveal = () => {
    setShowWinnerReveal(false);
    setIsDrawing(false);
    setCurrentWinners([]);
    setCurrentPrizes([]);
  };

  const goBackToDraw = () => {
    setShowWinnerReveal(false);
    setShowCrystalBalls(true);
  };

  return {
    isDrawing,
    showCrystalBalls,
    setShowCrystalBalls,
    showWinnerReveal,
    currentWinners,
    currentPrizes,
    conductDraw,
    handleAnimationComplete,
    closeWinnerReveal,
    goBackToDraw
  };
};
