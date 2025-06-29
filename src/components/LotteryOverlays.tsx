
import React from 'react';
import EnhancedDrawCountdown from './EnhancedDrawCountdown';
import EnhancedCrystalBallAnimation from './EnhancedCrystalBallAnimation';
import EnhancedWinnerReveal from './EnhancedWinnerReveal';
import { useRealTimeDraws } from '@/hooks/useRealTimeDraws';
import type { Event } from '@/types/lottery';

interface LotteryOverlaysProps {
  showUserCountdown: boolean;
  countdownDuration: number;
  onCountdownComplete: () => void;
  onCountdownCancel: () => void;
  showCrystalBalls: boolean;
  events: Event[];
  participants: string[];
  onAnimationComplete: (winners: string[]) => void;
  showWinnerReveal: boolean;
  currentWinners: string[];
  currentPrizes: string[];
  onWinnerRevealClose: () => void;
  onWinnerRevealBack: () => void;
  isAdmin: boolean;
}

const LotteryOverlays: React.FC<LotteryOverlaysProps> = ({
  showUserCountdown,
  countdownDuration,
  onCountdownComplete,
  onCountdownCancel,
  showCrystalBalls,
  events,
  participants,
  onAnimationComplete,
  showWinnerReveal,
  currentWinners,
  currentPrizes,
  onWinnerRevealClose,
  onWinnerRevealBack,
  isAdmin
}) => {
  const { activeDraw } = useRealTimeDraws(isAdmin);

  // Use real-time draw data when available, fallback to props
  const shouldShowCountdown = activeDraw?.status === 'countdown' || showUserCountdown;
  const shouldShowDrawing = activeDraw?.status === 'drawing' || showCrystalBalls;
  const shouldShowRevealing = activeDraw?.status === 'revealing' || showWinnerReveal;

  const drawPrizes = activeDraw?.prizes || currentPrizes;
  const drawWinners = activeDraw?.current_winners || currentWinners;
  const participantCount = activeDraw?.total_participants || participants.length;

  return (
    <>
      {shouldShowCountdown && (
        <EnhancedDrawCountdown
          duration={activeDraw?.countdown_duration || countdownDuration}
          onComplete={onCountdownComplete}
          onCancel={onCountdownCancel}
          participantCount={participantCount}
          prizes={drawPrizes}
        />
      )}
      
      {shouldShowDrawing && (
        <EnhancedCrystalBallAnimation
          winnersCount={events.find(e => e.active)?.winners_count || 3}
          onAnimationComplete={onAnimationComplete}
          participants={participants}
        />
      )}
      
      {shouldShowRevealing && (
        <EnhancedWinnerReveal
          winners={drawWinners}
          prizes={drawPrizes}
          onClose={onWinnerRevealClose}
          onBack={onWinnerRevealBack}
        />
      )}
    </>
  );
};

export default LotteryOverlays;
