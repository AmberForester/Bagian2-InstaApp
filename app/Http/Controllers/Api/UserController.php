<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function profile(User $user): JsonResponse
    {
        $currentUser = Auth::user();

        $user->loadCount(['posts', 'likes', 'comments']);
        
        $posts = $user->posts()
            ->withCount(['likes', 'comments'])
            ->latest()
            ->get()
            ->map(function ($post) use ($currentUser) {
                $post->is_liked = $currentUser ? $post->isLikedBy($currentUser) : false;
                $post->can_delete = $currentUser ? ($currentUser->id === $post->user_id) : false;
                return $post;
            });

        return response()->json([
            'user' => $user,
            'posts' => $posts,
        ]);
    }
}
