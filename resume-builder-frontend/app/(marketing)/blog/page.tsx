'use client';

import { useState, useEffect } from 'react';
import MarketingLayout from '@/components/layout/marketing-layout';
import Link from 'next/link';
import { RevealOnScroll } from '@/components/reveal-on-scroll';
import { blogAPI } from '@/lib/api';
import { format } from 'date-fns';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function BlogPage() {
    const [posts, setPosts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [featuredPost, setFeaturedPost] = useState<any>(null);
    const [trendingPosts, setTrendingPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [postsResponse, categoriesResponse] = await Promise.all([
                    blogAPI.getAll(),
                    blogAPI.getCategories()
                ]);

                const allPosts = postsResponse.data.data;

                // Determine featured post
                let featured = allPosts.find((p: any) => p.is_featured);
                if (!featured && allPosts.length > 0) featured = allPosts[0];

                // Filter out featured from main list
                const list = allPosts.filter((p: any) => p.id !== featured?.id);

                // Simulate trending
                const trending = list.slice(0, 2);

                setFeaturedPost(featured);
                setPosts(list);
                setTrendingPosts(trending);
                setCategories(categoriesResponse.data);
            } catch (error) {
                console.error('Failed to load blog posts', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <MarketingLayout>
                <div className="py-24 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
            </MarketingLayout>
        );
    }

    // Helper functionality
    const formatDate = (dateString: string) => dateString ? format(new Date(dateString), 'MMM d, yyyy') : '';
    const getAuthorImage = (name: string) => `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff`;

    return (
        <MarketingLayout>
            <RevealOnScroll />

            {/* Blog Hero */}
            <section className="bg-white border-b border-slate-100 pt-16 pb-16 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-50 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-50 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob" style={{ animationDelay: '2s' }} />

                <div className="container mx-auto px-6 text-center relative z-10 reveal">
                    <span className="inline-block py-1 px-3 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-4">
                        The Career Blog
                    </span>
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-6">
                        Resume Tips, <span className="text-indigo-600">ATS Insights</span> & Career Advice
                    </h1>
                    <p className="text-slate-500 text-lg max-w-2xl mx-auto">
                        Master the art of job hunting with expert guides on building resumes that pass the bots and impress the humans.
                    </p>
                </div>
            </section>

            {/* Featured Post */}
            {featuredPost && (
                <section className="container mx-auto px-6 py-12">
                    <article className="relative group rounded-3xl overflow-hidden shadow-lg reveal hover:shadow-2xl transition-all duration-300">
                        <Link href={`/blog/${featuredPost.slug}`} className="block relative h-[400px] md:h-[500px]">
                            <img
                                src={featuredPost.image_url || 'https://picsum.photos/seed/resume/1200/600'}
                                alt={featuredPost.title}
                                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent opacity-90" />
                            <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full md:w-2/3">
                                {featuredPost.category && (
                                    <span className="inline-block px-3 py-1 bg-indigo-600 text-white text-xs font-bold rounded-lg mb-4">
                                        {featuredPost.category.name}
                                    </span>
                                )}
                                <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4 leading-tight group-hover:text-indigo-200 transition-colors">
                                    {featuredPost.title}
                                </h2>
                                <p className="text-slate-300 mb-6 line-clamp-2">
                                    {featuredPost.excerpt}
                                </p>
                                <div className="flex items-center gap-3 text-white/80 text-sm">
                                    <img
                                        src={getAuthorImage(featuredPost.author?.name || 'Admin')}
                                        className="w-8 h-8 rounded-full"
                                        alt={featuredPost.author?.name}
                                    />
                                    <span className="font-semibold">{featuredPost.author?.name || 'Admin'}</span>
                                    <span>•</span>
                                    <span>{formatDate(featuredPost.published_at)}</span>
                                    {featuredPost.read_time && (
                                        <>
                                            <span>•</span>
                                            <span>{featuredPost.read_time}</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </Link>
                    </article>
                </section>
            )}

            <section className="container mx-auto px-6 py-8">
                <div className="grid lg:grid-cols-12 gap-12">

                    {/* Blog Grid (Left) */}
                    <div className="lg:col-span-8">
                        <div className="grid md:grid-cols-2 gap-8 mb-12">

                            {posts.map((post, index) => (
                                <article
                                    key={index}
                                    className="blog-card bg-white rounded-2xl overflow-hidden border border-slate-100 flex flex-col h-full reveal"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <Link href={`/blog/${post.slug}`} className="block h-48 overflow-hidden relative">
                                        <img
                                            src={post.image_url || `https://picsum.photos/seed/${index}/600/400`}
                                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                                            alt={post.title}
                                        />
                                        {post.category && (
                                            <span className="absolute top-4 left-4 bg-white/90 backdrop-blur text-slate-800 text-xs font-bold px-3 py-1 rounded-full">
                                                {post.category.name}
                                            </span>
                                        )}
                                    </Link>
                                    <div className="p-6 flex flex-col flex-grow">
                                        <h3 className="text-xl font-bold text-slate-900 mb-3 hover:text-indigo-600 transition-colors">
                                            <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                                        </h3>
                                        <p className="text-slate-500 text-sm mb-4 line-clamp-2 flex-grow">
                                            {post.excerpt}
                                        </p>
                                        <div className="flex items-center justify-between text-xs text-slate-400 mt-auto pt-4 border-t border-slate-50">
                                            <span>{post.read_time}</span>
                                            <span>{formatDate(post.published_at)}</span>
                                        </div>
                                    </div>
                                </article>
                            ))}

                            {/* Inline Sponsored Content */}
                            {posts.length > 0 && (
                                <div className="md:col-span-2 my-4 reveal">
                                    <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 flex flex-col md:flex-row items-center gap-6 relative overflow-hidden">
                                        <span className="absolute top-0 right-0 bg-slate-200 text-slate-500 text-[10px] px-2 py-0.5 rounded-bl">
                                            Sponsored
                                        </span>
                                        <div className="w-full md:w-1/3 h-32 bg-slate-200 rounded-lg flex items-center justify-center text-slate-400">
                                            <i className="fa-regular fa-image text-3xl" />
                                        </div>
                                        <div className="w-full md:w-2/3 text-center md:text-left">
                                            <h4 className="font-bold text-slate-800 mb-2">Master Your Interview Skills</h4>
                                            <p className="text-sm text-slate-500 mb-4">
                                                Join our partner platform for mock interviews with real FAANG engineers.
                                            </p>
                                            <button className="text-xs font-bold text-indigo-600 uppercase tracking-wide border border-indigo-600 px-4 py-2 rounded hover:bg-indigo-600 hover:text-white transition-colors">
                                                Learn More
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>

                        {/* Pagination */}
                        <div className="flex justify-center items-center gap-2 mt-12 reveal">
                            <button className="w-10 h-10 rounded-lg border border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-600 transition-all flex items-center justify-center">
                                <i className="fa-solid fa-chevron-left" />
                            </button>
                            <button className="w-10 h-10 rounded-lg bg-indigo-600 text-white font-bold shadow-md">1</button>
                            {/* Simple pagination not implemented yet */}
                        </div>
                    </div>

                    {/* Sidebar (Right) */}
                    <aside className="lg:col-span-4 space-y-8 reveal" style={{ animationDelay: '0.2s' }}>

                        {/* Search */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                            <h4 className="font-bold text-slate-900 mb-4">Search</h4>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search articles..."
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                />
                                <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            </div>
                        </div>

                        {/* Categories */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                            <h4 className="font-bold text-slate-900 mb-4">Categories</h4>
                            <ul className="space-y-2">
                                {categories.map((category, index) => (
                                    <li key={index}>
                                        <Link
                                            href={`?category=${category.slug}`}
                                            className="flex justify-between items-center text-slate-600 hover:text-indigo-600 transition-colors group"
                                        >
                                            <span className="group-hover:translate-x-1 transition-transform">{category.name}</span>
                                            <span className="bg-slate-100 text-xs px-2 py-0.5 rounded-full text-slate-500">{category.posts_count || 0}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Ad Space */}
                        <div className="bg-slate-100 rounded-2xl h-[300px] flex flex-col items-center justify-center text-slate-400 relative overflow-hidden border border-slate-200">
                            <span className="absolute top-2 right-2 text-[10px] bg-white/50 px-2 py-0.5 rounded text-slate-500">
                                Sponsored
                            </span>
                            <i className="fa-regular fa-image text-4xl mb-2" />
                            <span className="text-sm">Ad Space (300x250)</span>
                        </div>

                        {/* Trending Now */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                            <h4 className="font-bold text-slate-900 mb-4">Trending Now</h4>
                            <div className="space-y-4">
                                {trendingPosts.map((post, index) => (
                                    <Link key={index} href={`/blog/${post.slug}`} className="flex gap-4 group">
                                        <div className="w-16 h-16 rounded-lg bg-slate-200 overflow-hidden flex-shrink-0">
                                            <img
                                                src={post.image_url || `https://picsum.photos/seed/${index + 10}/100/100`}
                                                className="w-full h-full object-cover"
                                                alt={post.title}
                                            />
                                        </div>
                                        <div>
                                            <h5 className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-2">
                                                {post.title}
                                            </h5>
                                            <span className="text-xs text-slate-400 mt-1 block">{formatDate(post.published_at)}</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                    </aside>
                </div>
            </section>
        </MarketingLayout>
    );
}
