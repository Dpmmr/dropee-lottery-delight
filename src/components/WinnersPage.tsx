
import React from 'react';

interface Winner {
  id: number;
  name: string;
  date: string;
  event: string;
}

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
                      <h3 className="text-2xl font-bold text-yellow-300">{winner.name}</h3>
                      <p className="text-cyan-200">{winner.event}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold">{winner.date}</p>
                    <p className="text-sm text-cyan-200">Winner #{winner.id}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WinnersPage;
