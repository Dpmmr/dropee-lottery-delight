
import React from 'react';
import type { Winner, Customer, Event, Draw } from '@/types/lottery';

interface HomePageProps {
  currentWinners: Winner[];
  customers: Customer[];
  allWinners: Winner[];
  events: Event[];
  draws: Draw[];
}

const HomePage: React.FC<HomePageProps> = ({ 
  currentWinners, 
  customers, 
  allWinners, 
  events,
  draws
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-cyan-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h2 className="text-6xl font-bold mb-4 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent animate-pulse">
            🎉 DROPEE LOTTERY DRAW 🎉
          </h2>
          <p className="text-xl text-cyan-300 animate-bounce">
            Multiple Lucky Winners Every Draw!
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
                  <h4 className="text-2xl font-bold text-yellow-300">{winner.customer?.name}</h4>
                  <p className="text-cyan-200">{new Date(winner.won_at).toLocaleDateString()}</p>
                  <p className="text-green-300 font-semibold">{winner.prize_description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
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
                <span>Win amazing prizes!</span>
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
              <div className="flex justify-between items-center">
                <span className="text-lg">Total Draws:</span>
                <span className="text-2xl font-bold text-yellow-300">{draws.length}</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-600 to-teal-600 rounded-3xl p-8 shadow-2xl transform hover:rotate-1 transition-all duration-300">
            <h3 className="text-3xl font-bold mb-4 text-center">🗓️ Draw Schedule</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">📅</span>
                <span>Weekly Draws</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🌙</span>
                <span>Monthly Specials</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🎊</span>
                <span>Festival Events</span>
              </div>
            </div>
          </div>
        </div>

        {draws.length > 0 && (
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl p-8 shadow-2xl">
            <h3 className="text-3xl font-bold mb-6 text-center">📈 Recent Draw History</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-white">
                <thead>
                  <tr className="border-b border-white/30">
                    <th className="text-left py-3">Event</th>
                    <th className="text-center py-3">Participants</th>
                    <th className="text-center py-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {draws.slice(0, 5).map((draw) => (
                    <tr key={draw.id} className="border-b border-white/20">
                      <td className="py-3">{draw.event?.name}</td>
                      <td className="text-center py-3">{draw.total_participants}</td>
                      <td className="text-center py-3">{new Date(draw.conducted_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
