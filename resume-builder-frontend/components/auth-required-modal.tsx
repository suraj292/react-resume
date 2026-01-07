'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';

interface AuthRequiredModalProps {
    onClose?: () => void;
}

export default function AuthRequiredModal({ onClose }: AuthRequiredModalProps) {
    const [isMounted, setIsMounted] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Mount the component
        setIsMounted(true);

        // Trigger animation start slightly after mount
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => {
            window.location.href = '/';
        }, 300); // Wait for fade out animation
    };

    if (!isMounted) return null;

    return createPortal(
        <div className="relative z-50">
            {/* Backdrop */}
            <div
                className={`fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 transition-all duration-300 ease-out ${isVisible ? 'opacity-100' : 'opacity-0'
                    }`}
                onClick={handleClose}
            >
                {/* Modal Card */}
                <div
                    className={`relative max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 ease-out delay-100 ${isVisible
                        ? 'opacity-100 scale-100 translate-y-0'
                        : 'opacity-0 scale-95 translate-y-4'
                        }`}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Animated Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 opacity-10"></div>
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-pulse"></div>

                    {/* Content */}
                    <div className="relative p-8 text-center">
                        {/* Animated Icon */}
                        <div className="mb-6 relative">
                            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center animate-bounce-slow">
                                <i className="fa-solid fa-lock text-3xl text-indigo-600"></i>
                            </div>
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-20 bg-indigo-400 rounded-full blur-2xl opacity-20 animate-pulse"></div>
                        </div>

                        {/* Title */}
                        <h2 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">
                            Authentication Required
                        </h2>

                        {/* Message */}
                        <p className="text-slate-600 mb-6 leading-relaxed">
                            Please <span className="font-bold text-indigo-600">sign in</span> or{' '}
                            <span className="font-bold text-purple-600">create an account</span> to access this feature.
                        </p>

                        {/* Benefits */}
                        <div className="mb-6 bg-slate-50 rounded-2xl p-4 text-left">
                            <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Why Sign Up?</p>
                            <ul className="space-y-2">
                                {[
                                    "Build professional ATS-optimized resumes",
                                    "AI-powered content generation & optimization",
                                    "Save and manage multiple resume versions",
                                    "Real-time ATS compatibility scoring"
                                ].map((benefit, index) => (
                                    <li key={index} className="flex items-start gap-2 text-xs text-slate-600">
                                        <i className="fa-solid fa-check-circle text-green-500 mt-0.5"></i>
                                        <span>{benefit}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 gap-3">
                            <Link
                                href="/login"
                                className="group relative px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transition-all overflow-hidden"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    <i className="fa-solid fa-right-to-bracket"></i>
                                    Sign In
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                            </Link>

                            <Link
                                href="/login?tab=register"
                                className="group relative px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transition-all overflow-hidden"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    <i className="fa-solid fa-user-plus"></i>
                                    Sign Up
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                            </Link>
                        </div>

                        {/* Close Button */}
                        <button
                            onClick={handleClose}
                            className="mt-4 text-xs text-slate-400 hover:text-slate-600 transition-colors underline"
                        >
                            Maybe later
                        </button>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute top-4 right-4 w-32 h-32 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-4 left-4 w-24 h-24 bg-gradient-to-br from-pink-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
                </div>
            </div>

            {/* Embedded Styles for the bounce animation */}
            <style jsx>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      `}</style>
        </div>,
        document.body
    );
}
