'use client';

import MarketingLayout from '@/components/layout/marketing-layout';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ROUTES } from '@/lib/routes';
import { pricingAPI } from '@/lib/api';
import { useSEO } from '@/hooks/useSEO';

interface PricingFeature {
    text: string;
    included: boolean;
}

interface PricingPlan {
    id: number;
    name: string;
    slug: string;
    description: string;
    pricing: {
        usd: { monthly: number; yearly: number; formatted_monthly: string; formatted_yearly: string };
        inr: { monthly: number; yearly: number; formatted_monthly: string; formatted_yearly: string };
        eur: { monthly: number; yearly: number; formatted_monthly: string; formatted_yearly: string };
    };
    features: PricingFeature[];
    button_text: string;
    button_link: string;
    badge_text: string | null;
    theme: 'light' | 'dark';
    is_popular: boolean;
    is_active: boolean;
    sort_order: number;
    limits: {
        max_resumes: number | null;
        max_templates: number | null;
        max_downloads_per_month: number | null;
        max_ai_requests_per_month: number | null;
        can_export_pdf: boolean;
        can_export_docx: boolean;
    };
}

export default function PricingPage() {
    const [isYearly, setIsYearly] = useState(false);
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const [pricingPlans, setPricingPlans] = useState<PricingPlan[]>([]);
    const [loading, setLoading] = useState(true);
    const [detectedCurrency, setDetectedCurrency] = useState<'USD' | 'INR' | 'EUR'>('INR');
    const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

    // Dynamic SEO
    useSEO(
        'Pricing - AI Resume Builder',
        'Choose the plan that fits your career goals. No hidden fees, cancel anytime.'
    );

    useEffect(() => {
        const fetchPricingData = async () => {
            try {
                // Detect currency from IP
                const currencyResponse = await pricingAPI.detectCurrency();
                setDetectedCurrency(currencyResponse.data.currency);

                // Fetch pricing plans
                const plansResponse = await pricingAPI.getPlans();
                setPricingPlans(plansResponse.data);
            } catch (error) {
                console.error('Failed to fetch pricing data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPricingData();
    }, []);

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
                        className="relative inline-flex items-center w-14 h-7 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        style={{ backgroundColor: isYearly ? '#4F46E5' : '#E2E8F0' }}
                    >
                        <span
                            className={`inline-block w-5 h-5 transform rounded-full bg-white shadow-lg transition-transform duration-300 ease-in-out ${isYearly ? 'translate-x-8' : 'translate-x-1'
                                }`}
                        />
                    </button>

                    <span className={`text-sm font-medium ${isYearly ? 'text-slate-900' : 'text-slate-600'}`}>Yearly</span>
                    <span className="bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full border border-green-200 -ml-2 animate-[bounceSlight_2s_infinite]">
                        Save 20%
                    </span>
                </div>

                {/* Pricing Cards */}
                <div className="container mx-auto max-w-6xl px-4">
                    {loading ? (
                        <div className="text-center py-20">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                            <p className="mt-4 text-slate-600">Loading pricing plans...</p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-3 gap-8">
                            {pricingPlans.map((plan, index) => {
                                const isDark = plan.theme === 'dark';
                                const delay = `${0.3 + (index * 0.1)}s`;

                                return (
                                    <div
                                        key={plan.id}
                                        className={`rounded-2xl p-8 border ${isDark
                                            ? 'bg-slate-900 border-2 border-indigo-500 relative transform md:-translate-y-4 shadow-2xl'
                                            : 'bg-white border-slate-200'
                                            } pricing-card flex flex-col animate-[fadeUp_0.8s_ease-out_forwards]`}
                                        style={{ animationDelay: delay }}
                                    >
                                        {plan.badge_text && (
                                            <div className="absolute top-0 right-0 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-lg animate-pulse">
                                                {plan.badge_text}
                                            </div>
                                        )}

                                        <div className="mb-4">
                                            <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                                {plan.name}
                                            </h3>
                                            <p className={`text-sm mt-1 ${isDark ? 'text-indigo-200' : 'text-slate-500'}`}>
                                                {plan.description}
                                            </p>
                                        </div>

                                        <div className="mb-6">
                                            <span className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                                {isYearly
                                                    ? plan.pricing[detectedCurrency.toLowerCase() as 'usd' | 'inr' | 'eur'].formatted_yearly
                                                    : plan.pricing[detectedCurrency.toLowerCase() as 'usd' | 'inr' | 'eur'].formatted_monthly
                                                }
                                            </span>
                                            <span className="text-slate-400">
                                                /{plan.pricing.inr.monthly === 0 ? 'forever' : (isYearly ? 'year' : 'month')}
                                            </span>
                                        </div>

                                        <Link
                                            href={`/checkout?plan=${plan.slug}&period=${isYearly ? 'yearly' : 'monthly'}`}
                                            className={`block w-full py-3 px-4 font-bold text-center rounded-xl transition-colors mb-8 transform hover:scale-105 active:scale-95 ${isDark
                                                ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/25'
                                                : plan.pricing.inr.monthly === 0
                                                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                                    : 'bg-white border-2 border-slate-900 hover:bg-slate-50 text-slate-900'
                                                }`}
                                        >
                                            {plan.button_text}
                                        </Link>

                                        <ul className={`space-y-4 text-sm flex-grow ${isDark ? 'text-slate-300' : 'text-slate-600'
                                            }`}>
                                            {plan.features.map((feature, idx) => (
                                                <li
                                                    key={idx}
                                                    className={`flex items-center gap-3 ${!feature.included ? 'text-slate-400' : ''
                                                        }`}
                                                >
                                                    <i className={`fa-solid ${feature.included
                                                        ? isDark
                                                            ? 'fa-check text-indigo-400'
                                                            : plan.pricing[detectedCurrency.toLowerCase() as 'usd' | 'inr' | 'eur'].monthly === 0
                                                                ? 'fa-check text-green-500'
                                                                : 'fa-check text-indigo-600'
                                                        : 'fa-xmark'
                                                        }`}></i>
                                                    {feature.text.includes('Everything in') ? (
                                                        <strong>{feature.text}</strong>
                                                    ) : (
                                                        feature.text
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>

            {/* Feature Comparison Table */}
            <section className="py-16 bg-slate-50 border-t border-slate-200">
                <div className="container mx-auto px-6 max-w-4xl">
                    <h2 className="text-3xl font-display font-bold text-center text-slate-900 mb-12">Detailed Comparison</h2>

                    {loading ? (
                        <div className="text-center py-10">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                        </div>
                    ) : pricingPlans.length > 0 && (
                        <div className="overflow-x-auto bg-white rounded-2xl shadow-sm border border-slate-200 animate-[fadeUp_0.8s_ease-out_forwards] [animation-delay:0.6s]">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200">
                                        <th className="p-4 pl-8 font-semibold text-slate-600">Features</th>
                                        {pricingPlans.map((plan, idx) => (
                                            <th
                                                key={plan.id}
                                                className={`p-4 text-center font-bold ${plan.is_popular
                                                    ? 'text-indigo-600 bg-indigo-50/50'
                                                    : 'text-slate-700'
                                                    }`}
                                            >
                                                {plan.name}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {/* Resumes Row */}
                                    <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                        <td className="p-4 pl-8 text-slate-700">Resumes</td>
                                        {pricingPlans.map((plan, idx) => (
                                            <td
                                                key={plan.id}
                                                className={`p-4 text-center ${plan.limits.max_resumes === null
                                                    ? 'font-bold text-slate-900'
                                                    : 'text-slate-500'
                                                    } ${plan.is_popular ? 'bg-indigo-50/20' : ''}`}
                                            >
                                                {plan.limits.max_resumes === null ? 'Unlimited' : plan.limits.max_resumes}
                                            </td>
                                        ))}
                                    </tr>

                                    {/* Templates Row */}
                                    <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                        <td className="p-4 pl-8 text-slate-700">Templates</td>
                                        {pricingPlans.map((plan) => (
                                            <td
                                                key={plan.id}
                                                className={`p-4 text-center ${plan.limits.max_templates === null
                                                    ? 'font-bold text-slate-900'
                                                    : 'text-slate-500'
                                                    } ${plan.is_popular ? 'bg-indigo-50/20' : ''}`}
                                            >
                                                {plan.limits.max_templates === null ? 'Unlimited' : plan.limits.max_templates}
                                            </td>
                                        ))}
                                    </tr>

                                    {/* AI Requests Row */}
                                    <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                        <td className="p-4 pl-8 text-slate-700">AI Requests/Month</td>
                                        {pricingPlans.map((plan) => (
                                            <td
                                                key={plan.id}
                                                className={`p-4 text-center ${plan.is_popular ? 'bg-indigo-50/20' : ''}`}
                                            >
                                                {plan.limits.max_ai_requests_per_month === null ? (
                                                    <span className="font-bold text-slate-900">Unlimited</span>
                                                ) : plan.limits.max_ai_requests_per_month === 0 ? (
                                                    <i className="fa-solid fa-minus text-slate-300"></i>
                                                ) : (
                                                    <span className="text-slate-500">{plan.limits.max_ai_requests_per_month}</span>
                                                )}
                                            </td>
                                        ))}
                                    </tr>

                                    {/* Downloads Row */}
                                    <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                        <td className="p-4 pl-8 text-slate-700">Downloads/Month</td>
                                        {pricingPlans.map((plan) => (
                                            <td
                                                key={plan.id}
                                                className={`p-4 text-center ${plan.limits.max_downloads_per_month === null
                                                    ? 'font-bold text-slate-900'
                                                    : 'text-slate-500'
                                                    } ${plan.is_popular ? 'bg-indigo-50/20' : ''}`}
                                            >
                                                {plan.limits.max_downloads_per_month === null
                                                    ? 'Unlimited'
                                                    : plan.limits.max_downloads_per_month}
                                            </td>
                                        ))}
                                    </tr>

                                    {/* Export Formats Row */}
                                    <tr className="hover:bg-slate-50 transition-colors">
                                        <td className="p-4 pl-8 text-slate-700">Export Formats</td>
                                        {pricingPlans.map((plan) => {
                                            const formats = [];
                                            if (plan.limits.can_export_pdf) formats.push('PDF');
                                            if (plan.limits.can_export_docx) formats.push('DOCX');

                                            return (
                                                <td
                                                    key={plan.id}
                                                    className={`p-4 text-center text-slate-900 ${plan.is_popular ? 'bg-indigo-50/20' : ''}`}
                                                >
                                                    {formats.length > 0 ? formats.join(', ') : 'TXT'}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )}
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
                        href={ROUTES.BUILDER}
                        className="px-8 py-4 bg-white text-indigo-900 font-bold rounded-xl shadow-lg hover:bg-indigo-50 transition-colors transform hover:-translate-y-1"
                    >
                        Build Resume Free
                    </Link>
                    <Link
                        href={ROUTES.ATS_CHECKER}
                        className="px-8 py-4 bg-transparent border border-indigo-400 text-white font-bold rounded-xl hover:bg-indigo-800 transition-colors transform hover:-translate-y-1"
                    >
                        Check ATS Score
                    </Link>
                </div>
            </section>
        </MarketingLayout>
    );
}
