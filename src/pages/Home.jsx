import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Code, Shield, Brain, Server, Monitor, Database, Cpu, ShieldCheck, Star, Quote } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getDirectImageUrl } from '../utils/excelUtils';
import { getProjects, getClients, getTestimonials, getServices } from '../utils/supabaseUtils';
import { fetchConfig } from '../utils/configUtils';
import ClientMap from '../components/ClientMap';
import SEO from '../components/SEO';
import { getWebSiteSchema, getOrganizationSchema, getLocalBusinessSchema } from '../config/seo';

// Map icon strings to actual components
const IconMap = {
  Monitor, Cpu, ShieldCheck, Database, Code, Shield, Brain, Server
};

const DEFAULT_CONFIG = {
  HeroHeading: 'TechInnoSphere – Software Development & AI Solutions Company',
  HeroSubheading: 'TechInnoSphere Software Solutions Pvt. Ltd. is a Mumbai-based technology company delivering web and application development, custom software, AI solutions, SAP ABAP, automation and digital transformation services for businesses in India and global markets.',
  HeroButtonPrimaryText: 'Start Your Project',
  HeroButtonPrimaryLink: '/contact',
  HeroButtonSecondaryText: 'Explore Our Work',
  HeroButtonSecondaryLink: '/work',
  CompanyName: 'TechInnoSphere'
};

