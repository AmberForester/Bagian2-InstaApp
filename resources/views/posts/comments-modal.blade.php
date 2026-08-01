<!-- Comments Modal -->
<div class="modal fade" id="commentsModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title fw-bold"><i class="bi bi-chat-dots me-2"></i> Komentar Postingan</h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body p-3">
                <div id="modal-comments-list" class="d-flex flex-column gap-3">
                    <!-- Dynamic list of comments -->
                </div>
            </div>
            <div class="modal-footer p-2">
                <form id="modalCommentForm" class="w-100 d-flex gap-2" onsubmit="app.handleModalCommentSubmit(event)">
                    <input type="hidden" id="modalPostId">
                    <input type="text" class="form-control" id="modalCommentInput" placeholder="Tambahkan komentar..." required>
                    <button type="submit" class="btn btn-insta-primary px-3">
                        <i class="bi bi-send-fill"></i>
                    </button>
                </form>
            </div>
        </div>
    </div>
</div>
