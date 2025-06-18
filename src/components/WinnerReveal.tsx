
import React from 'react';
import { X, ArrowLeft } from 'lucide-react';

interface WinnerRevealProps {
  winners: string[];
  prizes: string[];
  onClose: () => void;
  onBack: () => void;
}

const WinnerReveal: React.FC<WinnerRevealProps> = ({ winners, prizes, onClose, onBack }) => {
  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 px-4">
      <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-6 max-w-md w-full mx-auto relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white hover:text-gray-200 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
        
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
            🎉 CONGRATULATIONS! 🎉
          </h2>
          
          <div className="space-y-4 mb-6">
            {winners.map((winner, index) => (
              <div key={index} className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl md:text-3xl mb-2">
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '🏆'}
                </div>
                <h3 className="text-xl font-bold text-white">{winner}</h3>
                <p className="text-white/90 text-sm">{prizes[index] || 'Participation Prize'}</p>
              </div>
            ))}
          </div>

          <div className="flex space-x-3">
            <button
              onClick={onBack}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Draw Again</span>
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WinnerReveal;
