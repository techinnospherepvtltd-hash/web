import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchExcelData } from '../utils/excelUtils';
import { Briefcase, MapPin, Clock, FileText, CheckCircle2, X, ExternalLink } from 'lucide-react';

const Careers = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    const loadJobs = async () => {
      const data = await fetchExcelData('jobs.xlsx');
      // Filter only Open jobs
      const openJobs = data.filter(job => job.Status === 'Open' || job.Status === 'open');
      setJobs(openJobs);
    };
    loadJobs();
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedJob) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; }
  }, [selectedJob]);

  const handleApply = (url) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      alert("Application link is not configured for this job.");
    }
  };

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
            Join Our Team
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-500 font-medium leading-relaxed"
          >
            Build the future of technology with us. We are always looking for passionate engineers, designers, and innovators to join our global team.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 gap-6 max-w-5xl mx-auto">
          {jobs.map((job, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white p-8 rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_40px_rgba(0,0,0,0.08)] transition-all border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-8 group"
            >
              <div className="flex-grow">
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-3 py-1 bg-brand-lightest text-brand-primary rounded-full text-xs font-bold uppercase tracking-wider">{job.Department}</span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold uppercase tracking-wider">{job['Employment Type'] || 'Full-Time'}</span>
                </div>
                <h3 className="text-2xl font-extrabold text-[#111827] mb-3 group-hover:text-brand-primary transition-colors">{job['Job Title']}</h3>
                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 font-semibold">
                  <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-brand-light" /> {job.Location}</span>
                  <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-brand-light" /> {job['Experience Required'] || job.Experience}</span>
                </div>
              </div>
              <div className="flex items-center gap-4 w-full md:w-auto">
                <button 
                  onClick={() => setSelectedJob(job)}
                  className="flex-1 md:flex-none whitespace-nowrap px-6 py-3.5 bg-white border border-gray-200 text-gray-800 font-bold rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
                >
                  View Details
                </button>
                <button 
                  onClick={() => handleApply(job['Google Form URL'])}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 whitespace-nowrap px-8 py-3.5 bg-[#111827] text-white font-bold rounded-xl hover:bg-brand-primary transition-all shadow-[0_4px_14px_rgba(0,0,0,0.1)]"
                >
                  Apply Now <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
          
          {jobs.length === 0 && (
            <div className="bg-white p-16 rounded-3xl text-center border border-gray-100 shadow-sm">
              <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-gray-400">
                <Briefcase className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No Openings Currently</h3>
              <p className="text-gray-500 font-medium">Please check back later or send your resume to careers@techinnosphere.com</p>
            </div>
          )}
        </div>
      </div>

      {/* Premium Fullscreen Modal for Job Details */}
      <AnimatePresence>
        {selectedJob && (
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
              className="w-full max-w-4xl h-full md:h-auto md:max-h-[90vh] md:rounded-[2rem] bg-white overflow-y-auto shadow-2xl relative border border-gray-200 flex flex-col"
            >
              {/* Modal Header */}
              <div className="sticky top-0 z-20 flex justify-between items-center p-6 bg-white/80 backdrop-blur-xl border-b border-gray-100">
                <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                  <FileText className="w-5 h-5 text-brand-primary" /> Job Description
                </h3>
                <button onClick={() => setSelectedJob(null)} className="p-2 rounded-full hover:bg-gray-100 transition-colors bg-gray-50">
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-8 md:p-12 flex-grow space-y-10">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-brand-lightest text-brand-primary rounded-full text-xs font-bold uppercase tracking-wider">{selectedJob.Department}</span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold uppercase tracking-wider">{selectedJob['Employment Type'] || 'Full-Time'}</span>
                  </div>
                  <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-6">{selectedJob['Job Title']}</h2>
                  
                  <div className="flex flex-wrap gap-6 text-sm font-semibold text-gray-500 pt-6 border-t border-gray-100">
                    <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-brand-primary" /> {selectedJob.Location}</span>
                    <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-brand-primary" /> {selectedJob['Experience Required'] || selectedJob.Experience}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">About the Role</h3>
                  <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-wrap">
                    {selectedJob['Job Description'] || selectedJob.Description}
                  </p>
                </div>

                {selectedJob['Skills Required'] && (
                  <div className="bg-[#F9FAFB] rounded-3xl p-8 border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Skills & Requirements</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedJob['Skills Required'].split(',').map((skill, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700 font-medium">{skill.trim()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Apply Section */}
                <div className="pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Ready to join us?</h4>
                    <p className="text-gray-500 text-sm">You will be redirected to our application form.</p>
                  </div>
                  <button 
                    onClick={() => handleApply(selectedJob['Google Form URL'])}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-10 py-4 bg-[#111827] text-white font-bold rounded-xl hover:bg-brand-primary transition-all shadow-xl hover:-translate-y-1"
                  >
                    Apply Now <ExternalLink className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Careers;
