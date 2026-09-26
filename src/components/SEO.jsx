import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SEO_CONFIG } from '../config/seo';

/**
 * Reusable SEO Component
 * Manages document head elements dynamically for React/Vite SPA.
 * Works seamlessly with React 19 without peer-dependency conflicts.
 */
const SEO = ({
  title,
  description,
  canonical,
  ogTitle,
  ogDescription,
  ogImage,
  ogType = 'website',
  twitterCard = 'summary_large_image',
  noIndex = false,
  structuredData,
}) => {
  const location = useLocation();

  useEffect(() => {
    // 1. Title
    const finalTitle = title || SEO_CONFIG.defaultTitle;
    document.title = finalTitle;

    // 2. Helper to set or create meta tag by name or property
    const setMetaTag = (attributeName, attributeValue, content) => {
      if (!content) return;
      let element = document.querySelector(`meta[${attributeName}="${attributeValue}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attributeName, attributeValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // 3. Meta Description
    const finalDescription = description || SEO_CONFIG.defaultDescription;
    setMetaTag('name', 'description', finalDescription);

    // 4. Canonical URL
    const finalCanonical = canonical || `${SEO_CONFIG.siteUrl}${location.pathname}`;
    let canonicalLink = document.querySelector("link[rel='canonical']");
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', finalCanonical);

    // 5. Robots Tag (Indexing Controls)
    const robotsContent = noIndex
      ? 'noindex, nofollow'
      : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
    setMetaTag('name', 'robots', robotsContent);
    setMetaTag('name', 'googlebot', robotsContent);

    // 6. Open Graph Tags
    const finalOgTitle = ogTitle || finalTitle;
    const finalOgDescription = ogDescription || finalDescription;
    const finalOgImage = ogImage || SEO_CONFIG.defaultImage;

    setMetaTag('property', 'og:site_name', SEO_CONFIG.siteName);
    setMetaTag('property', 'og:locale', SEO_CONFIG.locale);
    setMetaTag('property', 'og:type', ogType);
    setMetaTag('property', 'og:url', finalCanonical);
    setMetaTag('property', 'og:title', finalOgTitle);
    setMetaTag('property', 'og:description', finalOgDescription);
    setMetaTag('property', 'og:image', finalOgImage);

    // 7. Twitter / X Cards
    setMetaTag('name', 'twitter:card', twitterCard);
    setMetaTag('name', 'twitter:title', finalOgTitle);
    setMetaTag('name', 'twitter:description', finalOgDescription);
    setMetaTag('name', 'twitter:image', finalOgImage);

    // 8. JSON-LD Structured Data
    const schemaScriptId = 'dynamic-page-schema';
    let schemaScript = document.getElementById(schemaScriptId);

    if (structuredData) {
      if (!schemaScript) {
        schemaScript = document.createElement('script');
        schemaScript.id = schemaScriptId;
        schemaScript.type = 'application/ld+json';
        document.head.appendChild(schemaScript);
      }
      schemaScript.textContent = JSON.stringify(structuredData);
    } else if (schemaScript) {
      schemaScript.remove();
    }

    // Scroll restoration for better UX and crawl rendering
    window.scrollTo(0, 0);

    return () => {
      // Clean up dynamic schema if needed
      const script = document.getElementById(schemaScriptId);
      if (script) {
        script.remove();
      }
    };
  }, [
    title,
    description,
    canonical,
    ogTitle,
    ogDescription,
    ogImage,
    ogType,
    twitterCard,
    noIndex,
    structuredData,
    location.pathname,
  ]);

  return null;
};

export default SEO;
