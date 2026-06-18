import { motion } from 'framer-motion';
import { Target, Lightbulb, Users, Award } from 'lucide-react';

const About = () => {
  return (
    <div className="bg-brand-lightest min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Story Section */}
        <div className="max-w-4xl mx-auto text-center mb-20">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-bold text-brand-darker mb-6"
          >
            About TechInnoSphere
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-brand-light leading-relaxed"
          >
            From Vision To Software We Build It All. Headquartered in Mumbai, India, we are a premium technology firm engineering scalable digital systems for global businesses.
          </motion.p>
        </div>

        {/* Vision & Mission */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-20">
          <div className="bg-white p-12 rounded-3xl shadow-sm border border-brand-lightest/50">
            <Target className="w-12 h-12 text-brand-primary mb-6" />
            <h2 className="text-3xl font-bold text-brand-darker mb-4">Our Vision</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              To be the global leader in providing innovative and scalable digital solutions that empower businesses to thrive in a technology-driven world.
            </p>
          </div>
          <div className="bg-white p-12 rounded-3xl shadow-sm border border-brand-lightest/50">
            <Lightbulb className="w-12 h-12 text-brand-primary mb-6" />
            <h2 className="text-3xl font-bold text-brand-darker mb-4">Our Mission</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              We bridge the gap between vision and reality by building enterprise-grade software, advanced AI systems, and secure web platforms with uncompromising quality.
            </p>
          </div>
        </div>

        {/* Leadership */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-center text-brand-darker mb-12">Leadership</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl p-8 text-center shadow-sm hover:shadow-xl transition-shadow border border-brand-lightest/50">
              <div className="w-32 h-32 bg-brand-lightest rounded-full mx-auto mb-6 flex items-center justify-center">
                <Users className="w-12 h-12 text-brand-primary" />
              </div>
              <h3 className="text-2xl font-bold text-brand-darker">Omar Khan</h3>
              <p className="text-brand-primary font-medium mb-4">Founder & CEO</p>
              <p className="text-gray-600">Driving global strategy and technological innovation.</p>
            </div>
            <div className="bg-white rounded-3xl p-8 text-center shadow-sm hover:shadow-xl transition-shadow border border-brand-lightest/50">
              <div className="w-32 h-32 bg-brand-lightest rounded-full mx-auto mb-6 flex items-center justify-center">
                <Users className="w-12 h-12 text-brand-primary" />
              </div>
              <h3 className="text-2xl font-bold text-brand-darker">Fehed Shaikh</h3>
              <p className="text-brand-primary font-medium mb-4">Co-Founder & CTO</p>
              <p className="text-gray-600">Architecting scalable and secure enterprise solutions.</p>
            </div>
          </div>
        </div>

        {/* Global Growth Journey */}
        <div className="bg-brand-darker text-white rounded-3xl p-12 relative overflow-hidden circuit-bg">
          <div className="relative z-10">
            <h2 className="text-4xl font-bold mb-12 text-center">Our Global Growth Journey</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div>
                <h3 className="text-5xl font-bold text-brand-lighter mb-2">2021</h3>
                <p className="text-lg">Founded in Mumbai</p>
              </div>
              <div>
                <h3 className="text-5xl font-bold text-brand-lighter mb-2">2022</h3>
                <p className="text-lg">Expanded to Middle East</p>
              </div>
              <div>
                <h3 className="text-5xl font-bold text-brand-lighter mb-2">2023</h3>
                <p className="text-lg">North American Operations</p>
              </div>
              <div>
                <h3 className="text-5xl font-bold text-brand-lighter mb-2">2024</h3>
                <p className="text-lg">AI & Enterprise Suite Launch</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
