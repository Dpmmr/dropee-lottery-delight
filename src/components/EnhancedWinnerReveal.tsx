
import React, { useState, useEffect } from 'react';
import { X, ArrowLeft } from 'lucide-react';

interface EnhancedWinnerRevealProps {
  winners: string[];
  prizes: string[];
  onClose: () => void;
  onBack: () => void;
}

const EnhancedWinnerReveal: React.FC<EnhancedWinnerRevealProps> = ({ 
  winners, 
  prizes, 
  onClose, 
  onBack 
}) => {
  const [revealedWinners, setRevealedWinners] = useState<number[]>([]);
  const [confetti, setConfetti] = useState<Array<{id: number, x: number, y: number, color: string, delay: number}>>([]);
  const [currentlyRevealing, setCurrentlyRevealing] = useState(0);

  useEffect(() => {
    // Generate confetti particles
    const newConfetti = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      color: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'][Math.floor(Math.random() * 6)],
      delay: Math.random() * 3
    }));
    setConfetti(newConfetti);

    // Staggered winner reveal
    const revealInterval = setInterval(() => {
      setCurrentlyRevealing(prev => {
        if (prev < winners.length) {
          setRevealedWinners(current => [...current, prev]);
          return prev + 1;
        }
        clearInterval(revealInterval);
        return prev;
      });
    }, 800);

    return () => clearInterval(revealInterval);
  }, [winners.length]);

  const getWinnerIcon = (index: number) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return '🏆';
  };

  const getWinnerGradient = (index: number) => {
    if (index === 0) return 'from-yellow-400 via-yellow-300 to-yellow-500';
    if (index === 1) return 'from-gray-300 via-gray-400 to-gray-500';
    if (index === 2) return 'from-orange-400 via-orange-300 to-orange-500';
    return 'from-purple-400 via-purple-300 to-purple-500';
  };

  return (
    <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 px-4 overflow-hidden">
      {/* Animated Confetti Background */}
      <div className="absolute inset-0 pointer-events-none">
        {confetti.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-2 h-2 rounded-full animate-bounce"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              backgroundColor: particle.color,
              animationDelay: `${particle.delay}s`,
              animationDuration: '2s'
            }}
          />
        ))}
      </div>

      {/* Celebration Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-pink-900/30 to-yellow-900/30 animate-pulse" />

      <div className="relative z-10 bg-gradient-to-br from-purple-600/90 via-pink-600/90 to-orange-500/90 backdrop-blur-lg rounded-3xl p-6 md:p-8 max-w-2xl w-full mx-auto border border-white/20 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors hover:scale-110 transform"
        >
          <X className="w-6 h-6" />
        </button>
        
        <div className="text-center">
          {/* Main Celebration Header */}
          <div className="mb-8">
            <div className="text-4xl md:text-6xl mb-4 animate-bounce">
              🎉✨🎊
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-2 animate-pulse">
              CONGRATULATIONS!
            </h2>
            <div className="text-xl md:text-2xl text-yellow-300 font-semibold">
              Our Lucky Winners! 🌟
            </div>
          </div>
          
          {/* Winners Container */}
          <div className="space-y-6 mb-8">
            {winners.map((winner, index) => (
              <div
                key={index}
                className={`transform transition-all duration-1000 ${
                  revealedWinners.includes(index) 
                    ? 'translate-y-0 opacity-100 scale-100' 
                    : 'translate-y-8 opacity-0 scale-95'
                }`}
              >
                <div className={`bg-gradient-to-r ${getWinnerGradient(index)} rounded-2xl p-6 shadow-xl border-2 border-white/30 hover:scale-105 transform transition-all duration-300`}>
                  <div className="flex items-center justify-center space-x-4">
                    {/* Position Icon */}
                    <div className="text-4xl md:text-6xl animate-bounce">
                      {getWinnerIcon(index)}
                    </div>
                    
                    {/* Winner Info */}
                    <div className="flex-1 text-center">
                      <div className="text-sm md:text-base text-white/80 font-medium mb-1">
                        {index === 0 ? 'FIRST PLACE' : index === 1 ? 'SECOND PLACE' : index === 2 ? 'THIRD PLACE' : `${index + 1}TH PLACE`}
                      </div>
                      <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                        {winner}
                      </h3>
                      <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/30">
                        <p className="text-white/90 font-semibold text-sm md:text-base">
                          {prizes[index] || 'Participation Prize'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Celebration Message */}
          {revealedWinners.length === winners.length && (
            <div className="mb-6 animate-fade-in">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-lg md:text-xl text-yellow-300 font-semibold mb-2">
                  🎊 Thank you to all participants! 🎊
                </div>
                <div className="text-white/90 text-sm md:text-base">
                  Keep ordering from DROPEE for more chances to win amazing prizes!
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4">
            <button
              onClick={onBack}
              className="flex-1 bg-purple-600/80 hover:bg-purple-700/80 backdrop-blur-sm text-white px-6 py-3 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 border border-purple-400/30 hover:scale-105 transform"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Draw Again</span>
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-green-600/80 hover:bg-green-700/80 backdrop-blur-sm text-white px-6 py-3 rounded-xl transition-all duration-300 border border-green-400/30 hover:scale-105 transform"
            >
              🎉 Celebrate! 🎉
            </button>
          </div>
        </div>

        {/* Fireworks Effect */}
        {revealedWinners.length === winners.length && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="absolute animate-ping"
                style={{
                  left: `${10 + (i * 10)}%`,
                  top: `${10 + ((i % 3) * 20)}%`,
                  animationDelay: `${i * 0.3}s`,
                  animationDuration: '2s'
                }}
              >
                <div className="w-4 h-4 bg-yellow-400 rounded-full opacity-60" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedWinnerReveal;
