import fs from 'fs';
import path from 'path';

const distDir = path.resolve('dist');

if (!fs.existsSync(distDir)) {
  console.error('Error: dist directory does not exist.');
  process.exit(1);
}

// 1. Ensure 404.html fallback exists
const indexHtmlPath = path.join(distDir, 'index.html');
const indexHtmlContent = fs.readFileSync(indexHtmlPath, 'utf8');
fs.writeFileSync(path.join(distDir, '404.html'), indexHtmlContent);
console.log('✓ Created dist/404.html');

// 2. Ensure .nojekyll exists
fs.writeFileSync(path.join(distDir, '.nojekyll'), '# Disable Jekyll\n');
console.log('✓ Created dist/.nojekyll');

// 3. Define public routes with their specific metadata
const routes = [
  {
    path: 'about',
    title: 'About TechInnoSphere | Software & Technology Solutions Company',
    description: 'Learn about TechInnoSphere Software Solutions Pvt. Ltd., a Mumbai-based technology company delivering software development, AI, automation and digital solutions for businesses.',
    canonical: 'https://techinnosphere.com/about'
  },
  {
    path: 'services',
    title: 'Software Development & AI Services | TechInnoSphere',
    description: 'Explore TechInnoSphere services including web development, mobile apps, custom software, AI development, SAP ABAP, e-commerce, automation, SEO and digital solutions.',
    canonical: 'https://techinnosphere.com/services'
  },
  {
    path: 'work',
    title: 'Our Work & Projects | TechInnoSphere',
    description: 'Explore software, web, mobile, AI and digital projects delivered by TechInnoSphere for businesses across different industries and markets.',
    canonical: 'https://techinnosphere.com/work'
  },
  {
    path: 'testimonials',
    title: 'Client Testimonials & Reviews | TechInnoSphere',
    description: 'Read reviews and feedback from global clients who partnered with TechInnoSphere for custom software development, AI solutions, web platforms, and mobile apps.',
    canonical: 'https://techinnosphere.com/testimonials'
  },
  {
    path: 'news',
    title: 'News, Insights & Tech Updates | TechInnoSphere',
    description: 'Stay updated with the latest technology trends, artificial intelligence innovations, software development insights, and company announcements from TechInnoSphere.',
    canonical: 'https://techinnosphere.com/news'
  },
  {
    path: 'careers',
    title: 'Careers at TechInnoSphere | Software & Technology Jobs',
    description: 'Explore software engineering, AI development, and technology career opportunities at TechInnoSphere in Mumbai and remote. Join our engineering team.',
    canonical: 'https://techinnosphere.com/careers'
  },
  {
    path: 'contact',
    title: 'Contact TechInnoSphere | Software Development Company in Mumbai',
    description: 'Contact TechInnoSphere Software Solutions Pvt. Ltd. in Mumbai, India for software development, AI solutions, web & mobile applications, and technology consulting.',
    canonical: 'https://techinnosphere.com/contact'
  },
  {
    path: 'admin',
    title: 'Admin Portal | TechInnoSphere',
    description: 'TechInnoSphere Administrator Portal',
    canonical: 'https://techinnosphere.com/admin'
  },
  {
    path: 'admin/dashboard',
    title: 'Admin Dashboard | TechInnoSphere',
    description: 'TechInnoSphere Admin Dashboard',
    canonical: 'https://techinnosphere.com/admin/dashboard'
  },
  {
    path: 'dashboard',
    title: 'Dashboard | TechInnoSphere',
    description: 'TechInnoSphere Dashboard',
    canonical: 'https://techinnosphere.com/dashboard'
  }
];

// Helper to replace or update head meta tags in static HTML
function customizeHtml(baseHtml, route) {
  let html = baseHtml;

  // Title
  html = html.replace(/<title>.*?<\/title>/i, `<title>${route.title}</title>`);

  // Meta description
  html = html.replace(
    /<meta\s+name="description"\s+content=".*?"\s*\/?>/i,
    `<meta name="description" content="${route.description}" />`
  );

  // Canonical
  html = html.replace(
    /<link\s+rel="canonical"\s+href=".*?"\s*\/?>/i,
    `<link rel="canonical" href="${route.canonical}" />`
  );

  // Open Graph
  html = html.replace(
    /<meta\s+property="og:title"\s+content=".*?"\s*\/?>/i,
    `<meta property="og:title" content="${route.title}" />`
  );
  html = html.replace(
    /<meta\s+property="og:description"\s+content=".*?"\s*\/?>/i,
    `<meta property="og:description" content="${route.description}" />`
  );
  html = html.replace(
    /<meta\s+property="og:url"\s+content=".*?"\s*\/?>/i,
    `<meta property="og:url" content="${route.canonical}" />`
  );

  // Twitter
  html = html.replace(
    /<meta\s+name="twitter:title"\s+content=".*?"\s*\/?>/i,
    `<meta name="twitter:title" content="${route.title}" />`
  );
  html = html.replace(
    /<meta\s+name="twitter:description"\s+content=".*?"\s*\/?>/i,
    `<meta name="twitter:description" content="${route.description}" />`
  );

  return html;
}

// 4. Generate directory + index.html for each route
routes.forEach((route) => {
  const routeDir = path.join(distDir, route.path);
  if (!fs.existsSync(routeDir)) {
    fs.mkdirSync(routeDir, { recursive: true });
  }

  const customizedHtml = customizeHtml(indexHtmlContent, route);
  fs.writeFileSync(path.join(routeDir, 'index.html'), customizedHtml);
  console.log(`✓ Generated static route: dist/${route.path}/index.html (HTTP 200 on direct refresh)`);
});

// 5. Verify robots.txt and sitemap.xml in dist
const robotsPath = path.join(distDir, 'robots.txt');
const sitemapPath = path.join(distDir, 'sitemap.xml');

if (!fs.existsSync(robotsPath)) {
  console.warn('Warning: dist/robots.txt not found! Copying from public/robots.txt...');
  fs.copyFileSync(path.resolve('public/robots.txt'), robotsPath);
}
if (!fs.existsSync(sitemapPath)) {
  console.warn('Warning: dist/sitemap.xml not found! Copying from public/sitemap.xml...');
  fs.copyFileSync(path.resolve('public/sitemap.xml'), sitemapPath);
}

console.log('✓ Validated dist/robots.txt and dist/sitemap.xml');
console.log('Postbuild static route generation complete!');
