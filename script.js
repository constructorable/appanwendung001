/* ===========================
   NAVIGATION MODUL
   =========================== */

class Navigation {
    constructor() {
        this.hamburger = document.querySelector('.hamburger');
        this.navMenu = document.querySelector('.nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.init();
    }

    init() {
        this.hamburger?.addEventListener('click', () => this.toggleMenu());
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });
        window.addEventListener('resize', () => this.closeMenu());
    }

    toggleMenu() {
        this.hamburger.classList.toggle('active');
        this.navMenu.classList.toggle('active');
    }

    closeMenu() {
        this.hamburger.classList.remove('active');
        this.navMenu.classList.remove('active');
    }
}

/* ===========================
   FORM MODUL
   =========================== */

class FormHandler {
    constructor() {
        this.form = document.getElementById('kontaktForm');
        this.formFeedback = document.querySelector('.form-feedback');
        this.init();
    }

    init() {
        if (!this.form) return;

        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // NEU: Live-Validierung bei Input
        this.form.querySelectorAll('input, select, textarea').forEach(field => {
            field.addEventListener('blur', () => this.validateField(field));
            field.addEventListener('input', () => {
                if (field.classList.contains('error')) {
                    this.validateField(field);
                }
            });
        });
    }

    validateField(field) {
        const formGroup = field.parentElement;
        const errorMessage = formGroup.querySelector('.error-message');
        let isValid = true;
        let message = '';

        if (field.name === 'name') {
            if (field.value.trim().length < 2) {
                isValid = false;
                message = 'Name muss mindestens 2 Zeichen lang sein';
            }
        }

        if (field.name === 'email') {
            if (!this.isValidEmail(field.value)) {
                isValid = false;
                message = 'Bitte geben Sie eine gültige E-Mail-Adresse ein';
            }
        }

        if (field.name === 'telefon') {
            if (field.value && !this.isValidPhone(field.value)) {
                isValid = false;
                message = 'Ungültiges Telefonnummernformat';
            }
        }

        if (field.name === 'branche') {
            if (!field.value) {
                isValid = false;
                message = 'Bitte wählen Sie eine Branche';
            }
        }

        if (field.name === 'nachricht') {
            if (field.value.trim().length < 10) {
                isValid = false;
                message = 'Nachricht muss mindestens 10 Zeichen lang sein';
            }
        }

        if (isValid) {
            formGroup.classList.remove('error');
            errorMessage.textContent = '';
        } else {
            formGroup.classList.add('error');
            errorMessage.textContent = message;
        }

        return isValid;
    }

    isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    isValidPhone(phone) {
        const regex = /^[\d\s\-\+\(\)]+$/;
        return regex.test(phone) && phone.replace(/\D/g, '').length >= 10;
    }

    validateForm() {
        let isValid = true;
        this.form.querySelectorAll('input, select, textarea').forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        return isValid;
    }

    async handleSubmit(e) {
        e.preventDefault();

        if (!this.validateForm()) {
            this.showFeedback('Bitte füllen Sie alle erforderlichen Felder korrekt aus', 'error');
            return;
        }

        // NEU: Formular-Daten sammeln
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);

        // NEU: Loading-State
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Wird gesendet...';

