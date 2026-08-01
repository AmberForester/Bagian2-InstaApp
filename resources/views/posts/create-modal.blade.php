<!-- Create Post Modal -->
<div class="modal fade" id="createPostModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title fw-bold"><i class="bi bi-plus-circle me-2"></i> Buat Postingan Baru</h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <form id="createPostForm" onsubmit="app.handleCreatePost(event)">
                <div class="modal-body">
                    <!-- Image Upload Input -->
                    <div class="mb-3">
                        <label class="form-label fw-semibold">Pilih Foto Postingan</label>
                        <input type="file" class="form-control" id="postImageInput" accept="image/*" required onchange="app.previewPostImage(event)">
                    </div>

                    <!-- Image Preview Box -->
                    <div id="imagePreviewBox" class="mb-3 text-center d-none">
                        <img id="imagePreview" src="" class="img-fluid rounded border border-secondary" style="max-height: 350px; object-fit: cover;">
                    </div>

                    <!-- Caption Textarea -->
                    <div class="mb-3">
                        <label for="postCaptionInput" class="form-label fw-semibold">Tulis Teks Caption</label>
                        <textarea class="form-control" id="postCaptionInput" rows="3" placeholder="Tulis caption menarik untuk momen Anda..."></textarea>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Batal</button>
                    <button type="submit" class="btn btn-insta-primary" id="btnSubmitPost">
                        <i class="bi bi-send me-1"></i> Bagikan Postingan
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>
