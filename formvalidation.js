/**
 * AppAnwendung - Form Validation JavaScript
 * Kontaktformular-Validierung mit Live-Feedback
 */

'use strict';

// =========================================
// FORMULAR VERWALTUNG
// =========================================
const ContactForm = {
    init() {
        const form = document.getElementById('kontaktForm');
        if (!form) return;

        this.bindEvents(form);
    },

    // NEU: Event-Listener binden
    bindEvents(form) {
        form.addEventListener('submit', (e) => this.handleSubmit(e, form));

        // Input-Validierung
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearError(input));
        });
    },

    // NEU: Formular-Submit Handler
    handleSubmit(e, form) {
        e.preventDefault();

        const isValid = this.validateForm(form);
        if (!isValid) return;

        // Daten sammeln
        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });

        // Erfolgsmeldung anzeigen
        this.showSuccess(form);

        // Formular zurücksetzen
        form.reset();

        // Log für Debugging
        console.log('Formulardaten:', data);
    },

    // NEU: Formular validieren
    validateForm(form) {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    },

    // NEU: Einzelnes Feld validieren
    validateField(field) {
        const value = field.value.trim();
        const type = field.type;
        let isValid = true;
        let message = '';

        // Pflichtfeld prüfen
        if (field.required && !value) {
            isValid = false;
            message = 'Bitte füllen Sie dieses Feld aus.';
        }
        // E-Mail validieren
        else if (type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                message = 'Bitte geben Sie eine gültige E-Mail-Adresse ein.';
            }
        }

        if (!isValid) {
            this.showError(field, message);
        }

        return isValid;
    },

    // NEU: Fehler anzeigen
    showError(field, message) {
        this.clearError(field);

        field.style.borderColor = '#ef4444';

        const errorElement = document.createElement('span');
        errorElement.className = 'form-error';
        errorElement.textContent = message;
        errorElement.style.cssText = `
            display: block;
            color: #ef4444;
            font-size: 0.8rem;
            margin-top: 0.25rem;
        `;

        field.parentNode.appendChild(errorElement);
    },

    // NEU: Fehler entfernen
    clearError(field) {
        field.style.borderColor = '';
        const errorElement = field.parentNode.querySelector('.form-error');
        if (errorElement) {
            errorElement.remove();
        }
    },

    // NEU: Erfolgsmeldung anzeigen
    showSuccess(form) {
        const button = form.querySelector('button[type="submit"]');
        const originalContent = button.innerHTML;

        button.innerHTML = '<i class="fas fa-check"></i> <span>Nachricht gesendet!</span>';
        button.style.background = '#10b981';
        button.disabled = true;

        setTimeout(() => {
            button.innerHTML = originalContent;
            button.style.background = '';
            button.disabled = false;
        }, 3000);
    }
};

// =========================================
// INITIALISIERUNG
// =========================================
document.addEventListener('DOMContentLoaded', () => {
    ContactForm.init();
});
