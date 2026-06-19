import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, User } from 'lucide-react';
import { useConfig } from '../context/ConfigContext';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const config = useConfig();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin123') {
      localStorage.setItem('techinnosphere_auth', 'true');
      onLogin(true);
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-[#111827]/90 z-0"></div>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full space-y-8 bg-white p-10 rounded-[2rem] shadow-2xl relative z-10 border border-gray-100"
      >
        <div>
          <div className="flex justify-center mb-6">
            {config.CompanyLogo ? (
              <img src={config.CompanyLogo} alt={config.CompanyName} className="h-28 object-contain" />
            ) : (
              <span className="text-3xl font-black text-[#111827] tracking-tighter">
                {config.CompanyName || 'TechInnoSphere'}
              </span>
            )}
          </div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-[#111827]">
            Admin Portal
          </h2>
          <p className="mt-2 text-center text-sm text-gray-500 font-medium">
            Sign in to manage website content.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="sr-only">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  required
                  className="appearance-none rounded-xl relative block w-full px-3 py-4 pl-12 bg-[#FAFAFA] border border-gray-200 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 sm:text-sm font-medium transition-all"
                  placeholder="Username (admin)"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="sr-only">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  required
                  className="appearance-none rounded-xl relative block w-full px-3 py-4 pl-12 bg-[#FAFAFA] border border-gray-200 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 sm:text-sm font-medium transition-all"
                  placeholder="Password (admin123)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm text-center font-bold">{error}</p>}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-[#111827] hover:bg-brand-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-all shadow-[0_4px_14px_rgba(0,0,0,0.1)] hover:-translate-y-1"
            >
              Sign in
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