        try {
            // NEU: Simulierter API-Call (später anpassbar auf echten Endpoint)
            await this.sendForm(data);
            
            this.form.reset();
            this.form.querySelectorAll('.form-group').forEach(group => {
                group.classList.remove('error');
            });
            this.showFeedback('Vielen Dank! Wir werden uns in Kürze bei Ihnen melden.', 'success');
        } catch (error) {
            this.showFeedback('Es gab einen Fehler beim Senden. Bitte versuchen Sie es später erneut.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    }

    async sendForm(data) {
        // NEU: Hier können Sie später einen echten API-Endpoint verwenden
        // z.B.: const response = await fetch('/api/kontakt', { method: 'POST', body: JSON.stringify(data) });
        // Für jetzt: Simulate delay
        return new Promise((resolve) => {
            setTimeout(resolve, 1500);
        });
    }

    showFeedback(message, type) {
        this.formFeedback.textContent = message;
        this.formFeedback.className = `form-feedback ${type}`;
        
        // NEU: Auto-hide nach 5 Sekunden
        setTimeout(() => {
            this.formFeedback.className = 'form-feedback';
        }, 5000);
    }
}

/* ===========================
   SCROLL OBSERVER MODUL
   =========================== */

class ScrollObserver {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, this.observerOptions);

        // NEU: Alle Sektionen beobachten
        document.querySelectorAll('section').forEach(section => {
            section.classList.add('section-animate');
            observer.observe(section);
        });

        // NEU: Karten in den Sektionen beobachten
        document.querySelectorAll('.lösung-card, .feature-item, .testimonial-card').forEach((card, index) => {
            card.style.animation = `fadeIn 0.6s ease-out ${index * 0.1}s both`;
        });
    }
}

/* ===========================
   SMOOTH SCROLL MODUL
   =========================== */

class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        // NEU: Verbesserte Smooth-Scroll Implementierung
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href');
                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 80; // Offset für fixed navbar
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

/* ===========================
   NAVBAR SCROLL EFFECT MODUL
   =========================== */

class NavbarScroll {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => this.handleScroll());
    }

    handleScroll() {
        if (window.scrollY > 50) {
            this.navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.12)';
        } else {
            this.navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
        }
    }
}

/* ===========================
   PERFORMANCE MODUL
   =========================== */

class PerformanceOptimizer {
    constructor() {
        this.init();
    }

    init() {
        // NEU: Lazy Loading für Bilder (falls später verwendet)
        this.observeLazyImages();

        // NEU: Debounce für Scroll-Events
        this.setupScrollOptimization();
    }

    observeLazyImages() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.add('loaded');
                        observer.unobserve(img);
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    setupScrollOptimization() {
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    // Optimized scroll handler
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }
}

/* ===========================
   ACCESSIBILITY MODUL
   =========================== */

class Accessibility {
    constructor() {
        this.init();
    }

    init() {
        // NEU: Keyboard-Navigation
        this.setupKeyboardNavigation();

        // NEU: Focus-Management
        this.setupFocusStyles();
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // ESC-Taste schliesst Mobile-Menü
            if (e.key === 'Escape') {
                const nav = new Navigation();
                nav.closeMenu();
            }

            // Tab-Navigation für Formular
            if (e.key === 'Enter' && e.target.closest('.kontakt-form')) {
                const form = e.target.closest('form');
                if (e.target.type !== 'textarea') {
                    const nextInput = form.querySelector(
                        `input:not([type="submit"]):not([type="hidden"]), select, textarea`
                    );
                    if (nextInput && nextInput !== e.target) {
                        e.preventDefault();
                        const inputs = Array.from(
                            form.querySelectorAll('input, select, textarea')
                        );
                        const currentIndex = inputs.indexOf(e.target);
                        if (inputs[currentIndex + 1]) {
                            inputs[currentIndex + 1].focus();
                        }
                    }
                }
            }
        });
    }

    setupFocusStyles() {
        // NEU: Bessere Focus-Indikatoren für Keyboard-Navigation
        const style = document.createElement('style');
        style.textContent = `
            *:focus-visible {
                outline: 2px solid var(--primary);
                outline-offset: 2px;
            }
        `;
        document.head.appendChild(style);
    }
}

/* ===========================
   FEATURE & SOLUTION MODALS
   =========================== */

class ModalHandler {
    constructor() {
        this.init();
    }

