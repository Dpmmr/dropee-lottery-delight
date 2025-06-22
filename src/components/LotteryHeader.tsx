
import React, { useState } from 'react';
import { Users, Trophy, Settings, Home, Phone, Gift, Menu, X } from 'lucide-react';

interface LotteryHeaderProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

const LotteryHeader: React.FC<LotteryHeaderProps> = ({ currentPage, setCurrentPage }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavClick = (page: string) => {
    setCurrentPage(page);
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-gradient-to-r from-purple-800 via-blue-700 to-cyan-600 text-white shadow-2xl sticky top-0 z-40">
      <div className="container mx-auto px-3 md:px-4 py-3 md:py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2 md:space-x-4">
            <div className="relative">
              <div className="w-8 h-8 md:w-12 md:h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-pulse">
                <Gift className="w-4 h-4 md:w-6 md:h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 md:w-4 md:h-4 bg-red-500 rounded-full animate-bounce"></div>
            </div>
            <h1 className="text-base md:text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              DROPEE LOTTERY
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
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

          {/* Mobile Hamburger Menu */}
          <button 
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg hover:bg-white/20 transition-colors relative z-50"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Side Menu */}
      {isMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => setIsMenuOpen(false)}
          />
          
          {/* Side Menu */}
          <div className="fixed top-0 right-0 h-full w-64 bg-gradient-to-b from-purple-800 via-blue-700 to-cyan-600 shadow-2xl z-40 md:hidden animate-slide-in-right">
            <div className="pt-20 px-4">
              <nav className="flex flex-col space-y-3">
                <button 
                  onClick={() => handleNavClick('home')}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${currentPage === 'home' ? 'bg-white text-purple-800 shadow-lg' : 'hover:bg-white/20'}`}
                >
                  <Home className="w-5 h-5" />
                  <span className="font-medium">Home</span>
                </button>
                <button 
                  onClick={() => handleNavClick('contact')}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${currentPage === 'contact' ? 'bg-white text-purple-800 shadow-lg' : 'hover:bg-white/20'}`}
                >
                  <Phone className="w-5 h-5" />
                  <span className="font-medium">Contact</span>
                </button>
                <button 
                  onClick={() => handleNavClick('winners')}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${currentPage === 'winners' ? 'bg-white text-purple-800 shadow-lg' : 'hover:bg-white/20'}`}
                >
                  <Trophy className="w-5 h-5" />
                  <span className="font-medium">All Winners</span>
                </button>
                <button 
                  onClick={() => handleNavClick('admin-login')}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${currentPage === 'admin' ? 'bg-white text-purple-800 shadow-lg' : 'hover:bg-white/20'}`}
                >
                  <Settings className="w-5 h-5" />
                  <span className="font-medium">Admin</span>
                </button>
              </nav>
            </div>
          </div>
        </>
      )}
    </header>
  );
};

export default LotteryHeader;
