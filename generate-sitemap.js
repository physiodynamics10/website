const { SitemapStream, streamToPromise } = require('sitemap');
const fs = require('fs');
const path = require('path');

const pages = [
  '/',
  '/about.html',
  '/contact.html',
  '/service.html',
  '/neurological-physiotherapy.html',
  '/home-care.html',
  '/chest-physiotherapy.html',
  '/orthopedic-physiotherapy.html',
  '/pediatric-physiotherapy.html',
  '/sports-physiotherapy.html'
];

async function generateSitemap() {
  const sitemap = new SitemapStream({
    hostname: 'https://www.physio-dynamics.com'
  });

  pages.forEach(url => sitemap.write({ url }));
  sitemap.end();

  const xml = await streamToPromise(sitemap);
  fs.writeFileSync(path.join(__dirname, 'sitemap.xml'), xml.toString());
  console.log('✅ Sitemap generated');
}

generateSitemap().catch(console.error);
