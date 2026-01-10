'use client';

import MarketingLayout from '@/components/layout/marketing-layout';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ROUTES } from '@/lib/routes';
import { useSEO } from '@/hooks/useSEO';

interface FAQItem {
    question: string;
    answer: string;
    category: 'general' | 'ats' | 'pricing' | 'security';
}

const faqs: FAQItem[] = [
    {
        question: 'What is an ATS-friendly resume?',
        answer: 'An ATS (Applicant Tracking System) friendly resume is formatted in a way that allows software to easily read and parse your information. This means avoiding complex layouts, graphics, and unreadable fonts so that your skills and experience are correctly identified by the system used by recruiters.',
        category: 'general',
    },
    {
        question: 'How does the AI optimization work?',
        answer: 'Our AI analyzes millions of job descriptions to understand what recruiters are looking for. It then suggests specific keywords, action verbs, and formatting improvements for your resume to maximize your match score for your target role.',
        category: 'general',
    },
    {
        question: 'Can I upload my existing resume?',
        answer: 'Yes! You can upload your existing PDF or DOCX resume. Our system will scan it, extract the content, and give you a detailed score along with actionable tips to improve it instantly.',
        category: 'ats',
    },
    {
        question: 'Is there a free plan available?',
        answer: 'Absolutely. Our Free plan allows you to build one resume, use our basic templates, and download it as a text file. You also get a basic ATS score check for free.',
        category: 'pricing',
    },
    {
        question: 'Can I cancel my subscription anytime?',
        answer: 'Yes, you can cancel your subscription at any time from your account settings. You will retain access to premium features until the end of your current billing cycle.',
        category: 'pricing',
    },
    {
        question: 'Is my personal data secure?',
        answer: 'Security is our top priority. We use industry-standard encryption to protect your data. We do not sell your personal information to third parties or recruiters without your explicit consent.',
        category: 'security',
    },
];

