<?php

namespace Database\Seeders;

use App\Models\PageSeo;
use Illuminate\Database\Seeder;

class PageSeoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $pages = [
            [
                'page_route' => '/',
                'page_name' => 'Home',
                'is_published' => true,
                'meta_title' => 'AI Resume Builder - Create Professional Resumes in Minutes',
                'meta_description' => 'Build your perfect resume with our AI-powered resume builder. Choose from professional templates, get ATS-friendly formatting, and land your dream job faster.',
                'meta_keywords' => 'resume builder, AI resume, professional resume, ATS resume, job application',
                'og_title' => 'AI Resume Builder - Create Professional Resumes in Minutes',
                'og_description' => 'Build your perfect resume with our AI-powered resume builder. Choose from professional templates and land your dream job faster.',
                'og_type' => 'website',
                'twitter_card' => 'summary_large_image',
                'robots' => 'index, follow',
                'language' => 'en',
                'priority' => 10,
            ],
            [
                'page_route' => '/pricing',
                'page_name' => 'Pricing',
                'is_published' => true,
                'meta_title' => 'Pricing Plans - AI Resume Builder',
                'meta_description' => 'Choose the perfect plan for your needs. Free, Pro, and Premium options available with unlimited resumes, ATS checking, and AI-powered features.',
                'meta_keywords' => 'resume builder pricing, subscription plans, resume templates',
                'og_title' => 'Pricing Plans - AI Resume Builder',
                'og_description' => 'Choose the perfect plan for your needs. Free, Pro, and Premium options available.',
                'og_type' => 'website',
                'twitter_card' => 'summary_large_image',
                'robots' => 'index, follow',
                'language' => 'en',
                'priority' => 9,
            ],
            [
                'page_route' => '/ats-checker',
                'page_name' => 'ATS Checker',
                'is_published' => true,
                'meta_title' => 'Free ATS Resume Checker - Optimize Your Resume',
                'meta_description' => 'Check if your resume is ATS-friendly. Get instant feedback and optimization tips to pass applicant tracking systems and land more interviews.',
                'meta_keywords' => 'ATS checker, resume scanner, applicant tracking system, resume optimization',
                'og_title' => 'Free ATS Resume Checker - Optimize Your Resume',
                'og_description' => 'Check if your resume is ATS-friendly and get instant optimization tips.',
                'og_type' => 'website',
                'twitter_card' => 'summary_large_image',
                'robots' => 'index, follow',
                'language' => 'en',
                'priority' => 8,
            ],
            [
                'page_route' => '/contact',
                'page_name' => 'Contact',
                'is_published' => true,
                'meta_title' => 'Contact Us - AI Resume Builder Support',
                'meta_description' => 'Get in touch with our support team. We\'re here to help you create the perfect resume and answer any questions you may have.',
                'meta_keywords' => 'contact, support, help, customer service',
                'og_title' => 'Contact Us - AI Resume Builder Support',
                'og_description' => 'Get in touch with our support team for help with your resume.',
                'og_type' => 'website',
                'twitter_card' => 'summary',
                'robots' => 'index, follow',
                'language' => 'en',
                'priority' => 6,
            ],
            [
                'page_route' => '/about',
                'page_name' => 'About',
                'is_published' => true,
                'meta_title' => 'About Us - AI Resume Builder',
                'meta_description' => 'Learn about our mission to help job seekers create professional resumes and land their dream jobs with AI-powered tools.',
                'meta_keywords' => 'about us, company, mission, resume builder',
                'og_title' => 'About Us - AI Resume Builder',
                'og_description' => 'Learn about our mission to help job seekers land their dream jobs.',
                'og_type' => 'website',
                'twitter_card' => 'summary',
                'robots' => 'index, follow',
                'language' => 'en',
                'priority' => 5,
            ],
            [
                'page_route' => '/faq',
                'page_name' => 'FAQ',
                'is_published' => true,
                'meta_title' => 'Frequently Asked Questions - AI Resume Builder',
                'meta_description' => 'Find answers to common questions about our resume builder, pricing, features, and more. Get help with creating your perfect resume.',
                'meta_keywords' => 'FAQ, questions, help, support, resume builder',
                'og_title' => 'Frequently Asked Questions - AI Resume Builder',
                'og_description' => 'Find answers to common questions about our resume builder.',
                'og_type' => 'website',
                'twitter_card' => 'summary',
                'robots' => 'index, follow',
                'language' => 'en',
                'priority' => 6,
            ],
            [
                'page_route' => '/privacy',
                'page_name' => 'Privacy Policy',
                'is_published' => true,
                'meta_title' => 'Privacy Policy - AI Resume Builder',
                'meta_description' => 'Read our privacy policy to understand how we collect, use, and protect your personal information when using our resume builder.',
                'meta_keywords' => 'privacy policy, data protection, GDPR, privacy',
                'og_title' => 'Privacy Policy - AI Resume Builder',
                'og_description' => 'Read our privacy policy to understand how we protect your data.',
                'og_type' => 'website',
                'twitter_card' => 'summary',
                'robots' => 'index, follow',
                'language' => 'en',
                'priority' => 4,
            ],
            [
                'page_route' => '/terms',
                'page_name' => 'Terms of Service',
                'is_published' => true,
                'meta_title' => 'Terms of Service - AI Resume Builder',
                'meta_description' => 'Read our terms of service to understand the rules and guidelines for using our AI-powered resume builder platform.',
                'meta_keywords' => 'terms of service, terms and conditions, legal, agreement',
                'og_title' => 'Terms of Service - AI Resume Builder',
                'og_description' => 'Read our terms of service and usage guidelines.',
                'og_type' => 'website',
                'twitter_card' => 'summary',
                'robots' => 'index, follow',
                'language' => 'en',
                'priority' => 4,
            ],
        ];

        foreach ($pages as $page) {
            PageSeo::updateOrCreate(
                ['page_route' => $page['page_route']],
                $page
            );
        }

        $this->command->info('Page SEO data seeded successfully!');
    }
}
