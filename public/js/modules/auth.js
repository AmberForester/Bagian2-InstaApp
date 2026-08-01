/**
 * InstaApp Auth Subsystem Module
 */

window.InstaAppAuth = {
    async checkAuthStatus() {
        try {
            const res = await this.apiFetch('/api/me');
            this.currentUser = res.user;
            this.updateAuthUI();
        } catch (e) {
            this.currentUser = null;
            this.updateAuthUI();
        }
    },

    updateAuthUI() {
        const userBox = document.getElementById('auth-user-box');
        const guestBox = document.getElementById('guest-user-box');
        const profileText = document.getElementById('nav-profile-text');

        if (!userBox || !guestBox || !profileText) return;

        if (this.currentUser) {
            userBox.classList.remove('d-none');
            guestBox.classList.add('d-none');

            document.getElementById('sidebar-user-avatar').src = this.currentUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(this.currentUser.name)}`;
            document.getElementById('sidebar-user-name').innerText = this.currentUser.name;
            document.getElementById('sidebar-user-handle').innerText = `@${this.currentUser.username}`;
            profileText.innerText = `@${this.currentUser.username}`;
        } else {
            userBox.classList.add('d-none');
            guestBox.classList.remove('d-none');
            profileText.innerText = 'Profil Saya';
        }
    },

};
