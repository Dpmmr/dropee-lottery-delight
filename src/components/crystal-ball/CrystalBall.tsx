import React from 'react';

interface CrystalBallProps {
  index: number;
  name?: string;
  intensity: string;
}

const CrystalBall: React.FC<CrystalBallProps> = ({ index, name, intensity }) => {
  return (
    <div className="relative">
      {/* Crystal Ball */}
      <div className={`relative w-24 h-24 md:w-40 md:h-40 ${intensity}`}>
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
              {name && (
                <div className="text-white font-bold text-xs md:text-base break-words leading-tight">
                  {name}
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
  );
};

export default CrystalBall;