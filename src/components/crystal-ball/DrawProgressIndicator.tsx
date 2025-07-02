import React from 'react';

interface DrawProgressIndicatorProps {
  winnersCount: number;
  participantCount: number;
  phase: 'building' | 'selecting' | 'finalizing';
}

const DrawProgressIndicator: React.FC<DrawProgressIndicatorProps> = ({
  winnersCount,
  participantCount,
  phase
}) => {
  return (
    <div className="mb-6">
      <div className="text-lg md:text-2xl text-white mb-4">
        Selecting {winnersCount} lucky winner{winnersCount > 1 ? 's' : ''} from {participantCount} participants...
      </div>
      
      {/* Animated Progress Bar */}
      <div className="w-full max-w-md mx-auto bg-white/20 rounded-full h-3 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 transition-all duration-1000 animate-pulse"
          style={{ 
            width: phase === 'building' ? '33%' : phase === 'selecting' ? '66%' : '100%' 
          }}
        />
      </div>
    </div>
  );
};

export default DrawProgressIndicator;