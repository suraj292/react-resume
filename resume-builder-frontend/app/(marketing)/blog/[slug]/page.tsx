'use client';

import { useState, useEffect } from 'react';
import MarketingLayout from '@/components/layout/marketing-layout';
import Link from 'next/link';
import { blogAPI } from '@/lib/api';
import { format } from 'date-fns';
import { useParams } from 'next/navigation';

export default function BlogDetailPage() {
    const params = useParams();
    const [article, setArticle] = useState<any>(null);
    const [relatedPosts, setRelatedPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [processedHtml, setProcessedHtml] = useState('');
    const [toc, setToc] = useState<any[]>([]);

    useEffect(() => {
        const fetchPost = async () => {
            if (!params?.slug) return;

            try {
                setLoading(true);
                const response = await blogAPI.getBySlug(params.slug as string);
                const data = response.data;
                const post = data.post;

                setArticle(post);
                setRelatedPosts(data.related || []);

                // Process Content for TOC and IDs
                if (post.content) {
                    let tempToc: any[] = [];
                    // Very simple regex to find match h2 tags and inject IDs
                    // Note: This is a basic client-side transform. 
                    // ideally we use a parser, but regex works for simple structure.
                    const contentWithIds = post.content.replace(/<h2(.*?)>(.*?)<\/h2>/g, (match: string, attrs: string, title: string) => {
                        // Strip tags from title for TOC
                        const cleanTitle = title.replace(/<[^>]*>/g, '');
                        const id = 'section-' + tempToc.length;
                        tempToc.push({ id, title: cleanTitle });
                        return `<h2 id="${id}"${attrs}>${title}</h2>`;
                    });
                    setProcessedHtml(contentWithIds);
                    setToc(tempToc);
                }

            } catch (error) {
                console.error('Failed to load blog post', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [params?.slug]);

    if (loading) {
        return (
            <MarketingLayout>
                <div className="py-32 text-center min-h-[60vh]">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
            </MarketingLayout>
        );
    }

    if (!article) {
        return (
            <MarketingLayout>
                <div className="py-32 text-center min-h-[60vh]">
                    <h2 className="text-2xl font-bold text-slate-800">Article Not Found</h2>
                    <Link href="/blog" className="text-indigo-600 hover:underline mt-4 inline-block">Back to Blog</Link>
                </div>
            </MarketingLayout>
        );
    }

    const formatDate = (dateString: string) => dateString ? format(new Date(dateString), 'MMM d, yyyy') : '';
    const getAuthorImage = (name: string) => `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff`;

    return (
        <MarketingLayout>
            {/* Blog Header Hero */}
            <section className="bg-white pt-10 pb-12 border-b border-slate-100">
                <div className="container mx-auto px-6 max-w-5xl animate-fade-in">
                    <div className="text-center mb-8">
                        <Link
                            href="/blog"
                            className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold uppercase tracking-wide mb-4 hover:bg-indigo-100 transition-colors"
                        >
                            {article.category?.name || 'Blog'}
                        </Link>
                        <h1 className="text-3xl md:text-5xl font-display font-bold text-slate-900 mb-6 leading-tight">
                            {article.title}
                        </h1>

                        <div className="flex items-center justify-center gap-6 text-sm text-slate-500">
                            <div className="flex items-center gap-2">
                                <img
                                    src={getAuthorImage(article.author?.name || 'Admin')}
                                    className="w-8 h-8 rounded-full"
                                    alt={article.author?.name}
                                />
                                <span className="font-semibold text-slate-700">{article.author?.name || 'Admin'}</span>
                            </div>
                            <span>{formatDate(article.published_at)}</span>
                            {article.read_time && <span>{article.read_time}</span>}
                        </div>
                    </div>

                    <div className="w-full h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-xl">
                        <img
                            src={article.image_url || 'https://picsum.photos/seed/blog/1200/600'}
                            className="w-full h-full object-cover"
                            alt={article.title}
                        />
                    </div>
                </div>
            </section>

            <section className="container mx-auto px-6 py-12">
                <div className="grid lg:grid-cols-12 gap-12 max-w-6xl mx-auto">

                    {/* Content Area (Main) */}
                    <article className="lg:col-span-8 prose prose-lg prose-slate max-w-none animate-fade-in" style={{ animationDelay: '0.1s' }}>

                        {article.excerpt && (
                            <p className="lead text-xl text-slate-500 font-light mb-8">
                                {article.excerpt}
                            </p>
                        )}

                        <div className="mt-6" dangerouslySetInnerHTML={{ __html: processedHtml }} />

                        {/* Author Box */}
                        <div className="mt-12 not-prose bg-indigo-50 rounded-2xl p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 border border-indigo-100">
                            <img
                                src={getAuthorImage(article.author?.name || 'Admin')}
                                className="w-20 h-20 rounded-full border-4 border-white shadow-sm"
                                alt={article.author?.name}
                            />
                            <div className="text-center sm:text-left">
                                <h3 className="text-lg font-bold text-slate-900 mb-2">About {article.author?.name || 'Author'}</h3>
                                <p className="text-slate-600 text-sm mb-4">
                                    {article.author?.bio || `Professional writer and career expert sharing insights on resume building and job market trends.`}
                                </p>
                            </div>
                        </div>

                        {/* Share Buttons */}
                        <div className="mt-8 pt-8 border-t border-slate-200 flex items-center justify-between not-prose">
                            <span className="font-bold text-slate-700">Share this article:</span>
                            <div className="flex gap-3">
                                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-transform hover:-translate-y-1">
                                    <i className="fa-brands fa-linkedin mr-2" /> LinkedIn
                                </button>
                                <button className="px-4 py-2 bg-sky-500 text-white rounded-lg text-sm font-bold hover:bg-sky-600 transition-transform hover:-translate-y-1">
                                    <i className="fa-brands fa-twitter mr-2" /> Twitter
                                </button>
                                <button className="px-4 py-2 bg-blue-800 text-white rounded-lg text-sm font-bold hover:bg-blue-900 transition-transform hover:-translate-y-1">
                                    <i className="fa-brands fa-facebook mr-2" /> Facebook
                                </button>
                            </div>
                        </div>

                    </article>

                    {/* Sidebar (Right) */}
                    <aside className="lg:col-span-4 space-y-8">

                        {/* Table of Contents (Sticky) */}
                        {toc.length > 0 && (
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 sticky top-24">
                                <h4 className="font-bold text-slate-900 mb-4 uppercase text-xs tracking-wider">
                                    Table of Contents
                                </h4>
                                <ul className="space-y-3 text-sm border-l-2 border-slate-100 ml-1">
                                    {toc.map((item) => (
                                        <li key={item.id}>
                                            <a
                                                href={`#${item.id}`}
                                                className="block pl-4 text-slate-600 hover:text-indigo-600 hover:border-l-2 hover:border-indigo-600 -ml-[2px] transition-all"
                                            >
                                                {item.title}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Newsletter */}
                        <div className="bg-indigo-600 p-6 rounded-2xl text-white text-center">
                            <i className="fa-regular fa-paper-plane text-3xl mb-3 opacity-80" />
                            <h4 className="font-bold text-lg mb-2">Weekly Career Tips</h4>
                            <p className="text-indigo-100 text-xs mb-4">Join 50,000+ subscribers getting resume advice.</p>
                            <input
                                type="email"
                                placeholder="Email address"
                                className="w-full px-4 py-2 rounded-lg text-slate-900 text-sm mb-2 focus:outline-none"
                            />
                            <button className="w-full py-2 bg-slate-900 rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors">
                                Subscribe
                            </button>
                        </div>

                        {/* AdSense Sidebar */}
                        <div className="bg-slate-100 rounded-2xl h-[400px] flex items-center justify-center text-slate-400 border border-slate-200 relative">
                            <span className="absolute top-2 right-2 text-[10px] bg-white/50 px-2 py-0.5 rounded text-slate-500">
                                Sponsored
                            </span>
                            <div className="text-center">
                                <i className="fa-solid fa-ad text-3xl mb-2" />
                                <p className="text-sm">Vertical Ad Unit</p>
                            </div>
                        </div>

                    </aside>
                </div>
            </section>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
                <section className="bg-slate-50 py-16 border-t border-slate-200">
                    <div className="container mx-auto px-6 max-w-6xl">
                        <h3 className="text-2xl font-bold text-slate-900 mb-8">Read Next</h3>
                        <div className="grid md:grid-cols-3 gap-8">
                            {relatedPosts.map((post, index) => (
                                <Link
                                    key={index}
                                    href={`/blog/${post.slug}`}
                                    className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
                                >
                                    <div className="h-48 overflow-hidden">
                                        <img
                                            src={post.image_url || `https://picsum.photos/seed/${index + 50}/400/300`}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                            alt={post.title}
                                        />
                                    </div>
                                    <div className="p-5">
                                        <h4 className="font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                                            {post.title}
                                        </h4>
                                        <p className="text-xs text-slate-500">{formatDate(post.published_at)} • {post.read_time}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </MarketingLayout>
    );
}
