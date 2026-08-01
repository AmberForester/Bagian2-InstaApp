<!-- Auth Modal (Register / Login) -->
<div class="modal fade" id="authModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header border-0 pb-0">
                <ul class="nav nav-tabs border-0 w-100" id="authTabs" role="tablist">
                    <li class="nav-item flex-fill text-center" role="presentation">
                        <button class="nav-link active w-100 fw-bold border-0" id="login-tab" data-bs-toggle="tab" data-bs-target="#login-panel" type="button" role="tab">Masuk</button>
                    </li>
                    <li class="nav-item flex-fill text-center" role="presentation">
                        <button class="nav-link w-100 fw-bold border-0" id="register-tab" data-bs-toggle="tab" data-bs-target="#register-panel" type="button" role="tab">Daftar</button>
                    </li>
                </ul>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body p-4">
                <div class="tab-content" id="authTabsContent">
                    
                    <!-- Login Panel -->
                    <div class="tab-pane fade show active" id="login-panel" role="tabpanel">
                        <form id="loginForm" onsubmit="app.handleLogin(event)">
                            <div class="mb-3">
                                <label class="form-label small fw-semibold">Username atau Email</label>
                                <input type="text" class="form-control" id="loginIdentifier" placeholder="" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label small fw-semibold">Password</label>
                                <input type="password" class="form-control" id="loginPassword" placeholder="••••••••" required>
                            </div>
                            <div id="login-error-alert" class="alert alert-danger small d-none py-2 mb-3"></div>
                            <button type="submit" class="btn btn-insta-primary w-100 mb-3">
                                <i class="bi bi-box-arrow-in-right me-1"></i> Masuk Sekarang
                            </button>

                            <hr class="border-secondary opacity-25">
                        </form>
                    </div>

                    <!-- Register Panel -->
                    <div class="tab-pane fade" id="register-panel" role="tabpanel">
                        <form id="registerForm" onsubmit="app.handleRegister(event)">
                            <div class="mb-3">
                                <label class="form-label small fw-semibold">Nama Lengkap</label>
                                <input type="text" class="form-control" id="regName" placeholder="Contoh: Amber Forester" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label small fw-semibold">Username</label>
                                <input type="text" class="form-control" id="regUsername" placeholder="amberforester" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label small fw-semibold">Alamat Email</label>
                                <input type="email" class="form-control" id="regEmail" placeholder="amber@example.com" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label small fw-semibold">Password</label>
                                <input type="password" class="form-control" id="regPassword" placeholder="Minimal 6 karakter" required minlength="6">
                            </div>
                            <div class="mb-3">
                                <label class="form-label small fw-semibold">Konfirmasi Password</label>
                                <input type="password" class="form-control" id="regPasswordConfirm" placeholder="Ulangi password" required minlength="6">
                            </div>
                            <div id="register-error-alert" class="alert alert-danger small d-none py-2 mb-3"></div>
                            <button type="submit" class="btn btn-insta-primary w-100">
                                <i class="bi bi-person-plus me-1"></i> Buat Akun Baru
                            </button>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    </div>
</div>
