
import React from 'react';
import { useLiveMonitoring } from '@/hooks/useLiveMonitoring';
import { Users, Wifi, WifiOff } from 'lucide-react';

const LiveUserMonitor: React.FC = () => {
  const { onlineUsers, peakUsers, connectionStatus } = useLiveMonitoring();

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return <Wifi className="w-3 h-3 text-green-400" />;
      case 'disconnected':
        return <WifiOff className="w-3 h-3 text-red-400" />;
      default:
        return (
          <div className="w-3 h-3 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
        );
    }
  };

  const generateDots = () => {
    const dots = [];
    const maxDots = Math.min(onlineUsers, 3); // Reduced for mobile
    
    for (let i = 0; i < maxDots; i++) {
      dots.push(
        <div
          key={i}
          className="w-1 h-1 bg-green-400 rounded-full animate-pulse"
          style={{ animationDelay: `${i * 0.3}s` }}
        />
      );
    }
    return dots;
  };

  return (
    <>
      {/* Mobile Version - Bottom Left Floating Pill */}
      <div className="fixed bottom-4 left-4 z-50 md:hidden">
        <div className="bg-black/80 backdrop-blur-md rounded-full px-3 py-2 shadow-lg border border-white/10 animate-slide-in-left">
          <div className="flex items-center space-x-2">
            <Users className="w-3 h-3 text-cyan-300" />
            <div className="flex items-center space-x-1">
              <div className="flex space-x-0.5">
                {generateDots()}
              </div>
              <span className="text-white font-medium text-xs min-w-[1rem] text-center">
                {onlineUsers}
              </span>
            </div>
            {getStatusIcon()}
          </div>
        </div>
      </div>

      {/* Desktop Version - Top Right */}
      <div className="hidden md:block fixed top-4 right-4 z-50">
        <div className="bg-black/60 backdrop-blur-sm rounded-lg p-3 text-sm border border-white/20">
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-cyan-300" />
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
          
          {/* Peak users indicator */}
          {peakUsers > onlineUsers && (
            <div className="flex items-center justify-between mt-1 pt-1 border-t border-white/20">
              <span className="text-gray-300 text-xs">Peak:</span>
              <span className="text-yellow-300 text-xs font-medium">{peakUsers}</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default LiveUserMonitor;
