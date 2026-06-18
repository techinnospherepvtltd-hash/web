import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Send, MessageCircle } from 'lucide-react';
import { InstagramIcon, FacebookIcon } from '../components/SocialIcons';
import { useConfig } from '../context/ConfigContext';

const Contact = () => {
  const config = useConfig();

  return (
    <div className="bg-[#FAFAFA] min-h-screen pt-32 pb-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgc3Ryb2tlPSJyZ2JhKDAsMCwwLDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiPjxwYXRoIGQ9Ik0wIDEwbDQwIDBNMTAgMGwwIDQwIiAvPjwvZz48L3N2Zz4=')] opacity-60 z-0 pointer-events-none"></div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="max-w-3xl mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-extrabold text-[#111827] tracking-tight mb-6"
          >
            Get In Touch
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-500 font-medium leading-relaxed"
          >
            Ready to build scalable software? Contact our team or reach out globally.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-gray-100">
              <div className="w-14 h-14 bg-brand-lightest rounded-2xl flex items-center justify-center mb-6">
                <MapPin className="w-6 h-6 text-brand-primary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{config.CompanyName || 'TechInnoSphere'}</h3>
              <p className="text-gray-500 font-medium leading-relaxed">{config.CompanyAddress}</p>
            </div>
            
            <div className="bg-white p-8 rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-gray-100">
              <div className="w-14 h-14 bg-brand-lightest rounded-2xl flex items-center justify-center mb-6">
                <Phone className="w-6 h-6 text-brand-primary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">WhatsApp</h3>
              <p className="text-gray-500 font-medium">{config.WhatsAppNumber}</p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Social Media</h3>
              <div className="flex gap-4">
                {config.InstagramURL && (
                  <a href={config.InstagramURL} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center hover:bg-pink-50 hover:text-pink-600 transition-colors text-gray-500">
                    <InstagramIcon className="w-5 h-5" />
                  </a>
                )}
                {config.FacebookURL && (
                  <a href={config.FacebookURL} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center hover:bg-blue-50 hover:text-blue-600 transition-colors text-gray-500">
                    <FacebookIcon className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-gray-100 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Start Your Project Today</h3>
              <p className="text-gray-500 mb-6 font-medium">Let's discuss how we can help you achieve your goals.</p>
              <a 
                href={`https://wa.me/${config.WhatsAppNumber?.replace(/\D/g, '')}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-[#25D366] text-white p-4 rounded-xl font-bold hover:bg-[#128C7E] transition-all shadow-[0_4px_14px_rgba(37,211,102,0.4)] hover:-translate-y-1"
              >
                <MessageCircle className="w-6 h-6" /> Chat on WhatsApp
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-gray-100">
              <h2 className="text-3xl font-extrabold text-gray-900 mb-8 tracking-tight">Send Us A Message</h2>
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">First Name</label>
                    <input type="text" className="w-full bg-[#FAFAFA] border border-gray-200 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all font-medium" placeholder="John" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Last Name</label>
                    <input type="text" className="w-full bg-[#FAFAFA] border border-gray-200 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all font-medium" placeholder="Doe" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                  <input type="email" className="w-full bg-[#FAFAFA] border border-gray-200 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all font-medium" placeholder="john@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Subject</label>
                  <input type="text" className="w-full bg-[#FAFAFA] border border-gray-200 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all font-medium" placeholder="Project Inquiry" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Message</label>
                  <textarea rows="5" className="w-full bg-[#FAFAFA] border border-gray-200 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all font-medium" placeholder="Tell us about your project..."></textarea>
                </div>
                <button type="submit" className="w-full bg-[#111827] text-white font-bold text-lg p-4 rounded-xl hover:bg-brand-primary transition-all flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(0,0,0,0.1)] hover:-translate-y-1">
                  Send Message <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
