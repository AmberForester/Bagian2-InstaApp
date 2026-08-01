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

    showAuthModal(tab = 'login') {
        const errAlert1 = document.getElementById('login-error-alert');
        const errAlert2 = document.getElementById('register-error-alert');
        if (errAlert1) errAlert1.classList.add('d-none');
        if (errAlert2) errAlert2.classList.add('d-none');

        const tabBtn = document.getElementById(`${tab}-tab`);
        if (tabBtn) {
            const tabObj = new bootstrap.Tab(tabBtn);
            tabObj.show();
        }

        if (this.authModal) {
            this.authModal.show();
        }
    },

    quickFillLogin(username, password) {
        document.getElementById('loginIdentifier').value = username;
        document.getElementById('loginPassword').value = password;
    },

    async handleLogin(e) {
        e.preventDefault();
        const login = document.getElementById('loginIdentifier').value.trim();
        const password = document.getElementById('loginPassword').value;
        const errAlert = document.getElementById('login-error-alert');

        if (errAlert) errAlert.classList.add('d-none');

        try {
            const res = await this.apiFetch('/api/login', {
                method: 'POST',
                body: JSON.stringify({ login, password })
            });

            this.currentUser = res.user;
            this.updateAuthUI();
            if (this.authModal) this.authModal.hide();
            this.loadFeed();
            this.showToast(`Selamat datang kembali, ${this.currentUser.name}! 👋`, 'success');
        } catch (err) {
            if (errAlert) {
                errAlert.innerText = err.data?.message || 'Username/email atau password salah.';
                errAlert.classList.remove('d-none');
            }
        }
    },

    async handleRegister(e) {
        e.preventDefault();
        const name = document.getElementById('regName').value.trim();
        const username = document.getElementById('regUsername').value.trim();
        const email = document.getElementById('regEmail').value.trim();
        const password = document.getElementById('regPassword').value;
        const password_confirmation = document.getElementById('regPasswordConfirm').value;
        const errAlert = document.getElementById('register-error-alert');

        if (errAlert) errAlert.classList.add('d-none');

        if (password !== password_confirmation) {
            if (errAlert) {
                errAlert.innerText = 'Konfirmasi password tidak cocok.';
                errAlert.classList.remove('d-none');
            }
            return;
        }

        try {
            const res = await this.apiFetch('/api/register', {
                method: 'POST',
                body: JSON.stringify({ name, username, email, password, password_confirmation })
            });

            this.currentUser = res.user;
            this.updateAuthUI();
            if (this.authModal) this.authModal.hide();
            this.loadFeed();
            this.showToast(`Akun berhasil dibuat! Selamat datang, ${this.currentUser.name} 🎉`, 'success');
        } catch (err) {
            if (errAlert) {
                const msg = err.data?.message || (err.data?.errors ? Object.values(err.data.errors).flat().join('<br>') : 'Gagal mendaftar.');
                errAlert.innerHTML = msg;
                errAlert.classList.remove('d-none');
            }
        }
    },

    async logout() {
        if (!confirm('Apakah Anda yakin ingin keluar?')) return;

        try {
            await this.apiFetch('/api/logout', { method: 'POST' });
            this.currentUser = null;
            this.updateAuthUI();
            this.showFeed();
            this.loadFeed();
            this.showToast('Anda telah keluar dari akun.', 'info');
        } catch (err) {
            this.showToast('Gagal logout.', 'danger');
        }
    }
};
