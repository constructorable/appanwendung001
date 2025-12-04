/**
 * AppAnwendung - Modals JavaScript
 * Modal-Management mit Tab-Navigation und Animation
 */

'use strict';

// =========================================
// MODAL VERWALTUNG
// =========================================
const ModalManager = {
    currentModal: null,

    init() {
        this.bindTriggers();
        this.bindClosers();
        this.bindOverlay();
        this.bindTabs();
    },

    // NEU: Modal-Trigger binden
    bindTriggers() {
        // Portfolio-Karten Buttons
        const demoButtons = document.querySelectorAll('[data-modal]');
        demoButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const modalId = btn.dataset.modal;
                this.openModal(`modal-${modalId}`);
            });
        });
    },

    // NEU: Modal-Closer binden
    bindClosers() {
        const closeButtons = document.querySelectorAll('.modal-close');
        closeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const modalId = btn.dataset.close;
                this.closeModal(modalId);
            });
        });
    },

    // NEU: Overlay-Click zum Schließen
    bindOverlay() {
        const overlay = document.getElementById('modalOverlay');
        if (overlay) {
            overlay.addEventListener('click', () => {
                if (this.currentModal) {
                    this.closeModal(this.currentModal.id);
                }
            });
        }
    },

    // NEU: Tab-Navigation
    bindTabs() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.switchTab(btn);
            });
        });
    },

    // NEU: Modal öffnen mit Animation
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;

        // Alle Modals schließen
        if (this.currentModal) {
            this.closeModal(this.currentModal.id);
        }

        this.currentModal = modal;
        const overlay = document.getElementById('modalOverlay');

        // Body-Scroll verhindern
        document.body.style.overflow = 'hidden';

        // Overlay anzeigen
        if (overlay) {
            overlay.classList.add('active');
        }

        // Modal anzeigen mit Animation
        modal.classList.add('active');

        // Fokus auf Modal
        modal.focus();

        // ESC-Taste zum Schließen
        document.addEventListener('keydown', this.handleEscKey.bind(this));
    },

    // NEU: Modal schließen mit Animation
    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;

        const overlay = document.getElementById('modalOverlay');

        // Modal ausblenden
        modal.classList.remove('active');

        // Overlay ausblenden
        if (overlay) {
            overlay.classList.remove('active');
        }

        // Body-Scroll wiederherstellen
        document.body.style.overflow = '';

        this.currentModal = null;

        // ESC-Listener entfernen
        document.removeEventListener('keydown', this.handleEscKey.bind(this));
    },

    // NEU: ESC-Taste Handler
    handleEscKey(e) {
        if (e.key === 'Escape' && this.currentModal) {
            this.closeModal(this.currentModal.id);
        }
    },

    // NEU: Tab wechseln
    switchTab(btn) {
        const tabId = btn.dataset.tab;
        const modal = btn.closest('.modal');

        if (!modal) return;

        // Button aktivieren
        const tabButtons = modal.querySelectorAll('.tab-btn');
        tabButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Tab-Content anzeigen
        const tabContents = modal.querySelectorAll('.tab-content');
        tabContents.forEach(content => {
            content.classList.remove('active');
        });

        const activeTab = document.getElementById(tabId);
        if (activeTab) {
            activeTab.classList.add('active');
        }
    }
};

// =========================================
// INITIALISIERUNG
// =========================================
document.addEventListener('DOMContentLoaded', () => {
    ModalManager.init();
});
