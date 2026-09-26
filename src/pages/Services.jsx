import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Monitor, Cpu, ShieldCheck, Database, Layers, BarChart, ArrowRight, Code, Shield, Brain, Server, CheckCircle2 } from 'lucide-react';
import { getServices } from '../utils/supabaseUtils';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { getBreadcrumbSchema } from '../config/seo';

const IconMap = {
  Monitor, Cpu, ShieldCheck, Database, Layers, BarChart, Code, Shield, Brain, Server
};

const SERVICE_DETAILS_MAP = {
  'Web & Application Development': {
    problemSolved: 'Outdated web presence, slow load times, poor mobile responsiveness, and rigid architectures hindering user engagement and online conversions.',
    whatWeProvide: 'Custom responsive web apps, high-converting e-commerce platforms, static & dynamic websites, API-first architecture, and secure full-stack development.',
  },
  'AI & Advanced Technology Solutions': {
    problemSolved: 'Time-consuming manual operations, unstructured data backlogs, and lack of intelligent decision-making automation in daily workflows.',
    whatWeProvide: 'AI product development, LLM & OpenAI integration, AI photo & video tools, process automation, predictive intelligence, and smart agents.',
  },
  'Enterprise & Business Solutions': {
    problemSolved: 'Disconnected operational software, siloed departmental data, and lack of unified enterprise management across growing companies.',
    whatWeProvide: 'SAP ABAP custom development, ERP implementation, CRM & POS platforms, workflow automation, and custom enterprise software solutions.',
  },
  'Annual Maintenance Contract (AMC)': {
    problemSolved: 'Unexpected system downtimes, unpatched security vulnerabilities, performance degradation, and lack of dedicated SLA-backed IT support.',
    whatWeProvide: '24/7 uptime monitoring, scheduled security updates, performance optimization, database maintenance, and priority technical support.',
  },
  'Digital Marketing': {
    problemSolved: 'Low organic search rankings, inconsistent lead generation, fragmented social branding, and low return on marketing spend.',
    whatWeProvide: 'Search Engine Optimization (SEO), data-driven social media integration, content marketing, Google & Meta advertising, and conversion tracking.',
  },
  'Consulting & Strategy': {
    problemSolved: 'Unclear technology roadmaps, mounting technical debt, and friction when adopting modern cloud and AI digital transformation initiatives.',
    whatWeProvide: 'Technology audits, digital transformation consulting, architecture planning, agile roadmapping, and scalability assessments.',
  },
  'Design & User Experience': {
    problemSolved: 'High user bounce rates, confusing interface navigation, poor accessibility, and inconsistent brand presentation across digital platforms.',
    whatWeProvide: 'User research, wireframing, high-fidelity Figma UI/UX prototyping, design systems, and responsive interface engineering.',
  },
  'Data Analytics & Intelligence': {
    problemSolved: 'Scattered data across multiple databases and applications preventing management from accessing real-time, actionable business insights.',
    whatWeProvide: 'Executive dashboards, business intelligence reporting, Power BI/Tableau integrations, and custom analytical data pipelines.',
  },
  'Web Application Security Testing (VAPT)': {
    problemSolved: 'Unknown web application vulnerabilities, data breach risks, and non-compliance with international cyber security standards.',
    whatWeProvide: 'OWASP Top 10 security audits, SQLi & XSS testing, business logic validation, vulnerability remediation reports, and compliance verification.',
  },
  'Mobile Application Security Testing': {
    problemSolved: 'Insecure mobile data storage, reverse-engineering vulnerabilities, and untrusted client-server communication in iOS and Android applications.',
    whatWeProvide: 'Static & dynamic mobile application testing (MobSF), runtime analysis, cryptographic audits, and OWASP MASVS compliance checks.',
  },
  'API Security Testing': {
    problemSolved: 'Broken object-level authorization, shadow API endpoints, rate-limiting loopholes, and unauthorized data leakage.',
    whatWeProvide: 'REST/GraphQL security assessments, JWT/OAuth flow analysis, automated penetration testing, and rate-limiting enforcement.',
  },
  'Source Code Security Review': {
    problemSolved: 'Hidden backdoors, hardcoded secrets, memory leaks, and legacy insecure functions buried inside codebases.',
    whatWeProvide: 'Automated SAST scans, manual source code reviews, dependency vulnerability auditing, and developer security best practices.',
  },
  'Network Penetration Testing': {
    problemSolved: 'Perimeter firewall misconfigurations, exposed internal ports, and unpatched network infrastructure susceptible to external breach.',
    whatWeProvide: 'External & internal network penetration testing, simulated attack scenarios, port scanning, and infrastructure hardening.',
  }
};

