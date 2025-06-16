
import React from 'react';
import { useLiveMonitoring } from '@/hooks/useLiveMonitoring';

const LiveUserMonitor: React.FC = () => {
  const { onlineUsers } = useLiveMonitoring();

  const generateDots = () => {
    const dots = [];
    const maxDots = Math.min(onlineUsers, 5); // Cap at 5 dots for mobile
    
    for (let i = 0; i < maxDots; i++) {
      dots.push(
        <div
          key={i}
          className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-400 rounded-full animate-pulse"
          style={{ animationDelay: `${i * 0.2}s` }}
        />
      );
    }
    return dots;
  };

  return (
    <div className="fixed top-2 right-2 md:top-4 md:right-4 bg-black/40 backdrop-blur-sm rounded-lg p-2 md:p-3 z-40 text-xs md:text-sm">
      <div className="flex items-center space-x-1 md:space-x-2">
        <div className="flex space-x-0.5 md:space-x-1">
          {generateDots()}
        </div>
        <span className="text-white font-medium">
          {onlineUsers}
        </span>
      </div>
    </div>
  );
};

export default LiveUserMonitor;
