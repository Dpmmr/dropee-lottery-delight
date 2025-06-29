
import React, { useState, useEffect } from 'react';

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
  const [currentNames, setCurrentNames] = useState<string[]>([]);
  const [phase, setPhase] = useState<'building' | 'selecting' | 'finalizing'>('building');
  const [selectedWinners, setSelectedWinners] = useState<string[]>([]);

  useEffect(() => {
    let nameInterval: NodeJS.Timeout;
    let phaseTimeout: NodeJS.Timeout;

    // Phase 1: Building tension (2 seconds)
    if (phase === 'building') {
      nameInterval = setInterval(() => {
        const shuffledNames = [...participants].sort(() => 0.5 - Math.random());
        setCurrentNames(shuffledNames.slice(0, winnersCount));
      }, 100);

      phaseTimeout = setTimeout(() => {
        setPhase('selecting');
      }, 2000);
    }

    // Phase 2: Selecting winners (2 seconds)
    if (phase === 'selecting') {
      nameInterval = setInterval(() => {
        const shuffledNames = [...participants].sort(() => 0.5 - Math.random());
        setCurrentNames(shuffledNames.slice(0, winnersCount));
      }, 200); // Slower cycling

      phaseTimeout = setTimeout(() => {
        setPhase('finalizing');
      }, 2000);
    }

    // Phase 3: Final selection (1 second)
    if (phase === 'finalizing') {
      const finalWinners = [...participants].sort(() => 0.5 - Math.random()).slice(0, winnersCount);
      setSelectedWinners(finalWinners);
      setCurrentNames(finalWinners);

      phaseTimeout = setTimeout(() => {
        onAnimationComplete(finalWinners);
      }, 1000);
    }

    return () => {
      if (nameInterval) clearInterval(nameInterval);
      if (phaseTimeout) clearTimeout(phaseTimeout);
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

  return (
    <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 px-4 overflow-hidden">
      {/* Magical Particle Background */}
      <div className="absolute inset-0">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          >
            <div className="w-1 h-1 bg-cyan-400 rounded-full opacity-60" />
          </div>
        ))}
      </div>

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
            <div key={index} className="relative">
              {/* Crystal Ball */}
              <div className={`relative w-24 h-24 md:w-40 md:h-40 ${getIntensity()}`}>
                {/* Outer Glow */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-400 via-blue-500 to-cyan-400 opacity-30 blur-xl animate-pulse" />
                
                {/* Main Crystal Ball */}
                <div className="relative w-full h-full rounded-full bg-gradient-to-br from-purple-400 via-blue-500 to-cyan-400 shadow-2xl">
                  {/* Inner Reflections */}
                  <div className="absolute inset-2 rounded-full bg-gradient-to-br from-white/40 to-transparent" />
                  <div className="absolute inset-4 rounded-full bg-gradient-to-br from-white/60 to-transparent animate-pulse" />
                  
                  {/* Winner Name Display */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center px-2">
                      {currentNames[index] && (
                        <div className="text-white font-bold text-xs md:text-base break-words leading-tight">
                          {currentNames[index]}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Sparkle Effects */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-2xl md:text-4xl animate-spin">✨</div>
                </div>

                {/* Position Number */}
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold text-sm md:text-lg px-3 py-1 rounded-full shadow-lg">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Progress Indicator */}
        <div className="mb-6">
          <div className="text-lg md:text-2xl text-white mb-4">
            Selecting {winnersCount} lucky winner{winnersCount > 1 ? 's' : ''} from {participants.length} participants...
          </div>
          
          {/* Animated Progress Bar */}
          <div className="w-full max-w-md mx-auto bg-white/20 rounded-full h-3 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 transition-all duration-1000 animate-pulse"
              style={{ 
                width: phase === 'building' ? '33%' : phase === 'selecting' ? '66%' : '100%' 
              }}
            />
          </div>
        </div>

        {/* Mystical Loading Animation */}
        <div className="flex justify-center space-x-2 md:space-x-4">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className="w-3 h-3 md:w-4 md:h-4 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>

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
