import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { useConfig } from '../context/ConfigContext';

const FloatingWhatsApp = () => {
  const config = useConfig();

  if (!config.WhatsAppNumber) return null;

  const handleWhatsApp = () => {
    const number = config.WhatsAppNumber.replace(/\D/g, '');
    window.open(`https://wa.me/${number}`, '_blank');
  };

  return (
    <motion.button
      onClick={handleWhatsApp}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-6 right-6 z-50 p-4 bg-[#25D366] text-white rounded-full shadow-[0_8px_30px_rgba(37,211,102,0.4)] hover:shadow-[0_8px_40px_rgba(37,211,102,0.6)] transition-shadow flex items-center justify-center group"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="w-8 h-8 group-hover:scale-110 transition-transform" />
    </motion.button>
  );
};

export default FloatingWhatsApp;
