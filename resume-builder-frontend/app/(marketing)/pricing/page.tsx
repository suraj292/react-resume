'use client';

import MarketingLayout from '@/components/layout/marketing-layout';
import Link from 'next/link';
import { useState } from 'react';

export default function PricingPage() {
    const [isYearly, setIsYearly] = useState(false);
    const [activeFaq, setActiveFaq] = useState<number | null>(null);

    const toggleFaq = (index: number) => {
        setActiveFaq(activeFaq === index ? null : index);
    };

    const faqs = [
        {
            question: 'Is the Free plan really free?',
            answer: 'Yes! You can build one resume, use our basic templates, and download it as a TXT file completely for free. No credit card required.'
        },
        {
            question: 'Can I cancel my subscription anytime?',
            answer: 'Absolutely. You can cancel your subscription from your account settings at any time. You will retain access to premium features until the end of your billing cycle.'
        },
        {
            question: 'Are the resumes ATS-friendly?',
            answer: 'Yes. All our templates are designed with ATS readability in mind, ensuring columns, fonts, and structures are parsed correctly by applicant tracking systems.'
        }
    ];

    return (
        <MarketingLayout>
            {/* Hero Pricing Intro */}
            <section className="pt-20 pb-16 text-center px-6">
                <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-6 animate-[fadeUp_0.8s_ease-out_forwards]">
                    Simple, transparent <span className="text-indigo-600">pricing</span>
                </h1>
                <p className="text-slate-500 text-lg mb-10 max-w-xl mx-auto animate-[fadeUp_0.8s_ease-out_forwards] [animation-delay:0.1s]">
                    Choose the plan that fits your career goals. No hidden fees, cancel anytime.
                </p>

                {/* Toggle Switch */}
                <div className="flex items-center justify-center gap-4 mb-16 animate-[fadeUp_0.8s_ease-out_forwards] [animation-delay:0.2s]">
                    <span className={`text-sm font-medium ${!isYearly ? 'text-slate-900' : 'text-slate-600'}`}>
                        Monthly
                    </span>

                    <button
                        onClick={() => setIsYearly(!isYearly)}
                        className="relative inline-block w-14 h-6 align-middle select-none transition duration-200 ease-in"
                    >
                        <div className={`block overflow-hidden h-6 rounded-full ${isYearly ? 'bg-indigo-600' : 'bg-slate-200'} cursor-pointer transition-colors duration-300`}></div>
                        <div className={`absolute block w-6 h-6 rounded-full bg-white border-4 ${isYearly ? 'border-indigo-600 right-0' : 'border-slate-200 left-0'} appearance-none cursor-pointer transition-all duration-300 shadow`}></div>
                    </button>

                    <span className="text-sm font-medium text-slate-900">Yearly</span>
                    <span className="bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full border border-green-200 -ml-2 animate-[bounceSlight_2s_infinite]">
                        Save 20%
                    </span>
                </div>

                {/* Pricing Cards */}
                <div className="container mx-auto max-w-6xl px-4">
                    <div className="grid md:grid-cols-3 gap-8">

                        {/* Free Plan */}
                        <div className="bg-white rounded-2xl p-8 border border-slate-200 pricing-card flex flex-col animate-[fadeUp_0.8s_ease-out_forwards] [animation-delay:0.3s]">
                            <div className="mb-4">
                                <h3 className="text-xl font-bold text-slate-900">Free</h3>
                                <p className="text-sm text-slate-500 mt-1">For getting started</p>
                            </div>
                            <div className="mb-6">
                                <span className="text-4xl font-bold text-slate-900">₹0</span>
                                <span className="text-slate-400">/forever</span>
                            </div>
                            <Link
                                href="#"
                                className="block w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-center rounded-xl transition-colors mb-8 transform hover:scale-105 active:scale-95"
                            >
                                Start Free
                            </Link>
                            <ul className="space-y-4 text-sm text-slate-600 flex-grow">
                                <li className="flex items-center gap-3">
                                    <i className="fa-solid fa-check text-green-500"></i> 1 Resume
                                </li>
                                <li className="flex items-center gap-3">
                                    <i className="fa-solid fa-check text-green-500"></i> Limited Templates
                                </li>
                                <li className="flex items-center gap-3">
                                    <i className="fa-solid fa-check text-green-500"></i> Basic ATS Score
                                </li>
                                <li className="flex items-center gap-3">
                                    <i className="fa-solid fa-check text-green-500"></i> Resume Upload
                                </li>
                                <li className="flex items-center gap-3 text-slate-400">
                                    <i className="fa-solid fa-xmark"></i> AI Optimization
                                </li>
                                <li className="flex items-center gap-3 text-slate-400">
                                    <i className="fa-solid fa-xmark"></i> PDF Download
                                </li>
                            </ul>
                        </div>

                        {/* Pro Plan */}
                        <div className="bg-slate-900 rounded-2xl p-8 border-2 border-indigo-500 pricing-card flex flex-col relative transform md:-translate-y-4 shadow-2xl animate-[fadeUp_0.8s_ease-out_forwards] [animation-delay:0.4s]">
                            <div className="absolute top-0 right-0 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-lg animate-pulse">
                                MOST POPULAR
                            </div>
                            <div className="mb-4">
                                <h3 className="text-xl font-bold text-white">Pro</h3>
                                <p className="text-sm text-indigo-200 mt-1">Best for job seekers</p>
                            </div>
                            <div className="mb-6">
                                <span className="text-4xl font-bold text-white">
                                    {isYearly ? '₹4,999' : '₹499'}
                                </span>
                                <span className="text-slate-400">/{isYearly ? 'year' : 'month'}</span>
                            </div>
                            <Link
                                href="#"
                                className="block w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-center rounded-xl transition-colors mb-8 shadow-lg shadow-indigo-500/25 transform hover:scale-105 active:scale-95"
                            >
                                Upgrade to Pro
                            </Link>
                            <ul className="space-y-4 text-sm text-slate-300 flex-grow">
                                <li className="flex items-center gap-3">
                                    <i className="fa-solid fa-check text-indigo-400"></i> Unlimited Resumes
                                </li>
                                <li className="flex items-center gap-3">
                                    <i className="fa-solid fa-check text-indigo-400"></i> All Premium Templates
                                </li>
                                <li className="flex items-center gap-3">
                                    <i className="fa-solid fa-check text-indigo-400"></i> AI Resume Optimization
                                </li>
                                <li className="flex items-center gap-3">
                                    <i className="fa-solid fa-check text-indigo-400"></i> ATS Keyword Matching
                                </li>
                                <li className="flex items-center gap-3">
                                    <i className="fa-solid fa-check text-indigo-400"></i> PDF & DOCX Downloads
                                </li>
                                <li className="flex items-center gap-3">
                                    <i className="fa-solid fa-check text-indigo-400"></i> Priority Support
                                </li>
                            </ul>
                        </div>

                        {/* Career+ Plan */}
                        <div className="bg-white rounded-2xl p-8 border border-slate-200 pricing-card flex flex-col animate-[fadeUp_0.8s_ease-out_forwards] [animation-delay:0.5s]">
                            <div className="mb-4">
                                <h3 className="text-xl font-bold text-slate-900">Career+</h3>
                                <p className="text-sm text-slate-500 mt-1">For serious professionals</p>
                            </div>
                            <div className="mb-6">
                                <span className="text-4xl font-bold text-slate-900">
                                    {isYearly ? '₹9,999' : '₹999'}
                                </span>
                                <span className="text-slate-400">/{isYearly ? 'year' : 'month'}</span>
                            </div>
                            <Link
                                href="#"
                                className="block w-full py-3 px-4 bg-white border-2 border-slate-900 hover:bg-slate-50 text-slate-900 font-bold text-center rounded-xl transition-colors mb-8 transform hover:scale-105 active:scale-95"
                            >
                                Go Premium
                            </Link>
                            <ul className="space-y-4 text-sm text-slate-600 flex-grow">
                                <li className="flex items-center gap-3">
                                    <i className="fa-solid fa-check text-indigo-600"></i> <strong>Everything in Pro</strong>
                                </li>
                                <li className="flex items-center gap-3">
                                    <i className="fa-solid fa-check text-indigo-600"></i> Advanced ATS Analysis
                                </li>
                                <li className="flex items-center gap-3">
                                    <i className="fa-solid fa-check text-indigo-600"></i> Job Description Matcher
                                </li>
                                <li className="flex items-center gap-3">
                                    <i className="fa-solid fa-check text-indigo-600"></i> Cover Letter Generator
                                </li>
                                <li className="flex items-center gap-3">
                                    <i className="fa-solid fa-check text-indigo-600"></i> Personal Branding Themes
                                </li>
                                <li className="flex items-center gap-3">
                                    <i className="fa-solid fa-check text-indigo-600"></i> Early Access Features
                                </li>
                            </ul>
                        </div>

                    </div>
                </div>
            </section>

            {/* Feature Comparison Table */}
            <section className="py-16 bg-slate-50 border-t border-slate-200">
                <div className="container mx-auto px-6 max-w-4xl">
                    <h2 className="text-3xl font-display font-bold text-center text-slate-900 mb-12">Detailed Comparison</h2>

                    <div className="overflow-x-auto bg-white rounded-2xl shadow-sm border border-slate-200 animate-[fadeUp_0.8s_ease-out_forwards] [animation-delay:0.6s]">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="p-4 pl-8 font-semibold text-slate-600">Features</th>
                                    <th className="p-4 text-center font-bold text-slate-700">Free</th>
                                    <th className="p-4 text-center font-bold text-indigo-600 bg-indigo-50/50">Pro</th>
                                    <th className="p-4 text-center font-bold text-slate-900">Career+</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                    <td className="p-4 pl-8 text-slate-700">Resumes</td>
                                    <td className="p-4 text-center text-slate-500">1</td>
                                    <td className="p-4 text-center font-bold text-slate-900 bg-indigo-50/20">Unlimited</td>
                                    <td className="p-4 text-center font-bold text-slate-900">Unlimited</td>
                                </tr>
                                <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                    <td className="p-4 pl-8 text-slate-700">AI Rewrites</td>
                                    <td className="p-4 text-center text-slate-300"><i className="fa-solid fa-minus"></i></td>
                                    <td className="p-4 text-center text-green-500 bg-indigo-50/20"><i className="fa-solid fa-check"></i></td>
                                    <td className="p-4 text-center text-green-500"><i className="fa-solid fa-check"></i></td>
                                </tr>
                                <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                    <td className="p-4 pl-8 text-slate-700">Cover Letter Gen</td>
                                    <td className="p-4 text-center text-slate-300"><i className="fa-solid fa-minus"></i></td>
                                    <td className="p-4 text-center text-slate-300 bg-indigo-50/20"><i className="fa-solid fa-minus"></i></td>
                                    <td className="p-4 text-center text-green-500"><i className="fa-solid fa-check"></i></td>
                                </tr>
                                <tr className="hover:bg-slate-50 transition-colors">
                                    <td className="p-4 pl-8 text-slate-700">Export Formats</td>
                                    <td className="p-4 text-center text-slate-500">TXT</td>
                                    <td className="p-4 text-center text-slate-900 bg-indigo-50/20">PDF, DOCX</td>
                                    <td className="p-4 text-center text-slate-900">PDF, DOCX</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* Trust & Value */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6 max-w-6xl text-center">
                    <h2 className="text-3xl font-display font-bold text-slate-900 mb-12">Trusted by 50,000+ Professionals</h2>

                    <div className="grid md:grid-cols-3 gap-8 text-left mb-16">
                        {[
                            { name: 'Priya M., Product Manager', text: '"I was getting rejected by ATS constantly. One scan with the Pro plan, I fixed my keywords, and got an interview the next week."' },
                            { name: 'Rahul S., Software Engineer', text: '"Worth every rupee. The Career+ plan wrote my cover letter in seconds. It saved me hours of stress."' },
                            { name: 'Sarah J., Marketing Lead', text: '"Simple interface, great templates. The most honest resume builder I\'ve found online."' }
                        ].map((testimonial, idx) => (
                            <div key={idx} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-lg transition-shadow duration-300 animate-[fadeUp_0.8s_ease-out_forwards]">
                                <div className="flex text-yellow-400 mb-4 text-sm">
                                    {[1, 2, 3, 4, 5].map(i => <i key={i} className="fa-solid fa-star"></i>)}
                                </div>
                                <p className="text-slate-700 mb-4 italic">{testimonial.text}</p>
                                <div className="font-bold text-slate-900 text-sm">- {testimonial.name}</div>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-wrap justify-center gap-12 text-center animate-[fadeUp_0.8s_ease-out_forwards] [animation-delay:0.5s]">
                        <div className="hover:scale-110 transition-transform duration-300">
                            <div className="text-4xl font-bold text-indigo-600 mb-2">90%</div>
                            <div className="text-slate-500 font-medium">ATS Pass Rate</div>
                        </div>
                        <div className="hover:scale-110 transition-transform duration-300">
                            <div className="text-4xl font-bold text-indigo-600 mb-2">50k+</div>
                            <div className="text-slate-500 font-medium">Resumes Built</div>
                        </div>
                        <div className="hover:scale-110 transition-transform duration-300">
                            <div className="text-4xl font-bold text-indigo-600 mb-2">3x</div>
                            <div className="text-slate-500 font-medium">More Interviews</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-16 bg-slate-50">
                <div className="container mx-auto px-6 max-w-3xl">
                    <h2 className="text-3xl font-display font-bold text-center text-slate-900 mb-10">Frequently Asked Questions</h2>

                    <div className="space-y-4">
                        {faqs.map((faq, idx) => (
                            <div
                                key={idx}
                                className={`bg-white rounded-xl border border-slate-200 overflow-hidden faq-item hover:shadow-sm transition-shadow ${activeFaq === idx ? 'active' : ''}`}
                            >
                                <button
                                    className="w-full flex justify-between items-center p-5 text-left font-bold text-slate-800 hover:bg-slate-50 transition-colors"
                                    onClick={() => toggleFaq(idx)}
                                >
                                    {faq.question}
                                    <i className={`fa-solid fa-chevron-down text-slate-400 faq-icon transition-transform duration-300 ${activeFaq === idx ? 'rotate-180' : ''}`}></i>
                                </button>
                                <div className={`faq-content bg-slate-50 px-5 text-slate-600 text-sm ${activeFaq === idx ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}>
                                    <div className="pb-5">{faq.answer}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-20 bg-gradient-to-br from-indigo-700 to-indigo-900 text-white text-center px-6">
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-6 animate-[fadeUp_0.8s_ease-out_forwards]">
                    Land More Interviews Today
                </h2>
                <p className="text-indigo-200 text-lg mb-10 max-w-2xl mx-auto animate-[fadeUp_0.8s_ease-out_forwards] [animation-delay:0.1s]">
                    Stop guessing and start applying with confidence. Join thousands of job seekers getting hired faster.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4 animate-[fadeUp_0.8s_ease-out_forwards] [animation-delay:0.2s]">
                    <Link
                        href="/builder"
                        className="px-8 py-4 bg-white text-indigo-900 font-bold rounded-xl shadow-lg hover:bg-indigo-50 transition-colors transform hover:-translate-y-1"
                    >
                        Build Resume Free
                    </Link>
                    <Link
                        href="/ats-checker"
                        className="px-8 py-4 bg-transparent border border-indigo-400 text-white font-bold rounded-xl hover:bg-indigo-800 transition-colors transform hover:-translate-y-1"
                    >
                        Check ATS Score
                    </Link>
                </div>
            </section>
        </MarketingLayout>
    );
}
