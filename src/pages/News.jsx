import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getNews } from '../utils/supabaseUtils';
import { Calendar, ArrowRight, BookOpen } from 'lucide-react';
import SEO from '../components/SEO';
import { getBreadcrumbSchema } from '../config/seo';

const News = () => {
  const [newsList, setNewsList] = useState([]);

  useEffect(() => {
    const loadNews = async () => {
      const data = await getNews();
      const isEnabled = (val) => {
        if (val === undefined || val === null) return true;
        const str = String(val).trim().toLowerCase();
        return str !== 'false' && str !== 'no' && str !== 'n' && str !== '0';
      };
      setNewsList(data.filter(n => isEnabled(n.Enabled)));
    };
    loadNews();
  }, []);

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      getBreadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'News & Insights', url: '/news' }
      ]),
      ...newsList.map(n => ({
        '@type': 'Article',
        headline: n.Title,
        description: n.Description,
        datePublished: n['Publish Date'] || '2024-01-01',
        author: {
          '@type': 'Organization',
          name: 'TechInnoSphere Software Solutions Pvt. Ltd.',
          url: 'https://techinnosphere.com'
        },
        publisher: {
          '@type': 'Organization',
          name: 'TechInnoSphere',
          logo: {
            '@type': 'ImageObject',
            url: 'https://techinnosphere.com/logo.png'
          }
        },
        ...(n.Image ? { image: n.Image } : {})
      }))
    ]
  };

  return (
    <div className="bg-brand-lightest min-h-screen pt-32 pb-24">
      <SEO
        title="News, Insights & Tech Updates | TechInnoSphere"
        description="Stay updated with the latest technology trends, artificial intelligence innovations, software development insights, and company announcements from TechInnoSphere."
        canonical="https://techinnosphere.com/news"
        structuredData={structuredData}
      />

      <div className="container mx-auto px-6 lg:px-12">
        <div className="max-w-3xl mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-brand-darker mb-6 tracking-tight"
          >
            Technology Insights &amp; Company News
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg sm:text-xl text-gray-600 leading-relaxed font-normal"
          >
            Latest announcements, engineering insights, AI developments, and software updates from the TechInnoSphere team in Mumbai, India.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {newsList.map((news, idx) => (
            <motion.article
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-brand-lightest/50 flex flex-col"
            >
              <div className="h-48 bg-brand-lighter relative">
                {news.Image ? (
                  <img
                    src={news.Image}
                    alt={`TechInnoSphere article: ${news.Title}`}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/70 bg-gradient-to-br from-brand-primary to-brand-darker font-bold gap-2">
                    <BookOpen className="w-5 h-5" /> TechInnoSphere Insights
                  </div>
                )}
              </div>
              <div className="p-8 flex-grow flex flex-col">
                <div className="flex items-center gap-2 text-brand-light text-sm font-medium mb-4">
                  <Calendar className="w-4 h-4" /> {news['Publish Date']}
                </div>
                <h2 className="text-2xl font-bold text-brand-darker mb-3">{news.Title}</h2>
                <p className="text-gray-600 mb-6 flex-grow leading-relaxed text-sm">{news.Description}</p>
                <div className="pt-2">
                  <span className="inline-flex items-center gap-1.5 text-brand-primary font-bold text-sm">
                    Published by TechInnoSphere
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Bottom Consultation CTA */}
        <div className="mt-20 p-10 bg-white rounded-3xl border border-gray-100 shadow-sm text-center max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-[#111827] mb-3">
            Want to Discuss Our Technology Capabilities?
          </h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Reach out to TechInnoSphere to learn how we apply software engineering, AI, and cloud automation to real-world business challenges.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/contact"
              className="px-8 py-3.5 bg-brand-primary text-white font-bold rounded-xl hover:bg-brand-dark transition-all inline-flex items-center justify-center gap-2"
            >
              Contact TechInnoSphere <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/services"
              className="px-8 py-3.5 bg-gray-50 border border-gray-200 text-gray-800 font-bold rounded-xl hover:bg-gray-100 transition-all inline-flex items-center justify-center"
            >
              Explore our software development services
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default News;
