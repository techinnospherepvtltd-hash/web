import { motion } from 'framer-motion';
import { Target, Lightbulb, Users, Shield, Cpu, Code2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { getOrganizationSchema, getBreadcrumbSchema } from '../config/seo';

const About = () => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      getOrganizationSchema(),
      getBreadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'About TechInnoSphere', url: '/about' }
      ])
    ]
  };

  return (
    <div className="bg-brand-lightest min-h-screen pt-32 pb-24">
      <SEO
        title="About TechInnoSphere | Software & Technology Solutions Company"
        description="Learn about TechInnoSphere Software Solutions Pvt. Ltd., a Mumbai-based technology company delivering software development, AI, automation, and digital solutions for businesses."
        canonical="https://techinnosphere.com/about"
        structuredData={structuredData}
      />

      <div className="container mx-auto px-6 lg:px-12">
        {/* Story Section */}
        <div className="max-w-4xl mx-auto text-center mb-20">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-brand-darker mb-6 tracking-tight"
          >
            About TechInnoSphere Software Solutions
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg sm:text-xl text-gray-600 leading-relaxed font-normal"
          >
            Headquartered in Mumbai, Maharashtra, India, TechInnoSphere Software Solutions Pvt. Ltd. is a full-service technology engineering firm. We design, build, and support enterprise-grade web applications, mobile platforms, custom software systems, artificial intelligence workflows, and SAP ABAP solutions for clients across India and international markets.
          </motion.p>
        </div>

        {/* Vision & Mission */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-20">
          <div className="bg-white p-10 md:p-12 rounded-3xl shadow-sm border border-brand-lightest/50">
            <Target className="w-12 h-12 text-brand-primary mb-6" />
            <h2 className="text-3xl font-bold text-brand-darker mb-4">Our Vision</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              To be the trusted technology engineering partner for organizations worldwide, enabling sustainable business growth through reliable software architecture, intelligent automation, and measurable digital outcomes.
            </p>
          </div>
          <div className="bg-white p-10 md:p-12 rounded-3xl shadow-sm border border-brand-lightest/50">
            <Lightbulb className="w-12 h-12 text-brand-primary mb-6" />
            <h2 className="text-3xl font-bold text-brand-darker mb-4">Our Mission</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              We bridge the gap between business vision and production-ready software by delivering secure, scalable, and high-performance digital platforms with transparent communication and uncompromising engineering quality.
            </p>
          </div>
        </div>

        {/* Core Principles */}
        <div className="mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-brand-darker mb-4">
            How We Deliver Value
          </h2>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12 text-lg">
            Our engineering methodology combines rigorous technical standards with business-focused problem solving.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <Code2 className="w-10 h-10 text-brand-primary mb-4" />
              <h3 className="text-xl font-bold text-brand-darker mb-2">Modern Engineering</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                We develop full-stack applications using proven technologies including React, Node.js, Next.js, Python, and cloud infrastructure designed for high concurrency and uptime.
              </p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <Cpu className="w-10 h-10 text-brand-primary mb-4" />
              <h3 className="text-xl font-bold text-brand-darker mb-2">AI & Automation</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                From intelligent document processing and LLM integrations to computer vision and automated pipelines, we embed practical artificial intelligence into everyday business operations.
              </p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <Shield className="w-10 h-10 text-brand-primary mb-4" />
              <h3 className="text-xl font-bold text-brand-darker mb-2">Security & Quality</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                Every software solution undergoes rigorous vulnerability testing, code reviews, and OWASP compliance assessments to protect your critical business assets and user data.
              </p>
            </div>
          </div>
        </div>

        {/* Leadership */}
        <div className="mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-brand-darker mb-4">
            Leadership Team
          </h2>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12 text-lg">
            Experienced technology leaders guiding strategic vision, solution architecture, and engineering execution.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl p-8 text-center shadow-sm hover:shadow-xl transition-shadow border border-brand-lightest/50">
              <div className="w-32 h-32 bg-brand-lightest rounded-full mx-auto mb-6 flex items-center justify-center">
                <Users className="w-12 h-12 text-brand-primary" />
              </div>
              <h3 className="text-2xl font-bold text-brand-darker">Omar Khan</h3>
              <p className="text-brand-primary font-medium mb-4">Founder &amp; CEO</p>
              <p className="text-gray-600 leading-relaxed">
                Driving global strategic direction, client partnerships, and continuous technology innovation across international markets.
              </p>
            </div>
            <div className="bg-white rounded-3xl p-8 text-center shadow-sm hover:shadow-xl transition-shadow border border-brand-lightest/50">
              <div className="w-32 h-32 bg-brand-lightest rounded-full mx-auto mb-6 flex items-center justify-center">
                <Users className="w-12 h-12 text-brand-primary" />
              </div>
              <h3 className="text-2xl font-bold text-brand-darker">Fehed Shaikh</h3>
              <p className="text-brand-primary font-medium mb-4">Co-Founder &amp; CTO</p>
              <p className="text-gray-600 leading-relaxed">
                Architecting scalable cloud architectures, AI systems, and enterprise software with rigorous security and performance standards.
              </p>
            </div>
          </div>
        </div>

        {/* Global Growth Journey */}
        <div className="bg-brand-darker text-white rounded-3xl p-10 md:p-14 relative overflow-hidden circuit-bg mb-20">
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
              Our Journey &amp; Milestones
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <h3 className="text-4xl md:text-5xl font-bold text-brand-lighter mb-2">2021</h3>
                <p className="text-base md:text-lg">Founded in Mumbai, India</p>
              </div>
              <div>
                <h3 className="text-4xl md:text-5xl font-bold text-brand-lighter mb-2">2022</h3>
                <p className="text-base md:text-lg">Expanded to Middle East</p>
              </div>
              <div>
                <h3 className="text-4xl md:text-5xl font-bold text-brand-lighter mb-2">2023</h3>
                <p className="text-base md:text-lg">North American Client Projects</p>
              </div>
              <div>
                <h3 className="text-4xl md:text-5xl font-bold text-brand-lighter mb-2">2024</h3>
                <p className="text-base md:text-lg">AI &amp; Enterprise Suite Deployment</p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center max-w-3xl mx-auto bg-white p-10 rounded-3xl border border-gray-100 shadow-sm">
          <h2 className="text-2xl md:text-3xl font-bold text-brand-darker mb-4">
            Partner With TechInnoSphere
          </h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Whether you need a custom web application, an enterprise system, or an intelligent AI integration, our Mumbai team is ready to assist.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/services"
              className="w-full sm:w-auto px-8 py-3.5 bg-brand-primary text-white font-bold rounded-xl hover:bg-brand-dark transition-all inline-flex items-center justify-center gap-2"
            >
              Explore our software development services <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/contact"
              className="w-full sm:w-auto px-8 py-3.5 bg-gray-50 border border-gray-200 text-gray-800 font-bold rounded-xl hover:bg-gray-100 transition-all inline-flex items-center justify-center gap-2"
            >
              Contact TechInnoSphere
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
