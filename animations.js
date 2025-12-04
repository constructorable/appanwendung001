/**
 * AppAnwendung - Animations JavaScript
 * Scroll-Animationen und Reveal-Effekte
 */

'use strict';

// =========================================
// SCROLL ANIMATIONEN
// =========================================
const ScrollAnimations = {
    init() {
        this.setupIntersectionObserver();
    },

    // NEU: Intersection Observer für Reveal-Animationen
    setupIntersectionObserver() {
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -100px 0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal', 'active');

                    // Stagger-Effekt
                    const parent = entry.target.parentElement;
                    if (parent) {
                        const index = Array.from(parent.children).indexOf(entry.target);
                        entry.target.style.transitionDelay = `${index * 0.08}s`;
                    }
                }
            });
        }, observerOptions);

        // NEU: Alle reveal-Elemente beobachten
        const revealElements = document.querySelectorAll(
            '.branche-card, .feature-item, .prozess-step, .portfolio-card'
        );

        revealElements.forEach(element => {
            element.classList.add('reveal');
            observer.observe(element);
        });
    }
};

// =========================================
// INITIALISIERUNG
// =========================================
document.addEventListener('DOMContentLoaded', () => {
    ScrollAnimations.init();
});
