<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\BlogPost;
use App\Models\BlogCategory;

class BlogController extends Controller
{
    public function index(Request $request)
    {
        $query = BlogPost::with(['category', 'author:id,name'])->published();

        if ($request->has('category') && $request->category !== 'all') {
            $query->whereHas('category', function ($q) use ($request) {
                $q->where('slug', $request->category);
            });
        }

        if ($request->has('search')) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }
        
        if ($request->boolean('featured')) {
            $query->featured();
        }

        // Handle trending logic if needed (e.g. by views? For now random or recent)
        // Only return published
        
        return response()->json($query->orderByDesc('published_at')->paginate(12));
    }

    public function show($slug)
    {
        $post = BlogPost::with(['category', 'author:id,name'])
            ->where('slug', $slug)
            ->published()
            ->firstOrFail();

        // Get related posts
        $related = BlogPost::where('blog_category_id', $post->blog_category_id)
            ->where('id', '!=', $post->id)
            ->published()
            ->limit(3)
            ->get();

        return response()->json([
            'post' => $post,
            'related' => $related
        ]);
    }

    public function categories()
    {
        $categories = BlogCategory::withCount('posts')->get();
        return response()->json($categories);
    }
}
