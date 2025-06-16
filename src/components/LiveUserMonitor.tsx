
import React from 'react';
import { useLiveMonitoring } from '@/hooks/useLiveMonitoring';

const LiveUserMonitor: React.FC = () => {
  const { onlineUsers } = useLiveMonitoring();

  const generateDots = () => {
    const dots = [];
    const maxDots = Math.min(onlineUsers, 10); // Cap at 10 dots for UI
    
    for (let i = 0; i < maxDots; i++) {
      dots.push(
        <div
          key={i}
          className="w-2 h-2 bg-green-400 rounded-full animate-pulse"
          style={{ animationDelay: `${i * 0.2}s` }}
        />
      );
    }
    return dots;
  };

  return (
    <div className="fixed top-4 right-4 bg-black/60 backdrop-blur-sm rounded-lg p-3 z-50">
      <div className="flex items-center space-x-2">
        <div className="flex space-x-1">
          {generateDots()}
        </div>
        <span className="text-white text-sm font-medium">
          {onlineUsers} online
        </span>
      </div>
    </div>
  );
};

export default LiveUserMonitor;
