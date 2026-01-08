'use client';

import MarketingLayout from '@/components/layout/marketing-layout';
import { useSEO } from '@/hooks/useSEO';
import Link from 'next/link';
import { ROUTES } from '@/lib/routes';

export default function PrivacyPage() {
    useSEO(
        'Privacy Policy - AI Resume Builder',
        'Your privacy is important to us. Learn how we collect, use, and protect your data when using our AI-powered resume builder.'
    );

    return (
        <MarketingLayout>
            {/* Hero Section */}
            <section className="bg-white border-b border-slate-100 pt-16 pb-12 text-center px-6 relative overflow-hidden">
                <div className="absolute top-0 left-1/4 w-64 h-64 bg-indigo-50 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob"></div>
                <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-50 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-2000"></div>

                <div className="relative z-10 max-w-3xl mx-auto animate-fade-in">
                    <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-4">Privacy Policy</h1>
                    <p className="text-slate-500 text-lg">
                        Your privacy is important to us. This policy explains how we collect, use, and protect your data.
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
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 pl-3">Contents</h4>
                            <a href="#info-collect" className="block px-3 py-2 text-sm text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">1. Information We Collect</a>
                            <a href="#how-use" className="block px-3 py-2 text-sm text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">2. How We Use Information</a>
                            <a href="#security" className="block px-3 py-2 text-sm text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">3. Storage & Security</a>
                            <a href="#third-party" className="block px-3 py-2 text-sm text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">4. Third-Party Services</a>
                            <a href="#cookies" className="block px-3 py-2 text-sm text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">5. Cookies</a>
                            <a href="#rights" className="block px-3 py-2 text-sm text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">6. Your Rights</a>
                            <a href="#contact" className="block px-3 py-2 text-sm text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">7. Contact Us</a>
                        </nav>
                    </aside>

                    {/* Policy Content */}
                    <div className="lg:col-span-9 bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-slate-100 policy-content animate-slide-up">
                        <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 mb-8">
                            <h3 className="text-indigo-900 font-bold mb-2 flex items-center gap-2">
                                <i className="fa-solid fa-shield-halved"></i> Trust Summary
                            </h3>
                            <p className="text-sm text-indigo-800">
                                We do <strong>not</strong> sell your resume data to recruiters, data brokers, or third parties. Your resume is yours, and we only use it to help you build it better.
                            </p>
                        </div>

                        <div id="info-collect" className="scroll-mt-24">
                            <h2 className="text-2xl font-display font-bold text-slate-900 mt-10 mb-4">1. Information We Collect</h2>
                            <p className="text-slate-600 mb-4 leading-relaxed">To provide our resume building and ATS checking services, we collect the following types of information:</p>
                            <ul className="list-disc pl-6 space-y-2 text-slate-600 mb-6">
                                <li><strong className="text-slate-900">Personal Information:</strong> Name, email address, and phone number when you create an account.</li>
                                <li><strong className="text-slate-900">Resume Content:</strong> Any text, images, or files you upload or type into the resume builder.</li>
                                <li><strong className="text-slate-900">Job Descriptions:</strong> Text you paste into the ATS Checker to compare against your resume.</li>
                                <li><strong className="text-slate-900">Usage Data:</strong> Information on how you interact with our website to help us improve performance.</li>
                                <li><strong className="text-slate-900">Payment Information:</strong> Handled by secure payment processors (Razorpay/Stripe). We do not store your full credit card information.</li>
                            </ul>
                        </div>

                        <div id="how-use" className="scroll-mt-24">
                            <h2 className="text-2xl font-display font-bold text-slate-900 mt-10 mb-4">2. How We Use Your Information</h2>
                            <p className="text-slate-600 mb-4 leading-relaxed">We use your data solely to deliver and improve our services:</p>
                            <ul className="list-disc pl-6 space-y-2 text-slate-600 mb-6">
                                <li>To generate, format, and download your resumes.</li>
                                <li>To analyze your resume against job descriptions and calculate ATS scores.</li>
                                <li>To improve our AI algorithms (e.g., suggesting better keywords or phrasing).</li>
                                <li>To send you important account updates, security alerts, and support messages.</li>
                                <li>To provide customer support when you encounter issues.</li>
                            </ul>
                        </div>

                        <div id="security" className="scroll-mt-24">
                            <h2 className="text-2xl font-display font-bold text-slate-900 mt-10 mb-4">3. Data Storage & Security</h2>
                            <p className="text-slate-600 mb-4 leading-relaxed">We take the security of your personal data seriously.</p>
                            <ul className="list-disc pl-6 space-y-2 text-slate-600 mb-6">
                                <li><strong className="text-slate-900">Encryption:</strong> All data transmitted between your browser and our servers is encrypted using SSL technology. Your data is also encrypted at rest in our databases.</li>
                                <li><strong className="text-slate-900">Secure Infrastructure:</strong> We use industry-leading cloud providers (like AWS or Google Cloud) with robust physical and digital security measures.</li>
                                <li><strong className="text-slate-900">Access Control:</strong> Access to your personal data is restricted to authorized personnel who need it to perform their job duties.</li>
                            </ul>
                        </div>

                        <div id="third-party" className="scroll-mt-24">
                            <h2 className="text-2xl font-display font-bold text-slate-900 mt-10 mb-4">4. Third-Party Services</h2>
                            <p className="text-slate-600 mb-4 leading-relaxed">We may share limited data with trusted third-party service providers to help us operate our business. These providers act on our behalf and are contractually obligated to protect your data.</p>
                            <ul className="list-disc pl-6 space-y-2 text-slate-600 mb-6">
                                <li><strong className="text-slate-900">Payment Processors:</strong> To securely process transactions.</li>
                                <li><strong className="text-slate-900">Analytics Providers:</strong> To understand website traffic and usage patterns (e.g., Google Analytics).</li>
                                <li><strong className="text-slate-900">Cloud Hosting:</strong> To store our application data securely.</li>
                            </ul>
                        </div>

                        <div id="cookies" className="scroll-mt-24">
                            <h2 className="text-2xl font-display font-bold text-slate-900 mt-10 mb-4">5. Cookies & Tracking</h2>
                            <p className="text-slate-600 mb-4 leading-relaxed">We use cookies (small text files stored on your device) to:</p>
                            <ul className="list-disc pl-6 space-y-2 text-slate-600 mb-6">
                                <li>Keep you logged in to your account.</li>
                                <li>Remember your preferences (like language or narrative tone).</li>
                                <li>Analyze how our site is used so we can improve it.</li>
                            </ul>
                            <p className="text-slate-600 mb-4 leading-relaxed">You can control or disable cookies through your browser settings, though some features of the platform may not function correctly without them.</p>
                        </div>

                        <div id="rights" className="scroll-mt-24">
                            <h2 className="text-2xl font-display font-bold text-slate-900 mt-10 mb-4">6. Your Rights & Data Retention</h2>
                            <p className="text-slate-600 mb-4 leading-relaxed">You have full control over your data:</p>
                            <ul className="list-disc pl-6 space-y-2 text-slate-600 mb-6">
                                <li><strong className="text-slate-900">Access & Update:</strong> You can view and edit your profile and resumes at any time via your dashboard.</li>
                                <li><strong className="text-slate-900">Delete Account:</strong> You can request the deletion of your account and all associated data from your profile settings.</li>
                                <li><strong className="text-slate-900">Data Portability:</strong> You can download your resumes in PDF or DOCX format at any time.</li>
                                <li><strong className="text-slate-900">Retention:</strong> We retain your data only for as long as you have an active account.</li>
                            </ul>
                        </div>

                        <div id="contact" className="scroll-mt-24 mt-12 pt-8 border-t border-slate-100">
                            <h2 className="text-2xl font-display font-bold text-slate-900 mb-4">7. Contact Us</h2>
                            <p className="text-slate-600 mb-4 leading-relaxed">If you have any questions or concerns about this Privacy Policy or your data, please reach out to us:</p>
                            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 inline-block">
                                <p className="mb-2 text-slate-700"><strong>Email:</strong> <a href="mailto:privacy@resumebuilder.com" className="text-indigo-600 hover:underline">privacy@resumebuilder.com</a></p>
                                <p className="mb-0 text-slate-700"><strong>Address:</strong> 123 Tech Park, Bangalore, India</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Trust Footer */}
            <section className="bg-white py-12 border-t border-slate-100">
                <div className="container mx-auto px-6 text-center">
                    <h3 className="text-lg font-bold text-slate-900 mb-6">Your data is safe with us</h3>
                    <div className="flex flex-wrap justify-center gap-8 opacity-70 hover:opacity-100 transition-opacity duration-500">
                        <div className="flex items-center gap-2">
                            <i className="fa-solid fa-lock text-2xl text-slate-400"></i>
                            <span className="font-bold text-slate-600">SSL Encrypted</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <i className="fa-solid fa-server text-2xl text-slate-400"></i>
                            <span className="font-bold text-slate-600">Secure Cloud Storage</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <i className="fa-solid fa-user-shield text-2xl text-slate-400"></i>
                            <span className="font-bold text-slate-600">GDPR Compliant</span>
                        </div>
                    </div>
                </div>
            </section>
        </MarketingLayout>
    );
}
