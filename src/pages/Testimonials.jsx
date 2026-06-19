import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchExcelData, getDirectImageUrl } from '../utils/excelUtils';
import { Star, Search, Filter, MapPin, Briefcase, ExternalLink, X, Quote, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [projectsList, setProjectsList] = useState([]);
  const [locationsList, setLocationsList] = useState([]);
  const navigate = useNavigate();

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState('All');
  const [selectedRating, setSelectedRating] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');

  // Modal state
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);

  // Statistics
  const [stats, setStats] = useState({
    totalCount: 0,
    averageRating: 0,
    countriesCount: 0
  });

  useEffect(() => {
    const loadTestimonials = async () => {
      const data = await fetchExcelData('testimonials.xlsx');
      setTestimonials(data);
      setFiltered(data);

      // Extract unique values for filters
      const projects = ['All', ...new Set(data.map(t => t['Related Project']).filter(Boolean))];
      setProjectsList(projects);

      const locations = ['All', ...new Set(data.map(t => {
        if (!t.Location) return null;
        const parts = t.Location.split(',');
        return parts[parts.length - 1].trim(); // Extract country/region
      }).filter(Boolean))];
      setLocationsList(locations);

      // Calculate stats
      const totalCount = data.length;
      const totalRatingSum = data.reduce((sum, t) => sum + (Number(t.Rating) || 5), 0);
      const averageRating = totalCount > 0 ? (totalRatingSum / totalCount).toFixed(1) : 0;
      const countriesCount = locations.length - 1; // Exclude 'All'

      setStats({
        totalCount,
        averageRating,
        countriesCount: countriesCount > 0 ? countriesCount : 4
      });
    };
    loadTestimonials();
  }, []);

  // Filter logic
  useEffect(() => {
    let result = [...testimonials];

    // Search query
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      result = result.filter(t => 
        (t['Client Name'] || '').toLowerCase().includes(query) ||
        (t.Company || '').toLowerCase().includes(query) ||
        (t['Related Project'] || '').toLowerCase().includes(query)
      );
    }

    // Project filter
    if (selectedProject !== 'All') {
      result = result.filter(t => t['Related Project'] === selectedProject);
    }

    // Rating filter
    if (selectedRating !== 'All') {
      result = result.filter(t => Math.round(Number(t.Rating) || 5) === Number(selectedRating));
    }

    // Location filter
    if (selectedLocation !== 'All') {
      result = result.filter(t => t.Location && t.Location.toLowerCase().includes(selectedLocation.toLowerCase()));
    }

    setFiltered(result);
  }, [searchQuery, selectedProject, selectedRating, selectedLocation, testimonials]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedTestimonial !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedTestimonial]);

  // Check if featured
  const isFeatured = (t) => {
    if (t.Featured) {
      const str = String(t.Featured).trim().toLowerCase();
      return str === 'true' || str === 'yes' || str === 'y' || str === '1';
    }
    return Number(t.Rating) === 5; // Default featured if rating is 5
  };

  const featuredItems = testimonials.filter(isFeatured).slice(0, 3);

  return (
    <div className="bg-[#FAFAFA] min-h-screen pt-32 pb-24 relative overflow-hidden">
      {/* Background patterns Vercel-style */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgc3Ryb2tlPSJyZ2JhKDAsMCwwLDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiPjxwYXRoIGQ9Ik0wIDEwbDQwIDBNMTAgMGwwIDQwIiAvPjwvZz48L3N2Zz4=')] opacity-60 z-0 pointer-events-none"></div>
      
      {/* Decorative Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-primary/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/3 right-1/4 w-[30rem] h-[30rem] bg-brand-lightest/30 rounded-full blur-3xl pointer-events-none"></div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-lightest text-brand-primary text-xs font-bold uppercase tracking-wider mb-6"
          >
            <Sparkles className="w-3.5 h-3.5" /> Client Stories
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-extrabold text-[#111827] tracking-tight mb-6 leading-tight"
          >
            Trusted By Businesses Across Industries
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-500 font-medium leading-relaxed max-w-3xl mx-auto"
          >
            Real feedback from clients who partnered with TechInnoSphere to build websites, AI solutions, enterprise software, and digital platforms.
          </motion.p>
        </div>

        {/* Stats Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto mb-24"
        >
          {[
            { value: `${stats.totalCount}+`, label: 'Total Partnerships', desc: 'Satisfied clients globally' },
            { value: `${stats.averageRating} / 5.0`, label: 'Average Satisfaction Rating', desc: 'Consistent 5-star delivery' },
            { value: `${stats.countriesCount}+`, label: 'Countries Served', desc: 'International enterprise support' }
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] text-center">
              <div className="text-4xl font-extrabold text-brand-darker mb-2 tracking-tight">{stat.value}</div>
              <div className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-1">{stat.label}</div>
              <div className="text-xs text-gray-400 font-medium">{stat.desc}</div>
            </div>
          ))}
        </motion.div>

        {/* Featured Testimonials */}
        {featuredItems.length > 0 && (
          <div className="mb-24">
            <h2 className="text-3xl font-extrabold text-brand-darker tracking-tight mb-10 flex items-center gap-3">
              Featured Partnerships
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {featuredItems.map((item, idx) => {
                const photoUrl = getDirectImageUrl(item['Client Photo']);
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ y: -8 }}
                    onClick={() => setSelectedTestimonial(item)}
                    className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-gray-100 flex flex-col justify-between group cursor-pointer relative overflow-hidden hover:shadow-[0_15px_40px_rgb(0,0,0,0.08)] transition-all duration-300"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-brand-primary/5 rounded-bl-full pointer-events-none group-hover:bg-brand-primary/10 transition-colors"></div>
                    <div>
                      <div className="flex gap-1 text-yellow-400 mb-6">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${i < (Number(item.Rating) || 5) ? 'fill-current' : 'opacity-30'}`}
                          />
                        ))}
                      </div>
                      <Quote className="w-10 h-10 text-brand-primary/10 mb-4" />
                      <p className="text-gray-600 font-medium text-lg leading-relaxed mb-8 italic">
                        "{item.Feedback || item.Comment || 'Excellent services!'}"
                      </p>
                    </div>

                    <div className="flex items-center gap-4 border-t border-gray-50 pt-6">
                      {photoUrl ? (
                        <img 
                          src={photoUrl} 
                          alt={item['Client Name']} 
                          className="w-14 h-14 rounded-full object-cover border-2 border-brand-lightest" 
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-brand-primary to-brand-dark flex items-center justify-center text-white font-bold text-lg">
                          {(item['Client Name'] || 'C').substring(0, 1).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <h4 className="font-extrabold text-brand-darker text-base">{item['Client Name']}</h4>
                        <p className="text-xs text-gray-500 font-bold">{item.Designation || item.Role || 'Director'}</p>
                        <p className="text-xs text-brand-primary font-extrabold">{item.Company}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Filters & Search Control Bar */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] mb-12 flex flex-col md:flex-row gap-6 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, company, project..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-12 pr-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:bg-white transition-all font-semibold"
            />
          </div>

          <div className="flex flex-wrap gap-4 w-full md:w-auto justify-end">
            {/* Project Filter */}
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-2xl px-3 py-1.5">
              <Briefcase className="w-4 h-4 text-gray-400" />
              <select 
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="bg-transparent text-xs font-bold text-gray-600 focus:outline-none cursor-pointer"
              >
                <option value="All">All Projects</option>
                {projectsList.map((p, i) => <option key={i} value={p}>{p}</option>)}
              </select>
            </div>

            {/* Location Filter */}
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-2xl px-3 py-1.5">
              <MapPin className="w-4 h-4 text-gray-400" />
              <select 
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="bg-transparent text-xs font-bold text-gray-600 focus:outline-none cursor-pointer"
              >
                <option value="All">All Locations</option>
                {locationsList.map((loc, i) => <option key={i} value={loc}>{loc}</option>)}
              </select>
            </div>

            {/* Rating Filter */}
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-2xl px-3 py-1.5">
              <Star className="w-4 h-4 text-gray-400" />
              <select 
                value={selectedRating}
                onChange={(e) => setSelectedRating(e.target.value)}
                className="bg-transparent text-xs font-bold text-gray-600 focus:outline-none cursor-pointer"
              >
                <option value="All">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
              </select>
            </div>
          </div>
        </div>

        {/* Testimonials Masonry / Modern Card Grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
          <AnimatePresence>
            {filtered.map((item, idx) => {
              const photoUrl = getDirectImageUrl(item['Client Photo']);
              return (
                <motion.div
                  key={idx}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => setSelectedTestimonial(item)}
                  className="break-inside-avoid bg-white rounded-3xl p-8 border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)] hover:shadow-[0_12px_30px_rgb(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex gap-0.5 text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < (Number(item.Rating) || 5) ? 'fill-current' : 'opacity-30'}`}
                          />
                        ))}
                      </div>
                      {item['Related Project'] && (
                        <span className="px-3 py-1 bg-gray-50 border border-gray-100 text-gray-500 rounded-full text-[10px] font-bold uppercase tracking-wider">
                          {item['Related Project']}
                        </span>
                      )}
                    </div>

                    <p className="text-gray-600 font-medium text-sm leading-relaxed mb-6 italic">
                      "{item.Feedback || item.Comment || 'Outstanding performance and professional execution.'}"
                    </p>
                  </div>

                  <div className="flex items-center gap-3 pt-4 border-t border-gray-50">
                    {photoUrl ? (
                      <img 
                        src={photoUrl} 
                        alt={item['Client Name']} 
                        className="w-10 h-10 rounded-full object-cover border border-gray-200" 
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-primary/20 to-brand-dark/20 text-brand-dark flex items-center justify-center font-bold text-sm">
                        {(item['Client Name'] || 'C').substring(0, 1).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <h4 className="font-extrabold text-brand-darker text-sm">{item['Client Name']}</h4>
                      <p className="text-[10px] text-gray-500 font-bold leading-tight">{item.Designation || item.Role || 'Client'}</p>
                      <p className="text-[10px] text-brand-primary font-extrabold leading-tight">{item.Company} {item.Location ? `• ${item.Location}` : ''}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <Quote className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-1">No matching feedback found</h3>
            <p className="text-gray-500 text-sm">Try clearing filters or checking another spelling.</p>
          </div>
        )}
      </div>

      {/* Premium Testimonial Details Modal */}
      <AnimatePresence>
        {selectedTestimonial && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ y: 50, scale: 0.95 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 50, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="bg-white rounded-[2rem] max-w-lg w-full shadow-2xl border border-gray-100 overflow-hidden relative"
            >
              {/* Close Button */}
              <button 
                onClick={() => setSelectedTestimonial(null)} 
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 transition-colors bg-gray-50 text-gray-500 hover:text-gray-700 z-10"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="p-8">
                {/* Header info */}
                <div className="flex gap-4 items-center mb-6">
                  {selectedTestimonial['Client Photo'] ? (
                    <img 
                      src={getDirectImageUrl(selectedTestimonial['Client Photo'])} 
                      alt={selectedTestimonial['Client Name']} 
                      className="w-16 h-16 rounded-full object-cover border-2 border-brand-lightest" 
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-primary to-brand-dark flex items-center justify-center text-white font-bold text-2xl">
                      {(selectedTestimonial['Client Name'] || 'C').substring(0, 1).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h3 className="text-xl font-extrabold text-brand-darker tracking-tight leading-tight">{selectedTestimonial['Client Name']}</h3>
                    <p className="text-xs text-gray-500 font-bold">{selectedTestimonial.Designation || selectedTestimonial.Role || 'Partner'}</p>
                    <p className="text-sm text-brand-primary font-bold">{selectedTestimonial.Company}</p>
                  </div>
                </div>

                {/* Rating & Location metadata */}
                <div className="flex flex-wrap gap-4 items-center text-xs font-bold text-gray-500 bg-gray-50 border border-gray-100 rounded-2xl p-4 mb-6">
                  <div className="flex gap-0.5 text-yellow-400 items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < (Number(selectedTestimonial.Rating) || 5) ? 'fill-current' : 'opacity-30'}`}
                      />
                    ))}
                    <span className="text-gray-700 ml-1">{selectedTestimonial.Rating || 5}.0</span>
                  </div>
                  {selectedTestimonial.Location && (
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-brand-primary" /> {selectedTestimonial.Location}
                    </div>
                  )}
                </div>

                {/* Feedback Body */}
                <div className="mb-8 relative">
                  <Quote className="w-12 h-12 text-brand-primary/5 absolute -top-4 -left-4 pointer-events-none" />
                  <p className="text-gray-700 font-medium text-lg leading-relaxed relative z-10 italic">
                    "{selectedTestimonial.Feedback || selectedTestimonial.Comment}"
                  </p>
                </div>

                {/* Related Project integration */}
                {selectedTestimonial['Related Project'] && (
                  <div className="pt-6 border-t border-gray-100 flex justify-between items-center bg-brand-lightest/20 -mx-8 -mb-8 p-8 mt-4">
                    <div>
                      <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Related Project Case Study</span>
                      <span className="font-extrabold text-brand-darker text-sm">{selectedTestimonial['Related Project']}</span>
                    </div>
                    <Link
                      to={`/work?project=${encodeURIComponent(selectedTestimonial['Related Project'])}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-primary hover:bg-brand-dark text-white text-xs font-bold rounded-xl transition-all shadow-md"
                    >
                      View Project <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Testimonials;
