/**
 * AppAnwendung - SEO & Performance Optimierungen
 * Diese Datei sollte nicht direkt in HTML importiert werden
 * Sie enthält Best Practices und Optimierungstipps
 */

// =========================================
// PERFORMANCE TIPPS
// =========================================

// NEU: Lazy Loading für externe Ressourcen
function lazyLoadScripts() {
    // Portfolio-Scripts nur laden wenn Portfolio-Sektion sichtbar
    const portfolioSection = document.querySelector('#portfolio');
    if (!portfolioSection) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Script dynamisch laden
                const script = document.createElement('script');
                script.src = 'portfolio.js';
                script.async = true;
                document.body.appendChild(script);
                observer.unobserve(entry.target);
            }
        });
    });

    observer.observe(portfolioSection);
}

// NEU: Service Worker für Offline-Support (Progressive Web App)
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => console.log('Service Worker registered'))
            .catch(error => console.log('Service Worker registration failed:', error));
    }
}

// NEU: Performance Monitoring
function trackWebVitals() {
    // Largest Contentful Paint (LCP)
    new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
            console.log('LCP:', entry.renderTime || entry.loadTime);
            // Sende zu Analytics
            if (window.gtag) {
                gtag('event', 'page_view', {
                    'event_label': 'LCP',
                    'value': entry.renderTime || entry.loadTime
                });
            }
        }
    }).observe({entryTypes: ['largest-contentful-paint']});

    // First Input Delay (FID)
    new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
            const delay = entry.processingEnd - entry.startTime;
            console.log('FID:', delay);
            if (window.gtag) {
                gtag('event', 'page_view', {
                    'event_label': 'FID',
                    'value': delay
                });
            }
        }
    }).observe({entryTypes: ['first-input']});

    // Cumulative Layout Shift (CLS)
    let clsValue = 0;
    new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) {
                clsValue += entry.value;
                console.log('CLS:', clsValue);
                if (window.gtag) {
                    gtag('event', 'page_view', {
                        'event_label': 'CLS',
                        'value': clsValue
                    });
                }
            }
        }
    }).observe({entryTypes: ['layout-shift']});
}

// NEU: Keyboard Navigation für bessere Accessibility
function enhanceKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        // Skip to main content (Press '1')
        if (e.key === '1') {
            document.querySelector('main')?.focus();
        }
        // Skip to navigation (Press '2')
        if (e.key === '2') {
            document.querySelector('nav')?.focus();
        }
    });
}

// NEU: Reduce Motion für Accessibility
function respectedPrefersReducedMotion() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
        document.documentElement.style.setProperty('--transition-fast', '0ms');
        document.documentElement.style.setProperty('--transition-base', '0ms');
        document.documentElement.style.setProperty('--transition-slow', '0ms');
    }
}

// =========================================
// SEO BEST PRACTICES
// =========================================

// NEU: Meta Tag Dynamik aktualisieren
function updateMetaTags(title, description, url) {
    // Title
    document.title = title;

    // Meta Description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description);

    // Open Graph Tags
    updateOGTag('og:title', title);
    updateOGTag('og:description', description);
    updateOGTag('og:url', url);

    // Canonical
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
        canonical = document.createElement('link');
        canonical.rel = 'canonical';
        document.head.appendChild(canonical);
    }
    canonical.href = url;
}

function updateOGTag(property, content) {
    let ogTag = document.querySelector(`meta[property="${property}"]`);
    if (!ogTag) {
        ogTag = document.createElement('meta');
        ogTag.setAttribute('property', property);
        document.head.appendChild(ogTag);
    }
    ogTag.setAttribute('content', content);
}

// NEU: Structured Data für die aktuelle Seite
function addStructuredData(type, data) {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': type,
        ...data
    });
    document.head.appendChild(script);
}

// NEU: Sitemap Verweis hinzufügen (für Crawler)
function addSitemapReference() {
    const link = document.createElement('link');
    link.rel = 'sitemap';
    link.type = 'application/xml';
    link.href = '/sitemap.xml';
    document.head.appendChild(link);
}

// NEU: Feed-Links für RSS (falls später implementiert)
function addFeedLinks() {
    const rssLink = document.createElement('link');
    rssLink.rel = 'alternate';
    rssLink.type = 'application/rss+xml';
    rssLink.href = '/feed.xml';
    rssLink.title = 'AppAnwendung Blog Feed';
    document.head.appendChild(rssLink);
}

// NEU: Preload kritische Resources
function preloadResources() {
    const criticalResources = [
        { href: '/styles.css', as: 'style' },
        { href: '/main.js', as: 'script' }
    ];

    criticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = resource.href;
        link.as = resource.as;
        document.head.appendChild(link);
    });
}

// NEU: Prefetch für zukünftige Navigation
function prefetchFutureResources() {
    const futureResources = [
        '/portfolio.js',
        '/modals.js',
        '/demos.js'
    ];

    futureResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = resource;
        document.head.appendChild(link);
    });
}

// NEU: DNS Prefetch für externe Domains
function dnsPrefetch() {
    const domains = [
        'https://cdnjs.cloudflare.com',
        'https://www.googletagmanager.com',
        'https://www.google-analytics.com'
    ];

    domains.forEach(domain => {
        const link = document.createElement('link');
        link.rel = 'dns-prefetch';
        link.href = domain;
        document.head.appendChild(link);
    });
}

// NEU: Analytics Event Tracking für SEO Insights
function trackAnalyticsEvents() {
    // Scroll Depth Tracking
    let maxScroll = 0;
    window.addEventListener('scroll', () => {
        const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        if (scrollPercent > maxScroll) {
            maxScroll = scrollPercent;
            if (window.gtag && (maxScroll === 25 || maxScroll === 50 || maxScroll === 75 || maxScroll === 100)) {
                gtag('event', 'scroll', {
                    'event_label': `${Math.round(maxScroll)}% scrolled`
                });
            }
        }
    });

    // Form Interaction Tracking
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', () => {
            if (window.gtag) {
                gtag('event', 'form_submit', {
                    'event_label': form.id || 'unknown_form'
                });
            }
        });

        form.addEventListener('focus', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                if (window.gtag) {
                    gtag('event', 'form_interaction', {
                        'event_label': e.target.name || 'unknown_field'
                    });
                }
            }
        }, true);
    });

    // CTA Button Click Tracking
    const ctaButtons = document.querySelectorAll('[class*="btn-primary"]');
    ctaButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (window.gtag) {
                gtag('event', 'cta_click', {
                    'event_label': button.textContent.trim() || 'unknown_cta'
                });
            }
        });
    });
}

// NEU: Initialization (nur aufrufen wenn nötig)
document.addEventListener('DOMContentLoaded', () => {
    // lazyLoadScripts(); // Nur bei Bedarf
    // registerServiceWorker(); // Für PWA
    // trackWebVitals(); // Für Analytics
    // enhanceKeyboardNavigation(); // Für Accessibility
    respectedPrefersReducedMotion(); // Immer!
    // trackAnalyticsEvents(); // Mit Google Analytics
});

// =========================================
// EXPORTIERTE FUNKTIONEN FÜR EXTERNE NUTZUNG
// =========================================

window.SEOHelpers = {
    updateMetaTags,
    addStructuredData,
    trackAnalyticsEvents,
    trackWebVitals
};
