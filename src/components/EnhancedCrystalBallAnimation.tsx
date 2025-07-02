
import React from 'react';
import { useEnhancedCrystalBallAnimation } from '@/hooks/useEnhancedCrystalBallAnimation';
import MagicalParticleSystem from './crystal-ball/MagicalParticleSystem';
import MysticalRunes from './crystal-ball/MysticalRunes';
import EnergyPulseRings from './crystal-ball/EnergyPulseRings';
import CrystalBall from './crystal-ball/CrystalBall';
import DrawProgressIndicator from './crystal-ball/DrawProgressIndicator';
import MysticalLoadingAnimation from './crystal-ball/MysticalLoadingAnimation';

interface EnhancedCrystalBallAnimationProps {
  winnersCount: number;
  onAnimationComplete: (winners: string[]) => void;
  participants: string[];
}

const EnhancedCrystalBallAnimation: React.FC<EnhancedCrystalBallAnimationProps> = ({
  winnersCount,
  onAnimationComplete,
  participants
}) => {
  const {
    currentNames,
    phase,
    crystalIntensity,
    getPhaseMessage,
    getIntensity
  } = useEnhancedCrystalBallAnimation({
    winnersCount,
    participants,
    onAnimationComplete
  });

  return (
    <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 px-4 overflow-hidden">
      {/* Enhanced Magical Particle System */}
      <MagicalParticleSystem />

      {/* Floating Mystical Runes */}
      <MysticalRunes crystalIntensity={crystalIntensity} />

      {/* Energy Pulse Rings */}
      <EnergyPulseRings />

      {/* Swirling Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 via-blue-900/50 to-cyan-900/50 animate-pulse" />

      <div className="relative z-10 text-center max-w-4xl mx-auto">
        {/* Main Title */}
        <h2 className="text-3xl md:text-6xl font-bold text-white mb-8 animate-pulse">
          🔮 MYSTICAL DRAW IN PROGRESS 🔮
        </h2>

        {/* Phase Message */}
        <div className="text-xl md:text-3xl text-cyan-300 mb-8 font-semibold">
          {getPhaseMessage()}
        </div>

        {/* Crystal Balls Container */}
        <div className="flex justify-center flex-wrap gap-6 md:gap-12 mb-8">
          {Array.from({ length: winnersCount }).map((_, index) => (
            <CrystalBall
              key={index}
              index={index}
              name={currentNames[index]}
              intensity={getIntensity()}
            />
          ))}
        </div>

        {/* Progress Indicator */}
        <DrawProgressIndicator
          winnersCount={winnersCount}
          participantCount={participants.length}
          phase={phase}
        />

        {/* Mystical Loading Animation */}
        <MysticalLoadingAnimation />

        {/* Dramatic Final Phase Effect */}
        {phase === 'finalizing' && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-transparent to-yellow-400/20 animate-pulse" />
            {/* Screen flash effect */}
            <div className="absolute inset-0 bg-white/10 animate-ping" />
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedCrystalBallAnimation;