const Home = () => {
  const [stats, setStats] = useState({ projects: 0, clients: 0, services: 0, countries: 6 });
  const [testimonials, setTestimonials] = useState([]);
  const [services, setServices] = useState([]);
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    if (testimonials.length === 0) return;
    const isTestimonialFeatured = (t) => {
      if (t.Featured) {
        const str = String(t.Featured).trim().toLowerCase();
        return str === 'true' || str === 'yes' || str === 'y' || str === '1';
      }
      return Number(t.Rating) === 5;
    };
    const featured = testimonials.filter(isTestimonialFeatured).slice(0, 6);
    if (featured.length === 0) return;

    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % featured.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [testimonials]);

  useEffect(() => {
    const loadData = async () => {
      const cfg = await fetchConfig();
      if (cfg && Object.keys(cfg).length > 0) {
        setConfig((prev) => ({ ...prev, ...cfg }));
      }

      const projectsData = await getProjects();
      const clientsData = await getClients();
      const testimsData = await getTestimonials();
      const servicesData = await getServices();

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

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      getWebSiteSchema(),
      getOrganizationSchema(),
      getLocalBusinessSchema()
    ]
  };

  return (
    <div className="bg-white">
      <SEO
        title="TechInnoSphere | Software Development & AI Solutions Company"
        description="TechInnoSphere Software Solutions Pvt. Ltd. is a software development and technology company based in Mumbai, India, offering web and application development, AI solutions, custom software, SAP ABAP, automation, and digital transformation services."
        canonical="https://techinnosphere.com/"
        structuredData={structuredData}
      />

      {/* 1. Hero Section: Primary H1 & Company Introduction */}
      <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden bg-[#FAFAFA]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#F0F2F5] to-transparent z-0 opacity-50"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgc3Ryb2tlPSJyZ2JhKDAsMCwwLDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiPjxwYXRoIGQ9Ik0wIDEwbDQwIDBNMTAgMGwwIDQwIiAvPjwvZz48L3N2Zz4=')] opacity-60 z-0"></div>

        <div className="container mx-auto px-6 lg:px-12 relative z-10 py-16">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-lightest text-brand-primary text-sm font-bold mb-6 border border-brand-primary/10">
              <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse"></span>
              Software Development Company in Mumbai
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter mb-8 leading-[1.15] text-[#111827]"
            >
              TechInnoSphere – Software Development &amp; AI Solutions Company
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-lg md:text-xl text-gray-600 mb-10 max-w-4xl mx-auto leading-relaxed font-normal"
            >
              TechInnoSphere Software Solutions Pvt. Ltd. is a Mumbai-based technology company delivering web and application development, custom software, AI solutions, SAP ABAP, automation and digital transformation services for businesses in India and global markets.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link
                to={config.HeroButtonPrimaryLink || "/contact"}
                className="w-full sm:w-auto px-8 py-4 bg-brand-primary text-white rounded-xl font-bold text-lg hover:bg-brand-dark transition-all shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_40px_rgb(20,52,129,0.2)] flex items-center justify-center gap-2"
              >
                {config.HeroButtonPrimaryText || "Start Your Project"} <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to={config.HeroButtonSecondaryLink || "/work"}
                className="w-full sm:w-auto px-8 py-4 bg-white border border-gray-200 text-gray-800 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all shadow-sm flex items-center justify-center gap-2"
              >
                {config.HeroButtonSecondaryText || "Explore Our Work"}
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. Core Services Section */}
      <section className="py-28 bg-[#FAFAFA] border-t border-gray-100">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-3xl mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-brand-darker tracking-tight mb-4">
              Our Software Development Services
            </h2>
            <p className="text-xl text-brand-primary font-bold mb-4">
              Enterprise Software Development &amp; AI Solutions
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              As a full-service software development company in Mumbai, we architect, engineer, and deploy high-performance web development platforms, mobile application development, custom software systems, enterprise AI solutions, SAP ABAP integrations, and business automation workflows that drive measurable digital transformation.
            </p>
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
                  <Link
                    to={service['CTA Link'] || '/services'}
                    className="text-brand-primary font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all"
                  >
                    {service['CTA Text'] || 'Learn More'} <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              );
            })}
          </div>
          <div className="mt-12 text-center">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 text-brand-primary font-bold hover:text-brand-dark transition-colors text-base"
            >
              Explore our software development services <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Featured Projects & Case Studies */}
      <section className="py-28 bg-white border-t border-gray-100">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex justify-between items-end mb-16">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-bold text-brand-darker tracking-tight mb-4">
                Featured Projects &amp; Case Studies
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                A selection of high-impact custom software development, web development, mobile applications, and AI development systems engineered for global organizations.
              </p>
            </div>
            <Link
              to="/work"
              className="hidden md:flex items-center gap-2 text-brand-primary font-bold hover:gap-3 transition-all"
            >
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
                    <img
                      src={project.Image}
                      alt={`TechInnoSphere software project: ${project.Title} - ${project.Category}`}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center transition-transform duration-700 group-hover:scale-105">
                      <span className="text-gray-400 font-bold text-xl">{project.Title}</span>
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-xs font-bold text-brand-darker shadow-sm">
                    {project.Category}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-brand-darker mb-2 group-hover:text-brand-primary transition-colors">
                  {project.Title}
                </h3>
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

      {/* 4. Testimonials Section */}
      <section className="py-28 bg-white border-t border-gray-100 overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgc3Ryb2tlPSJyZ2JhKDAsMCwwLDAuMDIpIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiPjxwYXRoIGQ9Ik0wIDEwbDQwIDBNMTAgMGwwIDQwIiAvPjwvZz48L3N2Zz4=')] opacity-50 z-0"></div>
        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-bold text-brand-darker tracking-tight mb-4">
                What Our Clients Say
              </h2>
              <p className="text-lg text-gray-600 font-medium">
                Read feedback from enterprise leaders who partner with our software development company for digital transformation.
              </p>
            </div>
            <Link to="/testimonials" className="mt-6 md:mt-0 flex items-center gap-2 text-brand-primary font-bold hover:gap-3 transition-all">
              View All Testimonials <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {(() => {
            const isTestimonialFeatured = (t) => {
              if (t.Featured) {
                const str = String(t.Featured).trim().toLowerCase();
                return str === 'true' || str === 'yes' || str === 'y' || str === '1';
              }
              return Number(t.Rating) === 5;
            };
            const featured = testimonials.filter(isTestimonialFeatured).slice(0, 6);
            
            if (featured.length === 0) return null;

            return (
              <div className="max-w-4xl mx-auto">
                <div className="relative h-[420px] sm:h-[320px] md:h-[280px]">
                  {featured.map((t, idx) => {
                    const isCurrent = idx === activeSlide;
                    const photoUrl = getDirectImageUrl(t['Client Photo']);
                    return (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: 50 }}
                        animate={isCurrent ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className={`absolute inset-0 bg-[#FAFAFA] rounded-3xl p-8 md:p-12 border border-gray-100 flex flex-col justify-between shadow-[0_8px_30px_rgba(0,0,0,0.01)] ${isCurrent ? 'pointer-events-auto' : 'pointer-events-none'}`}
                      >
                        <div>
                          <div className="flex justify-between items-start mb-6">
                            <Quote className="w-10 h-10 text-brand-primary/10" />
                            <div className="flex gap-0.5 text-yellow-400">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${i < (Number(t.Rating) || 5) ? 'fill-current' : 'opacity-30'}`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-600 font-medium italic text-base md:text-lg leading-relaxed mb-6">
                            "{t.Feedback || t.Comment || 'Exceptional partner for building digital platforms.'}"
                          </p>
                        </div>
                        <div className="flex items-center gap-4 border-t border-gray-200/50 pt-4">
                          {photoUrl ? (
                            <img
                              src={photoUrl}
                              alt={`${t['Client Name']}, ${t.Designation || 'Client'} at ${t.Company} - Client review for TechInnoSphere`}
                              loading="lazy"
                              className="w-12 h-12 rounded-full object-cover border border-gray-200"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-primary/20 to-brand-dark/20 text-brand-dark flex items-center justify-center font-bold text-sm">
                              {(t['Client Name'] || 'C').substring(0, 1).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <h3 className="font-extrabold text-brand-darker text-sm md:text-base leading-tight">{t['Client Name']}</h3>
                            <p className="text-xs text-gray-500 font-bold leading-none mt-1">{t.Designation || t.Role || 'Director'} at <span className="text-brand-primary">{t.Company}</span></p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Track Indicators */}
                <div className="flex justify-center gap-2 mt-8">
                  {featured.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveSlide(idx)}
                      className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${idx === activeSlide ? 'bg-brand-primary w-8' : 'bg-gray-200 hover:bg-gray-300'}`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      </section>

      {/* 5. Global Presence Map Section */}
      <section className="py-28 bg-[#FAFAFA] border-t border-gray-100">
        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="w-full lg:w-1/3">
              <h2 className="text-4xl md:text-5xl font-bold text-brand-darker tracking-tight mb-6">
                Global Technology Partnerships
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Headquartered as a premier software development company in Mumbai, India, TechInnoSphere delivers digital transformation, custom software, AI solutions, and technology consulting across India, United Arab Emirates, Canada, Austria, and worldwide. We provide seamless communication, transparent project management, and reliable delivery across time zones.
              </p>
            </div>
            <div className="w-full lg:w-2/3">
              <ClientMap />
            </div>
          </div>
        </div>
      </section>

      {/* 6. CTA Section: Contact TechInnoSphere */}
      <section className="py-28 bg-brand-darker text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-brand-primary/20 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiPjxwYXRoIGQ9Ik0wIDEwbDQwIDBNMTAgMGwwIDQwIiAvPjwvZz48L3N2Zz4=')] opacity-20"></div>
        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
            Contact TechInnoSphere
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto font-medium">
            Ready to build your custom software system, web application, mobile app, or AI solution? Get in touch with our engineering team in Mumbai, India.
          </p>
          <Link
            to="/contact"
            className="px-10 py-5 bg-white text-brand-darker rounded-2xl font-bold text-lg hover:bg-gray-50 transition-all shadow-[0_8px_30px_rgb(255,255,255,0.1)] inline-flex items-center gap-3"
          >
            Contact Our Engineering Team <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
