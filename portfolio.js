/**
 * AppAnwendung - Portfolio JavaScript
 * Portfolio-Filterung und interaktive Karteneffekte
 */

'use strict';

// =========================================
// PORTFOLIO VERWALTUNG
// =========================================
const Portfolio = {
    currentFilter: 'alle',

    init() {
        this.bindFilterButtons();
        this.setupCardHovers();
    },

    bindFilterButtons() {
        const filterButtons = document.querySelectorAll('.filter-btn');

        filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleFilterChange(e.target.closest('.filter-btn'));
            });
        });
    },

    // NEU: Filter-Handling mit Animationen
    handleFilterChange(btn) {
        // Aktiven Button aktualisieren
        document.querySelectorAll('.filter-btn').forEach(b => {
            b.classList.remove('active');
        });
        btn.classList.add('active');

        // Filter-Wert speichern
        this.currentFilter = btn.dataset.filter;

        // Karten filtern
        this.filterCards();
    },

    // NEU: Karten basierend auf Filter anzeigen/verbergen
    filterCards() {
        const cards = document.querySelectorAll('.portfolio-card');

        cards.forEach(card => {
            const category = card.dataset.category;
            const matches = this.currentFilter === 'alle' || category === this.currentFilter;

            if (matches) {
                card.classList.remove('hidden');
                card.classList.add('show');
                // Stagger-Animation
                setTimeout(() => {
                    card.style.animation = 'none';
                    setTimeout(() => {
                        card.style.animation = '';
                    }, 10);
                }, 10);
            } else {
                card.classList.remove('show');
                card.classList.add('hidden');
            }
        });
    },

    // NEU: Hover-Effekte für Karten
    setupCardHovers() {
        const cards = document.querySelectorAll('.portfolio-card');

        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                cards.forEach(c => {
                    if (c !== card) {
                        c.style.opacity = '0.6';
                        c.style.transform = 'scale(0.95)';
                    }
                });
            });

            card.addEventListener('mouseleave', () => {
                cards.forEach(c => {
                    if (c !== card) {
                        c.style.opacity = '1';
                        c.style.transform = 'scale(1)';
                    }
                });
            });
        });
    }
};

// =========================================
// INITIALISIERUNG
// =========================================
document.addEventListener('DOMContentLoaded', () => {
    Portfolio.init();
});
