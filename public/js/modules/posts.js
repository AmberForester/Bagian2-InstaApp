/**
 * InstaApp Posts & Feed Subsystem Module
 */

window.InstaAppPosts = {
    
    async loadFeed() {
        const container = document.getElementById('posts-container');
        const spinner = document.getElementById('posts-loading');

        if (!container || !spinner) return;

        spinner.classList.remove('d-none');

        try {
            const data = await this.apiFetch('/api/posts');
            spinner.classList.add('d-none');

            if (!data.data || data.data.length === 0) {
                container.innerHTML = `
                    <div class="text-center py-5 text-secondary">
                        <i class="bi bi-camera fs-1 mb-2"></i>
                        <p>Belum ada postingan. Jadilah yang pertama membuat postingan!</p>
                        <button class="btn btn-insta-primary btn-sm mt-2" onclick="app.openCreatePostModal()">
                            <i class="bi bi-plus-square me-1"></i> Buat Postingan Baru
                        </button>
                    </div>
                `;
                return;
            }

            container.innerHTML = data.data.map(post => this.renderPostCard(post)).join('');
        } catch (err) {
            spinner.classList.add('d-none');
            container.innerHTML = `<div class="alert alert-danger">Gagal memuat postingan. Silakan coba lagi.</div>`;
        }
    },

    renderPostCard(post) {
        const isLiked = post.is_liked;
        const heartClass = isLiked ? 'bi-heart-fill text-danger liked' : 'bi-heart';
        const formattedDate = new Date(post.created_at).toLocaleDateString('id-ID', {
            day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });

        // Generate comments preview list
        const commentsList = (post.comments || []).slice(0, 3).map(comment => `
            <div class="comment-item" id="comment-${comment.id}">
                <div>
                    <span class="comment-author">${comment.user?.username || 'user'}:</span>
                    <span>${this.escapeHtml(comment.comment_text)}</span>
                </div>
                ${comment.can_delete ? `
                    <button class="btn btn-link text-danger p-0 ms-2 text-decoration-none extra-small" onclick="app.deleteComment(${comment.id}, ${post.id})" title="Hapus Komentar">
                        <i class="bi bi-trash"></i>
                    </button>
                ` : ''}
            </div>
        `).join('');

        return `
            <article class="post-card" id="post-card-${post.id}">
                <!-- Post Header -->
                <div class="post-header">
                    <a href="#" class="post-author" onclick="app.showProfileByUserId(${post.user.id}, event)">
                        <img src="${post.user.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(post.user.name)}" class="author-avatar" alt="${post.user.name}">
                        <div>
                            <div class="author-username">${post.user.username}</div>
                            <small class="text-secondary extra-small">${post.user.name}</small>
                        </div>
                    </a>
                    
                    ${post.can_delete ? `
                        <div class="dropdown">
                            <button class="btn btn-link text-light p-0 border-0" type="button" data-bs-toggle="dropdown">
                                <i class="bi bi-three-dots"></i>
                            </button>
                            <ul class="dropdown-menu dropdown-menu-end bg-dark border-secondary">
                                <li>
                                    <button class="dropdown-menu-item dropdown-item text-danger small d-flex align-items-center gap-2" onclick="app.deletePost(${post.id})">
                                        <i class="bi bi-trash"></i> Hapus Postingan
                                    </button>
                                </li>
                            </ul>
                        </div>
                    ` : ''}
                </div>

                <!-- Post Image with Double Tap Heart Animation -->
                <div class="post-image-container" ondblclick="app.doubleTapLike(${post.id})">
                    <img src="${post.image_url}" class="post-image" alt="Post Image" loading="lazy">
                    <i class="bi bi-heart-fill heart-overlay" id="heart-overlay-${post.id}"></i>
                </div>

                <!-- Post Actions -->
                <div class="post-actions">
                    <div>
                        <button class="action-btn ${isLiked ? 'liked' : ''}" id="like-btn-${post.id}" onclick="app.toggleLike(${post.id})">
                            <i class="bi ${heartClass}" id="like-icon-${post.id}"></i>
                        </button>
                        <button class="action-btn" onclick="app.openCommentsModal(${post.id})">
                            <i class="bi bi-chat"></i>
                        </button>
                    </div>
                </div>

                <!-- Likes Count -->
                <div class="likes-count" id="likes-count-${post.id}">
                    ${post.likes_count} suka
                </div>

                <!-- Caption -->
                ${post.caption ? `
                    <div class="post-caption">
                        <span class="username">${post.user.username}</span>
                        <span>${this.escapeHtml(post.caption)}</span>
                    </div>
                ` : ''}

                <!-- Comments Section Preview -->
                <div class="comments-preview" id="comments-preview-${post.id}">
                    ${post.comments_count > 3 ? `
                        <button class="btn-view-comments mb-2" onclick="app.openCommentsModal(${post.id})">
                            Lihat semua ${post.comments_count} komentar
                        </button>
                    ` : ''}
                    <div id="comments-list-${post.id}">
                        ${commentsList}
                    </div>
                </div>

                <!-- Timestamp -->
                <div class="post-time">${formattedDate}</div>

                <!-- Inline Add Comment Input -->
                <form class="comment-input-group" onsubmit="app.submitInlineComment(event, ${post.id})">
                    <input type="text" class="comment-input" id="inline-comment-input-${post.id}" placeholder="Tambahkan komentar..." required>
                    <button type="submit" class="btn-post-comment">Kirim</button>
                </form>
            </article>
        `;
    },

    async doubleTapLike(postId) {
        const overlay = document.getElementById(`heart-overlay-${postId}`);
        if (overlay) {
            overlay.classList.add('animate');
            setTimeout(() => overlay.classList.remove('animate'), 600);
        }
        await this.toggleLike(postId);
    },

    async toggleLike(postId) {
        if (!this.currentUser) {
            this.showAuthModal('login');
            this.showToast('Silakan login terlebih dahulu untuk menyukai postingan.', 'danger');
            return;
        }

        try {
            const res = await this.apiFetch(`/api/posts/${postId}/like`, { method: 'POST' });
            
            const likeBtn = document.getElementById(`like-btn-${postId}`);
            const likeIcon = document.getElementById(`like-icon-${postId}`);
            const likesCountEl = document.getElementById(`likes-count-${postId}`);

            if (res.liked) {
                if (likeBtn) likeBtn.classList.add('liked');
                if (likeIcon) likeIcon.className = 'bi bi-heart-fill text-danger';
            } else {
                if (likeBtn) likeBtn.classList.remove('liked');
                if (likeIcon) likeIcon.className = 'bi bi-heart';
            }

            if (likesCountEl) likesCountEl.innerText = `${res.likes_count} suka`;
        } catch (err) {
            this.showToast('Gagal menyukai postingan.', 'danger');
        }
    },

    previewPostImage(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const previewImg = document.getElementById('imagePreview');
                const previewBox = document.getElementById('imagePreviewBox');
                if (previewImg) previewImg.src = event.target.result;
                if (previewBox) previewBox.classList.remove('d-none');
            };
            reader.readAsDataURL(file);
        }
    },
};
