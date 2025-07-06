
import React from 'react';
import type { ExternalLink } from '@/types/lottery';

interface ContactPageProps {
  externalLinks: ExternalLink[];
}

const ContactPage: React.FC<ContactPageProps> = ({ externalLinks }) => {
  const phoneNumber = "+917005498122";
  const whatsappNumber = "917005498122";

  const handleCall = () => {
    window.open(`tel:${phoneNumber}`, '_self');
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent("Hello! I'm interested in DROPEE lottery draws. Can you help me?");
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-cyan-900 text-white">
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
            📞 Contact Us
          </h2>
          <p className="text-base md:text-xl text-cyan-300">
            Get in touch with our team for support, inquiries, or lottery information
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-8 md:mb-12">
          {/* Phone Contact */}
          <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-3xl p-6 md:p-8 shadow-2xl transform hover:scale-105 transition-all duration-300">
            <div className="text-center">
              <div className="text-4xl md:text-6xl mb-4">📱</div>
              <h3 className="text-xl md:text-3xl font-bold mb-4">Call Us Direct</h3>
              <p className="text-lg md:text-xl text-green-100 mb-6">Speak with our support team</p>
              <div className="bg-white/20 rounded-xl p-4 mb-6">
                <p className="text-lg md:text-2xl font-bold text-yellow-300">{phoneNumber}</p>
              </div>
              <button
                onClick={handleCall}
                className="bg-white text-green-600 hover:bg-green-50 px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold text-lg md:text-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                📞 Call Now
              </button>
            </div>
          </div>

          {/* WhatsApp Contact */}
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-3xl p-6 md:p-8 shadow-2xl transform hover:scale-105 transition-all duration-300">
            <div className="text-center">
              <div className="text-4xl md:text-6xl mb-4">💬</div>
              <h3 className="text-xl md:text-3xl font-bold mb-4">WhatsApp Chat</h3>
              <p className="text-lg md:text-xl text-green-100 mb-6">Quick and easy messaging</p>
              <div className="bg-white/20 rounded-xl p-4 mb-6">
                <p className="text-lg md:text-2xl font-bold text-yellow-300">{phoneNumber}</p>
              </div>
              <button
                onClick={handleWhatsApp}
                className="bg-white text-green-600 hover:bg-green-50 px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold text-lg md:text-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                💬 Chat on WhatsApp
              </button>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl p-6 md:p-8 shadow-2xl mb-8">
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-6">📍 Contact Information</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🏢</span>
                <div>
                  <h4 className="font-bold text-lg">Business Name</h4>
                  <p className="text-cyan-200">DROPEE UKHRUL</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-2xl">📞</span>
                <div>
                  <h4 className="font-bold text-lg">Phone</h4>
                  <p className="text-cyan-200">{phoneNumber}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-2xl">💬</span>
                <div>
                  <h4 className="font-bold text-lg">WhatsApp</h4>
                  <p className="text-cyan-200">{phoneNumber}</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🕐</span>
                <div>
                  <h4 className="font-bold text-lg">Business Hours</h4>
                  <p className="text-cyan-200">MON to SAT 9AM to 5PM</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🎯</span>
                <div>
                  <h4 className="font-bold text-lg">Service Area</h4>
                  <p className="text-cyan-200">Ukhrul & Surrounding Areas</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🏆</span>
                <div>
                  <h4 className="font-bold text-lg">Lottery Support</h4>
                  <p className="text-cyan-200">Winner Assistance & Inquiries</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* External Links */}
        {externalLinks.length > 0 && (
          <div className="bg-gradient-to-br from-cyan-600 to-blue-600 rounded-3xl p-6 md:p-8 shadow-2xl">
            <h3 className="text-2xl md:text-3xl font-bold text-center mb-6">🔗 Quick Links</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {externalLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/20 hover:bg-white/30 rounded-xl p-4 transition-all duration-300 transform hover:scale-105 text-center"
                >
                  <h4 className="font-bold text-lg text-yellow-300">{link.name}</h4>
                  <p className="text-sm text-cyan-200 truncate">{link.url}</p>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* FAQ Section */}
        <div className="mt-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl p-6 md:p-8 shadow-2xl">
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-6">❓ Frequently Asked Questions</h3>
          <div className="space-y-4">
            <div className="bg-white/10 rounded-xl p-4">
              <h4 className="font-bold text-lg mb-2">How do I participate in the lottery?</h4>
              <p className="text-cyan-200">Simply place an order with DROPEE and you'll be automatically entered into our lottery draws!</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <h4 className="font-bold text-lg mb-2">When are the draws held?</h4>
              <p className="text-cyan-200">We conduct regular draws including weekly, monthly, and special event draws. Check our home page for upcoming draws.</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <h4 className="font-bold text-lg mb-2">How will I know if I win?</h4>
              <p className="text-cyan-200">Winners will be contacted directly by our admin team, or you can reach out to us using the contact details above.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
