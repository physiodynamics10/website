/**
 * Physio Dynamics - Lightweight Zero-CLS Cookie Consent Banner & Preferences Modal
 * Compliant with Google Consent Mode v2, GDPR, and DPDP Act 2023.
 *
 * - Zero CLS: Uses position:fixed overlay, no document reflow.
 * - Granular control: Necessary, Analytics (GA4/Clarity), Marketing.
 * - Respects previous consent across visits via localStorage.
 * - Updates Google Consent Mode v2 dynamically via gtag('consent', 'update').
 */
(function() {
    'use strict';

    var STORAGE_KEY = 'pd_consent_preferences';
    var EXPIRY_DAYS = 365;

    // Retrieve stored preferences
    function getStoredPreferences() {
        try {
            var raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return null;
            var data = JSON.parse(raw);
            if (!data || !data.timestamp) return null;
            var ageDays = (Date.now() - data.timestamp) / (1000 * 60 * 60 * 24);
            if (ageDays > EXPIRY_DAYS) {
                localStorage.removeItem(STORAGE_KEY);
                return null;
            }
            return data;
        } catch (e) {
            return null;
        }
    }

    // Save preferences
    function savePreferences(analytics, marketing) {
        var data = {
            necessary: true,
            analytics: !!analytics,
            marketing: !!marketing,
            timestamp: Date.now()
        };
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (e) {}
        return data;
    }

    // Push consent update to Google Consent Mode v2 & dataLayer
    function updateConsentMode(prefs, source) {
        var consentObj = {
            'analytics_storage': prefs.analytics ? 'granted' : 'denied',
            'ad_storage': prefs.marketing ? 'granted' : 'denied',
            'ad_user_data': prefs.marketing ? 'granted' : 'denied',
            'ad_personalization': prefs.marketing ? 'granted' : 'denied'
        };

        if (typeof window.gtag === 'function') {
            window.gtag('consent', 'update', consentObj);
        }

        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            event: 'consent_updated',
            consent_source: source || 'user_action',
            consent_analytics: consentObj.analytics_storage,
            consent_marketing: consentObj.ad_storage,
            consent_timestamp: prefs.timestamp
        });
    }

    // Inject Scoped Styles (Zero external CSS requests)
    function injectStyles() {
        if (document.getElementById('pd-cookie-consent-styles')) return;
        var style = document.createElement('style');
        style.id = 'pd-cookie-consent-styles';
        style.textContent = '' +
            '#pd-cookie-banner {' +
                'position: fixed;' +
                'bottom: 0;' +
                'left: 0;' +
                'right: 0;' +
                'z-index: 999999;' +
                'background: #ffffff;' +
                'color: #1e293b;' +
                'padding: 18px 24px;' +
                'box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.12);' +
                'border-top: 3px solid #0692ab;' +
                'font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;' +
                'font-size: 14px;' +
                'line-height: 1.5;' +
                'animation: pdFadeIn 0.3s ease-out;' +
            '}' +
            '@keyframes pdFadeIn {' +
                'from { opacity: 0; transform: translateY(15px); }' +
                'to { opacity: 1; transform: translateY(0); }' +
            '}' +
            '#pd-cookie-banner .pd-container {' +
                'max-width: 1200px;' +
                'margin: 0 auto;' +
                'display: flex;' +
                'align-items: center;' +
                'justify-content: space-between;' +
                'gap: 20px;' +
                'flex-wrap: wrap;' +
            '}' +
            '#pd-cookie-banner .pd-text {' +
                'flex: 1 1 550px;' +
                'margin: 0;' +
            '}' +
            '#pd-cookie-banner .pd-title {' +
                'font-weight: 700;' +
                'font-size: 15px;' +
                'color: #005261;' +
                'margin: 0 0 4px 0;' +
                'display: flex;' +
                'align-items: center;' +
                'gap: 8px;' +
            '}' +
            '#pd-cookie-banner a {' +
                'color: #0692ab;' +
                'text-decoration: underline;' +
                'font-weight: 500;' +
            '}' +
            '#pd-cookie-banner a:hover {' +
                'color: #005261;' +
            '}' +
            '#pd-cookie-banner .pd-actions {' +
                'display: flex;' +
                'align-items: center;' +
                'gap: 10px;' +
                'flex-wrap: wrap;' +
            '}' +
            '.pd-btn {' +
                'font-family: inherit;' +
                'font-size: 13px;' +
                'font-weight: 600;' +
                'padding: 8px 18px;' +
                'border-radius: 50px;' +
                'cursor: pointer;' +
                'transition: all 0.2s ease;' +
                'border: 1px solid transparent;' +
                'white-space: nowrap;' +
            '}' +
            '.pd-btn-accept {' +
                'background: #0692ab;' +
                'color: #ffffff;' +
                'border-color: #0692ab;' +
            '}' +
            '.pd-btn-accept:hover {' +
                'background: #005261;' +
                'border-color: #005261;' +
            '}' +
            '.pd-btn-reject {' +
                'background: #f1f5f9;' +
                'color: #334155;' +
                'border-color: #cbd5e1;' +
            '}' +
            '.pd-btn-reject:hover {' +
                'background: #e2e8f0;' +
                'color: #0f172a;' +
            '}' +
            '.pd-btn-settings {' +
                'background: transparent;' +
                'color: #0692ab;' +
                'border-color: #0692ab;' +
            '}' +
            '.pd-btn-settings:hover {' +
                'background: #f0fdfa;' +
                'color: #005261;' +
            '}' +
            '/* Modal Styles */' +
            '#pd-cookie-modal-backdrop {' +
                'position: fixed;' +
                'top: 0;' +
                'left: 0;' +
                'width: 100%;' +
                'height: 100%;' +
                'background: rgba(15, 23, 42, 0.65);' +
                'z-index: 1000000;' +
                'display: flex;' +
                'align-items: center;' +
                'justify-content: center;' +
                'padding: 16px;' +
                'backdrop-filter: blur(3px);' +
            '}' +
            '#pd-cookie-modal {' +
                'background: #ffffff;' +
                'color: #1e293b;' +
                'width: 100%;' +
                'max-width: 580px;' +
                'max-height: 90vh;' +
                'border-radius: 16px;' +
                'box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);' +
                'overflow: hidden;' +
                'display: flex;' +
                'flex-direction: column;' +
                'font-family: Inter, -apple-system, BlinkMacSystemFont, sans-serif;' +
                'font-size: 14px;' +
            '}' +
            '#pd-cookie-modal .pd-modal-header {' +
                'padding: 20px 24px;' +
                'background: #f8fafc;' +
                'border-bottom: 1px solid #e2e8f0;' +
                'display: flex;' +
                'align-items: center;' +
                'justify-content: space-between;' +
            '}' +
            '#pd-cookie-modal .pd-modal-header h3 {' +
                'margin: 0;' +
                'font-size: 18px;' +
                'font-weight: 700;' +
                'color: #005261;' +
            '}' +
            '#pd-cookie-modal .pd-modal-close {' +
                'background: none;' +
                'border: none;' +
                'font-size: 24px;' +
                'line-height: 1;' +
                'cursor: pointer;' +
                'color: #64748b;' +
                'padding: 4px 8px;' +
            '}' +
            '#pd-cookie-modal .pd-modal-body {' +
                'padding: 20px 24px;' +
                'overflow-y: auto;' +
                'flex: 1;' +
            '}' +
            '.pd-category-card {' +
                'border: 1px solid #e2e8f0;' +
                'border-radius: 10px;' +
                'padding: 14px 16px;' +
                'margin-bottom: 12px;' +
                'background: #ffffff;' +
            '}' +
            '.pd-category-header {' +
                'display: flex;' +
                'justify-content: space-between;' +
                'align-items: center;' +
                'margin-bottom: 6px;' +
            '}' +
            '.pd-category-title {' +
                'font-weight: 600;' +
                'color: #0f172a;' +
                'font-size: 14px;' +
            '}' +
            '.pd-category-desc {' +
                'font-size: 12.5px;' +
                'color: #64748b;' +
                'margin: 0;' +
                'line-height: 1.4;' +
            '}' +
            '.pd-badge-required {' +
                'font-size: 11px;' +
                'font-weight: 600;' +
                'color: #0692ab;' +
                'background: #e0f2fe;' +
                'padding: 3px 8px;' +
                'border-radius: 12px;' +
            '}' +
            '/* Toggle switch */' +
            '.pd-switch {' +
                'position: relative;' +
                'display: inline-block;' +
                'width: 44px;' +
                'height: 24px;' +
            '}' +
            '.pd-switch input { opacity: 0; width: 0; height: 0; }' +
            '.pd-slider {' +
                'position: absolute; cursor: pointer;' +
                'top: 0; left: 0; right: 0; bottom: 0;' +
                'background-color: #cbd5e1;' +
                'transition: .2s;' +
                'border-radius: 24px;' +
            '}' +
            '.pd-slider:before {' +
                'position: absolute; content: "";' +
                'height: 18px; width: 18px;' +
                'left: 3px; bottom: 3px;' +
                'background-color: white;' +
                'transition: .2s;' +
                'border-radius: 50%;' +
            '}' +
            'input:checked + .pd-slider { background-color: #0692ab; }' +
            'input:checked + .pd-slider:before { transform: translateX(20px); }' +
            '#pd-cookie-modal .pd-modal-footer {' +
                'padding: 16px 24px;' +
                'background: #f8fafc;' +
                'border-top: 1px solid #e2e8f0;' +
                'display: flex;' +
                'justify-content: flex-end;' +
                'gap: 10px;' +
                'flex-wrap: wrap;' +
            '}' +
            '@media (max-width: 640px) {' +
                '#pd-cookie-banner {' +
                    'padding: 16px;' +
                '}' +
                '#pd-cookie-banner .pd-actions {' +
                    'width: 100%;' +
                    'justify-content: stretch;' +
                '}' +
                '.pd-btn {' +
                    'flex: 1 1 auto;' +
                    'text-align: center;' +
                    'padding: 10px 14px;' +
                '}' +
            '}';
        document.head.appendChild(style);
    }

    // Render Banner HTML
    function showBanner() {
        if (document.getElementById('pd-cookie-banner')) return;
        injectStyles();

        var banner = document.createElement('div');
        banner.id = 'pd-cookie-banner';
        banner.setAttribute('role', 'region');
        banner.setAttribute('aria-label', 'Cookie Consent');
        banner.innerHTML = '' +
            '<div class="pd-container">' +
                '<div class="pd-text">' +
                    '<div class="pd-title">' +
                        '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0692ab" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"/></svg>' +
                        'We value your privacy' +
                    '</div>' +
                    'We use cookies to analyze clinic website traffic, improve treatment information, and understand how visitors use our site. You can accept, reject, or customize your preferences anytime. Learn more in our <a href="/privacy-policy">Privacy Policy</a>.' +
                '</div>' +
                '<div class="pd-actions">' +
                    '<button type="button" class="pd-btn pd-btn-reject" id="pd-btn-reject">Reject All</button>' +
                    '<button type="button" class="pd-btn pd-btn-settings" id="pd-btn-settings">Cookie Settings</button>' +
                    '<button type="button" class="pd-btn pd-btn-accept" id="pd-btn-accept">Accept All</button>' +
                '</div>' +
            '</div>';

        document.body.appendChild(banner);

        // Bind banner buttons
        var acceptBtn = banner.querySelector('#pd-btn-accept');
        var rejectBtn = banner.querySelector('#pd-btn-reject');
        var settingsBtn = banner.querySelector('#pd-btn-settings');

        if (acceptBtn) {
            acceptBtn.addEventListener('click', function() {
                var prefs = savePreferences(true, true);
                updateConsentMode(prefs, 'accept_all');
                removeBanner();
            });
        }

        if (rejectBtn) {
            rejectBtn.addEventListener('click', function() {
                var prefs = savePreferences(false, false);
                updateConsentMode(prefs, 'reject_all');
                removeBanner();
            });
        }

        if (settingsBtn) {
            settingsBtn.addEventListener('click', function() {
                openPreferencesModal();
            });
        }
    }

    function removeBanner() {
        var banner = document.getElementById('pd-cookie-banner');
        if (banner) banner.parentNode.removeChild(banner);
    }

    // Render & Open Preferences Modal
    function openPreferencesModal() {
        injectStyles();
        var existing = document.getElementById('pd-cookie-modal-backdrop');
        if (existing) existing.parentNode.removeChild(existing);

        var current = getStoredPreferences() || { necessary: true, analytics: false, marketing: false };

        var backdrop = document.createElement('div');
        backdrop.id = 'pd-cookie-modal-backdrop';
        backdrop.innerHTML = '' +
            '<div id="pd-cookie-modal" role="dialog" aria-modal="true" aria-labelledby="pd-modal-title">' +
                '<div class="pd-modal-header">' +
                    '<h3 id="pd-modal-title">Cookie & Privacy Preferences</h3>' +
                    '<button type="button" class="pd-modal-close" id="pd-modal-close" aria-label="Close">&times;</button>' +
                '</div>' +
                '<div class="pd-modal-body">' +
                    '<p style="margin: 0 0 16px 0; color: #475569; font-size: 13px;">' +
                        'Choose which categories of cookies you wish to allow. Strictly necessary cookies are required for fundamental site operation and cannot be switched off.' +
                    '</p>' +
                    '<!-- Necessary -->' +
                    '<div class="pd-category-card">' +
                        '<div class="pd-category-header">' +
                            '<span class="pd-category-title">Strictly Necessary Cookies</span>' +
                            '<span class="pd-badge-required">Always Active</span>' +
                        '</div>' +
                        '<p class="pd-category-desc">Required for website security, page routing, and basic clinic accessibility. These do not store personally identifiable data.</p>' +
                    '</div>' +
                    '<!-- Analytics -->' +
                    '<div class="pd-category-card">' +
                        '<div class="pd-category-header">' +
                            '<span class="pd-category-title">Analytics & Measurement (Google Analytics 4 & Clarity)</span>' +
                            '<label class="pd-switch">' +
                                '<input type="checkbox" id="pd-toggle-analytics"' + (current.analytics ? ' checked' : '') + '>' +
                                '<span class="pd-slider"></span>' +
                            '</label>' +
                        '</div>' +
                        '<p class="pd-category-desc">Helps us understand how patients interact with clinic service guides, appointment pages, and rehabilitation articles to improve clinical care information.</p>' +
                    '</div>' +
                    '<!-- Marketing -->' +
                    '<div class="pd-category-card">' +
                        '<div class="pd-category-header">' +
                            '<span class="pd-category-title">Marketing & Personalization</span>' +
                            '<label class="pd-switch">' +
                                '<input type="checkbox" id="pd-toggle-marketing"' + (current.marketing ? ' checked' : '') + '>' +
                                '<span class="pd-slider"></span>' +
                            '</label>' +
                        '</div>' +
                        '<p class="pd-category-desc">Used for campaign measurement and relevant local healthcare information delivery across Google networks.</p>' +
                    '</div>' +
                '</div>' +
                '<div class="pd-modal-footer">' +
                    '<button type="button" class="pd-btn pd-btn-reject" id="pd-modal-reject-all">Reject All</button>' +
                    '<button type="button" class="pd-btn pd-btn-accept" id="pd-modal-save">Save Preferences</button>' +
                '</div>' +
            '</div>';

        document.body.appendChild(backdrop);

        // Bind modal controls
        var closeBtn = backdrop.querySelector('#pd-modal-close');
        var saveBtn = backdrop.querySelector('#pd-modal-save');
        var rejectAllBtn = backdrop.querySelector('#pd-modal-reject-all');
        var analyticsToggle = backdrop.querySelector('#pd-toggle-analytics');
        var marketingToggle = backdrop.querySelector('#pd-toggle-marketing');

        if (closeBtn) {
            closeBtn.addEventListener('click', closePreferencesModal);
        }

        backdrop.addEventListener('click', function(e) {
            if (e.target === backdrop) closePreferencesModal();
        });

        if (saveBtn) {
            saveBtn.addEventListener('click', function() {
                var analytics = analyticsToggle ? analyticsToggle.checked : false;
                var marketing = marketingToggle ? marketingToggle.checked : false;
                var prefs = savePreferences(analytics, marketing);
                updateConsentMode(prefs, 'modal_save');
                closePreferencesModal();
                removeBanner();
            });
        }

        if (rejectAllBtn) {
            rejectAllBtn.addEventListener('click', function() {
                var prefs = savePreferences(false, false);
                updateConsentMode(prefs, 'modal_reject_all');
                closePreferencesModal();
                removeBanner();
            });
        }
    }

    function closePreferencesModal() {
        var backdrop = document.getElementById('pd-cookie-modal-backdrop');
        if (backdrop) backdrop.parentNode.removeChild(backdrop);
    }

    // Expose global method to re-open settings from footer anytime
    window.openCookieSettings = openPreferencesModal;

    // Attach to any element with [data-cookie-settings] or #openCookieSettings
    function bindFooterButtons() {
        document.addEventListener('click', function(e) {
            var target = e.target;
            if (target && (target.id === 'openCookieSettings' || target.closest('[data-cookie-settings]'))) {
                e.preventDefault();
                openPreferencesModal();
            }
        });
    }

    // Initialization
    function init() {
        bindFooterButtons();
        var stored = getStoredPreferences();
        if (stored) {
            // Apply previously saved preferences immediately to Consent Mode
            updateConsentMode(stored, 'stored_preference');
        } else {
            // New visitor: display non-intrusive banner
            showBanner();
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
