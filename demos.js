/**
 * AppAnwendung - Demos JavaScript
 * Interaktive Demo-Effekte und simulierte Funktionalitäten
 */

'use strict';

// =========================================
// DEMO VERWALTUNG
// =========================================
const DemoManager = {
    demos: {},

    init() {
        this.setupDemos();
        this.bindDemoInteractions();
    },

    // NEU: Alle Demos initialisieren
    setupDemos() {
        this.demos = {
            steuerberater: new SteuerberaterDemo(),
            logopaedie: new LogopädieDemo(),
            immobilien: new ImmobilienDemo(),
            schreiner: new SchreinerDemo(),
            gartenbau: new GartenbauDemo()
        };
    },

    // NEU: Demo-Interaktionen binden
    bindDemoInteractions() {
        // Auf Modal-Öffnung warten und Demo aktivieren
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                if (mutation.type === 'class') {
                    const modal = mutation.target;
                    if (modal.classList.contains('active')) {
                        this.activateDemo(modal.id);
                    }
                }
            });
        });

        document.querySelectorAll('.modal').forEach(modal => {
            observer.observe(modal, { attributes: true, attributeFilter: ['class'] });
        });
    },

    // NEU: Demo aktivieren basierend auf Modal
    activateDemo(modalId) {
        const demoType = modalId.replace('modal-', '');
        const demo = this.demos[demoType];
        if (demo) {
            demo.activate();
        }
    }
};

// =========================================
// DEMO: STEUERBERATER
// =========================================
class SteuerberaterDemo {
    activate() {
        this.animateMandantenTable();
    }

    // NEU: Mandanten-Tabelle animieren
    animateMandantenTable() {
        const table = document.querySelector('#tab-stb-demo table tbody');
        if (!table) return;

        const rows = table.querySelectorAll('tr');
        rows.forEach((row, index) => {
            row.style.animation = 'none';
            setTimeout(() => {
                row.style.animation = `slideIn 0.5s ease forwards`;
                row.style.animationDelay = `${index * 0.1}s`;
            }, 10);
        });
    }
}

// =========================================
// DEMO: LOGOPÄDIE
// =========================================
class LogopädieDemo {
    activate() {
        this.animateCalendar();
        this.highlightAppointment();
    }

    // NEU: Kalender-Animation
    animateCalendar() {
        const slots = document.querySelectorAll('#tab-logo-demo .calendar-slot');
        if (slots.length === 0) return;

        slots.forEach((slot, index) => {
            slot.style.animation = 'none';
            setTimeout(() => {
                slot.style.animation = `scaleIn 0.4s ease forwards`;
                slot.style.animationDelay = `${index * 0.08}s`;
            }, 10);
        });
    }

    // NEU: Termin hervorheben
    highlightAppointment() {
        const appointmentInfo = document.querySelector('#tab-logo-demo .appointment-info');
        if (appointmentInfo) {
            appointmentInfo.style.animation = 'none';
            setTimeout(() => {
                appointmentInfo.style.animation = `fadeInUp 0.6s ease forwards`;
            }, 400);
        }
    }
}

// =========================================
// DEMO: IMMOBILIEN
// =========================================
class ImmobilienDemo {
    activate() {
        this.animatePropertyCard();
        this.animateStats();
    }

    // NEU: Property-Karte animieren
    animatePropertyCard() {
        const card = document.querySelector('#tab-immo-demo .property-card');
        if (card) {
            card.style.animation = 'none';
            setTimeout(() => {
                card.style.animation = `slideInUp 0.6s ease forwards`;
            }, 10);
        }
    }

    // NEU: Statistiken animieren
    animateStats() {
        const details = document.querySelectorAll('#tab-immo-demo .property-details p');
        details.forEach((detail, index) => {
            detail.style.animation = 'none';
            setTimeout(() => {
                detail.style.animation = `fadeIn 0.4s ease forwards`;
                detail.style.animationDelay = `${index * 0.15}s`;
            }, 10);
        });
    }
}

// =========================================
// DEMO: SCHREINER
// =========================================
class SchreinerDemo {
    activate() {
        this.animateTimeline();
    }

    // NEU: Projekt-Timeline animieren
    animateTimeline() {
        const items = document.querySelectorAll('#tab-sch-demo .timeline-item');
        if (items.length === 0) return;

        items.forEach((item, index) => {
            item.style.animation = 'none';
            setTimeout(() => {
                item.style.animation = `slideInLeft 0.5s ease forwards`;
                item.style.animationDelay = `${index * 0.2}s`;
            }, 10);
        });
    }
}

// =========================================
// DEMO: GARTENBAU
// =========================================
class GartenbauDemo {
    activate() {
        this.animateTourMap();
        this.animateTourStops();
    }

    // NEU: Touren-Karte animieren
    animateTourMap() {
        const map = document.querySelector('#tab-gala-demo .map-placeholder');
        if (map) {
            map.style.animation = 'none';
            setTimeout(() => {
                map.style.animation = `fadeIn 0.6s ease forwards`;
            }, 10);
        }
    }

    // NEU: Tour-Stopps animieren
    animateTourStops() {
        const stops = document.querySelectorAll('#tab-gala-demo .stop-item');
        stops.forEach((stop, index) => {
            stop.style.animation = 'none';
            setTimeout(() => {
                stop.style.animation = `slideInRight 0.4s ease forwards`;
                stop.style.animationDelay = `${index * 0.15}s`;
            }, 10);
        });
    }
}

// =========================================
// INITIALISIERUNG
// =========================================
document.addEventListener('DOMContentLoaded', () => {
    DemoManager.init();
});
