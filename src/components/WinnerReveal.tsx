
import React from 'react';

interface WinnerRevealProps {
  winners: string[];
  prizeDescription: string;
  onClose: () => void;
}

const WinnerReveal: React.FC<WinnerRevealProps> = ({ winners, prizeDescription, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
      <div className="text-center max-w-4xl mx-4">
        <h2 className="text-6xl font-bold mb-8 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent animate-bounce">
          🎉 CONGRATULATIONS! 🎉
        </h2>

        <div className="grid gap-6 mb-8">
          {winners.map((winner, index) => (
            <div
              key={index}
              className="bg-gradient-to-r from-green-400 to-blue-500 rounded-3xl p-8 transform animate-pulse"
              style={{ animationDelay: `${index * 0.5}s` }}
            >
              <div className="text-6xl mb-4">
                {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '🏆'}
              </div>
              <h3 className="text-4xl font-bold text-white mb-2">{winner}</h3>
              <p className="text-xl text-cyan-200">{prizeDescription}</p>
            </div>
          ))}
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8">
          <p className="text-white text-lg mb-4">
            🎊 Winners can inquire to admin or admin will reach out 🎊
          </p>
          <p className="text-yellow-400 text-xl font-bold">
            📞 Contact: +91 7005498122
          </p>
        </div>

        <button
          onClick={onClose}
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl text-xl font-bold hover:scale-105 transition-transform"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default WinnerReveal;
