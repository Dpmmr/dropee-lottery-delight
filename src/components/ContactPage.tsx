
import React from 'react';
import { Phone, ExternalLink, MessageCircle } from 'lucide-react';
import type { ExternalLink as ExternalLinkType } from '@/types/lottery';

interface ContactPageProps {
  externalLinks: ExternalLinkType[];
}

const ContactPage: React.FC<ContactPageProps> = ({ externalLinks }) => {
  const phoneNumber = "917005498122";
  const whatsappMessage = "Hello! I'm interested in DROPEE services and lottery draws.";

  const handleWhatsAppClick = () => {
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(url, '_blank');
  };

  const handleCallClick = () => {
    window.location.href = `tel:+${phoneNumber}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-cyan-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            📞 Contact Us
          </h2>
        </div>
        
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl p-8 shadow-2xl">
            <h3 className="text-3xl font-bold mb-6 text-center">Get In Touch</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-lg font-semibold">Phone</p>
                  <p className="text-cyan-200">+91 7005498122</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-xl">📧</span>
                </div>
                <div>
                  <p className="text-lg font-semibold">Email</p>
                  <p className="text-cyan-200">hashtagdropee@gmail.com</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-xl">📍</span>
                </div>
                <div>
                  <p className="text-lg font-semibold">Address</p>
                  <p className="text-cyan-200">Viewland Zone II opposite Warm Delight</p>
                </div>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <h4 className="text-xl font-bold text-center mb-4">Quick Contact</h4>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={handleWhatsAppClick}
                  className="bg-green-500 hover:bg-green-600 rounded-xl p-4 flex items-center justify-center space-x-2 transition-all duration-300 transform hover:scale-105"
                >
                  <MessageCircle className="w-6 h-6" />
                  <span>WhatsApp</span>
                </button>
                <button
                  onClick={handleCallClick}
                  className="bg-blue-500 hover:bg-blue-600 rounded-xl p-4 flex items-center justify-center space-x-2 transition-all duration-300 transform hover:scale-105"
                >
                  <Phone className="w-6 h-6" />
                  <span>Call Now</span>
                </button>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-cyan-600 to-blue-600 rounded-3xl p-8 shadow-2xl">
            <h3 className="text-3xl font-bold mb-6 text-center">Quick Links</h3>
            <div className="space-y-4">
              {externalLinks.map(link => (
                <a 
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-4 p-4 bg-white/20 rounded-xl hover:bg-white/30 transition-all duration-300 transform hover:scale-105"
                >
                  <ExternalLink className="w-6 h-6" />
                  <span className="text-lg">{link.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
