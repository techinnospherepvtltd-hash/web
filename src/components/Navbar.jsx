import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, Globe } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

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
  if (isAdmin) return null; // Don't show main navbar in admin panel

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'glass-panel shadow-sm py-4' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-6 lg:px-12 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 text-brand-primary">
          <Globe className={`w-8 h-8 ${isScrolled ? 'text-brand-primary' : 'text-brand-primary'}`} />
          <span className={`text-xl font-bold tracking-tighter ${isScrolled ? 'text-brand-darker' : 'text-brand-darker'}`}>TechInnoSphere</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(link => (
            <Link 
              key={link.name} 
              to={link.path}
              className={`text-sm font-medium transition-colors hover:text-brand-primary ${location.pathname === link.path ? 'text-brand-primary font-bold' : 'text-brand-dark'}`}
            >
              {link.name}
            </Link>
          ))}
          <Link to="/contact" className="px-6 py-2 bg-brand-primary text-white rounded-full font-medium hover:bg-brand-dark transition-colors shadow-lg shadow-brand-primary/30">
            Start Project
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden text-brand-darker" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden absolute top-full left-0 w-full glass-panel shadow-lg py-4 px-6 flex flex-col gap-4"
        >
          {navLinks.map(link => (
            <Link 
              key={link.name} 
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="text-brand-dark font-medium hover:text-brand-primary"
            >
              {link.name}
            </Link>
          ))}
          <Link to="/contact" className="w-full text-center py-3 bg-brand-primary text-white rounded-lg font-medium">
            Start Project
          </Link>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
