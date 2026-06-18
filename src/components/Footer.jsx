import { Link, useLocation } from 'react-router-dom';
import { Globe, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  if (isAdmin) return null;

  return (
    <footer className="bg-brand-darker text-white pt-20 pb-10 border-t border-brand-dark">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-6">
              <Globe className="w-8 h-8 text-brand-lighter" />
              <span className="text-2xl font-bold tracking-tighter">TechInnoSphere</span>
            </Link>
            <p className="text-brand-lighter mb-6 leading-relaxed">
              From Vision To Software We Build It All. Engineering Scalable Digital Systems For Global Businesses.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-brand-dark flex items-center justify-center hover:bg-brand-primary transition-colors text-sm font-bold">
                in
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-brand-dark flex items-center justify-center hover:bg-brand-primary transition-colors text-sm font-bold">
                tw
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-brand-dark flex items-center justify-center hover:bg-brand-primary transition-colors text-sm font-bold">
                fb
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6">Services</h4>
            <ul className="space-y-3">
              <li><Link to="/services" className="text-brand-lighter hover:text-white transition-colors">Web Development</Link></li>
              <li><Link to="/services" className="text-brand-lighter hover:text-white transition-colors">AI Solutions</Link></li>
              <li><Link to="/services" className="text-brand-lighter hover:text-white transition-colors">Security Testing (VAPT)</Link></li>
              <li><Link to="/services" className="text-brand-lighter hover:text-white transition-colors">Enterprise Systems</Link></li>
              <li><Link to="/services" className="text-brand-lighter hover:text-white transition-colors">SAP Solutions</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6">Company</h4>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-brand-lighter hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/work" className="text-brand-lighter hover:text-white transition-colors">Our Work</Link></li>
              <li><Link to="/careers" className="text-brand-lighter hover:text-white transition-colors">Careers</Link></li>
              <li><Link to="/news" className="text-brand-lighter hover:text-white transition-colors">News & Insights</Link></li>
              <li><Link to="/contact" className="text-brand-lighter hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-brand-light flex-shrink-0 mt-1" />
                <span className="text-brand-lighter">Mumbai, India<br/>Global Services Worldwide</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-brand-light flex-shrink-0" />
                <span className="text-brand-lighter">+91 XXXXX XXXXX</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-brand-light flex-shrink-0" />
                <span className="text-brand-lighter">contact@techinnosphere.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-brand-dark flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-brand-lighter text-sm">
            &copy; {new Date().getFullYear()} TechInnoSphere. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <Link to="/privacy" className="text-brand-lighter hover:text-white">Privacy Policy</Link>
            <Link to="/terms" className="text-brand-lighter hover:text-white">Terms of Service</Link>
            <Link to="/admin" className="text-brand-dark hover:text-brand-lighter transition-colors">Admin Login</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
