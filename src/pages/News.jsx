import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fetchExcelData } from '../utils/excelUtils';
import { Calendar, ArrowRight } from 'lucide-react';

const News = () => {
  const [newsList, setNewsList] = useState([]);

  useEffect(() => {
    const loadNews = async () => {
      const data = await fetchExcelData('news.xlsx');
      setNewsList(data);
    };
    loadNews();
  }, []);

  return (
    <div className="bg-brand-lightest min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="max-w-3xl mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-bold text-brand-darker mb-6"
          >
            News & Insights
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-brand-light leading-relaxed"
          >
            Latest updates, insights, and technological advancements from TechInnoSphere.
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
                  <img src={news.Image} alt={news.Title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/50 bg-gradient-to-br from-brand-primary to-brand-darker font-bold">
                    News Article
                  </div>
                )}
              </div>
              <div className="p-8 flex-grow flex flex-col">
                <div className="flex items-center gap-2 text-brand-light text-sm font-medium mb-4">
                  <Calendar className="w-4 h-4" /> {news['Publish Date']}
                </div>
                <h2 className="text-2xl font-bold text-brand-darker mb-3">{news.Title}</h2>
                <p className="text-gray-600 mb-6 flex-grow">{news.Description}</p>
                <button className="inline-flex items-center gap-2 text-brand-primary font-bold hover:text-brand-dark transition-colors self-start">
                  Read More <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default News;
