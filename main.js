/**
 * AppAnwendung - Main JavaScript
 * Navigation, Scroll-Effekte und globale Interaktionen
 */

'use strict';

// =========================================
// DOM ELEMENTE
// =========================================
const DOM = {
    navbar: document.getElementById('navbar'),
    navToggle: document.getElementById('navToggle'),
    navMenu: document.getElementById('navMenu'),
    navLinks: document.querySelectorAll('.nav-link'),
    backToTop: document.getElementById('backToTop'),
    modalOverlay: document.getElementById('modalOverlay'),
    statNumbers: document.querySelectorAll('.stat-number[data-count]')
};

// =========================================
// NAVIGATION
// =========================================
const Navigation = {
    init() {
        this.bindEvents();
        this.handleScroll();
    },

    bindEvents() {
        window.addEventListener('scroll', () => this.handleScroll(), { passive: true });

        if (DOM.navToggle) {
            DOM.navToggle.addEventListener('click', () => this.toggleMobile());
        }

        DOM.navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleLinkClick(e));
        });

        document.addEventListener('click', (e) => {
            if (!DOM.navMenu.contains(e.target) && !DOM.navToggle.contains(e.target)) {
                this.closeMobile();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeMobile();
            }
        });
    },

    handleScroll() {
        const scrolled = window.scrollY > 50;
        DOM.navbar.classList.toggle('scrolled', scrolled);
        this.updateActiveLink();
    },

    updateActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                DOM.navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    },

    toggleMobile() {
        const isActive = DOM.navMenu.classList.toggle('active');
        DOM.navToggle.classList.toggle('active', isActive);
        DOM.navToggle.setAttribute('aria-expanded', isActive);
        document.body.style.overflow = isActive ? 'hidden' : '';
    },

    closeMobile() {
        DOM.navMenu.classList.remove('active');
        DOM.navToggle.classList.remove('active');
        DOM.navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    },

    handleLinkClick(e) {
        const href = e.currentTarget.getAttribute('href');

        if (href.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(href);

            if (target) {
                this.closeMobile();
                const navbarHeight = DOM.navbar.offsetHeight;
                const targetPosition = target.offsetTop - navbarHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    }
};

// =========================================
// BACK TO TOP
// =========================================
const BackToTop = {
    init() {
        if (!DOM.backToTop) return;

        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY > 500;
            DOM.backToTop.classList.toggle('visible', scrolled);
        }, { passive: true });

        DOM.backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
};

// =========================================
// COUNTER ANIMATION
// =========================================
const CounterAnimation = {
    init() {
        if (DOM.statNumbers.length === 0) return;
        this.setupCounterObserver();
    },

    setupCounterObserver() {
        const options = { threshold: 0.5 };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, options);

        DOM.statNumbers.forEach(counter => observer.observe(counter));
    },

    animateCounter(element) {
        const target = parseInt(element.dataset.count, 10);
        const duration = 2000;
        const startTime = performance.now();

        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(easeOut * target);

            element.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        };

        requestAnimationFrame(updateCounter);
    }
};

// =========================================
// PARALLAX EFFEKTE
// =========================================
const ParallaxEffects = {
    init() {
        if (window.innerWidth > 768) {
            window.addEventListener('scroll', () => this.handleParallax(), { passive: true });
        }
    },

    handleParallax() {
        const scrolled = window.scrollY;
        const heroBg = document.querySelector('.hero-bg');

        if (heroBg) {
            heroBg.style.transform = `translateY(${scrolled * 0.3}px)`;
        }
    }
};

// =========================================
// UTILITY FUNKTIONEN
// =========================================
const Utils = {
    debounce(func, wait = 100) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
};

// =========================================
// INITIALISIERUNG
// =========================================
document.addEventListener('DOMContentLoaded', () => {
    Navigation.init();
    BackToTop.init();
    CounterAnimation.init();
    ParallaxEffects.init();
});

// RESIZE HANDLER
window.addEventListener('resize', Utils.debounce(() => {
    if (window.innerWidth > 768) {
        Navigation.closeMobile();
    }
}));
