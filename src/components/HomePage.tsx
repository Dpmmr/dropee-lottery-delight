
import React from 'react';

interface Winner {
  id: number;
  name: string;
  date: string;
  event: string;
}

interface Customer {
  id: number;
  name: string;
  phone: string;
  email: string;
}

interface Event {
  id: number;
  name: string;
  winners: number;
  date: string;
  active: boolean;
}

interface HomePageProps {
  currentWinners: Winner[];
  customers: Customer[];
  allWinners: Winner[];
  events: Event[];
  drawAnimation: boolean;
}

const HomePage: React.FC<HomePageProps> = ({ 
  currentWinners, 
  customers, 
  allWinners, 
  events, 
  drawAnimation 
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-cyan-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h2 className="text-6xl font-bold mb-4 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent animate-pulse">
            🎉 WEEKLY LOTTERY DRAW 🎉
          </h2>
          <p className="text-xl text-cyan-300 animate-bounce">
            3 Lucky Winners Every Week!
          </p>
        </div>

        {currentWinners.length > 0 && (
          <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-3xl p-8 mb-8 shadow-2xl transform hover:scale-105 transition-all duration-300">
            <h3 className="text-4xl font-bold text-center mb-6 text-white">🏆 LATEST WINNERS 🏆</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {currentWinners.map((winner, index) => (
                <div key={winner.id} className="bg-white/20 backdrop-blur-sm rounded-xl p-6 text-center transform hover:rotate-3 transition-all duration-300">
                  <div className="text-6xl mb-4">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                  </div>
                  <h4 className="text-2xl font-bold text-yellow-300">{winner.name}</h4>
                  <p className="text-cyan-200">{winner.date}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl p-8 shadow-2xl transform hover:rotate-1 transition-all duration-300">
            <h3 className="text-3xl font-bold mb-4 text-center">🎯 How It Works</h3>
            <ul className="space-y-3 text-lg">
              <li className="flex items-center space-x-3">
                <span className="text-2xl">📦</span>
                <span>Order from DROPEE</span>
              </li>
              <li className="flex items-center space-x-3">
                <span className="text-2xl">🎲</span>
                <span>Get entered automatically</span>
              </li>
              <li className="flex items-center space-x-3">
                <span className="text-2xl">🏆</span>
                <span>Win free delivery weekly!</span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-cyan-600 to-blue-600 rounded-3xl p-8 shadow-2xl transform hover:rotate-1 transition-all duration-300">
            <h3 className="text-3xl font-bold mb-4 text-center">📊 Statistics</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-lg">Total Customers:</span>
                <span className="text-2xl font-bold text-yellow-300">{customers.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-lg">Total Winners:</span>
                <span className="text-2xl font-bold text-yellow-300">{allWinners.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-lg">Active Events:</span>
                <span className="text-2xl font-bold text-yellow-300">{events.filter(e => e.active).length}</span>
              </div>
            </div>
          </div>
        </div>

        {drawAnimation && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="text-center">
              <div className="text-8xl mb-8 animate-spin">🎰</div>
              <h3 className="text-4xl font-bold text-white mb-4">Drawing Winners...</h3>
              <div className="flex space-x-2 justify-center">
                <div className="w-4 h-4 bg-yellow-400 rounded-full animate-bounce"></div>
                <div className="w-4 h-4 bg-yellow-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-4 h-4 bg-yellow-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
