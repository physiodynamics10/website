/**
 * Centralized Deferral Script for third-party widgets (GTM, Tidio)
 * GA4 is delivered exclusively via GTM to avoid loading gtag.js twice.
 * Loads after first user interaction (scroll/click/mouseover/keydown/touchstart)
 * or after a 4-second fallback, whichever comes first.
 */
(function() {
    let scriptsLoaded = false;

    function loadScripts() {
        if (scriptsLoaded) return;
        scriptsLoaded = true;

        // Remove interaction listeners once fired
        const events = ['scroll', 'click', 'mouseover', 'keydown', 'touchstart'];
        events.forEach(function(event) {
            window.removeEventListener(event, loadScripts, { passive: true });
        });

        // 1. Load Google Tag Manager (carries GA4 G-PF3YJYKC6V tag internally)
        //    Do NOT also load gtag.js directly — that would double-count pageviews.
        (function(w, d, s, l, i) {
            w[l] = w[l] || [];
            w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
            var f = d.getElementsByTagName(s)[0],
                j = d.createElement(s);
            j.async = true;
            j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i;
            f.parentNode.insertBefore(j, f);
        })(window, document, 'script', 'dataLayer', 'GTM-WKMWL3T3');

        // 2. Load Tidio Chat Widget
        var tidioScript = document.createElement('script');
        tidioScript.src = '//code.tidio.co/4cvipbnbdaxiob3bvkolvyaitucgfpnv.js';
        tidioScript.async = true;
        document.body.appendChild(tidioScript);
    }

    // Trigger on first meaningful interaction
    var events = ['scroll', 'click', 'mouseover', 'keydown', 'touchstart'];
    events.forEach(function(event) {
        window.addEventListener(event, loadScripts, { passive: true });
    });

    // Fallback: load after 4 s to ensure analytics fires even on passive visitors
    setTimeout(loadScripts, 4000);
})();
