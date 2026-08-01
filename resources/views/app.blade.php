<!DOCTYPE html>
<html lang="id" data-bs-theme="dark">
<head>
    @include('layouts.head')
</head>
<body>

    <!-- Desktop Navigation Sidebar -->
    @include('layouts.sidebar')

    <!-- Main Content Container -->
    <main class="insta-main-content mx-auto">
        
        @include('posts.feed')

        <!-- Profile Subsystem -->
        @include('profile.index')
    </main>

    <!-- Scripts -->
    @include('layouts.scripts')

</body>
</html>

