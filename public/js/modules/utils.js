/**
 * InstaApp Utility Module
 */

window.InstaAppUtils = {
    async apiFetch(url, options = {}) {
        const headers = {
            'X-CSRF-TOKEN': this.csrfToken,
            'Accept': 'application/json',
            ...(options.headers || {})
        };

        if (!(options.body instanceof FormData) && !headers['Content-Type']) {
            headers['Content-Type'] = 'application/json';
        }

        try {
            const response = await fetch(url, { ...options, headers });
            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                if (response.status === 401) {
                    this.currentUser = null;
                    this.updateAuthUI();
                }
                throw { status: response.status, data };
            }

            return data;
        } catch (err) {
            console.error('API Error:', err);
            throw err;
        }
    },

    showToast(message, type = 'info') {
        const toastEl = document.getElementById('liveToast');
        const toastMessage = document.getElementById('toastMessage');
        const toastIcon = document.getElementById('toastIcon');

        if (!toastEl || !toastMessage || !toastIcon) return;

        toastMessage.innerText = message;
        toastIcon.className = type === 'success' 
            ? 'bi bi-check-circle-fill text-success fs-5'
            : type === 'danger' 
            ? 'bi bi-exclamation-triangle-fill text-danger fs-5' 
            : 'bi bi-info-circle-fill text-info fs-5';

        if (this.toast) {
            this.toast.show();
        }
    },

    escapeHtml(text) {
        if (!text) return '';
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
};
