<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\BlogCategory;
use App\Models\BlogPost;
use App\Models\User;

class BlogSeeder extends Seeder
{
    public function run(): void
    {
        // Ensure we have a user
        $user = User::first();
        
        if (!$user) {
             // Create a dummy user if none exists
             $user = User::create([
                'name' => 'Demo Admin',
                'email' => 'admin@demo.com',
                'password' => bcrypt('password'),
             ]);
        }

        // Create Categories
        $resumeTips = BlogCategory::updateOrCreate(
            ['slug' => 'resume-tips'],
            [
                'name' => 'Resume Tips',
                'description' => 'Expert advice on crafting the perfect resume.'
            ]
        );

        $careerAdvice = BlogCategory::updateOrCreate(
            ['slug' => 'career-advice'],
            [
                'name' => 'Career Advice',
                'description' => 'Guides to detailed interview strategies and career growth.'
            ]
        );

        $atsStrategy = BlogCategory::updateOrCreate(
            ['slug' => 'ats-strategy'],
            [
                'name' => 'ATS Strategy',
                'description' => 'Master the Applicant Tracking System.'
            ]
        );

        // Create Posts
        BlogPost::updateOrCreate(
            ['slug' => '10-hidden-keywords-ats'],
            [
                'title' => '10 Hidden Keywords That Will Triple Your Interview Chances',
                'excerpt' => 'Stop guessing what recruiters want. We analyzed 100,000 job descriptions to find the power words that consistently beat the ATS algorithms.',
                'content' => '<h2>Why Keywords Matter</h2><p>Applicant Tracking Systems (ATS) are designed to filter out unqualified candidates. They do this by scanning for keywords found in the job description. If your resume lacks these specific terms, you might be rejected instantly, regardless of your actual qualifications.</p><h2>The Top 5 Action Verbs</h2><p>Stop using "Responsible for". Instead, use:</p><ul><li><strong>Spearheaded:</strong> Shows leadership.</li><li><strong>Orchestrated:</strong> Implies complexity.</li><li><strong>Accelerated:</strong> Demonstrates speed.</li></ul><h2>Conclusion</h2><p>Optimizing for ATS doesn\'t mean writing like a robot. It means ensuring the language you use aligns with what the machine values.</p>',
                'published_at' => now(),
                'is_featured' => true,
                'blog_category_id' => $atsStrategy->id,
                'user_id' => $user->id,
                'read_time' => '5 min read',
                'seo_title' => '10 Hidden ATS Keywords',
                'seo_description' => 'Learn the top keywords to beat the ATS.',
            ]
        );

        BlogPost::updateOrCreate(
            ['slug' => 'resume-design-trends-2024'],
            [
                'title' => 'Resume Design Trends for 2024',
                'excerpt' => 'Is your resume looking dated? Here are the modern design trends that recruiters love (and the ones they hate).',
                'content' => '<h2>Minimalism is King</h2><p>Gone are the days of cluttered layouts. 2024 is all about whitespace and clear typography.</p><h2>Two-Column Layouts</h2><p>These remain popular for fitting more content onto a single page without sacrificing readability.</p>',
                'published_at' => now()->subDays(5),
                'is_featured' => false,
                'blog_category_id' => $resumeTips->id,
                'user_id' => $user->id,
                'read_time' => '4 min read',
            ]
        );
        
        BlogPost::updateOrCreate(
            ['slug' => 'remote-interview-guide'],
            [
                'title' => 'The Ultimate Guide to Remote Interviews',
                'excerpt' => 'Remote interviews are here to stay. Master the Zoom call with these lighting, audio, and body language tips.',
                'content' => '<h2>Set the Stage</h2><p>Ensure your background is clean and professional. Avoid virtual backgrounds if possible, as they can sometimes glitch.</p><h2>Eye Contact</h2><p>Look at the camera, not the screen, to simulate eye contact.</p>',
                'published_at' => now()->subDays(10),
                'is_featured' => false,
                'blog_category_id' => $careerAdvice->id,
                'user_id' => $user->id,
                'read_time' => '7 min read',
            ]
        );
    }
}
