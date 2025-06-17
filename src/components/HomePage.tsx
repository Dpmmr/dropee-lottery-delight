
import React, { useState } from 'react';
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
  const [showAllHistory, setShowAllHistory] = useState(false);
  
  // Filter winners from last 24 hours
  const recentWinners = currentWinners.filter(winner => {
    const winTime = new Date(winner.won_at).getTime();
    const now = new Date().getTime();
    const twentyFourHours = 24 * 60 * 60 * 1000;
    return (now - winTime) <= twentyFourHours;
  });

  // Get active event details
  const activeEvent = events.find(e => e.active);
  
  // Show only recent 3 draws, or all if showAllHistory is true
  const displayedDraws = showAllHistory ? draws : draws.slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-cyan-900 text-white">
      <div className="container mx-auto px-3 md:px-4 py-6 md:py-8">
        <div className="text-center mb-6 md:mb-12">
          <h2 className="text-3xl md:text-6xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
            🎉 DROPEE LOTTERY DRAW 🎉
          </h2>
          <p className="text-base md:text-xl text-cyan-300">
            Multiple Lucky Winners Every Draw!
          </p>
        </div>

        {/* Active Event Banner - Fixed and stable */}
        {activeEvent && (
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl md:rounded-3xl p-4 md:p-8 mb-6 md:mb-8 shadow-2xl">
            <h3 className="text-xl md:text-4xl font-bold text-center mb-3 md:mb-4 text-white">🚀 UPCOMING DRAW 🚀</h3>
            <div className="text-center space-y-2 md:space-y-3">
              <h4 className="text-lg md:text-2xl font-bold text-yellow-300">{activeEvent.name}</h4>
              <p className="text-sm md:text-lg text-cyan-200">📅 Event Date: {new Date(activeEvent.event_date).toLocaleDateString()}</p>
              <p className="text-sm md:text-lg text-green-300">🏆 {activeEvent.winners_count} Lucky Winners</p>
              <div className="bg-white/20 rounded-xl p-3 md:p-4 mt-3 md:mt-4">
                <p className="text-xs md:text-base text-white mb-2">💰 Amazing Prizes Await:</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-3">
                  <div className="bg-yellow-500/20 rounded-lg p-2 md:p-3">
                    <p className="text-xs md:text-sm font-bold">🥇 First Prize</p>
                    <p className="text-xs">Free Delivery for 7 Days</p>
                  </div>
                  <div className="bg-gray-400/20 rounded-lg p-2 md:p-3">
                    <p className="text-xs md:text-sm font-bold">🥈 Second Prize</p>
                    <p className="text-xs">Free Delivery for 3 Days</p>
                  </div>
                  <div className="bg-orange-600/20 rounded-lg p-2 md:p-3">
                    <p className="text-xs md:text-sm font-bold">🥉 Third Prize</p>
                    <p className="text-xs">10% Discount Next Order</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recent Winners (24 hours) */}
        {recentWinners.length > 0 && (
          <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-2xl md:rounded-3xl p-4 md:p-8 mb-6 md:mb-8 shadow-2xl">
            <h3 className="text-2xl md:text-4xl font-bold text-center mb-4 md:mb-6 text-white">🏆 LATEST WINNERS (24H) 🏆</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6">
              {recentWinners.slice(0, 3).map((winner, index) => (
                <div key={winner.id} className="bg-white/20 backdrop-blur-sm rounded-xl p-3 md:p-6 text-center">
                  <div className="text-3xl md:text-6xl mb-2 md:mb-4">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                  </div>
                  <h4 className="text-lg md:text-2xl font-bold text-yellow-300">{winner.customer?.name}</h4>
                  <p className="text-cyan-200 text-xs md:text-base">{new Date(winner.won_at).toLocaleDateString()}</p>
                  <p className="text-green-300 font-semibold text-xs md:text-base">{winner.prize_description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 mb-6 md:mb-8">
          <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-2xl">
            <h3 className="text-xl md:text-3xl font-bold mb-3 md:mb-4 text-center">🎯 How It Works</h3>
            <ul className="space-y-2 md:space-y-3 text-sm md:text-lg">
              <li className="flex items-center space-x-2 md:space-x-3">
                <span className="text-xl md:text-2xl">📦</span>
                <span>Order from DROPEE</span>
              </li>
              <li className="flex items-center space-x-2 md:space-x-3">
                <span className="text-xl md:text-2xl">🎲</span>
                <span>Get entered automatically</span>
              </li>
              <li className="flex items-center space-x-2 md:space-x-3">
                <span className="text-xl md:text-2xl">🏆</span>
                <span>Win amazing prizes!</span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-cyan-600 to-blue-600 rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-2xl">
            <h3 className="text-xl md:text-3xl font-bold mb-3 md:mb-4 text-center">📊 Statistics</h3>
            <div className="space-y-3 md:space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm md:text-lg">Total Customers:</span>
                <span className="text-lg md:text-2xl font-bold text-yellow-300">{customers.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm md:text-lg">Total Winners:</span>
                <span className="text-lg md:text-2xl font-bold text-yellow-300">{allWinners.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm md:text-lg">Active Events:</span>
                <span className="text-lg md:text-2xl font-bold text-yellow-300">{events.filter(e => e.active).length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm md:text-lg">Total Draws:</span>
                <span className="text-lg md:text-2xl font-bold text-yellow-300">{draws.length}</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-600 to-teal-600 rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-2xl md:col-span-2 lg:col-span-1">
            <h3 className="text-xl md:text-3xl font-bold mb-3 md:mb-4 text-center">🗓️ Draw Schedule</h3>
            <div className="space-y-2 md:space-y-3">
              <div className="flex items-center space-x-2 md:space-x-3">
                <span className="text-xl md:text-2xl">📅</span>
                <span className="text-sm md:text-base">Weekly Draws</span>
              </div>
              <div className="flex items-center space-x-2 md:space-x-3">
                <span className="text-xl md:text-2xl">🌙</span>
                <span className="text-sm md:text-base">Monthly Specials</span>
              </div>
              <div className="flex items-center space-x-2 md:space-x-3">
                <span className="text-xl md:text-2xl">🎊</span>
                <span className="text-sm md:text-base">Festival Events</span>
              </div>
            </div>
          </div>
        </div>

        {/* Draw History */}
        {draws.length > 0 && (
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-2xl">
            <h3 className="text-xl md:text-3xl font-bold mb-4 md:mb-6 text-center">📈 Recent Draw History</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-white">
                <thead>
                  <tr className="border-b border-white/30">
                    <th className="text-left py-2 md:py-3 text-xs md:text-base">Event</th>
                    <th className="text-center py-2 md:py-3 text-xs md:text-base">Participants</th>
                    <th className="text-center py-2 md:py-3 text-xs md:text-base">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedDraws.map((draw) => (
                    <tr key={draw.id} className="border-b border-white/20">
                      <td className="py-2 md:py-3 text-xs md:text-base">{draw.event?.name}</td>
                      <td className="text-center py-2 md:py-3 text-xs md:text-base">{draw.total_participants}</td>
                      <td className="text-center py-2 md:py-3 text-xs md:text-base">{new Date(draw.conducted_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {draws.length > 3 && (
              <div className="text-center mt-3 md:mt-4">
                <button
                  onClick={() => setShowAllHistory(!showAllHistory)}
                  className="bg-white/20 hover:bg-white/30 px-3 md:px-6 py-2 md:py-3 rounded-lg transition-colors text-xs md:text-base"
                >
                  {showAllHistory ? 'Show Less' : 'View More'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
