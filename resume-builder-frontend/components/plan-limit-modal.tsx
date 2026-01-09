'use client';

import { useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/routes';

interface PlanLimitModalProps {
    isOpen: boolean;
    onClose: () => void;
    limitData: {
        error: string;
        message: string;
        limits: {
            plan_name: string;
            plan_slug: string;
            resumes: {
                limit: number;
                used: number;
                remaining: number;
            };
            templates: {
                limit: number;
                accessible: number;
            };
            downloads: {
                limit: number;
                used: number;
                remaining: number;
            };
            ai_requests: {
                limit: number;
                used: number;
                remaining: number;
            };
            can_export_pdf: boolean;
            can_export_docx: boolean;
        };
        upgrade_required: boolean;
    };
}

export default function PlanLimitModal({ isOpen, onClose, limitData }: PlanLimitModalProps) {
    const router = useRouter();

    if (!isOpen) return null;

    const { limits, message } = limitData;
    const aiProgress = limits.ai_requests.limit > 0
        ? (limits.ai_requests.used / limits.ai_requests.limit) * 100
        : 100;
    const resumesProgress = limits.resumes.limit > 0
        ? (limits.resumes.used / limits.resumes.limit) * 100
        : 0;

    const handleUpgrade = () => {
        router.push(ROUTES.PRICING);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity animate-fade-in"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-in">
                {/* Decorative Top Bar */}
                <div className="h-2 bg-gradient-to-r from-orange-400 to-pink-500"></div>

                <div className="p-8">
                    {/* Icon */}
                    <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                        <i className="fa-solid fa-lock text-2xl text-orange-500"></i>
                    </div>

                    {/* Text */}
                    <div className="text-center mb-8">
                        <h3 className="text-2xl font-display font-bold text-slate-900 mb-2">Plan Limit Reached</h3>
                        <p className="text-slate-500 text-sm leading-relaxed">
                            {message}
                        </p>
                    </div>

                    {/* Usage Stats */}
                    <div className="bg-slate-50 rounded-xl p-5 mb-8 border border-slate-100 space-y-4">
                        {/* AI Requests */}
                        <div>
                            <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                                <span>AI Requests</span>
                                <span className="text-red-500">
                                    {limits.ai_requests.used} / {limits.ai_requests.limit}
                                </span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2">
                                <div
                                    className="bg-red-500 h-2 rounded-full transition-all duration-500"
                                    style={{ width: `${aiProgress}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* Resumes */}
                        <div>
                            <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                                <span>Resumes Created</span>
                                <span className={resumesProgress >= 100 ? 'text-red-500' : 'text-slate-900'}>
                                    {limits.resumes.used} / {limits.resumes.limit}
                                </span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2">
                                <div
                                    className={`h-2 rounded-full transition-all duration-500 ${resumesProgress >= 100 ? 'bg-red-500' : 'bg-orange-400'}`}
                                    style={{ width: `${resumesProgress}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* Downloads (if applicable) */}
                        {limits.downloads.limit > 0 && (
                            <div>
                                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                                    <span>Downloads</span>
                                    <span className={limits.downloads.remaining === 0 ? 'text-red-500' : 'text-slate-900'}>
                                        {limits.downloads.used} / {limits.downloads.limit}
                                    </span>
                                </div>
                                <div className="w-full bg-slate-200 rounded-full h-2">
                                    <div
                                        className={`h-2 rounded-full transition-all duration-500 ${limits.downloads.remaining === 0 ? 'bg-red-500' : 'bg-blue-400'}`}
                                        style={{ width: `${(limits.downloads.used / limits.downloads.limit) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="space-y-3">
                        <button
                            onClick={handleUpgrade}
                            className="w-full py-3.5 bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                        >
                            <i className="fa-solid fa-bolt text-yellow-400"></i> Upgrade to Pro
                        </button>
                        <button
                            onClick={onClose}
                            className="w-full py-3.5 text-slate-500 font-medium hover:text-slate-800 transition-colors text-sm"
                        >
                            Maybe Later
                        </button>
                    </div>
                </div>

                {/* Footer Note */}
                <div className="bg-slate-50 p-4 text-center border-t border-slate-100">
                    <p className="text-xs text-slate-400">
                        Current Plan: <span className="font-bold text-slate-600 uppercase">{limits.plan_name}</span>
                    </p>
                </div>
            </div>

            <style jsx>{`
                @keyframes fade-in {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }

                @keyframes scale-in {
                    from {
                        opacity: 0;
                        transform: scale(0.9);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }

                .animate-fade-in {
                    animation: fade-in 0.2s ease-out;
                }

                .animate-scale-in {
                    animation: scale-in 0.3s ease-out;
                }
            `}</style>
        </div>
    );
}
