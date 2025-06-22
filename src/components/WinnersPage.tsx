
import React from 'react';
import type { Winner } from '@/types/lottery';

interface WinnersPageProps {
  allWinners: Winner[];
}

const WinnersPage: React.FC<WinnersPageProps> = ({ allWinners }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-cyan-900 text-white">
      <div className="container mx-auto px-4 md:px-6 py-6 md:py-8 max-w-6xl">
        <div className="text-center mb-8 md:mb-12 px-2">
          <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent leading-tight">
            🏆 All Time Winners
          </h2>
          <p className="text-sm md:text-lg text-cyan-300">Celebrating our amazing winners!</p>
        </div>
        
        <div className="mx-2 md:mx-0">
          <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-2xl backdrop-blur-sm border border-white/10">
            <div className="space-y-3 md:space-y-4">
              {allWinners.map((winner, index) => (
                <div key={winner.id} className="bg-white/20 backdrop-blur-sm rounded-xl p-4 md:p-6 flex flex-col md:flex-row md:items-center md:justify-between transform hover:scale-105 transition-all duration-300 shadow-lg border border-white/10">
                  <div className="flex items-start md:items-center space-x-3 md:space-x-4 mb-3 md:mb-0">
                    <div className="text-2xl md:text-4xl flex-shrink-0 mt-1 md:mt-0">
                      {index < 3 ? (index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉') : '🎖️'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg md:text-2xl font-bold text-yellow-300 truncate">{winner.customer?.name}</h3>
                      <p className="text-cyan-200 text-sm md:text-base">{winner.event?.name}</p>
                      <p className="text-green-300 font-semibold text-sm md:text-base">{winner.prize_description}</p>
                    </div>
                  </div>
                  <div className="text-left md:text-right flex-shrink-0">
                    <p className="text-base md:text-lg font-semibold text-white">{new Date(winner.won_at).toLocaleDateString()}</p>
                    <p className="text-xs md:text-sm text-cyan-200">Winner #{index + 1}</p>
                  </div>
                </div>
              ))}
              
              {allWinners.length === 0 && (
                <div className="text-center py-12 md:py-16">
                  <div className="text-4xl md:text-6xl mb-4">🎯</div>
                  <p className="text-lg md:text-xl text-cyan-200">No winners yet. Be the first!</p>
                  <p className="text-sm md:text-base text-white/70 mt-2">Order from DROPEE to enter the lottery!</p>
                </div>
              )}
            </div>
          </div>

          {allWinners.length > 0 && (
            <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-2xl md:rounded-3xl p-6 md:p-8 mt-6 md:mt-8 shadow-2xl backdrop-blur-sm border border-white/10">
              <div className="text-center">
                <h3 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4">
                  🎊 Winners can inquire to admin or admin will reach out 🎊
                </h3>
                <p className="text-yellow-300 text-lg md:text-xl font-bold mb-4 md:mb-6">
                  📞 Contact: +91 7005498122
                </p>
                <button
                  onClick={() => window.open(`https://wa.me/917005498122?text=${encodeURIComponent('Hi! I am a lottery winner and would like to claim my prize.')}`)}
                  className="bg-green-500 hover:bg-green-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl text-base md:text-lg font-bold transition-all duration-300 transform hover:scale-105 shadow-lg backdrop-blur-sm border border-green-400/30 min-h-[44px] w-full md:w-auto"
                >
                  💬 Contact via WhatsApp
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
