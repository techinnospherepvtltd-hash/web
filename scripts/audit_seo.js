import fs from 'fs';
import path from 'path';

const distDir = path.resolve('dist');
const errors = [];
const successes = [];

function assert(condition, message) {
  if (condition) {
    successes.push(message);
  } else {
    errors.push(message);
    console.error('❌ FAIL:', message);
  }
}

console.log('--- Starting Comprehensive SEO Audit ---\n');

// 1. Verify robots.txt
const robotsTxt = fs.readFileSync(path.join(distDir, 'robots.txt'), 'utf8');
assert(robotsTxt.includes('Disallow: /admin'), 'robots.txt disallows /admin');
assert(robotsTxt.includes('Disallow: /dashboard'), 'robots.txt disallows /dashboard');
assert(robotsTxt.includes('Sitemap: https://techinnosphere.com/sitemap.xml'), 'robots.txt points to canonical sitemap.xml');

// 2. Verify sitemap.xml
const sitemapXml = fs.readFileSync(path.join(distDir, 'sitemap.xml'), 'utf8');
const publicUrls = [
  'https://techinnosphere.com/',
  'https://techinnosphere.com/services',
  'https://techinnosphere.com/work',
  'https://techinnosphere.com/about',
  'https://techinnosphere.com/testimonials',
  'https://techinnosphere.com/news',
  'https://techinnosphere.com/careers',
  'https://techinnosphere.com/contact'
];

publicUrls.forEach(url => {
  assert(sitemapXml.includes(`<loc>${url}</loc>`), `sitemap.xml contains public canonical URL: ${url}`);
});
assert(!sitemapXml.includes('/admin'), 'sitemap.xml does NOT contain /admin');
assert(!sitemapXml.includes('/dashboard'), 'sitemap.xml does NOT contain /dashboard');
assert(!sitemapXml.includes('404'), 'sitemap.xml does NOT contain 404');

// 3. Verify 404.html has noindex
const notFoundHtml = fs.readFileSync(path.join(distDir, '404.html'), 'utf8');
assert(notFoundHtml.includes('content="noindex, nofollow"'), '404.html has explicit noindex, nofollow');

// 4. Verify admin routes have noindex
['admin/index.html', 'admin/dashboard/index.html', 'dashboard/index.html'].forEach(adminFile => {
  const adminHtml = fs.readFileSync(path.join(distDir, adminFile), 'utf8');
  assert(adminHtml.includes('content="noindex, nofollow"'), `${adminFile} has explicit noindex, nofollow`);
});

// 5. Verify all public routes have unique titles, descriptions, and correct canonicals
const publicRouteChecks = [
  { file: 'index.html', expectedCanonical: 'https://techinnosphere.com/' },
  { file: 'about/index.html', expectedCanonical: 'https://techinnosphere.com/about' },
  { file: 'services/index.html', expectedCanonical: 'https://techinnosphere.com/services' },
  { file: 'work/index.html', expectedCanonical: 'https://techinnosphere.com/work' },
  { file: 'testimonials/index.html', expectedCanonical: 'https://techinnosphere.com/testimonials' },
  { file: 'news/index.html', expectedCanonical: 'https://techinnosphere.com/news' },
  { file: 'careers/index.html', expectedCanonical: 'https://techinnosphere.com/careers' },
  { file: 'contact/index.html', expectedCanonical: 'https://techinnosphere.com/contact' }
];

const titles = new Set();
const descriptions = new Set();

publicRouteChecks.forEach(({ file, expectedCanonical }) => {
  const html = fs.readFileSync(path.join(distDir, file), 'utf8');

  // Title
  const titleMatch = html.match(/<title>(.*?)<\/title>/i);
  assert(titleMatch && titleMatch[1].length > 10, `${file} has non-empty title: "${titleMatch ? titleMatch[1] : ''}"`);
  if (titleMatch) {
    assert(!titles.has(titleMatch[1]), `${file} has UNIQUE title: "${titleMatch[1]}"`);
    titles.add(titleMatch[1]);
  }

  // Meta description
  const descMatch = html.match(/<meta\s+name="description"\s+content="(.*?)"/i);
  assert(descMatch && descMatch[1].length > 30, `${file} has descriptive meta description (${descMatch ? descMatch[1].length : 0} chars)`);
  if (descMatch) {
    assert(!descriptions.has(descMatch[1]), `${file} has UNIQUE meta description`);
    descriptions.add(descMatch[1]);
  }

  // Canonical
  const canonicalMatch = html.match(/<link\s+rel="canonical"\s+href="(.*?)"/i);
  assert(canonicalMatch && canonicalMatch[1] === expectedCanonical, `${file} canonical matches "${expectedCanonical}" (found: "${canonicalMatch ? canonicalMatch[1] : ''}")`);

  // Robots
  const robotsMatch = html.match(/<meta\s+name="robots"\s+content="(.*?)"/i);
  assert(robotsMatch && robotsMatch[1].includes('index, follow'), `${file} has index, follow robots directive`);

  // Open Graph
  assert(html.includes('property="og:title"'), `${file} has og:title`);
  assert(html.includes('property="og:description"'), `${file} has og:description`);
  assert(html.includes('property="og:url"'), `${file} has og:url`);
  assert(html.includes('property="og:image"'), `${file} has og:image`);

  // Twitter
  assert(html.includes('name="twitter:card"'), `${file} has twitter:card`);
  assert(html.includes('name="twitter:title"'), `${file} has twitter:title`);
  assert(html.includes('name="twitter:description"'), `${file} has twitter:description`);
});

console.log(`\nAudit finished: ${successes.length} passed, ${errors.length} failed.`);

if (errors.length > 0) {
  process.exit(1);
} else {
  console.log('✅ ALL SEO AUDIT CHECKS PASSED PERFECTLY!');
}
