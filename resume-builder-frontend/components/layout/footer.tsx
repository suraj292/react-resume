'use client';

import Link from 'next/link';
import { ROUTES } from '@/lib/routes';

export default function Footer() {
    return (
        <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-center md:text-left">
                        <h3 className="text-xl font-display font-bold text-white mb-2">
                            Resume<span className="text-indigo-400">BP</span>
                        </h3>
                        <p className="text-sm text-slate-400">Build ATS-friendly resumes in minutes</p>
                    </div>
                    <div className="flex gap-6 text-sm">
                        <Link href={ROUTES.ABOUT} className="hover:text-white transition-colors">
                            About
                        </Link>
                        <Link href={ROUTES.PRICING} className="hover:text-white transition-colors">
                            Pricing
                        </Link>
                        <Link href={ROUTES.PRIVACY} className="hover:text-white transition-colors">
                            Privacy
                        </Link>
                        <Link href={ROUTES.TERMS} className="hover:text-white transition-colors">
                            Terms
                        </Link>
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
                    © {new Date().getFullYear()} ResumeBP. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
