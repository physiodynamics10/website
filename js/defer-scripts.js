/**
 * Centralized Deferral Script for third-party widgets (Google Analytics, GTM, Tidio)
 * Speeds up initial page load by delaying execution until user interaction or a timeout.
 */
(function() {
    let scriptsLoaded = false;

    function loadScripts() {
        if (scriptsLoaded) return;
        scriptsLoaded = true;

        // Remove interaction listeners
        const events = ['scroll', 'click', 'mouseover', 'keydown', 'touchstart'];
        events.forEach(event => {
            window.removeEventListener(event, loadScripts, { passive: true });
        });

        // 1. Load Google Tag (gtag.js)
        const gtagScript = document.createElement('script');
        gtagScript.src = "https://www.googletagmanager.com/gtag/js?id=G-PF3YJYKC6V";
        gtagScript.async = true;
        document.head.appendChild(gtagScript);

        // Configure gtag parameters
        window.dataLayer = window.dataLayer || [];
        function gtag() { window.dataLayer.push(arguments); }
        window.gtag = gtag;
        gtag('js', new Date());
        gtag('config', 'G-PF3YJYKC6V');

        // 2. Load Google Tag Manager (GTM)
        const gtmScript = document.createElement('script');
        gtmScript.async = true;
        gtmScript.src = "https://www.googletagmanager.com/gtm.js?id=GTM-WKMWL3T3";
        document.head.appendChild(gtmScript);

        // 3. Load Tidio Chat Widget
        const tidioScript = document.createElement('script');
        tidioScript.src = "//code.tidio.co/4cvipbnbdaxiob3bvkolvyaitucgfpnv.js";
        tidioScript.async = true;
        document.body.appendChild(tidioScript);
    }

    // Attach event listeners
    const events = ['scroll', 'click', 'mouseover', 'keydown', 'touchstart'];
    events.forEach(event => {
        window.addEventListener(event, loadScripts, { passive: true });
    });

    // Fallback load after 4 seconds (handles static analysis/bots if they wait)
    setTimeout(loadScripts, 4000);
})();
