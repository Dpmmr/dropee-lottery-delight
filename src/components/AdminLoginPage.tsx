
import React from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface AdminLoginPageProps {
  adminPassword: string;
  setAdminPassword: (password: string) => void;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  adminLogin: () => void;
}

const AdminLoginPage: React.FC<AdminLoginPageProps> = ({
  adminPassword,
  setAdminPassword,
  showPassword,
  setShowPassword,
  adminLogin
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-cyan-900 text-white flex items-center justify-center">
      <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl p-8 shadow-2xl max-w-md w-full mx-4">
        <h2 className="text-4xl font-bold text-center mb-8">🔐 Admin Login</h2>
        <div className="space-y-6">
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter admin password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/20 rounded-xl border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              onKeyPress={(e) => e.key === 'Enter' && adminLogin()}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          <button
            onClick={adminLogin}
            className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-3 rounded-xl font-bold text-lg hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 transform hover:scale-105"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
