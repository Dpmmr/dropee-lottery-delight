
import React from 'react';

interface WinnerRevealProps {
  winners: string[];
  prizes: string[];
  onClose: () => void;
  onBack: () => void;
}

const WinnerReveal: React.FC<WinnerRevealProps> = ({ winners, prizes, onClose, onBack }) => {
  const getPrize = (index: number) => {
    return prizes[index] || 'Participation Prize';
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
      <div className="text-center max-w-4xl mx-auto w-full">
        <h2 className="text-4xl md:text-6xl font-bold mb-6 md:mb-8 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent animate-bounce">
          🎉 CONGRATULATIONS! 🎉
        </h2>

        <div className="grid gap-4 md:gap-6 mb-6 md:mb-8">
          {winners.map((winner, index) => (
            <div
              key={index}
              className="bg-gradient-to-r from-green-400 to-blue-500 rounded-2xl md:rounded-3xl p-4 md:p-8 transform animate-pulse shadow-2xl"
              style={{ animationDelay: `${index * 0.5}s` }}
            >
              <div className="text-4xl md:text-6xl mb-2 md:mb-4">
                {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '🏆'}
              </div>
              <h3 className="text-2xl md:text-4xl font-bold text-white mb-1 md:mb-2">{winner}</h3>
              <p className="text-lg md:text-xl text-cyan-200">{getPrize(index)}</p>
            </div>
          ))}
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 md:p-6 mb-6 md:mb-8">
          <p className="text-white text-base md:text-lg mb-3 md:mb-4">
            🎊 Winners can inquire to admin or admin will reach out 🎊
          </p>
          <p className="text-yellow-400 text-lg md:text-xl font-bold">
            📞 Contact: +91 7005498122
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-3 md:gap-4 justify-center">
          <button
            onClick={onBack}
            className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl text-lg md:text-xl font-bold hover:scale-105 transition-transform"
          >
            Back to Draw
          </button>
          <button
            onClick={onClose}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl text-lg md:text-xl font-bold hover:scale-105 transition-transform"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default WinnerReveal;
