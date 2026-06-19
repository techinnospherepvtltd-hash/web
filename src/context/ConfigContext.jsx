import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchConfig } from '../utils/configUtils';

const ConfigContext = createContext(null);

const resolveAssetPath = (path) => {
  if (!path) return '';
  if (path.startsWith('http') || path.startsWith('data:')) {
    return path;
  }
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  const baseUrl = import.meta.env.BASE_URL || '/';
  const prefix = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  return `${prefix}${cleanPath}`;
};

export const ConfigProvider = ({ children }) => {
  const [config, setConfig] = useState(null);

  useEffect(() => {
    const loadConfig = async () => {
      const data = await fetchConfig();
      
      // Set defaults if empty
      const resolvedLogo = data.CompanyLogo || 'logo.png';
      const resolvedFavicon = data.Favicon || 'logo.png';

      const resolvedData = {
        ...data,
        CompanyLogo: resolveAssetPath(resolvedLogo),
        Favicon: resolveAssetPath(resolvedFavicon)
      };

      setConfig(resolvedData);
      
      // Handle dynamic document title and favicon
      if (resolvedData.CompanyName) {
        document.title = resolvedData.CompanyName;
      }
      if (resolvedData.Favicon) {
        let link = document.querySelector("link[rel~='icon']");
        if (!link) {
          link = document.createElement('link');
          link.rel = 'icon';
          document.getElementsByTagName('head')[0].appendChild(link);
        }
        link.href = resolvedData.Favicon;
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
