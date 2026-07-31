<?php

namespace App\Policies;

use App\Models\Comment;
use App\Models\User;

class CommentPolicy
{
    public function delete(User $user, Comment $comment): bool
    {
        // Allowed if the user wrote the comment OR if the user is the owner of the post
        return $user->id === $comment->user_id || $user->id === $comment->post->user_id;
    }
}
