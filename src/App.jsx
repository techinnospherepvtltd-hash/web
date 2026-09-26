import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import { ConfigProvider } from './context/ConfigContext';

// Pages
import Home from './pages/Home';
import Services from './pages/Services';
import Work from './pages/Work';
import About from './pages/About';
import Contact from './pages/Contact';
import Careers from './pages/Careers';
import News from './pages/News';
import Testimonials from './pages/Testimonials';
import NotFound from './pages/NotFound';
import Analytics from './components/Analytics';

// Admin
import AdminLayout from './admin/AdminLayout';

function App() {
  return (
    <ConfigProvider>
      <Router basename={import.meta.env.BASE_URL}>
        <Analytics />
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<Services />} />
              <Route path="/work" element={<Work />} />
              <Route path="/testimonials" element={<Testimonials />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/news" element={<News />} />
              
              {/* Admin Routes */}
              <Route path="/admin/*" element={<AdminLayout />} />

              {/* Catch-all 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
          <FloatingWhatsApp />
        </div>
      </Router>
    </ConfigProvider>
  );
}

export default App;
