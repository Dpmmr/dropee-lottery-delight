
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { FooterContent, ExternalLink } from '@/types/lottery';

const LotteryFooter: React.FC = () => {
  const [footerContent, setFooterContent] = useState<FooterContent | null>(null);
  const [quickLinks, setQuickLinks] = useState<ExternalLink[]>([]);

  useEffect(() => {
    const fetchFooterData = async () => {
      // Fetch footer content
      const { data: content } = await supabase
        .from('footer_content')
        .select('*')
        .limit(1)
        .single();
      
      if (content) setFooterContent(content);

      // Fetch quick links
      const { data: links } = await supabase
        .from('external_links')
        .select('*')
        .limit(6);
      
      if (links) setQuickLinks(links);
    };

    fetchFooterData();
  }, []);

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold text-yellow-400 mb-4">#DROPEE UKHRUL</h3>
            <p className="text-gray-300 mb-4">
              {footerContent?.description || 'Experience the thrill of winning with DROPEE UKHRUL!'}
            </p>
            <div className="flex space-x-4">
              <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                <span className="text-black font-bold">#</span>
              </div>
              <div>
                <p className="font-semibold">Trusted Delivery Service</p>
                <p className="text-sm text-gray-400">Ukhrul, Manipur</p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-bold mb-4">Quick Links</h4>
            <div className="grid grid-cols-2 gap-2">
              {quickLinks.map(link => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-yellow-400 transition-colors text-sm"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-xl font-bold mb-4">Contact Information</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <span className="text-yellow-400">📞</span>
                <span>+91 7005498122</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-yellow-400">📧</span>
                <span>hashtagdropee@gmail.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-yellow-400">📍</span>
                <span>Viewland Zone II opposite Warm Delight</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-lg mb-2">
            Powered by <span className="text-yellow-400 font-bold">#DROPEE UKHRUL</span>
          </p>
          <p className="text-sm text-gray-400">
            Developed by <span className="text-cyan-400">Jihal Shimray</span> • 
            © {new Date().getFullYear()} All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
};

export default LotteryFooter;
