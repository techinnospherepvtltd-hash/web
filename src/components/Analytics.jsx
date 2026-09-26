import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Google Analytics 4 Integration Component
 * Activates only when VITE_GA_MEASUREMENT_ID is configured in environment.
 * Gracefully silent when no measurement ID is present.
 */
const Analytics = () => {
  const location = useLocation();
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;

  useEffect(() => {
    if (!measurementId || typeof window === 'undefined') return;

    // Load gtag script if not already added
    const scriptId = 'google-analytics-gtag';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
      document.head.appendChild(script);

      window.dataLayer = window.dataLayer || [];
      function gtag() {
        window.dataLayer.push(arguments);
      }
      window.gtag = gtag;
      gtag('js', new Date());
      gtag('config', measurementId, {
        page_path: location.pathname + location.search,
        send_page_view: true,
      });
    } else if (window.gtag) {
      window.gtag('config', measurementId, {
        page_path: location.pathname + location.search,
        send_page_view: true,
      });
    }
  }, [location, measurementId]);

  return null;
};

export default Analytics;
