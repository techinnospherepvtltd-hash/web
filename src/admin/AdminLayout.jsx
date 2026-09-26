import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Login from './Login';
import Dashboard from './Dashboard';
import { logoutAdmin } from '../utils/supabaseUtils';
import SEO from '../components/SEO';

const AdminLayout = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = localStorage.getItem('techinnosphere_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const handleLogin = (status) => {
    setIsAuthenticated(status);
    if (status) {
      navigate('/admin/dashboard');
    }
  };

  const handleLogout = async () => {
    await logoutAdmin();
    setIsAuthenticated(false);
    navigate('/admin');
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <>
      <SEO title="Admin Portal | TechInnoSphere" noIndex={true} />
      <Routes>
        <Route path="/" element={<Dashboard onLogout={handleLogout} />} />
        <Route path="/dashboard" element={<Dashboard onLogout={handleLogout} />} />
      </Routes>
    </>
  );
};

export default AdminLayout;
