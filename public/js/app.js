/**
 * InstaApp Single Page Application JavaScript Core
 */

class InstaApp {
    constructor() {
        this.currentUser = null;
        const csrfMeta = document.querySelector('meta[name="csrf-token"]');
        this.csrfToken = csrfMeta ? csrfMeta.getAttribute('content') : '';
        this.authModal = null;
        this.createPostModal = null;
        this.commentsModal = null;
        this.toast = null;
        
        document.addEventListener('DOMContentLoaded', () => this.init());
    }

    async init() {
        // Initialize Bootstrap Modals & Toasts
        const authModalEl = document.getElementById('authModal');
        const createPostModalEl = document.getElementById('createPostModal');
        const commentsModalEl = document.getElementById('commentsModal');

        if (authModalEl) this.authModal = new bootstrap.Modal(authModalEl);
        if (createPostModalEl) this.createPostModal = new bootstrap.Modal(createPostModalEl);
        if (commentsModalEl) this.commentsModal = new bootstrap.Modal(commentsModalEl);

        // Check authentication state
        await this.checkAuthStatus();

        this.loadFeed();
    }
}

// Mixin Subsystem Modules into InstaApp Prototype
Object.assign(InstaApp.prototype, window.InstaAppUtils || {});
Object.assign(InstaApp.prototype, window.InstaAppAuth || {});
Object.assign(InstaApp.prototype, window.InstaAppPosts || {});
Object.assign(InstaApp.prototype, window.InstaAppComments || {});

// Instantiate Global App
const app = new InstaApp();
window.app = app;