    init() {
        // NEU: Event Delegation für Modal-Trigger
        document.addEventListener('click', (e) => {
            const trigger = e.target.closest('.modal-trigger');
            if (trigger) {
                e.preventDefault();
                e.stopPropagation();
                const modalId = trigger.getAttribute('data-modal');
                console.log('Modal triggered:', modalId);
                this.openModal(modalId);
            }
        });

        // NEU: Event-Listener für Close-Buttons
        document.addEventListener('click', (e) => {
            const closeBtn = e.target.closest('.modal-close');
            if (closeBtn) {
                e.preventDefault();
                e.stopPropagation();
                const modal = closeBtn.closest('.feature-modal, .solution-modal');
                if (modal) {
                    this.closeModal(modal);
                }
            }
        });

        // NEU: Modal schließen beim Klick auf Overlay
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay')) {
                e.preventDefault();
                e.stopPropagation();
                const modal = e.target.closest('.feature-modal, .solution-modal');
                if (modal) {
                    this.closeModal(modal);
                }
            }
        });

        // NEU: ESC-Taste zum Schließen
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const activeModal = document.querySelector('.feature-modal.active, .solution-modal.active');
                if (activeModal) {
                    this.closeModal(activeModal);
                }
            }
        });
    }

    openModal(modalId) {
        // NEU: Nach Feature- UND Solution-Modal suchen
        let modal = document.querySelector(`.feature-modal[data-modal="${modalId}"]`);
        if (!modal) {
            modal = document.querySelector(`.solution-modal[data-modal="${modalId}"]`);
        }
        
        console.log('Looking for modal:', modalId, 'Found:', !!modal);
        
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            console.log('Modal opened:', modalId);
        } else {
            console.error('Modal not found:', modalId);
        }
    }

    closeModal(modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        console.log('Modal closed');
    }
}

/* NEU: Alte FeatureModal-Klasse für Kompatibilität */
class FeatureModal extends ModalHandler {}

/* ===========================
   FEATURE TOGGLE MODUL
   =========================== */

class FeatureToggle {
    constructor() {
        this.init();
    }

    init() {
        // NEU: Alle Feature-Toggle Buttons finden und Event-Listener hinzufügen
        document.querySelectorAll('.feature-toggle').forEach(button => {
            button.addEventListener('click', () => this.toggleFeature(button));
        });
    }

    toggleFeature(button) {
        const isExpanded = button.getAttribute('aria-expanded') === 'true';
        const details = button.nextElementSibling;

        if (isExpanded) {
            // Schließen
            button.setAttribute('aria-expanded', 'false');
            button.querySelector('.toggle-text').textContent = 'Details anzeigen';
            details.classList.remove('open');
        } else {
            // Öffnen
            button.setAttribute('aria-expanded', 'true');
            button.querySelector('.toggle-text').textContent = 'Details verbergen';
            details.classList.add('open');
        }
    }
}



document.addEventListener('DOMContentLoaded', () => {
    // NEU: Alle Module initialisieren
    new Navigation();
    new FormHandler();
    new ScrollObserver();
    new SmoothScroll();
    new NavbarScroll();
    new PerformanceOptimizer();
    new Accessibility();
    new ModalHandler();
    new FeatureToggle();

    // NEU: Initialisierungs-Feedback in Console
    console.log('%c✓ AppAnwendung geladen', 'color: #3d5a8c; font-weight: bold; font-size: 14px;');
});

/* ===========================
   UTILITY FUNKTIONEN
   =========================== */

// NEU: Debounce-Funktion für optimierte Event-Handling
function debounce(func, wait) {
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

// NEU: Throttle-Funktion
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// NEU: Hilfsfunktion zum Prüfen von Viewport-Größe
function isSmallScreen() {
    return window.innerWidth < 768;
}

// NEU: Dynamisches Jahr im Footer (falls verwendet)
document.addEventListener('DOMContentLoaded', () => {
    const year = new Date().getFullYear();
    const footerYear = document.querySelector('.footer-bottom p');
    if (footerYear) {
        footerYear.textContent = footerYear.textContent.replace('2024', year);
    }
});