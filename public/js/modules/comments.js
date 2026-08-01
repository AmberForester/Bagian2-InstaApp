/**
 * InstaApp Comments Subsystem Module
 */

window.InstaAppComments = {
    async submitInlineComment(e, postId) {
        e.preventDefault();
        if (!this.currentUser) {
            this.showAuthModal('login');
            this.showToast('Silakan login terlebih dahulu untuk berkomentar.', 'danger');
            return;
        }

        const input = document.getElementById(`inline-comment-input-${postId}`);
        if (!input) return;

        const commentText = input.value.trim();
        if (!commentText) return;

        try {
            const res = await this.apiFetch(`/api/posts/${postId}/comments`, {
                method: 'POST',
                body: JSON.stringify({ comment_text: commentText })
            });

            input.value = '';

            // Append comment dynamically
            const commentsListEl = document.getElementById(`comments-list-${postId}`);
            const newCommentHtml = `
                <div class="comment-item" id="comment-${res.comment.id}">
                    <div>
                        <span class="comment-author">${res.comment.user?.username || 'user'}:</span>
                        <span>${this.escapeHtml(res.comment.comment_text)}</span>
                    </div>
                    <button class="btn btn-link text-danger p-0 ms-2 text-decoration-none extra-small" onclick="app.deleteComment(${res.comment.id}, ${postId})" title="Hapus Komentar">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            `;

            if (commentsListEl) {
                commentsListEl.insertAdjacentHTML('beforeend', newCommentHtml);
            }

            this.showToast('Komentar berhasil dikirim!', 'success');
        } catch (err) {
            this.showToast('Gagal mengirim komentar.', 'danger');
        }
    },

    async openCommentsModal(postId) {
        const modalList = document.getElementById('modal-comments-list');
        const modalPostIdInput = document.getElementById('modalPostId');
        if (modalPostIdInput) modalPostIdInput.value = postId;

        if (modalList) {
            modalList.innerHTML = `<div class="text-center py-4"><div class="spinner-border spinner-border-sm text-light"></div></div>`;
        }

        if (this.commentsModal) {
            this.commentsModal.show();
        }

        try {
            const comments = await this.apiFetch(`/api/posts/${postId}/comments`);

            if (!modalList) return;

            if (comments.length === 0) {
                modalList.innerHTML = `<div class="text-center py-4 text-secondary">Belum ada komentar. Tulis komentar pertama!</div>`;
                return;
            }

            modalList.innerHTML = comments.map(comment => `
                <div class="d-flex align-items-start justify-content-between p-2 rounded bg-black bg-opacity-25" id="modal-comment-${comment.id}">
                    <div class="d-flex gap-2">
                        <img src="${comment.user?.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(comment.user?.name || 'User')}" class="author-avatar" style="width: 32px; height: 32px;">
                        <div>
                            <span class="fw-bold me-1 small">${comment.user?.username}:</span>
                            <span class="small">${this.escapeHtml(comment.comment_text)}</span>
                            <div class="text-secondary extra-small mt-1">${new Date(comment.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</div>
                        </div>
                    </div>
                    ${comment.can_delete ? `
                        <button class="btn btn-sm text-danger border-0" onclick="app.deleteComment(${comment.id}, ${postId})" title="Hapus Komentar">
                            <i class="bi bi-trash"></i>
                        </button>
                    ` : ''}
                </div>
            `).join('');
        } catch (err) {
            if (modalList) {
                modalList.innerHTML = `<div class="alert alert-danger py-2 small">Gagal memuat komentar.</div>`;
            }
        }
    },

    async handleModalCommentSubmit(e) {
        e.preventDefault();
        if (!this.currentUser) {
            if (this.commentsModal) this.commentsModal.hide();
            this.showAuthModal('login');
            return;
        }

        const postId = document.getElementById('modalPostId').value;
        const input = document.getElementById('modalCommentInput');
        if (!input) return;

        const text = input.value.trim();
        if (!text) return;

        try {
            await this.apiFetch(`/api/posts/${postId}/comments`, {
                method: 'POST',
                body: JSON.stringify({ comment_text: text })
            });

            input.value = '';
            this.openCommentsModal(postId);
            this.loadFeed(); // Refresh feed comment counter
            this.showToast('Komentar ditambahkan!', 'success');
        } catch (err) {
            this.showToast('Gagal menambahkan komentar.', 'danger');
        }
    },

    async deleteComment(commentId, postId) {
        if (!confirm('Apakah Anda yakin ingin menghapus komentar ini?')) return;

        try {
            await this.apiFetch(`/api/comments/${commentId}`, { method: 'DELETE' });

            // Remove elements if present
            const el1 = document.getElementById(`comment-${commentId}`);
            const el2 = document.getElementById(`modal-comment-${commentId}`);
            if (el1) el1.remove();
            if (el2) el2.remove();

            this.showToast('Komentar berhasil dihapus.', 'success');
        } catch (err) {
            const msg = err.data?.message || 'Gagal menghapus komentar. Otorisasi ditolak.';
            this.showToast(msg, 'danger');
        }
    }
};
