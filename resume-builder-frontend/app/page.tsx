'use client';

import MarketingLayout from '@/components/layout/marketing-layout';
import Link from 'next/link';
import { RevealOnScroll } from '@/components/reveal-on-scroll';
import { useState, useEffect } from 'react';
import { ROUTES, isAuthenticated } from '@/lib/routes';
import { useRouter } from 'next/navigation';
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
}

export default function HomePage() {
    const [pricingPlans, setPricingPlans] = useState<PricingPlan[]>([]);
    const [loading, setLoading] = useState(true);
    const [detectedCurrency, setDetectedCurrency] = useState<'USD' | 'INR' | 'EUR'>('INR');
    const router = useRouter();

    // Dynamic SEO
    useSEO(
        'AI Resume Builder - Create Professional Resumes in Minutes',
        'Build your perfect resume with our AI-powered resume builder. Choose from professional templates, get ATS-friendly formatting, and land your dream job faster.'
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

    return (
        <MarketingLayout>
            <RevealOnScroll />
            {/* Hero Section */}
            <section className="relative pt-12 pb-20 lg:pt-28 lg:pb-32 overflow-hidden">
                {/* Background Blobs */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-[blob_7s_infinite]"></div>
                    <div className="absolute top-0 right-1/4 w-96 h-96 bg-violet-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-[blob_7s_infinite] animation-delay-2000"></div>
                    <div className="absolute -bottom-8 left-1/3 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-[blob_7s_infinite] animation-delay-4000"></div>
                </div>

                <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left: Text */}
                    <div className="text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold mb-6 animate-[fadeInUp_0.8s_ease-out_forwards]">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                            </span>
                            AI V2.0 Now Live
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-slate-900 leading-[1.15] mb-6 animate-[fadeInUp_0.8s_ease-out_forwards] [animation-delay:0.1s]">
                            Build an <span className="text-gradient">ATS-Optimized</span> Resume in Minutes
                        </h1>

                        <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0 animate-[fadeInUp_0.8s_ease-out_forwards] [animation-delay:0.2s]">
                            Stop getting rejected by bots. Upload your existing resume, paste the job description, and let our AI tailor your CV to land 3x more interviews.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 animate-[fadeInUp_0.8s_ease-out_forwards] [animation-delay:0.3s]">
                            <Link href={ROUTES.BUILDER} className="w-full sm:w-auto px-8 py-4 rounded-xl bg-indigo-600 text-white font-bold shadow-lg hover:bg-indigo-500 hover:shadow-indigo-500/30 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2">
                                <i className="fa-solid fa-wand-magic-sparkles"></i> Build Resume
                            </Link>
                            <Link href={ROUTES.ATS_CHECKER} className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white text-slate-700 border border-slate-200 font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2 hover:border-indigo-300">
                                <i className="fa-solid fa-shield-halved"></i> Check ATS Score
                            </Link>
                        </div>

                        <div className="mt-8 flex items-center justify-center lg:justify-start gap-4 text-sm text-slate-500 animate-[fadeInUp_0.8s_ease-out_forwards] [animation-delay:0.4s]">
                            <div className="flex -space-x-2">
                                <img src="https://ui-avatars.com/api/?name=John+Doe&background=cbd5e1&color=fff" className="w-8 h-8 rounded-full border-2 border-white" alt="User" />
                                <img src="https://ui-avatars.com/api/?name=Jane+Smith&background=94a3b8&color=fff" className="w-8 h-8 rounded-full border-2 border-white" alt="User" />
                                <img src="https://ui-avatars.com/api/?name=Alex+Ray&background=64748b&color=fff" className="w-8 h-8 rounded-full border-2 border-white" alt="User" />
                            </div>
                            <p>Join <span className="font-bold text-slate-700">50,000+</span> hired professionals</p>
                        </div>
                    </div>

                    {/* Right: Visual */}
                    <div className="relative hidden lg:block animate-[slideInRight_1s_ease-out_forwards] [animation-delay:0.3s]">
                        <div className="relative z-10 bg-white p-2 rounded-2xl shadow-2xl border border-slate-100 transform rotate-2 hover:rotate-0 transition-transform duration-700 animate-[float_6s_ease-in-out_infinite]">
                            <div className="aspect-[3/4] bg-slate-50 rounded-xl overflow-hidden border border-slate-100 relative">
                                <div className="p-6 space-y-4 opacity-50 blur-[1px]">
                                    <div className="flex gap-4 items-center border-b pb-4 border-slate-200">
                                        <div className="w-16 h-16 bg-slate-200 rounded-full"></div>
                                        <div className="space-y-2">
                                            <div className="w-48 h-4 bg-slate-300 rounded"></div>
                                            <div className="w-32 h-3 bg-slate-200 rounded"></div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="w-full h-3 bg-slate-200 rounded"></div>
                                        <div className="w-full h-3 bg-slate-200 rounded"></div>
                                        <div className="w-3/4 h-3 bg-slate-200 rounded"></div>
                                    </div>
                                </div>

                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-xl shadow-xl border border-slate-100 flex items-center gap-4 z-20 w-64 hover:scale-105 transition-transform duration-300">
                                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-xl font-bold">
                                        92
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900">ATS Optimized</h4>
                                        <p className="text-xs text-slate-500">Ready for application</p>
                                    </div>
                                    <div className="ml-auto text-green-500">
                                        <i className="fa-solid fa-circle-check text-xl"></i>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="absolute top-10 -right-10 w-24 h-24 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-[blob_7s_infinite]"></div>
                        <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-[blob_7s_infinite] animation-delay-2000"></div>
                    </div>
                </div>
            </section>

            {/* How it Works */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16 reveal">
                        <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-4">How it works</h2>
                        <p className="text-slate-600 text-lg max-w-2xl mx-auto">Three simple steps to your dream job. No design skills required.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="group p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-200 hover:shadow-lg transition-all reveal delay-100 hover-card">
                            <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-indigo-600 text-2xl mb-6 group-hover:scale-110 transition-transform duration-300 group-hover:rotate-6">
                                <i className="fa-solid fa-cloud-arrow-up"></i>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">1. Upload Resume</h3>
                            <p className="text-slate-600 leading-relaxed">Upload your current PDF/DOCX or start from scratch. We extract your details instantly.</p>
                        </div>

                        <div className="group p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-200 hover:shadow-lg transition-all reveal delay-200 hover-card">
                            <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-indigo-600 text-2xl mb-6 group-hover:scale-110 transition-transform duration-300 group-hover:rotate-6">
                                <i className="fa-solid fa-crosshairs"></i>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">2. Add Job Target</h3>
                            <p className="text-slate-600 leading-relaxed">Paste the job description you want to apply for. Our AI analyzes the keywords.</p>
                        </div>

                        <div className="group p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-200 hover:shadow-lg transition-all reveal delay-300 hover-card">
                            <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-indigo-600 text-2xl mb-6 group-hover:scale-110 transition-transform duration-300 group-hover:rotate-6">
                                <i className="fa-solid fa-wand-magic-sparkles"></i>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">3. Optimize & Download</h3>
                            <p className="text-slate-600 leading-relaxed">Our AI rewrites your bullets to match the job. Download as ATS-friendly PDF.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Key Features */}
            <section className="py-24 bg-slate-50">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16 reveal">
                        <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-4">Everything you need to get hired</h2>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover-card reveal">
                            <i className="fa-solid fa-robot text-3xl text-blue-500 mb-4 transition-transform group-hover:scale-110"></i>
                            <h3 className="font-bold text-lg text-slate-900 mb-2">AI Optimization</h3>
                            <p className="text-slate-600 text-sm">Rewrites your experience to sound more professional and impactful.</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover-card reveal delay-100">
                            <i className="fa-solid fa-chart-pie text-3xl text-indigo-500 mb-4"></i>
                            <h3 className="font-bold text-lg text-slate-900 mb-2">ATS Score Checker</h3>
                            <p className="text-slate-600 text-sm">See exactly what the bots see with our detailed parsing analysis.</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover-card reveal delay-200">
                            <i className="fa-solid fa-briefcase text-3xl text-purple-500 mb-4"></i>
                            <h3 className="font-bold text-lg text-slate-900 mb-2">Job Description Match</h3>
                            <p className="text-slate-600 text-sm">Target specific keywords from the job listing to increase relevance.</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover-card reveal">
                            <i className="fa-solid fa-layer-group text-3xl text-teal-500 mb-4"></i>
                            <h3 className="font-bold text-lg text-slate-900 mb-2">Professional Templates</h3>
                            <p className="text-slate-600 text-sm">Clean, modern designs that are proven to pass ATS filters.</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover-card reveal delay-100">
                            <i className="fa-solid fa-sliders text-3xl text-orange-500 mb-4"></i>
                            <h3 className="font-bold text-lg text-slate-900 mb-2">Tone Control</h3>
                            <p className="text-slate-600 text-sm">Choose between confident, technical, or leadership narrative tones.</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover-card reveal delay-200">
                            <i className="fa-solid fa-file-export text-3xl text-red-500 mb-4"></i>
                            <h3 className="font-bold text-lg text-slate-900 mb-2">PDF & DOCX Export</h3>
                            <p className="text-slate-600 text-sm">Download in the format recruiters prefer with one click.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ATS Explanation */}
            <section className="py-24 bg-white overflow-hidden">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col lg:flex-row items-center gap-16">

                        <div className="lg:w-1/2 reveal">
                            <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-6">
                                Why <span className="text-indigo-600">ATS Compatibility</span> Matters
                            </h2>
                            <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                                75% of resumes are rejected by Applicant Tracking Systems (ATS) before a human ever sees them. Simple formatting errors or missing keywords can cost you the interview.
                            </p>

                            <ul className="space-y-4 mb-8">
                                <li className="flex items-center gap-3">
                                    <i className="fa-solid fa-check-circle text-green-500 text-xl"></i>
                                    <span className="text-slate-700 font-medium">Pass automated screening bots</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <i className="fa-solid fa-check-circle text-green-500 text-xl"></i>
                                    <span className="text-slate-700 font-medium">Match hidden recruiter keywords</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <i className="fa-solid fa-check-circle text-green-500 text-xl"></i>
                                    <span className="text-slate-700 font-medium">Format correctly for parsing</span>
                                </li>
                            </ul>

                            <Link href={ROUTES.ATS_CHECKER} className="group text-indigo-600 font-bold hover:text-indigo-700 border-b-2 border-indigo-200 hover:border-indigo-600 transition-all inline-flex items-center gap-2">
                                Check your resume score now <i className="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
                            </Link>
                        </div>

                        <div className="lg:w-1/2 w-full reveal delay-200">
                            <div className="bg-slate-900 rounded-2xl p-8 shadow-2xl relative text-white transform hover:scale-[1.01] transition-transform duration-500">
                                <div className="mb-8">
                                    <div className="flex justify-between items-end mb-2">
                                        <span className="font-bold text-slate-400 text-sm uppercase">Standard Resume</span>
                                        <span className="font-bold text-red-400">Score: 42/100</span>
                                    </div>
                                    <div className="w-full bg-slate-700 h-3 rounded-full overflow-hidden">
                                        <div className="bg-red-500 h-full w-[42%]"></div>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between items-end mb-2">
                                        <span className="font-bold text-indigo-300 text-sm uppercase">Optimized Resume</span>
                                        <span className="font-bold text-green-400">Score: 95/100</span>
                                    </div>
                                    <div className="w-full bg-slate-700 h-3 rounded-full overflow-hidden">
                                        <div className="bg-green-500 h-full w-[95%] shadow-[0_0_15px_rgba(34,197,94,0.5)]"></div>
                                    </div>
                                </div>

                                <div className="mt-8 pt-8 border-t border-slate-700 flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-xl">
                                        <i className="fa-solid fa-rocket"></i>
                                    </div>
                                    <div>
                                        <p className="font-bold">3x More Interviews</p>
                                        <p className="text-slate-400 text-sm">On average for optimized users</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* Templates Preview */}
            <section id="templates" className="py-24 bg-slate-50">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12 reveal">
                        <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-4">Professional Templates</h2>
                        <p className="text-slate-600">Clean, parseable, and recruiter-approved.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { name: 'The Professional', delay: '0s' },
                            { name: 'The Modernist', delay: '0.1s' },
                            { name: 'The Executive', delay: '0.2s' }
                        ].map((template, idx) => (
                            <div key={idx} className="group relative bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden reveal">
                                <div className="aspect-[3/4] bg-slate-200 relative">
                                    <div className="absolute inset-4 bg-white shadow-sm flex flex-col p-4 gap-2 opacity-80 group-hover:scale-105 transition-transform duration-500">
                                        <div className="h-4 w-1/2 bg-slate-800"></div>
                                        <div className="h-2 w-full bg-slate-200"></div>
                                        <div className="h-24 w-full bg-slate-100 mt-2"></div>
                                    </div>

                                    <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                        <Link href={ROUTES.BUILDER} className="px-6 py-3 bg-white text-slate-900 rounded-lg font-bold transform translate-y-4 group-hover:translate-y-0 transition-transform">
                                            Use Template
                                        </Link>
                                    </div>
                                </div>
                                <div className="p-4 border-t border-slate-100 text-center">
                                    <h4 className="font-bold text-slate-800">{template.name}</h4>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Live Editing Experience */}
            <section className="py-24 bg-white border-y border-slate-100">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12 reveal">
                        <h2 className="text-3xl font-display font-bold text-slate-900 mb-2">Live Editing Experience</h2>
                        <p className="text-slate-600">Real-time preview as you type. No more guessing.</p>
                    </div>

                    {/* Fake Editor UI */}
                    <div className="max-w-5xl mx-auto rounded-xl border border-slate-200 shadow-2xl overflow-hidden bg-slate-900 reveal hover:shadow-indigo-500/20 transition-shadow duration-500">
                        <div className="h-8 bg-slate-800 flex items-center px-4 gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-400"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                            <div className="w-3 h-3 rounded-full bg-green-400"></div>
                        </div>
                        <div className="flex h-[400px] md:h-[500px]">
                            {/* Left Panel (Inputs) */}
                            <div className="w-1/3 bg-white border-r border-slate-200 p-6 space-y-4 hidden md:block">
                                <div className="space-y-1">
                                    <div className="h-2 w-12 bg-slate-200 rounded"></div>
                                    <div className="h-8 w-full bg-slate-100 rounded border border-slate-200 animate-pulse"></div>
                                </div>
                                <div className="space-y-1">
                                    <div className="h-2 w-12 bg-slate-200 rounded"></div>
                                    <div className="h-24 w-full bg-slate-100 rounded border border-slate-200 p-2">
                                        <div className="h-2 w-3/4 bg-slate-300 rounded mb-2"></div>
                                        <div className="h-2 w-1/2 bg-slate-300 rounded"></div>
                                    </div>
                                </div>
                                <div className="pt-4">
                                    <div className="h-10 w-full bg-indigo-600 rounded-lg opacity-90"></div>
                                </div>
                            </div>
                            {/* Right Panel (Preview) */}
                            <div className="flex-1 bg-slate-100 p-8 flex items-center justify-center">
                                <div className="w-full max-w-sm h-full bg-white shadow-lg p-6 space-y-3 transform hover:scale-[1.02] transition-transform duration-300">
                                    <div className="h-6 w-1/2 bg-slate-800"></div>
                                    <div className="h-3 w-full bg-slate-200"></div>
                                    <div className="h-3 w-full bg-slate-200"></div>
                                    <div className="mt-8 space-y-2">
                                        <div className="h-4 w-1/3 bg-slate-400"></div>
                                        <div className="h-2 w-full bg-slate-200"></div>
                                        <div className="h-2 w-full bg-slate-200"></div>
                                        <div className="h-2 w-3/4 bg-slate-200"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Social Proof */}
            <section className="py-24 bg-slate-50">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl font-display font-bold text-center text-slate-900 mb-16 reveal">Loved by job seekers</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm reveal hover-card">
                            <div className="flex text-yellow-400 mb-4 text-sm">
                                {[1, 2, 3, 4, 5].map(i => <i key={i} className="fa-solid fa-star"></i>)}
                            </div>
                            <p className="text-slate-600 mb-6">&quot;I applied to 50 jobs with my old resume and heard nothing. After using ResumeBP, I got 3 interviews in a week!&quot;</p>
                            <div className="font-bold text-sm text-slate-900 flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">SJ</div>
                                Sarah Jenkins
                            </div>
                        </div>
                        <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm reveal delay-100 hover-card">
                            <div className="flex text-yellow-400 mb-4 text-sm">
                                {[1, 2, 3, 4, 5].map(i => <i key={i} className="fa-solid fa-star"></i>)}
                            </div>
                            <p className="text-slate-600 mb-6">&quot;The ATS checker is a lifesaver. I didn&apos;t realize my resume format was unreadable by bots until now.&quot;</p>
                            <div className="font-bold text-sm text-slate-900 flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">MD</div>
                                Mark Davis
                            </div>
                        </div>
                        <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm reveal delay-200 hover-card">
                            <div className="flex text-yellow-400 mb-4 text-sm">
                                {[1, 2, 3, 4, 5].map(i => <i key={i} className="fa-solid fa-star"></i>)}
                            </div>
                            <p className="text-slate-600 mb-6">&quot;Simple, fast, and the templates look amazing. Worth every penny for the Pro plan.&quot;</p>
                            <div className="font-bold text-sm text-slate-900 flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-xs">EL</div>
                                Emma Lee
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Preview */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6 max-w-4xl text-center">
                    <h2 className="text-3xl font-display font-bold text-slate-900 mb-12">Plans for every career stage</h2>

                    {loading ? (
                        <div className="text-center py-10">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                            <p className="mt-4 text-slate-600">Loading pricing...</p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-3 gap-6 items-center">
                            {pricingPlans.map((plan, index) => {
                                const isDark = plan.theme === 'dark';

                                const handlePlanClick = () => {
                                    const checkoutUrl = ROUTES.checkoutWithPlan(plan.slug, 'monthly');

                                    // Check authentication and navigate
                                    if (isAuthenticated()) {
                                        router.push(checkoutUrl);
                                    } else {
                                        router.push(ROUTES.loginWithRedirect(checkoutUrl));
                                    }
                                };

                                return (
                                    <div
                                        key={plan.id}
                                        onClick={handlePlanClick}
                                        className={`p-6 rounded-xl transition-all opacity-100 cursor-pointer ${isDark
                                            ? 'bg-slate-900 text-white shadow-xl transform scale-105 relative hover:scale-110 duration-300'
                                            : 'border border-slate-200 text-slate-500 hover:border-indigo-200 hover:shadow-md'
                                            }`}
                                    >
                                        {plan.badge_text && (
                                            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-indigo-500 text-xs font-bold px-3 py-1 rounded-full animate-bounce">
                                                {plan.badge_text}
                                            </div>
                                        )}
                                        <h3 className={`font-bold ${isDark ? 'text-xl' : 'text-lg'} mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                            {plan.name}
                                        </h3>
                                        <p className={`font-bold mb-4 ${isDark ? 'text-4xl' : 'text-3xl'} ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                            {plan.pricing[detectedCurrency.toLowerCase() as 'usd' | 'inr' | 'eur'].formatted_monthly}
                                        </p>
                                        {plan.pricing.inr.monthly > 0 && (
                                            <p className={`text-sm mb-6 ${isDark ? 'text-indigo-200' : 'text-slate-500'}`}>
                                                /month
                                            </p>
                                        )}
                                        <ul className={`text-sm ${isDark ? 'space-y-3 mb-8 text-slate-300' : 'space-y-2 mb-6 text-slate-600'}`}>
                                            {plan.features.slice(0, isDark ? 4 : 3).map((feature, idx) => (
                                                <li key={idx}>{feature.text}</li>
                                            ))}
                                        </ul>
                                        {isDark && (
                                            <div className="block w-full py-3 bg-indigo-600 rounded-xl font-bold hover:bg-indigo-500 transition-colors shadow-lg hover:shadow-indigo-500/50 text-white">
                                                Get Started
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-24 bg-gradient-to-br from-indigo-900 to-slate-900 text-white text-center px-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-20">
                    <div className="absolute top-10 left-10 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl animate-[blob_7s_infinite]"></div>
                    <div className="absolute bottom-10 right-10 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-[blob_7s_infinite] animation-delay-2000"></div>
                </div>

                <div className="reveal relative z-10">
                    <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">Land your dream job today</h2>
                    <p className="text-indigo-200 text-lg mb-10 max-w-2xl mx-auto">Join thousands of professionals using AI to advance their careers.</p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link href={ROUTES.BUILDER} className="px-8 py-4 bg-white text-indigo-900 font-bold rounded-xl shadow-lg hover:bg-indigo-50 transition-colors transform hover:-translate-y-1">
                            Build Resume Free
                        </Link>
                        <Link href={ROUTES.ATS_CHECKER} className="px-8 py-4 bg-transparent border border-indigo-400 text-white font-bold rounded-xl hover:bg-indigo-900/50 transition-colors transform hover:-translate-y-1">
                            Check ATS Score
                        </Link>
                    </div>
                </div>
            </section>
        </MarketingLayout>
    );
}