export default function FAQPage() {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [activeCategory, setActiveCategory] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Enhanced SEO with better keywords and CTR optimization
    useSEO(
        'FAQ - Resume Builder Questions Answered | ResumeBP',
        'Get answers to resume builder questions. Learn about ATS optimization, pricing, features & security. Instant answers to create the perfect resume.'
    );

    // Add structured data and meta tags for SEO
    useEffect(() => {
        // FAQPage Schema with all questions
        const faqSchema = document.createElement('script');
        faqSchema.type = 'application/ld+json';
        faqSchema.id = 'faq-schema';
        faqSchema.text = JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            'mainEntity': faqs.map(faq => ({
                '@type': 'Question',
                'name': faq.question,
                'acceptedAnswer': {
                    '@type': 'Answer',
                    'text': faq.answer
                }
            }))
        });
        document.head.appendChild(faqSchema);

        // Breadcrumb Schema
        const breadcrumbSchema = document.createElement('script');
        breadcrumbSchema.type = 'application/ld+json';
        breadcrumbSchema.id = 'breadcrumb-schema-faq';
        breadcrumbSchema.text = JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            'itemListElement': [
                {
                    '@type': 'ListItem',
                    'position': 1,
                    'name': 'Home',
                    'item': 'https://resumebp.com/'
                },
                {
                    '@type': 'ListItem',
                    'position': 2,
                    'name': 'FAQ',
                    'item': 'https://resumebp.com/faq'
                }
            ]
        });
        document.head.appendChild(breadcrumbSchema);

        // Add canonical URL
        let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
        if (!canonical) {
            canonical = document.createElement('link');
            canonical.rel = 'canonical';
            document.head.appendChild(canonical);
        }
        canonical.href = 'https://resumebp.com/faq';

        // Enhanced Open Graph tags
        const updateMeta = (property: string, content: string) => {
            let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
            if (!meta) {
                meta = document.createElement('meta');
                meta.setAttribute('property', property);
                document.head.appendChild(meta);
            }
            meta.setAttribute('content', content);
        };

        updateMeta('og:title', 'Frequently Asked Questions | ResumeBP Resume Builder');
        updateMeta('og:description', 'Find instant answers to your resume builder questions. ATS optimization, pricing, features, security & more. Get help creating the perfect resume.');
        updateMeta('og:image', 'https://resumebp.com/og-faq.jpg');
        updateMeta('og:url', 'https://resumebp.com/faq');
        updateMeta('og:type', 'website');
        updateMeta('og:site_name', 'ResumeBP');

        // Twitter Card tags
        const updateTwitterMeta = (name: string, content: string) => {
            let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
            if (!meta) {
                meta = document.createElement('meta');
                meta.setAttribute('name', name);
                document.head.appendChild(meta);
            }
            meta.setAttribute('content', content);
        };

        updateTwitterMeta('twitter:card', 'summary_large_image');
        updateTwitterMeta('twitter:title', 'Resume Builder FAQ | Instant Answers - ResumeBP');
        updateTwitterMeta('twitter:description', 'Get answers to resume builder questions. ATS, pricing, features & security covered.');
        updateTwitterMeta('twitter:image', 'https://resumebp.com/og-faq.jpg');

        return () => {
            // Cleanup schemas on unmount
            const schemas = ['faq-schema', 'breadcrumb-schema-faq'];
            schemas.forEach(id => {
                const element = document.getElementById(id);
                if (element) element.remove();
            });
        };
    }, []);

    const toggleAccordion = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    const filterByCategory = (category: string) => {
        setActiveCategory(category);
        setActiveIndex(null);
    };

    const filteredFAQs = faqs.filter((faq) => {
        const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
        const matchesSearch =
            faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <MarketingLayout>
            {/* Hero Section */}
            <section className="relative pt-20 pb-16 text-center px-6 overflow-hidden">
                {/* Background Decoration */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full overflow-hidden -z-10 pointer-events-none">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-[float_6s_ease-in-out_infinite]"></div>
                    <div className="absolute top-20 right-1/4 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-[float_6s_ease-in-out_infinite]" style={{ animationDelay: '2s' }}></div>
                </div>

                <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-6 animate-[slideUp_0.6s_ease-out_forwards]">
                    Resume Builder <span className="text-indigo-600">FAQ</span> - Instant Answers
                </h1>
                <p className="text-slate-500 text-lg mb-10 max-w-2xl mx-auto animate-[slideUp_0.6s_ease-out_forwards]" style={{ animationDelay: '0.1s' }}>
                    Everything you need to know about building ATS-friendly resumes, pricing, features, and how our AI technology works. Search or browse by category.
                </p>

                {/* Search FAQ */}
                <div className="max-w-xl mx-auto relative mb-12 animate-[slideUp_0.6s_ease-out_forwards]" style={{ animationDelay: '0.2s' }}>
                    <input
                        type="text"
                        placeholder="Search for answers..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-white text-slate-800"
                    />
                    <i className="fa-solid fa-magnifying-glass absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"></i>
                </div>
            </section>

            {/* FAQ Filter */}
            <section className="container mx-auto px-6 max-w-4xl mb-12">
                <div className="flex flex-wrap justify-center gap-3 animate-[fadeIn_0.6s_ease-out_forwards]">
                    <button
                        onClick={() => filterByCategory('all')}
                        className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${activeCategory === 'all'
                            ? 'bg-slate-900 text-white shadow-md'
                            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                    >
                        All Questions
                    </button>
                    <button
                        onClick={() => filterByCategory('general')}
                        className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${activeCategory === 'general'
                            ? 'bg-slate-900 text-white shadow-md'
                            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                    >
                        General
                    </button>
                    <button
                        onClick={() => filterByCategory('ats')}
                        className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${activeCategory === 'ats'
                            ? 'bg-slate-900 text-white shadow-md'
                            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                    >
                        ATS Checker
                    </button>
                    <button
                        onClick={() => filterByCategory('pricing')}
                        className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${activeCategory === 'pricing'
                            ? 'bg-slate-900 text-white shadow-md'
                            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                    >
                        Pricing
                    </button>
                    <button
                        onClick={() => filterByCategory('security')}
                        className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${activeCategory === 'security'
                            ? 'bg-slate-900 text-white shadow-md'
                            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                    >
                        Security
                    </button>
                </div>
            </section>

            {/* FAQ List */}
            <section className="container mx-auto px-6 max-w-3xl pb-24">
                <div className="space-y-4">
                    {filteredFAQs.length > 0 ? (
                        filteredFAQs.map((faq, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-all duration-300 hover:shadow-md animate-[slideUp_0.6s_ease-out_forwards]"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <button
                                    className="w-full flex justify-between items-center p-6 text-left focus:outline-none"
                                    onClick={() => toggleAccordion(index)}
                                >
                                    <span className={`text-lg font-bold transition-colors ${activeIndex === index ? 'text-indigo-600' : 'text-slate-800'
                                        }`}>
                                        {faq.question}
                                    </span>
                                    <i className={`fa-solid fa-chevron-down transition-transform duration-300 ${activeIndex === index ? 'rotate-180 text-indigo-600' : 'text-slate-400'
                                        }`}></i>
                                </button>
                                <div
                                    className={`px-6 text-slate-600 leading-relaxed overflow-hidden transition-all duration-300 ${activeIndex === index ? 'max-h-96 opacity-100 pb-6' : 'max-h-0 opacity-0'
                                        }`}
                                >
                                    <p>{faq.answer}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400 text-2xl">
                                <i className="fa-solid fa-magnifying-glass"></i>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">No questions found</h3>
                            <p className="text-slate-500">Try adjusting your search terms.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Still Have Questions */}
            <section className="bg-indigo-50 py-16 border-t border-indigo-100">
                <div className="container mx-auto px-6 text-center animate-[fadeIn_0.6s_ease-out_forwards]">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Didn't find what you were looking for?</h2>
                    <p className="text-slate-600 mb-8">Our support team is always ready to help you with any questions.</p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link
                            href={ROUTES.CONTACT}
                            className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-500 transition-transform transform hover:-translate-y-1"
                        >
                            Contact Support
                        </Link>
                        <a
                            href="#"
                            className="px-6 py-3 bg-white text-slate-700 font-bold rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
                        >
                            Visit Help Center
                        </a>
                    </div>
                </div>
            </section>

            {/* Trust Cards */}
            <section className="bg-white py-12 border-b border-slate-100">
                <div className="container mx-auto px-6 max-w-4xl grid md:grid-cols-3 gap-6">
                    <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                            <i className="fa-solid fa-lock"></i>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 text-sm">Secure Payments</h4>
                            <p className="text-xs text-slate-500">256-bit SSL Encryption</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                            <i className="fa-solid fa-ban"></i>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 text-sm">No Hidden Fees</h4>
                            <p className="text-xs text-slate-500">Transparent pricing always</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                            <i className="fa-regular fa-circle-xmark"></i>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 text-sm">Cancel Anytime</h4>
                            <p className="text-xs text-slate-500">No long-term contracts</p>
                        </div>
                    </div>
                </div>
            </section>
        </MarketingLayout>
    );
}