const Services = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    const loadServices = async () => {
      const data = await getServices();
      const isEnabled = (val) => {
        if (val === undefined || val === null) return true;
        const str = String(val).trim().toLowerCase();
        return str !== 'false' && str !== 'no' && str !== 'n' && str !== '0';
      };
      setServices(data.filter(s => isEnabled(s.Enabled)));
    };
    loadServices();
  }, []);

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      getBreadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Software Development & Technology Services', url: '/services' }
      ]),
      ...services.map(s => ({
        '@type': 'Service',
        name: s['Service Name'],
        description: s['Detailed Description'] || s['Short Description'],
        provider: {
          '@type': 'Organization',
          name: 'TechInnoSphere Software Solutions Pvt. Ltd.',
          url: 'https://techinnosphere.com'
        },
        serviceType: s.Category || 'Software Development',
        areaServed: 'Worldwide'
      }))
    ]
  };

  return (
    <div className="bg-[#FAFAFA] min-h-screen pt-32 pb-24 relative overflow-hidden">
      <SEO
        title="Software Development, AI & Technology Services | TechInnoSphere"
        description="TechInnoSphere provides custom software development, web & application development, AI development & integration, SAP ABAP services, and digital automation."
        canonical="https://techinnosphere.com/services"
        structuredData={structuredData}
      />

      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgc3Ryb2tlPSJyZ2JhKDAsMCwwLDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiPjxwYXRoIGQ9Ik0wIDEwbDQwIDBNMTAgMGwwIDQwIiAvPjwvZz48L3N2Zz4=')] opacity-60 z-0 pointer-events-none"></div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="max-w-4xl mb-16 text-center mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-[#111827] tracking-tight mb-6"
          >
            Software Development &amp; Technology Services
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg sm:text-xl text-gray-500 font-medium leading-relaxed"
          >
            Comprehensive enterprise-grade solutions engineered to accelerate digital transformation, automate business operations, and scale technology infrastructure. Delivered by TechInnoSphere from Mumbai, India to global businesses.
          </motion.p>
        </div>

        {/* Core Capabilities Overview Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-20 max-w-6xl mx-auto">
          <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm text-center">
            <span className="block font-bold text-gray-900 text-sm mb-1">Web &amp; Apps</span>
            <span className="text-xs text-gray-500">Static, Dynamic &amp; E-Commerce</span>
          </div>
          <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm text-center">
            <span className="block font-bold text-gray-900 text-sm mb-1">AI Solutions</span>
            <span className="text-xs text-gray-500">LLM, Vision &amp; Automation</span>
          </div>
          <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm text-center">
            <span className="block font-bold text-gray-900 text-sm mb-1">Enterprise &amp; SAP</span>
            <span className="text-xs text-gray-500">SAP ABAP &amp; ERP Platforms</span>
          </div>
          <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm text-center">
            <span className="block font-bold text-gray-900 text-sm mb-1">Growth &amp; SEO</span>
            <span className="text-xs text-gray-500">Digital Marketing &amp; Social</span>
          </div>
          <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm text-center col-span-2 sm:col-span-1">
            <span className="block font-bold text-gray-900 text-sm mb-1">AMC &amp; Security</span>
            <span className="text-xs text-gray-500">VAPT Audits &amp; Maintenance</span>
          </div>
        </div>

        <div className="space-y-16">
          {services.map((service, idx) => {
            const IconComponent = IconMap[service.Icon] || Server;
            const features = service['Features List'] ? service['Features List'].split(',') : [];
            const isEven = idx % 2 === 0;
            const details = SERVICE_DETAILS_MAP[service['Service Name']] || {
              problemSolved: 'Overcoming operational bottlenecks, legacy limitations, and technical hurdles with scalable, modern architectures.',
              whatWeProvide: service['Detailed Description'] || service['Short Description'],
            };

            return (
              <motion.article
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 items-center bg-white rounded-[2.5rem] p-8 lg:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100`}
              >
                {/* Visual / Banner Side */}
                <div className="w-full lg:w-1/2">
                  <div className="aspect-[4/3] rounded-3xl bg-gray-50 overflow-hidden relative border border-gray-100 shadow-inner flex items-center justify-center group">
                    {service['Banner Image'] ? (
                      <img
                        src={service['Banner Image']}
                        alt={`TechInnoSphere ${service['Service Name']} - ${service.Category || 'Software Development'}`}
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center relative overflow-hidden">
                        <IconComponent className="w-32 h-32 text-gray-200 group-hover:scale-110 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-brand-primary/5 mix-blend-overlay"></div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Content Side */}
                <div className="w-full lg:w-1/2 space-y-6">
                  <div>
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand-lightest text-brand-primary mb-6">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold uppercase tracking-wider">{service.Category}</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-darker tracking-tight mb-4">{service['Service Name']}</h2>
                    <p className="text-lg text-gray-600 leading-relaxed font-normal">
                      {service['Detailed Description'] || service['Short Description']}
                    </p>
                  </div>

                  {/* Business Problem Solved */}
                  {details.problemSolved && (
                    <div className="bg-[#FAFAFA] rounded-2xl p-5 border border-gray-100">
                      <div className="text-xs font-bold uppercase tracking-wider text-brand-primary mb-1">
                        Business Problem Solved
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed font-medium">
                        {details.problemSolved}
                      </p>
                    </div>
                  )}

                  {/* What TechInnoSphere Provides */}
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                      What TechInnoSphere Provides
                    </div>
                    {features.length > 0 ? (
                      <div className="space-y-2.5">
                        {features.map((feature, i) => (
                          <div key={i} className="flex items-start gap-2.5">
                            <CheckCircle2 className="w-5 h-5 text-brand-primary flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700 font-medium text-sm sm:text-base">{feature.trim()}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {details.whatWeProvide}
                      </p>
                    )}
                  </div>

                  <div className="pt-4 flex flex-wrap gap-4 items-center">
                    <Link
                      to={service['CTA Link'] || "/contact"}
                      className="inline-flex items-center justify-center px-8 py-4 bg-[#111827] text-white rounded-xl font-bold hover:bg-brand-primary transition-all shadow-md hover:shadow-xl group"
                    >
                      {service['CTA Text'] || "Discuss This Service"}
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                      to="/work"
                      className="text-sm font-semibold text-gray-600 hover:text-brand-primary transition-colors"
                    >
                      View related projects →
                    </Link>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* Bottom Consultation Box */}
        <div className="mt-24 p-10 md:p-14 bg-white rounded-3xl border border-gray-100 shadow-sm text-center max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-[#111827] mb-4">
            Need a Custom Technology Solution?
          </h2>
          <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
            From tailored enterprise workflows to bespoke AI models, TechInnoSphere architects systems built to your precise functional specifications.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/contact"
              className="px-8 py-3.5 bg-brand-primary text-white font-bold rounded-xl hover:bg-brand-dark transition-all inline-flex items-center justify-center gap-2"
            >
              Contact TechInnoSphere <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/work"
              className="px-8 py-3.5 bg-gray-50 border border-gray-200 text-gray-800 font-bold rounded-xl hover:bg-gray-100 transition-all inline-flex items-center justify-center"
            >
              Explore Our Portfolio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
