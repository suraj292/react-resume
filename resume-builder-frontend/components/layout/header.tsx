'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <nav className="glass-header fixed w-full z-50 top-0 bg-white/85 backdrop-blur-md border-b border-slate-200/60">
            <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2.5 group">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white text-lg shadow-lg group-hover:scale-105 transition-transform duration-300">
                        <i className="fa-solid fa-layer-group"></i>
                    </div>
                    <span className="text-xl font-display font-bold text-slate-900 tracking-tight">
                        Resume<span className="text-indigo-600">AI</span>
                    </span>
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-8">
                    <Link href="/" className="text-sm font-medium text-indigo-600">
                        Home
                    </Link>
                    <Link href="/builder" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
                        Resume Builder
                    </Link>
                    <Link href="/ats-checker" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
                        ATS Checker
                    </Link>
                    <Link href="/pricing" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
                        Pricing
                    </Link>
                    <Link href="/contact" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
                        Contact
                    </Link>
                </div>

                {/* CTA */}
                <div className="hidden md:flex items-center gap-4">
                    <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900">
                        Log In
                    </Link>
                    <Link
                        href="/builder"
                        className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-bold shadow-lg hover:bg-slate-800 hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                    >
                        Build Resume Free
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-slate-600 text-xl"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    <i className={`fa-solid ${mobileMenuOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-white border-t border-slate-200 shadow-lg">
                    <div className="container mx-auto px-6 py-4 flex flex-col gap-4">
                        <Link href="/" className="text-sm font-medium text-indigo-600" onClick={() => setMobileMenuOpen(false)}>
                            Home
                        </Link>
                        <Link href="/builder" className="text-sm font-medium text-slate-600" onClick={() => setMobileMenuOpen(false)}>
                            Resume Builder
                        </Link>
                        <Link href="/ats-checker" className="text-sm font-medium text-slate-600" onClick={() => setMobileMenuOpen(false)}>
                            ATS Checker
                        </Link>
                        <Link href="/pricing" className="text-sm font-medium text-slate-600" onClick={() => setMobileMenuOpen(false)}>
                            Pricing
                        </Link>
                        <Link href="/contact" className="text-sm font-medium text-slate-600" onClick={() => setMobileMenuOpen(false)}>
                            Contact
                        </Link>
                        <div className="pt-4 border-t border-slate-200 flex flex-col gap-3">
                            <Link href="/login" className="text-sm font-medium text-slate-600" onClick={() => setMobileMenuOpen(false)}>
                                Log In
                            </Link>
                            <Link
                                href="/builder"
                                className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-bold text-center shadow-lg"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Build Resume Free
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
