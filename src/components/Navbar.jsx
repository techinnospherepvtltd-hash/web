import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, MessageCircle } from 'lucide-react';
import { InstagramIcon, FacebookIcon } from './SocialIcons';
import { useConfig } from '../context/ConfigContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const config = useConfig();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Work', path: '/work' },
    { name: 'About', path: '/about' },
    { name: 'News', path: '/news' },
    { name: 'Careers', path: '/careers' },
    { name: 'Contact', path: '/contact' }
  ];

  const isAdmin = location.pathname.startsWith('/admin');
  if (isAdmin) return null;

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'glass-panel shadow-sm py-4' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-6 lg:px-12 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 z-50">
          {config.CompanyLogo ? (
            <img src={config.CompanyLogo} alt={config.CompanyName} className="h-10 object-contain" />
          ) : (
            <span className={`text-xl font-bold tracking-tighter ${isScrolled ? 'text-brand-darker' : 'text-brand-darker'}`}>
              {config.CompanyName || 'TechInnoSphere'}
            </span>
          )}
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          {navLinks.map(link => (
            <Link 
              key={link.name} 
              to={link.path}
              className={`text-sm font-medium transition-colors hover:text-brand-primary ${location.pathname === link.path ? 'text-brand-primary font-bold' : 'text-brand-dark'}`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Desktop Social & CTA */}
        <div className="hidden md:flex items-center gap-4 z-50">
          <div className="flex items-center gap-3 border-r border-gray-200 pr-4">
            {config.InstagramURL && (
              <a href={config.InstagramURL} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-600 transition-colors">
                <InstagramIcon className="w-5 h-5" />
              </a>
            )}
            {config.FacebookURL && (
              <a href={config.FacebookURL} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600 transition-colors">
                <FacebookIcon className="w-5 h-5" />
              </a>
            )}
            {config.WhatsAppNumber && (
              <a href={`https://wa.me/${config.WhatsAppNumber.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-green-500 transition-colors">
                <MessageCircle className="w-5 h-5" />
              </a>
            )}
          </div>
          <Link to="/contact" className="px-6 py-2 bg-brand-primary text-white rounded-full font-medium hover:bg-brand-dark transition-colors shadow-lg shadow-brand-primary/30 whitespace-nowrap">
            Start Project
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden text-brand-darker z-50 relative" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden absolute top-full left-0 w-full glass-panel shadow-lg py-6 px-6 flex flex-col gap-6 h-screen overflow-y-auto pb-32"
        >
          <div className="flex flex-col gap-4">
            {navLinks.map(link => (
              <Link 
                key={link.name} 
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="text-brand-darker font-bold text-lg hover:text-brand-primary"
              >
                {link.name}
              </Link>
            ))}
          </div>
          
          <div className="pt-6 border-t border-gray-100 flex gap-6 justify-center">
            {config.InstagramURL && (
              <a href={config.InstagramURL} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-pink-600">
                <InstagramIcon className="w-6 h-6" />
              </a>
            )}
            {config.FacebookURL && (
              <a href={config.FacebookURL} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-600">
                <FacebookIcon className="w-6 h-6" />
              </a>
            )}
            {config.WhatsAppNumber && (
              <a href={`https://wa.me/${config.WhatsAppNumber.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-green-500">
                <MessageCircle className="w-6 h-6" />
              </a>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
