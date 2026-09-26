import fs from 'fs';
import path from 'path';

const distDir = path.resolve('dist');

if (!fs.existsSync(distDir)) {
  console.error('Error: dist directory does not exist.');
  process.exit(1);
}

// 1. Read index.html content
const indexHtmlPath = path.join(distDir, 'index.html');
const indexHtmlContent = fs.readFileSync(indexHtmlPath, 'utf8');

// 2. Ensure .nojekyll exists
fs.writeFileSync(path.join(distDir, '.nojekyll'), '# Disable Jekyll\n');
console.log('✓ Created dist/.nojekyll');

// 3. Define public routes with their specific metadata
const routes = [
  {
    path: 'about',
    title: 'About TechInnoSphere | Software Development Company in Mumbai',
    description: 'Learn about TechInnoSphere Software Solutions Pvt. Ltd., a Mumbai technology services company delivering business-focused software development and AI for global clients.',
    canonical: 'https://techinnosphere.com/about'
  },
  {
    path: 'services',
    title: 'Software Development, AI & Technology Services | TechInnoSphere',
    description: 'TechInnoSphere provides custom software development, web & application development, AI development & integration, SAP ABAP services, and digital automation.',
    canonical: 'https://techinnosphere.com/services'
  },
  {
    path: 'work',
    title: 'Software Projects, Web Apps & AI Case Studies | TechInnoSphere Work',
    description: "Explore TechInnoSphere's portfolio of custom software projects, web applications, enterprise systems, AI solutions, and technology case studies.",
    canonical: 'https://techinnosphere.com/work'
  },
  {
    path: 'testimonials',
    title: 'Client Testimonials & Software Reviews | TechInnoSphere',
    description: "Read genuine client experiences and reviews for TechInnoSphere's software development, AI solutions, web platforms, and technology engineering projects.",
    canonical: 'https://techinnosphere.com/testimonials'
  },
  {
    path: 'news',
    title: 'Technology News, AI Insights & Software Updates | TechInnoSphere',
    description: "Stay informed with TechInnoSphere's technology news, artificial intelligence insights, custom software development articles, and company announcements.",
    canonical: 'https://techinnosphere.com/news'
  },
  {
    path: 'careers',
    title: 'Careers at TechInnoSphere | Software, Web & AI Engineering Jobs',
    description: 'Explore technology careers at TechInnoSphere in Mumbai and remote. We are hiring for software development, web engineering, and AI solution roles.',
    canonical: 'https://techinnosphere.com/careers'
  },
  {
    path: 'contact',
    title: 'Contact TechInnoSphere | Software Development & AI Inquiries',
    description: 'Contact TechInnoSphere in Mumbai, India for software development, AI solutions, web & application development projects, and technology consulting.',
    canonical: 'https://techinnosphere.com/contact'
  },
  {
    path: 'admin',
    title: 'Admin Portal | TechInnoSphere',
    description: 'TechInnoSphere Administrator Portal',
    canonical: 'https://techinnosphere.com/admin',
    noindex: true
  },
  {
    path: 'admin/dashboard',
    title: 'Admin Dashboard | TechInnoSphere',
    description: 'TechInnoSphere Admin Dashboard',
    canonical: 'https://techinnosphere.com/admin/dashboard',
    noindex: true
  },
  {
    path: 'dashboard',
    title: 'Dashboard | TechInnoSphere',
    description: 'TechInnoSphere Dashboard',
    canonical: 'https://techinnosphere.com/dashboard',
    noindex: true
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

  // Indexing Controls (noindex for admin routes)
  if (route.noindex) {
    html = html.replace(
      /<meta\s+name="robots"\s+content=".*?"\s*\/?>/i,
      '<meta name="robots" content="noindex, nofollow" />'
    );
  } else {
    html = html.replace(
      /<meta\s+name="robots"\s+content=".*?"\s*\/?>/i,
      '<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />'
    );
  }

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

// 4b. Generate dist/404.html fallback with explicit noindex, nofollow
const notFoundHtml = customizeHtml(indexHtmlContent, {
  title: '404 - Page Not Found | TechInnoSphere',
  description: 'The requested page could not be found. Explore our software development services, project case studies, or contact TechInnoSphere.',
  canonical: 'https://techinnosphere.com/404',
  noindex: true
});
fs.writeFileSync(path.join(distDir, '404.html'), notFoundHtml);
console.log('✓ Created dist/404.html with noindex, nofollow');

// 5. Verify robots.txt and sitemap.xml in dist
const robotsPath = path.join(distDir, 'robots.txt');
const sitemapPath = path.join(distDir, 'sitemap.xml');

if (!fs.existsSync(robotsPath) || true) {
  fs.copyFileSync(path.resolve('public/robots.txt'), robotsPath);
}
if (!fs.existsSync(sitemapPath) || true) {
  fs.copyFileSync(path.resolve('public/sitemap.xml'), sitemapPath);
}

console.log('✓ Validated dist/robots.txt and dist/sitemap.xml');
console.log('Postbuild static route generation complete!');
