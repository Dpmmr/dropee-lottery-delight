
import React from 'react';

interface CrystalBallAnimationProps {
  winnersCount: number;
  onAnimationComplete: (winners: string[]) => void;
  participants: string[];
}

const CrystalBallAnimation: React.FC<CrystalBallAnimationProps> = ({
  winnersCount,
  onAnimationComplete,
  participants
}) => {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      const shuffled = [...participants].sort(() => 0.5 - Math.random());
      const selectedWinners = shuffled.slice(0, winnersCount);
      onAnimationComplete(selectedWinners);
    }, 5000);

    return () => clearTimeout(timer);
  }, [winnersCount, onAnimationComplete, participants]);

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
      <div className="text-center">
        <h2 className="text-6xl font-bold text-white mb-8 animate-pulse">
          🔮 DRAWING WINNERS 🔮
        </h2>
        
        <div className="flex justify-center space-x-8 mb-8">
          {Array.from({ length: winnersCount }).map((_, index) => (
            <div
              key={index}
              className="relative"
            >
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-400 via-blue-500 to-cyan-400 animate-spin shadow-2xl">
                <div className="absolute inset-2 rounded-full bg-gradient-to-br from-white/30 to-transparent animate-pulse" />
                <div className="absolute inset-4 rounded-full bg-gradient-to-br from-white/50 to-transparent animate-bounce" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl animate-spin">✨</span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-2xl text-white mb-4">
          Selecting {winnersCount} lucky winner{winnersCount > 1 ? 's' : ''}...
        </div>

        <div className="flex justify-center space-x-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CrystalBallAnimation;
