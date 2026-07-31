<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;

class PostController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $currentUser = Auth::user();

        $posts = Post::with(['user', 'comments.user'])
            ->withCount(['likes', 'comments'])
            ->latest()
            ->paginate(15);

        // Transform post data to include permission flags and is_liked status
        $posts->getCollection()->transform(function ($post) use ($currentUser) {
            $post->is_liked = $currentUser ? $post->isLikedBy($currentUser) : false;
            $post->can_delete = $currentUser ? ($currentUser->id === $post->user_id) : false;
            
            // Format comments with permission flag
            $post->comments->transform(function ($comment) use ($currentUser, $post) {
                $comment->can_delete = $currentUser ? ($currentUser->id === $comment->user_id || $currentUser->id === $post->user_id) : false;
                return $comment;
            });

            return $post;
        });

        return response()->json($posts);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:10240', // Max 10MB
            'caption' => 'nullable|string|max:2000',
        ]);

        $path = $request->file('image')->store('posts', 'public');

        $post = Post::create([
            'user_id' => Auth::id(),
            'caption' => $validated['caption'] ?? null,
            'image_path' => $path,
        ]);

        $post->load(['user']);
        $post->likes_count = 0;
        $post->comments_count = 0;
        $post->is_liked = false;
        $post->can_delete = true;
        $post->comments = [];

        return response()->json([
            'message' => 'Postingan berhasil dibuat!',
            'post' => $post,
        ], 201);
    }

    public function show(Post $post): JsonResponse
    {
        $currentUser = Auth::user();

        $post->load(['user', 'comments.user']);
        $post->loadCount(['likes', 'comments']);
        $post->is_liked = $currentUser ? $post->isLikedBy($currentUser) : false;
        $post->can_delete = $currentUser ? ($currentUser->id === $post->user_id) : false;

        $post->comments->transform(function ($comment) use ($currentUser, $post) {
            $comment->can_delete = $currentUser ? ($currentUser->id === $comment->user_id || $currentUser->id === $post->user_id) : false;
            return $comment;
        });

        return response()->json($post);
    }

    public function destroy(Post $post): JsonResponse
    {
        if (Gate::denies('delete', $post)) {
            return response()->json([
                'message' => 'Anda tidak memiliki hak akses untuk menghapus postingan ini.'
            ], 403);
        }

        // Delete image file from storage
        if (Storage::disk('public')->exists($post->image_path)) {
            Storage::disk('public')->delete($post->image_path);
        }

        $post->delete();

        return response()->json([
            'message' => 'Postingan berhasil dihapus.'
        ]);
    }
}
