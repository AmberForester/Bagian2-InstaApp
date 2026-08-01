<!-- Desktop Navigation Sidebar -->
<aside class="insta-sidebar">
    <a href="#" class="insta-logo" onclick="app.showFeed(event)">
        <i class=" insta-logo-icon"></i> InstaApp
    </a>

    <nav class="nav flex-column gap-1 my-auto">
        <a href="#" class="nav-link-insta active" id="nav-home" onclick="app.showFeed(event)">
            <i class="bi bi-house-door-fill"></i> <span>Beranda</span>
        </a>
        <a href="#" class="nav-link-insta" id="nav-create" onclick="app.openCreatePostModal(event)">
            <i class="bi bi-plus-square"></i> <span>Buat Postingan</span>
        </a>
        <a href="#" class="nav-link-insta" id="nav-profile" onclick="app.showProfile(event)">
            <i class="bi bi-person-circle"></i> <span id="nav-profile-text">Profil Saya</span>
        </a>
    </nav>

    <div class="mt-auto border-top border-secondary border-opacity-25 pt-3">
        <div id="auth-user-box" class="d-none">
            <div class="d-flex align-items-center justify-content-between">
                <div class="d-flex align-items-center gap-2 overflow-hidden">
                    <img id="sidebar-user-avatar" src="" class="author-avatar" alt="Avatar">
                    <div class="text-truncate">
                        <div id="sidebar-user-name" class="fw-bold small text-truncate">User</div>
                        <div id="sidebar-user-handle" class="text-secondary extra-small text-truncate">@user</div>
                    </div>
                </div>
                <button class="btn btn-sm btn-outline-danger border-0 ms-1" onclick="app.logout()" title="Logout">
                    <i class="bi bi-box-arrow-right fs-5"></i>
                </button>
            </div>
        </div>

        <div id="guest-user-box">
            <button class="btn btn-insta-primary w-100 mb-2" onclick="app.showAuthModal('login')">
                <i class="bi bi-box-arrow-in-right me-1"></i> Masuk
            </button>
            <button class="btn btn-outline-light w-100 btn-sm" onclick="app.showAuthModal('register')">
                Daftar Akun
            </button>
        </div>
    </div>
</aside>
