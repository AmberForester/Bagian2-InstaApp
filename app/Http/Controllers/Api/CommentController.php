<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Comment;
use App\Models\Post;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;

class CommentController extends Controller
{
    public function index(Post $post): JsonResponse
    {
        $currentUser = Auth::user();

        $comments = $post->comments()
            ->with('user')
            ->latest()
            ->get()
            ->map(function ($comment) use ($currentUser, $post) {
                $comment->can_delete = $currentUser ? ($currentUser->id === $comment->user_id || $currentUser->id === $post->user_id) : false;
                return $comment;
            });

        return response()->json($comments);
    }

    public function store(Request $request, Post $post): JsonResponse
    {
        $validated = $request->validate([
            'comment_text' => 'required|string|max:1000',
        ]);

        $comment = Comment::create([
            'user_id' => Auth::id(),
            'post_id' => $post->id,
            'comment_text' => $validated['comment_text'],
        ]);

        $comment->load('user');
        $comment->can_delete = true;

        return response()->json([
            'message' => 'Komentar berhasil ditambahkan.',
            'comment' => $comment,
            'comments_count' => $post->comments()->count()
        ], 201);
    }

    public function destroy(Comment $comment): JsonResponse
    {
        if (Gate::denies('delete', $comment)) {
            return response()->json([
                'message' => 'Anda tidak memiliki hak akses untuk menghapus komentar ini.'
            ], 403);
        }

        $postId = $comment->post_id;
        $comment->delete();

        $remainingCount = Comment::where('post_id', $postId)->count();

        return response()->json([
            'message' => 'Komentar berhasil dihapus.',
            'comments_count' => $remainingCount
        ]);
    }
}
