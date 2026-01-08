'use client';

import MarketingLayout from '@/components/layout/marketing-layout';
import { useSEO } from '@/hooks/useSEO';
import Link from 'next/link';
import { ROUTES } from '@/lib/routes';

export default function RefundPolicyPage() {
    useSEO(
        'Refund & Cancellation Policy - AI Resume Builder',
        'We believe in fairness and transparency. Here is everything you need to know about our billing, refunds, and cancellations.'
    );

    return (
        <MarketingLayout>
            {/* Hero Section */}
            <section className="bg-white border-b border-slate-100 pt-16 pb-12 text-center px-6 relative overflow-hidden">
                <div className="absolute top-0 left-1/4 w-64 h-64 bg-indigo-50 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob"></div>
                <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-50 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-2000"></div>

                <div className="relative z-10 max-w-3xl mx-auto animate-fade-in">
                    <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-4">Refund & Cancellation Policy</h1>
                    <p className="text-slate-500 text-lg">
                        We believe in fairness and transparency. Here is everything you need to know about our billing, refunds, and cancellations.
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
                            <a href="#free-plan" className="block px-3 py-2 text-sm text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">1. Free Plan</a>
                            <a href="#paid-subscriptions" className="block px-3 py-2 text-sm text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">2. Paid Subscriptions</a>
                            <a href="#refund-policy" className="block px-3 py-2 text-sm text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">3. Refund Policy</a>
                            <a href="#cancellation" className="block px-3 py-2 text-sm text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">4. Cancellation</a>
                            <a href="#payment-failures" className="block px-3 py-2 text-sm text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">5. Payment Failures</a>
                            <a href="#how-to-request" className="block px-3 py-2 text-sm text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">6. How to Request</a>
                        </nav>
                    </aside>

                    {/* Policy Content */}
                    <div className="lg:col-span-9 bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-slate-100 policy-content animate-slide-up">
                        <div className="p-4 bg-green-50 rounded-xl border border-green-100 mb-8 flex items-start gap-3">
                            <i className="fa-solid fa-hand-holding-heart text-green-600 mt-1"></i>
                            <p className="text-sm text-green-900 m-0">
                                <strong>Our Promise:</strong> We want you to be happy with AI Resume Builder. If you have an issue, please contact us first, and we will do our best to resolve it.
                            </p>
                        </div>

                        <div id="free-plan" className="scroll-mt-24">
                            <h2 className="text-2xl font-display font-bold text-slate-900 mt-10 mb-4">1. Free Plan</h2>
                            <p className="text-slate-600 mb-4 leading-relaxed">AI Resume Builder offers a free tier that allows users to create a resume and test our features without any cost.</p>
                            <ul className="list-disc pl-6 space-y-2 text-slate-600 mb-6">
                                <li><strong className="text-slate-900">Charges:</strong> $0. No credit card is required.</li>
                                <li><strong className="text-slate-900">Refunds:</strong> Since there is no charge, the concept of a refund does not apply to the Free plan.</li>
                            </ul>
                        </div>

                        <div id="paid-subscriptions" className="scroll-mt-24">
                            <h2 className="text-2xl font-display font-bold text-slate-900 mt-10 mb-4">2. Paid Subscriptions</h2>
                            <p className="text-slate-600 mb-4 leading-relaxed">We offer Pro and Premium plans billed on a subscription basis (Monthly or Yearly).</p>
                            <ul className="list-disc pl-6 space-y-2 text-slate-600 mb-6">
                                <li><strong className="text-slate-900">Billing Cycle:</strong> You are billed in advance at the start of each billing cycle.</li>
                                <li><strong className="text-slate-900">Automatic Renewal:</strong> To ensure uninterrupted service, subscriptions automatically renew at the end of each billing period unless cancelled.</li>
                            </ul>
                        </div>

                        <div id="refund-policy" className="scroll-mt-24">
                            <h2 className="text-2xl font-display font-bold text-slate-900 mt-10 mb-4">3. Refund Policy</h2>
                            <p className="text-slate-600 mb-4 leading-relaxed">We offer a <strong className="text-slate-900">7-day money-back guarantee</strong> for first-time purchases of our paid plans, subject to the following conditions:</p>
                            <ul className="list-disc pl-6 space-y-2 text-slate-600 mb-6">
                                <li><strong className="text-slate-900">Eligibility:</strong> Refund requests must be made within 7 days of the initial purchase date.</li>
                                <li><strong className="text-slate-900">Good Faith:</strong> Refunds are generally granted if you are unsatisfied with the service or experienced technical issues that we could not resolve.</li>
                                <li><strong className="text-slate-900">Non-Refundable Cases:</strong> We reserve the right to deny refunds in cases where you have downloaded multiple resumes or used a significant amount of AI credits (fair use policy), the request is made after the 7-day window, or the account has violated our Terms of Service.</li>
                            </ul>
                        </div>

                        <div id="cancellation" className="scroll-mt-24">
                            <h2 className="text-2xl font-display font-bold text-slate-900 mt-10 mb-4">4. Cancellation Policy</h2>
                            <p className="text-slate-600 mb-4 leading-relaxed">You are free to cancel your subscription at any time.</p>
                            <ul className="list-disc pl-6 space-y-2 text-slate-600 mb-6">
                                <li><strong className="text-slate-900">How to Cancel:</strong> Go to &apos;Account Settings&apos; &gt; &apos;Subscription&apos; and click &apos;Cancel Subscription&apos;.</li>
                                <li><strong className="text-slate-900">Access:</strong> After cancellation, you will continue to have access to paid features until the end of your current billing period.</li>
                                <li><strong className="text-slate-900">No Partial Refunds:</strong> We do not offer pro-rated refunds for unused days in a billing cycle. Once you cancel, no further charges will be applied.</li>
                            </ul>
                        </div>

                        <div id="payment-failures" className="scroll-mt-24">
                            <h2 className="text-2xl font-display font-bold text-slate-900 mt-10 mb-4">5. Payment Failures & Chargebacks</h2>
                            <p className="text-slate-600 mb-4 leading-relaxed">If a payment fails (e.g., expired card, insufficient funds):</p>
                            <ul className="list-disc pl-6 space-y-2 text-slate-600 mb-6">
                                <li>We will attempt to process the payment again over the next few days.</li>
                                <li>If payment continues to fail, your account will be downgraded to the Free plan automatically.</li>
                            </ul>
                            <p className="text-slate-600 mb-4 leading-relaxed"><strong className="text-slate-900">Chargebacks:</strong> If you initiate a chargeback dispute with your bank, your account will be immediately suspended pending investigation. We recommend contacting our support team first to resolve billing issues amicably.</p>
                        </div>

                        <div id="how-to-request" className="scroll-mt-24 mt-12 pt-8 border-t border-slate-100">
                            <h2 className="text-2xl font-display font-bold text-slate-900 mb-4">6. How to Request a Refund</h2>
                            <p className="text-slate-600 mb-4 leading-relaxed">To request a refund, please email our billing team with the following details:</p>
                            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 w-full">
                                <ul className="list-disc pl-6 space-y-2 text-slate-600 mb-4">
                                    <li><strong className="text-slate-900">Email To:</strong> <a href="mailto:billing@resumebuilder.com" className="text-indigo-600 hover:underline">billing@resumebuilder.com</a></li>
                                    <li><strong className="text-slate-900">Subject Line:</strong> Refund Request - [Your Email Address]</li>
                                    <li><strong className="text-slate-900">Details:</strong> Please include your transaction ID (found in your email receipt) and a brief reason for the request.</li>
                                </ul>
                                <p className="text-sm text-slate-500 mb-0"><em>We typically process refund requests within 3-5 business days. Once processed, it may take 5-10 days for the funds to appear in your bank account depending on your bank's policies.</em></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MarketingLayout>
    );
}
