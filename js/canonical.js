/**
 * Dynamic Canonical Tag Injector
 * Corrects and normalizes the canonical URL for SEO across the static site.
 * Logic: Base URL + Pathname (stripped of .html and trailing slashes).
 */
(function() {
    const baseUrl = 'https://www.physio-dynamics.com';
    let path = window.location.pathname;
    
    // Normalize path: Remove .html and trailing slashes (except root)
    if (path.endsWith('.html')) path = path.slice(0, -5);
    if (path === '/index') path = '/';
    if (path.length > 1 && path.endsWith('/')) path = path.slice(0, -1);
    
    const canonicalUrl = baseUrl + path;
    
    // Find or create the canonical link element
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
        link = document.createElement('link');
        link.rel = 'canonical';
        document.head.appendChild(link);
    }
    link.setAttribute('href', canonicalUrl);
})();
