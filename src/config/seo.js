/**
 * Centralized SEO Configuration for TechInnoSphere Software Solutions Pvt. Ltd.
 * Website: https://techinnosphere.com
 */

export const SEO_CONFIG = {
  siteName: 'TechInnoSphere',
  legalName: 'TechInnoSphere Software Solutions Pvt. Ltd.',
  siteUrl: 'https://techinnosphere.com',
  defaultTitle: 'TechInnoSphere | Software Development & AI Solutions Company',
  titleTemplate: '%s | TechInnoSphere',
  defaultDescription:
    'TechInnoSphere Software Solutions Pvt. Ltd. is a premier software development and technology company based in Mumbai, India, delivering web and mobile applications, custom software, AI solutions, SAP ABAP, business automation, and digital services globally.',
  defaultImage: 'https://techinnosphere.com/logo.png',
  locale: 'en_US',
  themeColor: '#143481',
  contact: {
    phone: '+917710031550',
    email: 'careers@techinnosphere.com',
    whatsapp: '+917710031550',
    address: {
      streetAddress: 'Mumbai',
      addressLocality: 'Mumbai',
      addressRegion: 'Maharashtra',
      postalCode: '400001',
      addressCountry: 'IN',
    },
  },
  socialLinks: [
    'https://www.instagram.com/techinnosphere/',
    'https://www.facebook.com/profile.php?id=61584937588072',
  ],
  areaServed: [
    'India',
    'United Arab Emirates',
    'Canada',
    'Austria',
    'United States',
    'Worldwide',
  ],
};

/**
 * Standard Organization Schema (JSON-LD)
 */
export const getOrganizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${SEO_CONFIG.siteUrl}/#organization`,
  name: SEO_CONFIG.legalName,
  alternateName: SEO_CONFIG.siteName,
  url: SEO_CONFIG.siteUrl,
  logo: {
    '@type': 'ImageObject',
    url: `${SEO_CONFIG.siteUrl}/logo.png`,
    caption: 'TechInnoSphere Software Solutions Pvt. Ltd. Logo',
  },
  description: SEO_CONFIG.defaultDescription,
  sameAs: SEO_CONFIG.socialLinks,
  contactPoint: [
    {
      '@type': 'ContactPoint',
      telephone: SEO_CONFIG.contact.phone,
      contactType: 'customer support',
      areaServed: 'Worldwide',
      availableLanguage: ['English', 'Hindi'],
    },
  ],
  address: {
    '@type': 'PostalAddress',
    addressLocality: SEO_CONFIG.contact.address.addressLocality,
    addressRegion: SEO_CONFIG.contact.address.addressRegion,
    addressCountry: SEO_CONFIG.contact.address.addressCountry,
  },
});

/**
 * LocalBusiness / ProfessionalService Schema (JSON-LD)
 */
export const getLocalBusinessSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': `${SEO_CONFIG.siteUrl}/#localbusiness`,
  name: SEO_CONFIG.legalName,
  image: `${SEO_CONFIG.siteUrl}/logo.png`,
  url: SEO_CONFIG.siteUrl,
  telephone: SEO_CONFIG.contact.phone,
  priceRange: '$$',
  address: {
    '@type': 'PostalAddress',
    addressLocality: SEO_CONFIG.contact.address.addressLocality,
    addressRegion: SEO_CONFIG.contact.address.addressRegion,
    addressCountry: SEO_CONFIG.contact.address.addressCountry,
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: '19.0760',
    longitude: '72.8777',
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '18:00',
    },
  ],
  areaServed: SEO_CONFIG.areaServed.map((area) => ({
    '@type': 'Place',
    name: area,
  })),
});

/**
 * WebSite Schema (JSON-LD)
 */
export const getWebSiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SEO_CONFIG.siteUrl}/#website`,
  name: SEO_CONFIG.siteName,
  url: SEO_CONFIG.siteUrl,
  publisher: {
    '@id': `${SEO_CONFIG.siteUrl}/#organization`,
  },
});

/**
 * BreadcrumbList Schema (JSON-LD)
 */
export const getBreadcrumbSchema = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url.startsWith('http')
      ? item.url
      : `${SEO_CONFIG.siteUrl}${item.url}`,
  })),
});
