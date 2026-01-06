import MarketingLayout from '@/components/layout/marketing-layout';
import Link from 'next/link';

export default function BlogPage() {
    const posts = [
        {
            title: 'How to Write an ATS-Friendly Resume in 2023',
            excerpt: 'Learn the essential tips and tricks to ensure your resume passes through Applicant Tracking Systems.',
            category: 'Resume Tips',
            date: 'Dec 15, 2023',
            slug: 'ats-friendly-resume-2023'
        },
        {
            title: '10 Common Resume Mistakes to Avoid',
            excerpt: 'Discover the most frequent resume errors that could be costing you job interviews.',
            category: 'Career Advice',
            date: 'Dec 10, 2023',
            slug: 'common-resume-mistakes'
        },
        {
            title: 'The Power of Keywords in Your Resume',
            excerpt: 'Understanding how to strategically place keywords can significantly boost your chances.',
            category: 'Job Search',
            date: 'Dec 5,  2023',
            slug: 'power-of-keywords'
        }
    ];

    return (
        <MarketingLayout>
            {/* Hero */}
            <section className="pt-20 pb-16 text-center px-6 bg-slate-50">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-6">
                        Career <span className="text-indigo-600">Insights</span> Blog
                    </h1>
                    <p className="text-slate-500 text-lg">
                        Tips, tricks, and advice to help you land your dream job
                    </p>
                </div>
            </section>

            {/* Blog Posts */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-6 max-w-4xl">
                    <div className="grid gap-8">
                        {posts.map((post, idx) => (
                            <Link
                                key={idx}
                                href={`/blog/${post.slug}`}
                                className="group p-8 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-200 hover:shadow-lg transition-all"
                            >
                                <div className="flex items-center gap-3 mb-4 text-sm">
                                    <span className="px-3 py-1 bg-indigo-100 text-indigo-600 rounded-full font-bold">
                                        {post.category}
                                    </span>
                                    <span className="text-slate-400">{post.date}</span>
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">
                                    {post.title}
                                </h2>
                                <p className="text-slate-600 mb-4">{post.excerpt}</p>
                                <div className="text-indigo-600 font-bold inline-flex items-center gap-2">
                                    Read More <i className="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </MarketingLayout>
    );
}
