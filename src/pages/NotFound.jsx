import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Layers, Briefcase, Mail } from 'lucide-react';
import SEO from '../components/SEO';

const NotFound = () => {
  return (
    <>
      <SEO
        title="404 - Page Not Found | TechInnoSphere"
        description="The page you are looking for could not be found. Explore our software development services, project case studies, or contact TechInnoSphere."
        noIndex={true}
      />
      <div className="bg-[#FAFAFA] min-h-[85vh] flex items-center justify-center pt-32 pb-24 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgc3Ryb2tlPSJyZ2JhKDAsMCwwLDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiPjxwYXRoIGQ9Ik0wIDEwbDQwIDBNMTAgMGwwIDQwIiAvPjwvZz48L3N2Zz4=')] opacity-60 z-0 pointer-events-none"></div>

        <div className="container mx-auto px-6 lg:px-12 relative z-10 text-center max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-8xl md:text-9xl font-black text-brand-primary/20 tracking-tighter block mb-2">
              404
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold text-[#111827] tracking-tight mb-4">
              Page Not Found
            </h1>
            <p className="text-lg text-gray-500 font-medium mb-10 leading-relaxed">
              We couldn't find the page you were looking for. The link may be broken, or the page may have been moved.
            </p>

            {/* Quick Links */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10 text-left">
              <Link
                to="/"
                className="p-4 bg-white rounded-2xl border border-gray-200 hover:border-brand-primary shadow-sm hover:shadow-md transition-all flex items-center gap-3 group"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-lightest flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-colors">
                  <Home className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">Home Page</h3>
                  <p className="text-xs text-gray-500">Back to the main overview</p>
                </div>
              </Link>

              <Link
                to="/services"
                className="p-4 bg-white rounded-2xl border border-gray-200 hover:border-brand-primary shadow-sm hover:shadow-md transition-all flex items-center gap-3 group"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-lightest flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-colors">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">Services</h3>
                  <p className="text-xs text-gray-500">Software, AI & Cloud</p>
                </div>
              </Link>

              <Link
                to="/work"
                className="p-4 bg-white rounded-2xl border border-gray-200 hover:border-brand-primary shadow-sm hover:shadow-md transition-all flex items-center gap-3 group"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-lightest flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-colors">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">Our Work</h3>
                  <p className="text-xs text-gray-500">Case studies & portfolio</p>
                </div>
              </Link>

              <Link
                to="/contact"
                className="p-4 bg-white rounded-2xl border border-gray-200 hover:border-brand-primary shadow-sm hover:shadow-md transition-all flex items-center gap-3 group"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-lightest flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">Contact Us</h3>
                  <p className="text-xs text-gray-500">Get in touch with our team</p>
                </div>
              </Link>
            </div>

            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-brand-primary text-white rounded-xl font-bold hover:bg-brand-dark transition-all shadow-md"
            >
              <ArrowLeft className="w-4 h-4" /> Return to Homepage
            </Link>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default NotFound;
