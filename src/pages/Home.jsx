import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Code, Shield, Brain, Server, Monitor, Database, Cpu, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchExcelData } from '../utils/excelUtils';
import { fetchConfig } from '../utils/configUtils';
import ClientMap from '../components/ClientMap';

// Map icon strings to actual components
const IconMap = {
  Monitor, Cpu, ShieldCheck, Database, Code, Shield, Brain, Server
};

const Home = () => {
  const [stats, setStats] = useState({ projects: 0, clients: 0, services: 0, countries: 6 });
  const [testimonials, setTestimonials] = useState([]);
  const [services, setServices] = useState([]);
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [config, setConfig] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const cfg = await fetchConfig();
      setConfig(cfg);

      const projectsData = await fetchExcelData('projects.xlsx');
      const clientsData = await fetchExcelData('clients.xlsx');
      const testimsData = await fetchExcelData('testimonials.xlsx');
      const servicesData = await fetchExcelData('services.xlsx');

      const isEnabled = (val) => {
        if (val === undefined || val === null) return true;
        const str = String(val).trim().toLowerCase();
        return str !== 'false' && str !== 'no' && str !== 'n' && str !== '0';
      };

      const isFeatured = (val) => {
        if (val === undefined || val === null) return false;
        const str = String(val).trim().toLowerCase();
        return str === 'true' || str === 'yes' || str === 'y' || str === '1';
      };

      setStats({
        projects: projectsData.length,
        clients: clientsData.length,
        services: servicesData.filter(s => isEnabled(s.Enabled)).length,
        countries: new Set(clientsData.map(c => c.Country)).size
      });

      setTestimonials(testimsData);
      setServices(servicesData.filter(s => isEnabled(s.Enabled)).slice(0, 4));
      setFeaturedProjects(projectsData.filter(p => isFeatured(p['Featured Project Toggle'])).slice(0, 3));
    };
    loadData();
  }, []);

  if (!config) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden bg-[#FAFAFA]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#F0F2F5] to-transparent z-0 opacity-50"></div>
        {/* Subtle grid pattern background characteristic of Linear/Vercel */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgc3Ryb2tlPSJyZ2JhKDAsMCwwLDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiPjxwYXRoIGQ9Ik0wIDEwbDQwIDBNMTAgMGwwIDQwIiAvPjwvZz48L3N2Zz4=')] opacity-60 z-0"></div>

        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-6xl md:text-8xl font-extrabold tracking-tighter mb-8 leading-[1.1] text-[#111827]"
            >
              {config.HeroHeading}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-xl md:text-2xl text-gray-500 mb-12 max-w-3xl mx-auto leading-relaxed font-medium"
            >
              {config.HeroSubheading}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link to={config.HeroButtonPrimaryLink || "/contact"} className="w-full sm:w-auto px-8 py-4 bg-brand-primary text-white rounded-xl font-bold text-lg hover:bg-brand-dark transition-all shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_40px_rgb(20,52,129,0.2)] flex items-center justify-center gap-2">
                {config.HeroButtonPrimaryText || "Start Your Project"} <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to={config.HeroButtonSecondaryLink || "/work"} className="w-full sm:w-auto px-8 py-4 bg-white border border-gray-200 text-gray-800 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all shadow-sm flex items-center justify-center gap-2">
                {config.HeroButtonSecondaryText || "View Our Work"}
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {/* <section className="py-12 bg-white border-y border-gray-100">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: `${stats.projects > 0 ? stats.projects : 50}+`, label: 'Projects Delivered' },
              { value: `${stats.clients > 0 ? stats.clients : 20}+`, label: 'Global Clients' },
              { value: `${stats.countries > 0 ? stats.countries : 6}+`, label: 'Countries Served' },
              { value: '99%', label: 'Client Satisfaction' }
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <h3 className="text-4xl font-bold text-brand-darker tracking-tight mb-2">{stat.value}</h3>
                <p className="text-gray-500 font-semibold tracking-wide text-xs uppercase">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      */}
      {/* Dynamic Services Preview */}
      <section className="py-32 bg-[#FAFAFA]">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-3xl mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-brand-darker tracking-tight mb-6">Enterprise-Grade Solutions</h2>
            <p className="text-xl text-gray-500">We build robust, scalable, and secure applications tailored to your business needs.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, idx) => {
              const IconComponent = IconMap[service.Icon] || Server;
              return (
                <motion.div
                  key={idx}
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white p-8 rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-col group"
                >
                  <div className="w-12 h-12 bg-brand-lightest/50 rounded-2xl flex items-center justify-center mb-6 text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-colors">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-brand-darker mb-3">{service['Service Name']}</h3>
                  <p className="text-gray-500 leading-relaxed mb-6 flex-grow">{service['Short Description']}</p>
                  <Link to={service['CTA Link'] || '/services'} className="text-brand-primary font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                    {service['CTA Text'] || 'Learn More'} <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Projects Preview */}
      <section className="py-32 bg-white border-t border-gray-100">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex justify-between items-end mb-20">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-bold text-brand-darker tracking-tight mb-6">Featured Work</h2>
              <p className="text-xl text-gray-500">A selection of our most impactful enterprise projects.</p>
            </div>
            <Link to="/work" className="hidden md:flex items-center gap-2 text-brand-primary font-bold hover:gap-3 transition-all">
              View All Projects <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProjects.map((project, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group cursor-pointer"
              >
                <div className="aspect-video bg-gray-100 rounded-3xl overflow-hidden mb-6 relative">
                  {project.Image ? (
                    <img src={project.Image} alt={project.Title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center transition-transform duration-700 group-hover:scale-105">
                      <span className="text-gray-400 font-bold text-xl">{project.Title}</span>
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-xs font-bold text-brand-darker shadow-sm">
                    {project.Category}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-brand-darker mb-2 group-hover:text-brand-primary transition-colors">{project.Title}</h3>
                <p className="text-gray-500 line-clamp-2">{project['Short Description'] || project.Description}</p>
              </motion.div>
            ))}
          </div>
          <div className="mt-12 text-center md:hidden">
            <Link to="/work" className="inline-flex items-center gap-2 text-brand-primary font-bold">
              View All Projects <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Global Presence Map Section */}
      <section className="py-32 bg-[#FAFAFA] border-t border-gray-100">
        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="w-full lg:w-1/3">
              <h2 className="text-4xl md:text-5xl font-bold text-brand-darker tracking-tight mb-6">Global Presence</h2>
              <p className="text-lg text-gray-500 mb-8 leading-relaxed">
                From Mumbai to Canada, Dubai, Austria and beyond. We serve clients across the globe, providing reliable technology partnerships regardless of borders.
              </p>
            </div>
            <div className="w-full lg:w-2/3">
              <ClientMap />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-brand-darker text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-brand-primary/20 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiPjxwYXRoIGQ9Ik0wIDEwbDQwIDBNMTAgMGwwIDQwIiAvPjwvZz48L3N2Zz4=')] opacity-20"></div>
        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <h2 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">Ready to Scale?</h2>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto font-medium">Join leading businesses worldwide who trust TechInnoSphere with their core technology infrastructure.</p>
          <Link to="/contact" className="px-10 py-5 bg-white text-brand-darker rounded-2xl font-bold text-lg hover:bg-gray-50 transition-all shadow-[0_8px_30px_rgb(255,255,255,0.1)] inline-flex items-center gap-3">
            Contact Our Team <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
