/**
 * InstaApp Profile Subsystem Module
 */

window.InstaAppProfile = {
    showFeed(e) {
        if (e) e.preventDefault();
        const feedSection = document.getElementById('feed-section');
        const profileSection = document.getElementById('profile-section');
        const navHome = document.getElementById('nav-home');
        const navProfile = document.getElementById('nav-profile');

        if (feedSection) feedSection.classList.remove('d-none');
        if (profileSection) profileSection.classList.add('d-none');
        if (navHome) navHome.classList.add('active');
        if (navProfile) navProfile.classList.remove('active');
    },

    async showProfile(e) {
        if (e) e.preventDefault();
        if (!this.currentUser) {
            this.showAuthModal('login');
            this.showToast('Silakan login untuk melihat profil.', 'info');
            return;
        }

        await this.showProfileByUserId(this.currentUser.id);
    },

    async showProfileByUserId(userId, e) {
        if (e) e.preventDefault();

        const feedSection = document.getElementById('feed-section');
        const profileSection = document.getElementById('profile-section');
        const navHome = document.getElementById('nav-home');
        const navProfile = document.getElementById('nav-profile');

        if (feedSection) feedSection.classList.add('d-none');
        if (profileSection) profileSection.classList.remove('d-none');
        if (navHome) navHome.classList.remove('active');
        if (navProfile) navProfile.classList.add('active');

        try {
            const res = await this.apiFetch(`/api/users/${userId}`);
            const user = res.user;
            const posts = res.posts;

            const avatarImg = document.getElementById('profile-avatar-img');
            const usernameEl = document.getElementById('profile-username');
            const badgeEl = document.getElementById('profile-name-badge');
            const bioEl = document.getElementById('profile-bio-text');
            const postCountEl = document.getElementById('profile-post-count');
            const likesCountEl = document.getElementById('profile-likes-count');
            const commentsCountEl = document.getElementById('profile-comments-count');

            if (avatarImg) avatarImg.src = user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`;
            if (usernameEl) usernameEl.innerText = `@${user.username}`;
            if (badgeEl) badgeEl.innerText = user.name;
            if (bioEl) bioEl.innerText = user.bio || 'Belum ada bio.';
            if (postCountEl) postCountEl.innerText = posts.length;
            
            const totalLikes = posts.reduce((acc, p) => acc + (p.likes_count || 0), 0);
            const totalComments = posts.reduce((acc, p) => acc + (p.comments_count || 0), 0);
            if (likesCountEl) likesCountEl.innerText = totalLikes;
            if (commentsCountEl) commentsCountEl.innerText = totalComments;

            const gridContainer = document.getElementById('profile-posts-grid');
            if (!gridContainer) return;

            if (posts.length === 0) {
                gridContainer.innerHTML = `<div class="col-12 text-center py-5 text-secondary">Belum ada postingan.</div>`;
                return;
            }

            gridContainer.innerHTML = posts.map(post => `
                <div class="grid-item" onclick="app.openCommentsModal(${post.id})">
                    <img src="${post.image_url}" alt="Profile Post Image" loading="lazy">
                </div>
            `).join('');
        } catch (err) {
            this.showToast('Gagal memuat profil pengguna.', 'danger');
        }
    }
};
