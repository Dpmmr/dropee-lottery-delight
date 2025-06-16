
import React from 'react';
import type { Winner } from '@/types/lottery';

interface WinnersPageProps {
  allWinners: Winner[];
}

const WinnersPage: React.FC<WinnersPageProps> = ({ allWinners }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-cyan-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            🏆 All Time Winners
          </h2>
        </div>
        
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl p-8 shadow-2xl">
            <div className="grid gap-4">
              {allWinners.map((winner, index) => (
                <div key={winner.id} className="bg-white/20 backdrop-blur-sm rounded-xl p-6 flex items-center justify-between transform hover:scale-105 transition-all duration-300">
                  <div className="flex items-center space-x-4">
                    <div className="text-4xl">
                      {index < 3 ? (index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉') : '🎖️'}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-yellow-300">{winner.customer?.name}</h3>
                      <p className="text-cyan-200">{winner.event?.name}</p>
                      <p className="text-green-300 font-semibold">{winner.prize_description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold">{new Date(winner.won_at).toLocaleDateString()}</p>
                    <p className="text-sm text-cyan-200">Winner #{index + 1}</p>
                  </div>
                </div>
              ))}
              
              {allWinners.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-xl text-cyan-200">No winners yet. Be the first!</p>
                </div>
              )}
            </div>
          </div>

          {allWinners.length > 0 && (
            <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-3xl p-8 mt-8 shadow-2xl">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-4">
                  🎊 Winners can inquire to admin or admin will reach out 🎊
                </h3>
                <p className="text-yellow-300 text-xl font-bold">
                  📞 Contact: +91 7005498122
                </p>
                <button
                  onClick={() => window.open(`https://wa.me/917005498122?text=${encodeURIComponent('Hi! I am a lottery winner and would like to claim my prize.')}`)}
                  className="mt-4 bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-xl text-lg font-bold transition-all duration-300 transform hover:scale-105"
                >
                  Contact via WhatsApp
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WinnersPage;
