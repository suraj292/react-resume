'use client';

import MarketingLayout from '@/components/layout/marketing-layout';
import { useSEO } from '@/hooks/useSEO';
import Link from 'next/link';
import { ROUTES } from '@/lib/routes';

export default function TermsPage() {
    useSEO(
        'Terms of Service - AI Resume Builder',
        'By using our platform, you agree to the following terms. We\'ve written them in plain English to ensure clarity and fairness.'
    );

    return (
        <MarketingLayout>
            {/* Hero Section */}
            <section className="bg-white border-b border-slate-100 pt-16 pb-12 text-center px-6 relative overflow-hidden">
                <div className="absolute top-0 left-1/4 w-64 h-64 bg-indigo-50 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob"></div>
                <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-50 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-2000"></div>

                <div className="relative z-10 max-w-3xl mx-auto animate-fade-in">
                    <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-4">Terms & Conditions</h1>
                    <p className="text-slate-500 text-lg">
                        By using our platform, you agree to the following terms. We've written them in plain English to ensure clarity and fairness.
                    </p>
                    <p className="text-sm text-slate-400 mt-4">Last Updated: January 8, 2026</p>
                </div>
            </section>

            {/* Main Content */}
            <div className="container mx-auto px-6 py-12 max-w-6xl">
                <div className="grid lg:grid-cols-12 gap-12">
                    {/* Sidebar Navigation */}
                    <aside className="hidden lg:block lg:col-span-3">
                        <nav className="sticky top-24 space-y-1">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 pl-3">Table of Contents</h4>
                            <a href="#acceptance" className="block px-3 py-2 text-sm text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">1. Acceptance of Terms</a>
                            <a href="#services" className="block px-3 py-2 text-sm text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">2. Services</a>
                            <a href="#responsibilities" className="block px-3 py-2 text-sm text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">3. User Responsibilities</a>
                            <a href="#ai-disclaimer" className="block px-3 py-2 text-sm text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">4. AI Disclaimer</a>
                            <a href="#payments" className="block px-3 py-2 text-sm text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">5. Payments</a>
                            <a href="#ip" className="block px-3 py-2 text-sm text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">6. Intellectual Property</a>
                            <a href="#liability" className="block px-3 py-2 text-sm text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">7. Liability</a>
                            <a href="#contact" className="block px-3 py-2 text-sm text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">8. Contact Us</a>
                        </nav>
                    </aside>

                    {/* Terms Content */}
                    <div className="lg:col-span-9 bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-slate-100 policy-content animate-slide-up">
                        <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 mb-8 flex items-start gap-3">
                            <i className="fa-solid fa-scale-balanced text-amber-600 mt-1"></i>
                            <p className="text-sm text-amber-900 m-0">
                                <strong>Summary:</strong> Treat our platform with respect, don't use it for illegal activities, and understand that our AI suggestions are tools to help you, not guarantees of employment.
                            </p>
                        </div>

                        <div id="acceptance" className="scroll-mt-24">
                            <h2 className="text-2xl font-display font-bold text-slate-900 mt-10 mb-4">1. Acceptance of Terms</h2>
                            <p className="text-slate-600 mb-4 leading-relaxed">By accessing or using AI Resume Builder (the "Service"), you agree to be bound by these Terms & Conditions. If you do not agree with any part of these terms, you may not use our Service.</p>
                        </div>

                        <div id="services" className="scroll-mt-24">
                            <h2 className="text-2xl font-display font-bold text-slate-900 mt-10 mb-4">2. Service Description</h2>
                            <p className="text-slate-600 mb-4 leading-relaxed">AI Resume Builder provides online tools for career development, including:</p>
                            <ul className="list-disc pl-6 space-y-2 text-slate-600 mb-6">
                                <li><strong className="text-slate-900">Resume Builder:</strong> An AI-powered tool to create and format professional resumes.</li>
                                <li><strong className="text-slate-900">ATS Checker:</strong> An analysis tool that simulates Applicant Tracking Systems to score your resume.</li>
                                <li><strong className="text-slate-900">Templates:</strong> Pre-designed document layouts for resumes and cover letters.</li>
                            </ul>
                            <p className="text-slate-600 mb-4 leading-relaxed">We work hard to ensure our services are available 24/7, but we cannot guarantee zero downtime due to maintenance or unforeseen technical issues.</p>
                        </div>

                        <div id="responsibilities" className="scroll-mt-24">
                            <h2 className="text-2xl font-display font-bold text-slate-900 mt-10 mb-4">3. User Responsibilities</h2>
                            <p className="text-slate-600 mb-4 leading-relaxed">When using our platform, you agree to:</p>
                            <ul className="list-disc pl-6 space-y-2 text-slate-600 mb-6">
                                <li>Provide accurate, current, and complete information about yourself.</li>
                                <li>Maintain the security of your account password.</li>
                                <li>Not upload content that is illegal, offensive, defamatory, or violates the rights of others.</li>
                                <li>Not use the Service to spam recruiters or employers.</li>
                                <li>Not attempt to reverse engineer, hack, or compromise our platform's security.</li>
                            </ul>
                            <p className="text-slate-600 mb-4 leading-relaxed">We reserve the right to suspend or terminate accounts that violate these rules without prior notice.</p>
                        </div>

                        <div id="ai-disclaimer" className="scroll-mt-24">
                            <h2 className="text-2xl font-display font-bold text-slate-900 mt-10 mb-4">4. AI & Employment Disclaimer</h2>
                            <p className="text-slate-600 mb-4 leading-relaxed">Our platform uses Artificial Intelligence to provide suggestions, optimizations, and scores. It is important to understand that:</p>
                            <ul className="list-disc pl-6 space-y-2 text-slate-600 mb-6">
                                <li><strong className="text-slate-900">No Guarantees:</strong> While we aim to improve your chances, we <strong>do not guarantee</strong> that using our Service will result in job interviews, offers, or employment.</li>
                                <li><strong className="text-slate-900">Accuracy:</strong> AI suggestions are based on patterns and data but may not always be perfect. You are responsible for reviewing and verifying all content on your resume before submitting it to employers.</li>
                                <li><strong className="text-slate-900">ATS Scoring:</strong> Our ATS score is an estimation based on common industry standards. Different companies use different systems.</li>
                            </ul>
                        </div>

                        <div id="payments" className="scroll-mt-24">
                            <h2 className="text-2xl font-display font-bold text-slate-900 mt-10 mb-4">5. Subscriptions & Payments</h2>
                            <p className="text-slate-600 mb-4 leading-relaxed">We offer both free and paid subscription plans.</p>
                            <ul className="list-disc pl-6 space-y-2 text-slate-600 mb-6">
                                <li><strong className="text-slate-900">Billing:</strong> Paid plans are billed in advance on a recurring and periodic basis (monthly or yearly).</li>
                                <li><strong className="text-slate-900">Payment Processors:</strong> We use secure third-party payment processors (such as Razorpay or Stripe).</li>
                                <li><strong className="text-slate-900">Cancellations:</strong> You may cancel your subscription at any time via your account settings.</li>
                                <li><strong className="text-slate-900">Refunds:</strong> Refund requests are handled on a case-by-case basis as per our <Link href={ROUTES.REFUND} className="text-indigo-600 hover:underline">Refund Policy</Link>.</li>
                            </ul>
                        </div>

                        <div id="ip" className="scroll-mt-24">
                            <h2 className="text-2xl font-display font-bold text-slate-900 mt-10 mb-4">6. Intellectual Property</h2>
                            <p className="text-slate-600 mb-4 leading-relaxed"><strong className="text-slate-900">Your Content:</strong> You retain full ownership of the personal data and resume content you upload or create. We claim no intellectual property rights over your personal career history.</p>
                            <p className="text-slate-600 mb-4 leading-relaxed"><strong className="text-slate-900">Our Content:</strong> The platform, including its code, design, logos, AI models, and templates, is the exclusive property of AI Resume Builder and is protected by copyright and intellectual property laws.</p>
                        </div>

                        <div id="liability" className="scroll-mt-24">
                            <h2 className="text-2xl font-display font-bold text-slate-900 mt-10 mb-4">7. Limitation of Liability</h2>
                            <p className="text-slate-600 mb-4 leading-relaxed">To the maximum extent permitted by law, AI Resume Builder shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.</p>
                        </div>

                        <div id="contact" className="scroll-mt-24 mt-12 pt-8 border-t border-slate-100">
                            <h2 className="text-2xl font-display font-bold text-slate-900 mb-4">8. Contact Us</h2>
                            <p className="text-slate-600 mb-4 leading-relaxed">If you have any questions about these Terms, please contact us:</p>
                            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 inline-block">
                                <p className="mb-2 text-slate-700"><strong>Email:</strong> <a href="mailto:legal@resumebuilder.com" className="text-indigo-600 hover:underline">legal@resumebuilder.com</a></p>
                                <p className="mb-0 text-slate-700"><strong>Address:</strong> 123 Tech Park, Bangalore, India</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MarketingLayout>
    );
}
