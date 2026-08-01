<?php

namespace Database\Seeders;

use App\Models\Comment;
use App\Models\Like;
use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create Demo Users
        $arteta = User::create([
            'name' => 'Mikel Arteta',
            'username' => 'mikel_arteta',
            'email' => 'mikel@example.com',
            'password' => Hash::make('password'),
            'avatar' => 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdMay_6XWUqIi86R44yWZSILySohtwuCIngpkK6s0rww&s=10',
            'bio' => 'Premier League Manager ⚽ | Passionate about football tactics and strategy.',
        ]);

        $martin = User::create([
            'name' => 'Martin Odegaard',
            'username' => 'martin_odegaard',
            'email' => 'martin@example.com',
            'password' => Hash::make('password'),
            'avatar' => 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYCcJBya8nnv1s5pdnJ_pZCPVZdaGo3BZOkhG3H5RIiw&s=10',
            'bio' => 'Arsenal Captain | Sharing my journey on and off the pitch.',
        ]);

        $erling = User::create([
            'name' => 'Erling Haaland',
            'username' => 'erling_haaland',
            'email' => 'erling@example.com',
            'password' => Hash::make('password'),
            'avatar' => 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxgVFic4N7ev0dJ_olsHki_9_p0nrUFyFl_R6PhjFUKA&s=10',
            'bio' => 'Manchester City Striker | Football is life. Sharing my training and match experiences.',
        ]);

        // Demo Posts
        $post1 = Post::create([
            'user_id' => $arteta->id,
            'caption' => 'Premier League winner! 🏆 What a season it has been. Proud of the team and our fans!',
            'image_path' => 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdMay_6XWUqIi86R44yWZSILySohtwuCIngpkK6s0rww&s=10',
        ]);

        $post2 = Post::create([
            'user_id' => $martin->id,
            'caption' => 'Premier League winner! 🏆 What a season it has been. Proud of the team and our fans!',
            'image_path' => 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYCcJBya8nnv1s5pdnJ_pZCPVZdaGo3BZOkhG3H5RIiw&s=10',
        ]);

        $post3 = Post::create([
            'user_id' => $erling->id,
            'caption' => 'Premier League winner! 🏆 What a season it has been. Proud of the team and our fans!',
            'image_path' => 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxgVFic4N7ev0dJ_olsHki_9_p0nrUFyFl_R6PhjFUKA&s=10',
        ]);

        // Demo Likes
        Like::create(['user_id' => $arteta->id, 'post_id' => $post1->id]);
        Like::create(['user_id' => $martin->id, 'post_id' => $post1->id]);
        Like::create(['user_id' => $erling->id, 'post_id' => $post2->id]);
        Like::create(['user_id' => $erling->id, 'post_id' => $post3->id]);
        Like::create(['user_id' => $arteta->id, 'post_id' => $post3->id]);

        // Demo Comments
        Comment::create([
            'user_id' => $arteta->id,
            'post_id' => $post1->id,
            'comment_text' => '🔥',
        ]);

        Comment::create([
            'user_id' => $martin->id,
            'post_id' => $post1->id,
            'comment_text' => 'COYG🔥',
        ]);

        Comment::create([
            'user_id' => $erling->id,
            'post_id' => $post2->id,
            'comment_text' => 'What a wonderfull season!🔥',
        ]);
    }
}
