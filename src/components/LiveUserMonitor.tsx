
import React from 'react';
import { useLiveMonitoring } from '@/hooks/useLiveMonitoring';
import { Users, Wifi, WifiOff } from 'lucide-react';

const LiveUserMonitor: React.FC = () => {
  const { onlineUsers, peakUsers, connectionStatus } = useLiveMonitoring();

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return <Wifi className="w-3 h-3 md:w-4 md:h-4 text-green-400" />;
      case 'disconnected':
        return <WifiOff className="w-3 h-3 md:w-4 md:h-4 text-red-400" />;
      default:
        return (
          <div className="w-3 h-3 md:w-4 md:h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
        );
    }
  };

  const generateDots = () => {
    const dots = [];
    const maxDots = Math.min(onlineUsers, 4); // Cap at 4 dots for mobile
    
    for (let i = 0; i < maxDots; i++) {
      dots.push(
        <div
          key={i}
          className="w-1 h-1 md:w-1.5 md:h-1.5 bg-green-400 rounded-full animate-pulse"
          style={{ animationDelay: `${i * 0.2}s` }}
        />
      );
    }
    return dots;
  };

  return (
    <div className="fixed top-2 right-2 md:top-4 md:right-4 z-50">
      {/* Main monitor */}
      <div className="bg-black/60 backdrop-blur-sm rounded-lg p-2 md:p-3 text-xs md:text-sm border border-white/20">
        <div className="flex items-center space-x-2">
          <Users className="w-3 h-3 md:w-4 md:h-4 text-cyan-300" />
          <div className="flex items-center space-x-1">
            <div className="flex space-x-0.5">
              {generateDots()}
            </div>
            <span className="text-white font-medium min-w-[1rem] text-center">
              {onlineUsers}
            </span>
          </div>
          {getStatusIcon()}
        </div>
        
        {/* Peak users indicator - only show on larger screens */}
        {peakUsers > onlineUsers && (
          <div className="hidden md:flex items-center justify-between mt-1 pt-1 border-t border-white/20">
            <span className="text-gray-300 text-xs">Peak:</span>
            <span className="text-yellow-300 text-xs font-medium">{peakUsers}</span>
          </div>
        )}
      </div>
      
      {/* Connection status indicator for mobile */}
      <div className="md:hidden mt-1 flex justify-center">
        <div className={`w-2 h-2 rounded-full ${
          connectionStatus === 'connected' ? 'bg-green-400' : 
          connectionStatus === 'disconnected' ? 'bg-red-400' : 'bg-yellow-400'
        }`} />
      </div>
    </div>
  );
};

export default LiveUserMonitor;
