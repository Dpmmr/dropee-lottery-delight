
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
  const [confetti, setConfetti] = useState<Array<{id: number, x: number, y: number, color: string, delay: number, size: number, type: string}>>([]);
  const [currentlyRevealing, setCurrentlyRevealing] = useState(0);
  const [celebrationIntensity, setCelebrationIntensity] = useState(0);
  const [spotlightEffect, setSpotlightEffect] = useState<number>(-1);
  const [fireworks, setFireworks] = useState<Array<{id: number, x: number, y: number, delay: number, color: string}>>([]);

  useEffect(() => {
    // Generate enhanced confetti particles
    const confettiTypes = ['🎉', '🎊', '✨', '🌟', '💫', '🎈', '🎀', '💎'];
    const newConfetti = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      color: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#FF69B4', '#00CED1'][Math.floor(Math.random() * 8)],
      delay: Math.random() * 4,
      size: 0.5 + Math.random() * 1.5,
      type: confettiTypes[Math.floor(Math.random() * confettiTypes.length)]
    }));
    setConfetti(newConfetti);

    // Generate spectacular fireworks
    const newFireworks = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 60 + 20,
      delay: Math.random() * 3,
      color: ['#FFD700', '#FF1493', '#00BFFF', '#32CD32', '#FF69B4', '#FFA500'][Math.floor(Math.random() * 6)]
    }));
    setFireworks(newFireworks);

    // Enhanced staggered winner reveal with spotlight effect
    const revealInterval = setInterval(() => {
      setCurrentlyRevealing(prev => {
        if (prev < winners.length) {
          setRevealedWinners(current => [...current, prev]);
          setSpotlightEffect(prev);
          setCelebrationIntensity(current => current + 25);
          
          // Reset spotlight after 2 seconds
          setTimeout(() => setSpotlightEffect(-1), 2000);
          
          return prev + 1;
        }
        clearInterval(revealInterval);
        return prev;
      });
    }, 1200);

    return () => clearInterval(revealInterval);
  }, [winners.length]);

  // Continuous celebration animation
  useEffect(() => {
    if (revealedWinners.length === winners.length) {
      const interval = setInterval(() => {
        setCelebrationIntensity(prev => (prev + 1) % 100);
      }, 100);
      return () => clearInterval(interval);
    }
  }, [revealedWinners.length, winners.length]);

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
      {/* Enhanced Confetti & Celebration Effects */}
      <div className="absolute inset-0 pointer-events-none">
        {confetti.map((particle) => (
          <div
            key={particle.id}
            className="absolute animate-bounce opacity-80"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              fontSize: `${particle.size}rem`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${1.5 + Math.random()}s`,
              transform: `rotate(${Math.random() * 360}deg)`
            }}
          >
            {Math.random() > 0.5 ? particle.type : (
              <div 
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: particle.color }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Spectacular Fireworks */}
      <div className="absolute inset-0 pointer-events-none">
        {fireworks.map((firework) => (
          <div
            key={firework.id}
            className="absolute"
            style={{
              left: `${firework.x}%`,
              top: `${firework.y}%`,
              animationDelay: `${firework.delay}s`
            }}
          >
            <div className="relative">
              <div 
                className="w-4 h-4 rounded-full animate-ping opacity-75"
                style={{ backgroundColor: firework.color }}
              />
              <div 
                className="absolute inset-0 w-8 h-8 border-2 rounded-full animate-ping"
                style={{ 
                  borderColor: firework.color,
                  animationDelay: '0.5s',
                  animationDuration: '2s' 
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Spotlight Effect */}
      {spotlightEffect >= 0 && (
        <div className="absolute inset-0 pointer-events-none">
          <div 
            className="absolute bg-white/20 rounded-full animate-pulse"
            style={{
              width: '200px',
              height: '200px',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              boxShadow: '0 0 100px 50px rgba(255,255,255,0.1)'
            }}
          />
        </div>
      )}

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
