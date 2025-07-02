import React from 'react';

const MagicalParticleSystem: React.FC = () => {
  return (
    <div className="absolute inset-0">
      {Array.from({ length: 60 }).map((_, i) => (
        <div
          key={i}
          className="absolute animate-ping"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 4}s`,
            animationDuration: `${1.5 + Math.random() * 3}s`,
            transform: `scale(${0.5 + Math.random() * 1})`
          }}
        >
          <div className={`w-1 h-1 rounded-full opacity-70 ${
            i % 4 === 0 ? 'bg-purple-400' : 
            i % 4 === 1 ? 'bg-cyan-400' : 
            i % 4 === 2 ? 'bg-yellow-400' : 'bg-pink-400'
          }`} />
        </div>
      ))}
    </div>
  );
};

export default MagicalParticleSystem;