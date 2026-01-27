const { SitemapStream, streamToPromise } = require('sitemap');
const fs = require('fs');
const path = require('path');

// Your website pages
const pages = [
  { url: '/', changefreq: 'monthly', priority: 1.0 },
  { url: '/about.html', changefreq: 'monthly', priority: 0.8 },
  { url: '/contact.html', changefreq: 'monthly', priority: 0.8 },
  { url: '/service.html', changefreq: 'monthly', priority: 0.8 },
  { url: '/neurological-physiotherapy.html', changefreq: 'monthly', priority: 0.7 },
  { url: '/home-care.html', changefreq: 'monthly', priority: 0.7 },
  { url: '/chest-physiotherapy.html', changefreq: 'monthly', priority: 0.7 },
  { url: '/orthopedic-physiotherapy.html', changefreq: 'monthly', priority: 0.7 },
  { url: '/pediatric-physiotherapy.html', changefreq: 'monthly', priority: 0.7 },
  { url: '/sports-physiotherapy.html', changefreq: 'monthly', priority: 0.7 },
  { url: '/404.html', changefreq: 'yearly', priority: 0.3 }
];

async function generateSitemap() {
  const sitemap = new SitemapStream({ 
    hostname: 'https://www.physio-dynamics.com',
    lastmodDateOnly: true 
  });

  // Add pages to sitemap
  pages.forEach(page => {
    sitemap.write({
      url: page.url,
      changefreq: page.changefreq,
      priority: page.priority,
      lastmod: new Date().toISOString()
    });
  });

  sitemap.end();

  // Generate XML
  const xml = await streamToPromise(sitemap);
  
  // Write to file
  fs.writeFileSync(path.join(__dirname, 'sitemap.xml'), xml.toString());
  console.log('✅ Sitemap generated: sitemap.xml');
}

generateSitemap().catch(console.error);