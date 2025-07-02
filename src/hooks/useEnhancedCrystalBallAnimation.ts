import { useState, useEffect } from 'react';

interface UseEnhancedCrystalBallAnimationProps {
  winnersCount: number;
  participants: string[];
  onAnimationComplete: (winners: string[]) => void;
}

export const useEnhancedCrystalBallAnimation = ({
  winnersCount,
  participants,
  onAnimationComplete
}: UseEnhancedCrystalBallAnimationProps) => {
  const [currentNames, setCurrentNames] = useState<string[]>([]);
  const [phase, setPhase] = useState<'building' | 'selecting' | 'finalizing'>('building');
  const [selectedWinners, setSelectedWinners] = useState<string[]>([]);
  const [crystalIntensity, setCrystalIntensity] = useState(0);

  // Enhanced phase system with intensity tracking
  useEffect(() => {
    let nameInterval: NodeJS.Timeout;
    let phaseTimeout: NodeJS.Timeout;
    let intensityInterval: NodeJS.Timeout;

    // Continuous intensity building
    intensityInterval = setInterval(() => {
      setCrystalIntensity(prev => (prev + 1) % 100);
    }, 100);

    // Phase 1: Building tension (3 seconds)
    if (phase === 'building') {
      nameInterval = setInterval(() => {
        const shuffledNames = [...participants].sort(() => 0.5 - Math.random());
        setCurrentNames(shuffledNames.slice(0, winnersCount));
      }, 80);

      phaseTimeout = setTimeout(() => {
        setPhase('selecting');
      }, 3000);
    }

    // Phase 2: Selecting winners (3 seconds)
    if (phase === 'selecting') {
      nameInterval = setInterval(() => {
        const shuffledNames = [...participants].sort(() => 0.5 - Math.random());
        setCurrentNames(shuffledNames.slice(0, winnersCount));
      }, 150);

      phaseTimeout = setTimeout(() => {
        setPhase('finalizing');
      }, 3000);
    }

    // Phase 3: Final selection (2 seconds)
    if (phase === 'finalizing') {
      const finalWinners = [...participants].sort(() => 0.5 - Math.random()).slice(0, winnersCount);
      setSelectedWinners(finalWinners);
      setCurrentNames(finalWinners);

      phaseTimeout = setTimeout(() => {
        onAnimationComplete(finalWinners);
      }, 2000);
    }

    return () => {
      if (nameInterval) clearInterval(nameInterval);
      if (phaseTimeout) clearTimeout(phaseTimeout);
      if (intensityInterval) clearInterval(intensityInterval);
    };
  }, [phase, winnersCount, participants, onAnimationComplete]);

  const getPhaseMessage = () => {
    switch (phase) {
      case 'building':
        return '🔮 Channeling the draw energy...';
      case 'selecting':
        return '⚡ The spirits are choosing...';
      case 'finalizing':
        return '✨ Winners have been selected! ✨';
      default:
        return '';
    }
  };

  const getIntensity = () => {
    switch (phase) {
      case 'building':
        return 'animate-spin';
      case 'selecting':
        return 'animate-pulse';
      case 'finalizing':
        return 'animate-bounce';
      default:
        return '';
    }
  };

  return {
    currentNames,
    phase,
    selectedWinners,
    crystalIntensity,
    getPhaseMessage,
    getIntensity
  };
};