
import React from 'react';
import { Users, Trophy, Settings, Home, Phone, Gift } from 'lucide-react';

interface LotteryHeaderProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

const LotteryHeader: React.FC<LotteryHeaderProps> = ({ currentPage, setCurrentPage }) => {
  return (
    <header className="bg-gradient-to-r from-purple-800 via-blue-700 to-cyan-600 text-white p-4 shadow-2xl">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-pulse">
              <Gift className="w-6 h-6 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-bounce"></div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent animate-pulse">
            DROPEE LOTTERY
          </h1>
        </div>
        <nav className="flex space-x-6">
          <button 
            onClick={() => setCurrentPage('home')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 ${currentPage === 'home' ? 'bg-white text-purple-800' : 'hover:bg-white/20'}`}
          >
            <Home className="w-5 h-5" />
            <span>Home</span>
          </button>
          <button 
            onClick={() => setCurrentPage('contact')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 ${currentPage === 'contact' ? 'bg-white text-purple-800' : 'hover:bg-white/20'}`}
          >
            <Phone className="w-5 h-5" />
            <span>Contact</span>
          </button>
          <button 
            onClick={() => setCurrentPage('winners')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 ${currentPage === 'winners' ? 'bg-white text-purple-800' : 'hover:bg-white/20'}`}
          >
            <Trophy className="w-5 h-5" />
            <span>All Winners</span>
          </button>
          <button 
            onClick={() => setCurrentPage('admin-login')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 ${currentPage === 'admin' ? 'bg-white text-purple-800' : 'hover:bg-white/20'}`}
          >
            <Settings className="w-5 h-5" />
            <span>Admin</span>
          </button>
        </nav>
      </div>
    </header>
  );
};

export default LotteryHeader;
