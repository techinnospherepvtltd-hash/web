import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Send, MessageCircle } from 'lucide-react';

const Contact = () => {
  return (
    <div className="bg-brand-lightest min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="max-w-3xl mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-bold text-brand-darker mb-6"
          >
            Get In Touch
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-brand-light leading-relaxed"
          >
            Ready to build scalable software? Contact our team in Mumbai or reach out globally.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-brand-lightest/50">
              <div className="w-12 h-12 bg-brand-lightest rounded-full flex items-center justify-center mb-6">
                <MapPin className="w-6 h-6 text-brand-primary" />
              </div>
              <h3 className="text-xl font-bold text-brand-darker mb-2">Office Location</h3>
              <p className="text-gray-600">Mumbai, Maharashtra, India<br/>Global Services Worldwide</p>
            </div>
            
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-brand-lightest/50">
              <div className="w-12 h-12 bg-brand-lightest rounded-full flex items-center justify-center mb-6">
                <Phone className="w-6 h-6 text-brand-primary" />
              </div>
              <h3 className="text-xl font-bold text-brand-darker mb-2">Phone</h3>
              <p className="text-gray-600">+91 XXXXX XXXXX</p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-brand-lightest/50">
              <div className="w-12 h-12 bg-brand-lightest rounded-full flex items-center justify-center mb-6">
                <Mail className="w-6 h-6 text-brand-primary" />
              </div>
              <h3 className="text-xl font-bold text-brand-darker mb-2">Email</h3>
              <p className="text-gray-600">contact@techinnosphere.com</p>
            </div>

            <a 
              href="https://wa.me/91XXXXXXXXXX" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full bg-[#25D366] text-white p-4 rounded-2xl font-bold hover:bg-[#128C7E] transition-colors shadow-lg"
            >
              <MessageCircle className="w-6 h-6" /> Chat on WhatsApp
            </a>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white p-10 md:p-12 rounded-3xl shadow-xl border border-brand-lightest/50">
              <h2 className="text-3xl font-bold text-brand-darker mb-8">Send Us A Message</h2>
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-brand-darker mb-2">First Name</label>
                    <input type="text" className="w-full bg-brand-lightest/50 border border-brand-lighter/50 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-brand-primary/50" placeholder="John" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-brand-darker mb-2">Last Name</label>
                    <input type="text" className="w-full bg-brand-lightest/50 border border-brand-lighter/50 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-brand-primary/50" placeholder="Doe" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-brand-darker mb-2">Email Address</label>
                  <input type="email" className="w-full bg-brand-lightest/50 border border-brand-lighter/50 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-brand-primary/50" placeholder="john@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-brand-darker mb-2">Subject</label>
                  <input type="text" className="w-full bg-brand-lightest/50 border border-brand-lighter/50 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-brand-primary/50" placeholder="Project Inquiry" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-brand-darker mb-2">Message</label>
                  <textarea rows="5" className="w-full bg-brand-lightest/50 border border-brand-lighter/50 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-brand-primary/50" placeholder="Tell us about your project..."></textarea>
                </div>
                <button type="submit" className="w-full bg-brand-primary text-white font-bold text-lg p-4 rounded-xl hover:bg-brand-darker transition-colors flex items-center justify-center gap-2 shadow-lg">
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
