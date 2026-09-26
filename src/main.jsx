import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Filter out third-party browser extension noise (e.g. McAfee WebAdvisor feature_collector.js)
if (typeof window !== 'undefined') {
  const originalWarn = console.warn;
  console.warn = (...args) => {
    const msg = args.map(a => (typeof a === 'string' ? a : (a?.stack || a?.message || ''))).join(' ');
    if (msg.includes('feature_collector') || msg.includes('Initialize should be called only once')) {
      return;
    }
    originalWarn.apply(console, args);
  };
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
