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
