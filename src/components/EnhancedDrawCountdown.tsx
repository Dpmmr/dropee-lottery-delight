
import React, { useState, useEffect } from 'react';

interface EnhancedDrawCountdownProps {
  duration: number;
  onComplete: () => void;
  onCancel: () => void;
  participantCount: number;
  prizes: string[];
}

const EnhancedDrawCountdown: React.FC<EnhancedDrawCountdownProps> = ({ 
  duration, 
  onComplete, 
  onCancel, 
  participantCount,
  prizes 
}) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, delay: number, type: string}>>([]);
  const [floatingNames, setFloatingNames] = useState<Array<{id: number, name: string, x: number, y: number, rotation: number}>>([]);
  const [intensity, setIntensity] = useState(0);

  useEffect(() => {
    // Generate magical particles with different types
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 3,
      type: ['✨', '🌟', '💫', '⭐', '🔮'][Math.floor(Math.random() * 5)]
    }));
    setParticles(newParticles);

    // Generate floating participant names
    const sampleNames = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Henry'];
    const newFloatingNames = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      name: sampleNames[i] || `Participant ${i + 1}`,
      x: Math.random() * 80 + 10,
      y: Math.random() * 80 + 10,
      rotation: Math.random() * 360
    }));
    setFloatingNames(newFloatingNames);
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete();
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
      setIntensity(prev => prev + 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, onComplete]);

  // Dynamic floating names animation
  useEffect(() => {
    const interval = setInterval(() => {
      setFloatingNames(prev => prev.map(name => ({
        ...name,
        x: (name.x + Math.sin(Date.now() * 0.001 + name.id) * 0.5) % 100,
        y: (name.y + Math.cos(Date.now() * 0.001 + name.id) * 0.3) % 100,
        rotation: (name.rotation + 0.5) % 360
      })));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const getCountdownColor = () => {
    if (timeLeft <= 3) return 'from-red-500 via-red-600 to-red-700';
    if (timeLeft <= 5) return 'from-orange-500 via-orange-600 to-red-600';
    return 'from-purple-500 via-blue-600 to-cyan-500';
  };

  const getIntensity = () => {
    if (timeLeft <= 3) return 'animate-bounce';
    if (timeLeft <= 5) return 'animate-pulse';
    return '';
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 overflow-hidden">
      {/* Magical Particle System */}
      <div className="absolute inset-0">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute text-lg animate-ping opacity-60"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
              transform: `scale(${0.5 + Math.random() * 0.5})`
            }}
          >
            {particle.type}
          </div>
        ))}
      </div>

      {/* Floating Participant Names */}
      <div className="absolute inset-0 pointer-events-none">
        {floatingNames.map((nameObj) => (
          <div
            key={nameObj.id}
            className="absolute text-white/30 text-sm font-medium transition-all duration-1000"
            style={{
              left: `${nameObj.x}%`,
              top: `${nameObj.y}%`,
              transform: `rotate(${nameObj.rotation}deg)`,
              textShadow: '0 0 10px rgba(255,255,255,0.3)'
            }}
          >
            {nameObj.name}
          </div>
        ))}
      </div>

      {/* Energy Waves */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {timeLeft <= 5 && (
          <>
            <div className="absolute w-32 h-32 border-2 border-white/20 rounded-full animate-ping" style={{ animationDuration: '2s' }} />
            <div className="absolute w-48 h-48 border-2 border-white/10 rounded-full animate-ping" style={{ animationDuration: '3s', animationDelay: '0.5s' }} />
            <div className="absolute w-64 h-64 border-2 border-white/5 rounded-full animate-ping" style={{ animationDuration: '4s', animationDelay: '1s' }} />
          </>
        )}
      </div>

      {/* Pulsing Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${getCountdownColor()} opacity-20 animate-pulse`} />

      {/* Main Content */}
      <div className="relative z-10 text-center max-w-2xl mx-4">
        {/* Pre-countdown info */}
        <div className="mb-8">
          <div className="flex justify-center items-center space-x-4 mb-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
              <span className="text-cyan-300 text-sm md:text-base">👥 {participantCount} Participants</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
              <span className="text-green-300 text-sm md:text-base">🏆 {prizes.length} Prizes</span>
            </div>
          </div>
          
          <h3 className="text-2xl md:text-4xl font-bold text-white mb-6 animate-fade-in">
            🎯 DRAW STARTING SOON! 🎯
          </h3>
        </div>

        {/* Main Countdown Circle */}
        <div className="relative mb-8">
          <div className={`relative w-48 h-48 md:w-64 md:h-64 mx-auto ${getIntensity()}`}>
            {/* Outer Glow Ring */}
            <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${getCountdownColor()} opacity-30 blur-xl animate-pulse`} />
            
            {/* Main Circle */}
            <div className={`relative w-full h-full rounded-full bg-gradient-to-br ${getCountdownColor()} p-1 shadow-2xl`}>
              <div className="w-full h-full rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center border border-white/20">
                <div className="text-center">
                  <div className={`text-5xl md:text-7xl font-bold text-white mb-2 ${timeLeft <= 3 ? 'animate-bounce' : 'animate-pulse'}`}>
                    {timeLeft}
                  </div>
                  <div className="text-white/80 text-sm md:text-lg font-medium">
                    {timeLeft === 1 ? 'SECOND' : 'SECONDS'}
                  </div>
                </div>
              </div>
            </div>

            {/* Rotating Border Effect */}
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-white/50 animate-spin" />
          </div>

          {/* Countdown Messages */}
          <div className="mt-6 space-y-2">
            {timeLeft <= 3 && (
              <div className="text-2xl md:text-3xl font-bold text-red-400 animate-bounce">
                🚨 GET READY! 🚨
              </div>
            )}
            {timeLeft > 3 && timeLeft <= 5 && (
              <div className="text-xl md:text-2xl font-bold text-orange-400 animate-pulse">
                ⚡ ALMOST TIME! ⚡
              </div>
            )}
            {timeLeft > 5 && (
              <div className="text-lg md:text-xl text-cyan-300">
                Preparing the draw...
              </div>
            )}
          </div>
        </div>

        {/* Prize Preview */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 md:p-6 mb-6 border border-white/20">
          <h4 className="text-lg md:text-xl font-bold text-yellow-300 mb-3">🎁 Today's Prizes:</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {prizes.slice(0, 3).map((prize, index) => (
              <div key={index} className="bg-white/5 rounded-lg p-3 border border-white/10">
                <div className="text-2xl mb-1">
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                </div>
                <div className="text-sm text-white/90">{prize}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Cancel Button */}
        <button
          onClick={onCancel}
          className="bg-red-500/80 hover:bg-red-600/80 backdrop-blur-sm text-white px-6 py-3 rounded-xl transition-all duration-300 border border-red-400/30 hover:scale-105 transform"
        >
          Cancel Draw
        </button>

        {/* Screen Shake Effect for Final Seconds */}
        {timeLeft <= 3 && (
          <style>
            {`
              @keyframes screenShake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-2px); }
                75% { transform: translateX(2px); }
              }
              .fixed { animation: screenShake 0.5s infinite; }
            `}
          </style>
        )}
      </div>
    </div>
  );
};

export default EnhancedDrawCountdown;
