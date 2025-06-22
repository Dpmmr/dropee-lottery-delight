
import React from 'react';
import DrawCountdown from './DrawCountdown';
import CrystalBallAnimation from './CrystalBallAnimation';
import WinnerReveal from './WinnerReveal';
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
  onWinnerRevealBack
}) => {
  return (
    <>
      {showUserCountdown && (
        <DrawCountdown
          duration={countdownDuration}
          onComplete={onCountdownComplete}
          onCancel={onCountdownCancel}
        />
      )}
      
      {showCrystalBalls && (
        <CrystalBallAnimation
          winnersCount={events.find(e => e.active)?.winners_count || 3}
          onAnimationComplete={onAnimationComplete}
          participants={participants}
        />
      )}
      
      {showWinnerReveal && (
        <WinnerReveal
          winners={currentWinners}
          prizes={currentPrizes}
          onClose={onWinnerRevealClose}
          onBack={onWinnerRevealBack}
        />
      )}
    </>
  );
};

export default LotteryOverlays;
