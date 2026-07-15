const fs = require('fs');
const path = require('path');
const { PurgeCSS } = require('purgecss');
const https = require('https');

const PROJECT_DIR = __dirname;
const BOOTSTRAP_CSS_PATH = path.join(PROJECT_DIR, 'css', 'bootstrap.min.css');
const FONT_AWESOME_URL = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
const FONT_AWESOME_PURGED_PATH = path.join(PROJECT_DIR, 'css', 'font-awesome-purged.min.css');

function downloadUrl(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            if (res.statusCode !== 200) {
                reject(new Error(`Failed to download ${url}: Status ${res.statusCode}`));
                return;
            }
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => { resolve(data); });
        }).on('error', (err) => { reject(err); });
    });
}

function getFiles(dir, extensions, excludeDirs = ['node_modules', '.git']) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) {
            if (!excludeDirs.includes(file)) {
                results = results.concat(getFiles(fullPath, extensions, excludeDirs));
            }
        } else {
            const ext = path.extname(file);
            if (extensions.includes(ext)) {
                results.push(fullPath);
            }
        }
    });
    return results;
}

async function main() {
    console.log('Finding HTML and JS files...');
    const contentFiles = getFiles(PROJECT_DIR, ['.html', '.js']);
    console.log(`Found ${contentFiles.length} files to scan.`);

    // 1. Optimize Bootstrap
    console.log('Optimizing Bootstrap...');
    const bootstrapCssContent = fs.readFileSync(BOOTSTRAP_CSS_PATH, 'utf8');
    
    const bootstrapPurged = await new PurgeCSS().purge({
        content: contentFiles,
        css: [{ raw: bootstrapCssContent }],
        safelist: {
            standard: [
                'collapse', 'collapsing', 'show', 'collapsed', 'active', 'fade', 
                'showing', 'hiding', 'modal-backdrop', 'modal-open', 'd-none', 
                'd-block', 'd-flex', 'spinner-border', 'alert-success', 'alert-danger',
                'page-loaded', 'active', 'dropdown', 'dropdown-menu', 'dropdown-item',
                'dropdown-toggle', 'nav', 'nav-item', 'nav-link', 'navbar', 'navbar-collapse',
                'navbar-toggler', 'navbar-nav'
            ],
            deep: [
                /^nav-/, /^navbar-/, /^dropdown-/, /^modal-/, /^carousel-/
            ],
            greedy: [
                /^nav-/, /^navbar-/, /^dropdown-/, /^modal-/, /^carousel-/
            ]
        }
    });

    const optimizedBootstrapCss = bootstrapPurged[0].css;
    const oldBootstrapSize = (bootstrapCssContent.length / 1024).toFixed(2);
    const newBootstrapSize = (optimizedBootstrapCss.length / 1024).toFixed(2);
    console.log(`Bootstrap optimized: ${oldBootstrapSize} KB -> ${newBootstrapSize} KB`);
    
    // Save optimized bootstrap
    fs.writeFileSync(BOOTSTRAP_CSS_PATH, optimizedBootstrapCss, 'utf8');

    // 2. Optimize Font Awesome
    console.log('Downloading Font Awesome from Cloudflare CDN...');
    const rawFaCss = await downloadUrl(FONT_AWESOME_URL);
    
    console.log('Rewriting Font Awesome webfont URLs to point to CDN...');
    const rewrittenFaCss = rawFaCss.replace(/url\(['"]?\.{2}\/webfonts\//g, 'url(https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/webfonts/');

    console.log('Purging Font Awesome CSS...');
    const faPurged = await new PurgeCSS().purge({
        content: contentFiles,
        css: [{ raw: rewrittenFaCss }],
        safelist: {
            standard: [
                'fa', 'fas', 'far', 'fab', 'fa-solid', 'fa-regular', 'fa-brands',
                'fa-fw', 'fa-spin', 'fa-pulse', 'fa-xs', 'fa-sm', 'fa-lg',
                'fa-2x', 'fa-3x', 'fa-4x', 'fa-5x', 'fa-6x', 'fa-7x', 'fa-8x',
                'fa-9x', 'fa-10x', 'fa-ul', 'fa-li'
            ]
        }
    });

    const optimizedFaCss = faPurged[0].css;
    const oldFaSize = (rawFaCss.length / 1024).toFixed(2);
    const newFaSize = (optimizedFaCss.length / 1024).toFixed(2);
    console.log(`Font Awesome optimized: ${oldFaSize} KB -> ${newFaSize} KB`);

    fs.writeFileSync(FONT_AWESOME_PURGED_PATH, optimizedFaCss, 'utf8');

    // 3. Update HTML files
    console.log('Updating HTML files to use the new purged Font Awesome stylesheet...');
    let updatedCount = 0;
    
    for (const file of contentFiles) {
        if (path.extname(file) === '.html') {
            let content = fs.readFileSync(file, 'utf8');
            let updated = false;

            const pattern = /<link rel="preload" href="https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/font-awesome\/6\.4\.0\/css\/all\.min\.css" as="style" onload="this\.onload=null;this\.rel='stylesheet'" \/>\r?\n\s*<noscript><link rel="stylesheet" href="https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/font-awesome\/6\.4\.0\/css\/all\.min\.css" \/><\/noscript>/g;
            
            if (pattern.test(content)) {
                content = content.replace(pattern, '<link rel="stylesheet" href="/css/font-awesome-purged.min.css" />');
                updated = true;
            } else {
                // Try a fallback search/replace for single lines if it exists
                const singleLinePattern = /<link rel="preload" href="https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/font-awesome\/6\.4\.0\/css\/all\.min\.css"[^>]*>/g;
                const noscriptPattern = /<noscript><link rel="stylesheet" href="https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/font-awesome\/6\.4\.0\/css\/all\.min\.css"[^>]*><\/noscript>/g;
                
                if (singleLinePattern.test(content) || noscriptPattern.test(content)) {
                    content = content.replace(singleLinePattern, '<link rel="stylesheet" href="/css/font-awesome-purged.min.css" />');
                    content = content.replace(noscriptPattern, '');
                    updated = true;
                }
            }

            if (updated) {
                fs.writeFileSync(file, content, 'utf8');
                updatedCount++;
            }
        }
    }
    
    console.log(`Updated ${updatedCount} HTML files.`);
    console.log('CSS Optimization complete!');
}

main().catch(err => {
    console.error('Error during optimization:', err);
    process.exit(1);
});
