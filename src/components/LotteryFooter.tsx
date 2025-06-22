
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { FooterContent, ExternalLink } from '@/types/lottery';

const LotteryFooter: React.FC = () => {
  const { data: footerContent } = useQuery({
    queryKey: ['footer_content'],
    queryFn: async () => {
      const { data, error } = await supabase.from('footer_content').select('*').single();
      if (error) throw error;
      return data as FooterContent;
    },
    staleTime: 60000,
    gcTime: 300000
  });

  const { data: quickLinks = [] } = useQuery({
    queryKey: ['external_links'],
    queryFn: async () => {
      const { data, error } = await supabase.from('external_links').select('*');
      if (error) throw error;
      return data as ExternalLink[];
    },
    staleTime: 60000,
    gcTime: 300000
  });

  return (
    <footer className="bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 text-white py-6 md:py-12 mt-8 md:mt-12">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {/* Company Info */}
          <div className="space-y-3 md:space-y-4 text-center md:text-left">
            <h3 className="text-xl md:text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              🎉 DROPEE LOTTERY
            </h3>
            <p className="text-sm md:text-base text-cyan-200 leading-relaxed">
              {footerContent?.description || "Experience the thrill of winning with DROPEE UKHRUL! Our weekly lottery draws bring excitement and amazing prizes to our community."}
            </p>
            <div className="flex justify-center md:justify-start space-x-3 md:space-x-4">
              <div className="bg-green-500 rounded-full p-2 md:p-3 transform hover:scale-110 transition-transform">
                <span className="text-base md:text-lg">📱</span>
              </div>
              <div className="bg-blue-500 rounded-full p-2 md:p-3 transform hover:scale-110 transition-transform">
                <span className="text-base md:text-lg">💬</span>
              </div>
              <div className="bg-purple-500 rounded-full p-2 md:p-3 transform hover:scale-110 transition-transform">
                <span className="text-base md:text-lg">🎯</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3 md:space-y-4 text-center md:text-left">
            <h4 className="text-lg md:text-2xl font-bold text-yellow-300">🔗 Quick Links</h4>
            <div className="space-y-2">
              <a href="/" className="block text-cyan-200 hover:text-white transition-colors duration-300 text-sm md:text-base hover:translate-x-1 transform">
                🏠 Home
              </a>
              <a href="/winners" className="block text-cyan-200 hover:text-white transition-colors duration-300 text-sm md:text-base hover:translate-x-1 transform">
                🏆 Winners
              </a>
              <a href="/contact" className="block text-cyan-200 hover:text-white transition-colors duration-300 text-sm md:text-base hover:translate-x-1 transform">
                📞 Contact
              </a>
              {quickLinks.slice(0, 3).map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-cyan-200 hover:text-white transition-colors duration-300 text-sm md:text-base hover:translate-x-1 transform"
                >
                  🌐 {link.name}
                </a>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-3 md:space-y-4 text-center md:text-left">
            <h4 className="text-lg md:text-2xl font-bold text-yellow-300">📞 Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-center md:justify-start space-x-3 p-3 bg-white/5 rounded-xl backdrop-blur-sm">
                <span className="text-xl md:text-2xl">📱</span>
                <div>
                  <p className="text-cyan-200 text-xs md:text-sm">Phone & WhatsApp</p>
                  <p className="text-white font-semibold text-sm md:text-base">+91 7005498122</p>
                </div>
              </div>
              <div className="flex items-center justify-center md:justify-start space-x-3 p-3 bg-white/5 rounded-xl backdrop-blur-sm">
                <span className="text-xl md:text-2xl">🏢</span>
                <div>
                  <p className="text-cyan-200 text-xs md:text-sm">Business</p>
                  <p className="text-white font-semibold text-sm md:text-base">DROPEE UKHRUL</p>
                </div>
              </div>
              <div className="flex items-center justify-center md:justify-start space-x-3 p-3 bg-white/5 rounded-xl backdrop-blur-sm">
                <span className="text-xl md:text-2xl">🕐</span>
                <div>
                  <p className="text-cyan-200 text-xs md:text-sm">Hours</p>
                  <p className="text-white font-semibold text-sm md:text-base">9:00 AM - 9:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/20 mt-6 md:mt-8 pt-4 md:pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0 text-center md:text-left">
            <div>
              <p className="text-sm md:text-base text-cyan-200">
                © 2024 DROPEE UKHRUL. All rights reserved.
              </p>
              <p className="text-xs md:text-sm text-gray-400 mt-1">
                💻 Developed by <span className="text-yellow-400 font-semibold">Jihal Shimray</span>
              </p>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-4 md:mt-6 p-3 md:p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10">
          <p className="text-xs md:text-sm text-gray-300 text-center leading-relaxed">
            🎲 <strong>Fair Play Guarantee:</strong> All lottery draws are conducted transparently with equal chances for all participants. 
            Winners are selected randomly and contacted directly. For any inquiries or support, reach out to us at +91 7005498122.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default LotteryFooter;
