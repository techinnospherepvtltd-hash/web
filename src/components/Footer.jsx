import { Link, useLocation } from 'react-router-dom';
import { Globe, Mail, Phone, MapPin, Instagram, Facebook, MessageCircle } from 'lucide-react';
import { useConfig } from '../context/ConfigContext';

const Footer = () => {
  const location = useLocation();
  const config = useConfig();
  const isAdmin = location.pathname.startsWith('/admin');
  
  if (isAdmin) return null;

  return (
    <footer className="bg-brand-darker text-white pt-20 pb-10 border-t border-brand-dark">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-6 inline-block">
              {config.CompanyLogo ? (
                <img src={config.CompanyLogo} alt={config.CompanyName} className="h-12 object-contain filter brightness-0 invert" />
              ) : (
                <div className="flex items-center gap-2">
                  <Globe className="w-8 h-8 text-brand-lighter" />
                  <span className="text-2xl font-bold tracking-tighter">
                    {config.CompanyName || 'TechInnoSphere'}
                  </span>
                </div>
              )}
            </Link>
            <p className="text-brand-lighter mb-8 max-w-sm leading-relaxed">
              {config.CompanyTagline || 'From Vision To Software We Build It All.'}
            </p>
            <div className="flex gap-4">
              {config.InstagramURL && (
                <a href={config.InstagramURL} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-brand-dark flex items-center justify-center hover:bg-pink-600 transition-colors text-gray-300 hover:text-white">
                  <Instagram className="w-5 h-5" />
                </a>
              )}
              {config.FacebookURL && (
                <a href={config.FacebookURL} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-brand-dark flex items-center justify-center hover:bg-blue-600 transition-colors text-gray-300 hover:text-white">
                  <Facebook className="w-5 h-5" />
                </a>
              )}
              {config.WhatsAppNumber && (
                <a href={`https://wa.me/${config.WhatsAppNumber.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-brand-dark flex items-center justify-center hover:bg-green-500 transition-colors text-gray-300 hover:text-white">
                  <MessageCircle className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6 text-white">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link to="/" className="text-brand-lighter hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/services" className="text-brand-lighter hover:text-white transition-colors">Services</Link></li>
              <li><Link to="/work" className="text-brand-lighter hover:text-white transition-colors">Work</Link></li>
              <li><Link to="/about" className="text-brand-lighter hover:text-white transition-colors">About</Link></li>
              <li><Link to="/careers" className="text-brand-lighter hover:text-white transition-colors">Careers</Link></li>
              <li><Link to="/news" className="text-brand-lighter hover:text-white transition-colors">News</Link></li>
              <li><Link to="/contact" className="text-brand-lighter hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6 text-white">Contact Info</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-brand-light flex-shrink-0 mt-1" />
                <span className="text-brand-lighter leading-relaxed">{config.CompanyAddress}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-brand-light flex-shrink-0" />
                <a href={`https://wa.me/${config.WhatsAppNumber?.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-brand-lighter hover:text-white transition-colors">
                  {config.WhatsAppNumber}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-brand-light flex-shrink-0" />
                <a href={`mailto:${config.ContactEmail}`} className="text-brand-lighter hover:text-white transition-colors">
                  {config.ContactEmail}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-brand-dark flex flex-col md:flex-row justify-between items-center gap-4 text-brand-lighter text-sm">
          <p>{config.FooterContent || '© TechInnoSphere. All Rights Reserved.'}</p>
          <div className="flex gap-6">
            <Link to="/admin" className="text-brand-dark hover:text-brand-lighter transition-colors">Admin Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
