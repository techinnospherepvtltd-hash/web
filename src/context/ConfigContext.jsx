import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchConfig } from '../utils/configUtils';

const ConfigContext = createContext(null);

export const ConfigProvider = ({ children }) => {
  const [config, setConfig] = useState(null);

  useEffect(() => {
    const loadConfig = async () => {
      const data = await fetchConfig();
      setConfig(data);
      
      // Handle dynamic document title and favicon
      if (data.CompanyName) {
        document.title = data.CompanyName;
      }
      if (data.Favicon) {
        let link = document.querySelector("link[rel~='icon']");
        if (!link) {
          link = document.createElement('link');
          link.rel = 'icon';
          document.getElementsByTagName('head')[0].appendChild(link);
        }
        link.href = data.Favicon;
      }
    };
    loadConfig();
  }, []);

  if (!config) {
    return <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center font-bold text-gray-500">Loading Configuration...</div>;
  }

  return (
    <ConfigContext.Provider value={config}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => useContext(ConfigContext);
