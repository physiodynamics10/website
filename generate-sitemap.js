const { SitemapStream, streamToPromise } = require('sitemap');
const fs = require('fs');
const path = require('path');

// 1. Identify which folders and files should be excluded from the sitemap
const EXCLUDED_FILES = ['404.html', 'google89be9aab9d25c09c.html'];
const EXCLUDED_DIRS = ['.git', 'node_modules', 'css', 'js', 'img', 'scss', 'lib'];

/**
 * Recursively find all .html files in a directory
 * @param {string} dirPath Current directory path 
 * @param {Array} fileList Accumulator for file paths
 * @param {string} baseDir Base directory for calculating relative paths
 * @returns {Array} List of relative URL paths
 */
function getHtmlFiles(dirPath, fileList = [], baseDir = __dirname) {
    const files = fs.readdirSync(dirPath);

    files.forEach(file => {
        const fullPath = path.join(dirPath, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            if (!EXCLUDED_DIRS.includes(file)) {
                getHtmlFiles(fullPath, fileList, baseDir);
            }
        } else if (file.endsWith('.html') && !EXCLUDED_FILES.includes(file)) {
            // Convert file path to URL path
            let relativePath = path.relative(baseDir, fullPath).replace(/\\/g, '/');
            
            // Normalize path: Remove .html and handle index files
            let urlPath = '/' + relativePath.replace('.html', '');
            if (urlPath === '/index') urlPath = '/';
            else if (urlPath.endsWith('/index')) urlPath = urlPath.slice(0, -5); // e.g. /blogs/index -> /blogs/
            
            fileList.push(urlPath);
        }
    });

    return fileList;
}

async function generateSitemap() {
    const sitemap = new SitemapStream({
        hostname: 'https://www.physio-dynamics.com'
    });

    try {
        const pages = getHtmlFiles(__dirname);
        
        console.log('🔍 Found pages:', pages);

        pages.forEach(url => {
            // Primary pages have higher priority
            let priority = 0.8;
            if (url === '/') priority = 1.0;
            if (url === '/services') priority = 0.9;

            sitemap.write({ 
                url, 
                changefreq: 'weekly', 
                priority,
                lastmod: new Date().toISOString().split('T')[0] // Set today as the last modified date
            });
        });

        sitemap.end();

        const xml = await streamToPromise(sitemap);
        fs.writeFileSync(path.join(__dirname, 'sitemap.xml'), xml.toString());
        console.log('✅ Sitemap generated successfully for ' + pages.length + ' pages');
    } catch (error) {
        console.error('❌ Error generating sitemap:', error);
    }
}

generateSitemap().catch(console.error);
