import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchExcelData } from '../utils/excelUtils';
import { ExternalLink, Calendar, MapPin, X, ChevronLeft, ChevronRight, Briefcase, Star, Target, Lightbulb, TrendingUp } from 'lucide-react';

const Work = () => {
  const [projects, setProjects] = useState([]);
  const [filter, setFilter] = useState('All');
  const [categories, setCategories] = useState(['All']);
  const [selectedProjectIndex, setSelectedProjectIndex] = useState(null);

  useEffect(() => {
    const loadProjects = async () => {
      const data = await fetchExcelData('projects.xlsx');
      setProjects(data);
      const uniqueCategories = ['All', ...new Set(data.map(p => p.Category).filter(Boolean))];
      setCategories(uniqueCategories);
    };
    loadProjects();
  }, []);

  const filteredProjects = filter === 'All' ? projects : projects.filter(p => p.Category === filter);

  // Keyboard navigation for modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedProjectIndex === null) return;
      if (e.key === 'Escape') setSelectedProjectIndex(null);
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedProjectIndex, filteredProjects]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedProjectIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; }
  }, [selectedProjectIndex]);

  const handleNext = () => {
    setSelectedProjectIndex((prev) => (prev + 1) % filteredProjects.length);
  };

  const handlePrev = () => {
    setSelectedProjectIndex((prev) => (prev - 1 + filteredProjects.length) % filteredProjects.length);
  };

  const selectedProject = selectedProjectIndex !== null ? filteredProjects[selectedProjectIndex] : null;

  return (
    <div className="bg-[#FAFAFA] min-h-screen pt-32 pb-24 relative">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgc3Ryb2tlPSJyZ2JhKDAsMCwwLDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiPjxwYXRoIGQ9Ik0wIDEwbDQwIDBNMTAgMGwwIDQwIiAvPjwvZz48L3N2Zz4=')] opacity-60 z-0 pointer-events-none"></div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="max-w-3xl mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-extrabold text-[#111827] tracking-tight mb-6"
          >
            Our Work
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-500 font-medium leading-relaxed"
          >
            Explore our premium portfolio of highly scalable enterprise systems, cutting-edge AI integrations, and beautifully crafted web applications.
          </motion.p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-16">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => { setFilter(cat); setSelectedProjectIndex(null); }}
              className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${
                filter === cat 
                  ? 'bg-[#111827] text-white shadow-md' 
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredProjects.map((project, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              onClick={() => setSelectedProjectIndex(idx)}
              className="bg-white rounded-3xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_40px_rgba(0,0,0,0.08)] transition-all border border-gray-100 group flex flex-col cursor-pointer"
            >
              <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden flex items-center justify-center">
                {project.Image ? (
                  <img src={project.Image} alt={project.Title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                ) : (
                  <div className="text-gray-400 font-bold text-3xl tracking-wider transition-transform duration-700 group-hover:scale-110">
                    {project.Title.substring(0, 2).toUpperCase()}
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-brand-darker text-xs font-bold border border-white/50 shadow-sm">
                  {project.Category}
                </div>
              </div>
              
              <div className="p-8 flex-grow flex flex-col">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  <Briefcase className="w-3 h-3" /> {project.Industry || 'Enterprise'}
                </div>
                <h3 className="text-2xl font-extrabold text-brand-darker tracking-tight mb-3 group-hover:text-brand-primary transition-colors">{project.Title}</h3>
                <p className="text-gray-500 mb-6 flex-grow line-clamp-2">{project['Short Description'] || project.Description}</p>
                
                <div className="flex flex-wrap gap-2 mt-auto">
                  {project['Technology Used']?.split(',').slice(0, 3).map((tech, i) => (
                    <span key={i} className="px-2.5 py-1 bg-gray-50 border border-gray-100 text-gray-600 rounded text-xs font-semibold">
                      {tech.trim()}
                    </span>
                  ))}
                  {project['Technology Used']?.split(',').length > 3 && (
                     <span className="px-2.5 py-1 text-gray-400 text-xs font-semibold">+{project['Technology Used'].split(',').length - 3}</span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Premium Fullscreen Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-6 bg-[#FAFAFA]/90 backdrop-blur-sm"
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-full h-full md:rounded-[2rem] bg-white overflow-y-auto shadow-2xl relative border border-gray-200 flex flex-col"
            >
              {/* Modal Header & Navigation */}
              <div className="sticky top-0 z-20 flex justify-between items-center p-4 md:p-6 bg-white/80 backdrop-blur-xl border-b border-gray-100">
                <div className="flex gap-2">
                  <button onClick={handlePrev} className="p-2 rounded-full hover:bg-gray-100 transition-colors" title="Previous Project">
                    <ChevronLeft className="w-6 h-6 text-gray-600" />
                  </button>
                  <button onClick={handleNext} className="p-2 rounded-full hover:bg-gray-100 transition-colors" title="Next Project">
                    <ChevronRight className="w-6 h-6 text-gray-600" />
                  </button>
                </div>
                <button onClick={() => setSelectedProjectIndex(null)} className="p-2 rounded-full hover:bg-gray-100 transition-colors bg-gray-50" title="Close">
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-grow pb-24">
                {/* Banner */}
                <div className="w-full aspect-[21/9] md:aspect-[3/1] bg-gray-100 relative">
                  {selectedProject.Image ? (
                    <img src={selectedProject.Image} alt={selectedProject.Title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-brand-primary/10 to-brand-darker/10 flex items-center justify-center">
                       <span className="text-brand-darker/20 font-bold text-6xl tracking-tighter">CASE STUDY</span>
                    </div>
                  )}
                </div>

                <div className="max-w-4xl mx-auto px-6 lg:px-0 -mt-16 relative z-10">
                  {/* Meta Card */}
                  <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 mb-16 flex flex-wrap gap-8 justify-between">
                    <div>
                      <h2 className="text-4xl font-extrabold text-[#111827] tracking-tight mb-2">{selectedProject.Title}</h2>
                      <p className="text-gray-500 font-medium text-lg">{selectedProject.Description}</p>
                    </div>
                    <div className="flex flex-wrap gap-6 text-sm font-semibold text-gray-600 w-full pt-6 border-t border-gray-100">
                      <div className="flex items-center gap-2"><Briefcase className="w-4 h-4 text-brand-primary" /> Client: {selectedProject['Client Name'] || 'Confidential'}</div>
                      <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-brand-primary" /> {selectedProject.Location}</div>
                      <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-brand-primary" /> {selectedProject['Completion Date'] || 'N/A'}</div>
                      <div className="flex items-center gap-2"><Target className="w-4 h-4 text-brand-primary" /> {selectedProject.Industry || selectedProject.Category}</div>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="space-y-16">
                    {/* Full Description */}
                    <div>
                      <h3 className="text-2xl font-bold text-brand-darker mb-4">Project Overview</h3>
                      <p className="text-lg text-gray-600 leading-relaxed">
                        {selectedProject['Full Case Study Description'] || selectedProject.Description}
                      </p>
                    </div>

                    {/* Challenges & Solutions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {selectedProject.Challenges && (
                        <div className="bg-red-50/50 rounded-3xl p-8 border border-red-100">
                          <Target className="w-8 h-8 text-red-500 mb-4" />
                          <h4 className="text-xl font-bold text-gray-900 mb-3">The Challenge</h4>
                          <p className="text-gray-600 leading-relaxed">{selectedProject.Challenges}</p>
                        </div>
                      )}
                      {selectedProject['Solution Provided'] && (
                        <div className="bg-green-50/50 rounded-3xl p-8 border border-green-100">
                          <Lightbulb className="w-8 h-8 text-green-500 mb-4" />
                          <h4 className="text-xl font-bold text-gray-900 mb-3">Our Solution</h4>
                          <p className="text-gray-600 leading-relaxed">{selectedProject['Solution Provided']}</p>
                        </div>
                      )}
                    </div>

                    {/* Business Outcome */}
                    {selectedProject['Business Outcome'] && (
                      <div className="bg-brand-lightest/30 rounded-3xl p-8 border border-brand-lightest">
                        <TrendingUp className="w-8 h-8 text-brand-primary mb-4" />
                        <h4 className="text-xl font-bold text-gray-900 mb-3">Business Outcome</h4>
                        <p className="text-gray-700 font-medium text-lg leading-relaxed">{selectedProject['Business Outcome']}</p>
                      </div>
                    )}

                    {/* Tech Stack */}
                    <div>
                      <h3 className="text-xl font-bold text-brand-darker mb-4">Technologies Used</h3>
                      <div className="flex flex-wrap gap-3">
                        {selectedProject['Technology Used']?.split(',').map((tech, i) => (
                          <span key={i} className="px-4 py-2 bg-[#F3F4F6] text-[#374151] rounded-lg text-sm font-bold">
                            {tech.trim()}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Testimonial embedded */}
                    {selectedProject.Testimonial && (
                      <div className="pt-10 border-t border-gray-100">
                        <div className="flex gap-4 items-start">
                          <div className="text-brand-primary/20 text-6xl font-serif leading-none">"</div>
                          <div>
                            <p className="text-xl text-gray-700 italic mb-6 leading-relaxed">
                              {selectedProject.Testimonial}
                            </p>
                            <div className="flex items-center justify-between">
                              <div>
                                <h5 className="font-bold text-gray-900">{selectedProject['Client Name']}</h5>
                                <p className="text-sm text-gray-500">{selectedProject['Client Designation']}</p>
                              </div>
                              {selectedProject['Client Rating'] && (
                                <div className="flex gap-1 text-yellow-400">
                                  {[...Array(Number(selectedProject['Client Rating']))].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Action */}
                    {selectedProject['Website URL'] && (
                      <div className="pt-10 pb-10 text-center">
                        <a 
                          href={selectedProject['Website URL']} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center px-10 py-5 bg-[#111827] text-white font-bold rounded-xl hover:bg-brand-primary transition-all shadow-xl hover:-translate-y-1 gap-3"
                        >
                          Visit Live Project <ExternalLink className="w-5 h-5" />
                        </a>
                      </div>
                    )}

                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Work;
