'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ROUTES } from '@/lib/routes';

export default function Header() {
    const router = useRouter();
    const { user, logout } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowUserMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        await logout();
        router.push(ROUTES.LOGIN);
    };

    const getUserInitials = () => {
        if (!user?.name) return 'U';
        return user.name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <nav className="glass-header fixed w-full z-50 top-0 bg-white/85 backdrop-blur-md border-b border-slate-200/60">
            <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                {/* Logo */}
                <Link href={ROUTES.HOME} className="flex items-center gap-2.5 group">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white text-lg shadow-lg group-hover:scale-105 transition-transform duration-300">
                        <i className="fa-solid fa-layer-group"></i>
                    </div>
                    <span className="text-xl font-display font-bold text-slate-900 tracking-tight">
                        Resume<span className="text-indigo-600">AI</span>
                    </span>
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-8">
                    <Link href={ROUTES.HOME} className="text-sm font-medium text-indigo-600">
                        Home
                    </Link>
                    <Link href={ROUTES.BUILDER} className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
                        Resume Builder
                    </Link>
                    <Link href={ROUTES.ATS_CHECKER} className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
                        ATS Checker
                    </Link>
                    <Link href={ROUTES.PRICING} className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
                        Pricing
                    </Link>
                    <Link href={ROUTES.CONTACT} className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
                        Contact
                    </Link>
                </div>

                {/* CTA */}
                <div className="hidden md:flex items-center gap-4">
                    {user ? (
                        <div className="relative" ref={menuRef}>
                            <button
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="flex items-center gap-2 hover:bg-slate-100 rounded-lg px-2 py-1.5 transition-all"
                            >
                                {user.avatar ? (
                                    <img
                                        src={user.avatar}
                                        alt={user.name}
                                        className="w-8 h-8 rounded-full object-cover border-2 border-slate-200"
                                    />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
                                        {getUserInitials()}
                                    </div>
                                )}
                                <span className="text-sm font-medium text-slate-700 max-w-[120px] truncate">
                                    {user.name || user.email}
                                </span>
                                <i className={`fa-solid fa-chevron-down text-xs text-slate-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`}></i>
                            </button>

                            {/* Dropdown Menu */}
                            {showUserMenu && (
                                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-2 animate-fade-in">
                                    {/* User Info */}
                                    <div className="px-4 py-3 border-b border-slate-100">
                                        <p className="text-sm font-bold text-slate-900">{user.name}</p>
                                        <p className="text-xs text-slate-500 truncate">{user.email}</p>
                                    </div>

                                    {/* Menu Items */}
                                    <Link
                                        href={ROUTES.PROFILE}
                                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors text-sm text-slate-700"
                                        onClick={() => setShowUserMenu(false)}
                                    >
                                        <i className="fa-solid fa-user w-4 text-slate-400"></i>
                                        Profile
                                    </Link>
                                    <Link
                                        href={ROUTES.MY_RESUMES}
                                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors text-sm text-slate-700"
                                        onClick={() => setShowUserMenu(false)}
                                    >
                                        <i className="fa-solid fa-file-lines w-4 text-slate-400"></i>
                                        My Resumes
                                    </Link>
                                    <div className="border-t border-slate-100 my-1"></div>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 transition-colors text-sm text-red-600"
                                    >
                                        <i className="fa-solid fa-right-from-bracket w-4"></i>
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <Link href={ROUTES.LOGIN} className="text-sm font-medium text-slate-600 hover:text-slate-900">
                                Log In
                            </Link>
                            <Link
                                href={ROUTES.BUILDER}
                                className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-bold shadow-lg hover:bg-slate-800 hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                            >
                                Build Resume Free
                            </Link>
                        </>
                    )}
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
                        <Link href={ROUTES.HOME} className="text-sm font-medium text-indigo-600" onClick={() => setMobileMenuOpen(false)}>
                            Home
                        </Link>
                        <Link href={ROUTES.BUILDER} className="text-sm font-medium text-slate-600" onClick={() => setMobileMenuOpen(false)}>
                            Resume Builder
                        </Link>
                        <Link href={ROUTES.ATS_CHECKER} className="text-sm font-medium text-slate-600" onClick={() => setMobileMenuOpen(false)}>
                            ATS Checker
                        </Link>
                        <Link href={ROUTES.PRICING} className="text-sm font-medium text-slate-600" onClick={() => setMobileMenuOpen(false)}>
                            Pricing
                        </Link>
                        <Link href={ROUTES.CONTACT} className="text-sm font-medium text-slate-600" onClick={() => setMobileMenuOpen(false)}>
                            Contact
                        </Link>
                        <div className="pt-4 border-t border-slate-200 flex flex-col gap-3">
                            {user ? (
                                <>
                                    <div className="flex items-center gap-3 px-3 py-2 bg-slate-50 rounded-lg">
                                        {user.avatar ? (
                                            <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-bold">
                                                {getUserInitials()}
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-sm font-bold text-slate-900">{user.name}</p>
                                            <p className="text-xs text-slate-500">{user.email}</p>
                                        </div>
                                    </div>
                                    <Link href={ROUTES.PROFILE} className="text-sm font-medium text-slate-600" onClick={() => setMobileMenuOpen(false)}>
                                        Profile
                                    </Link>
                                    <Link href={ROUTES.MY_RESUMES} className="text-sm font-medium text-slate-600" onClick={() => setMobileMenuOpen(false)}>
                                        My Resumes
                                    </Link>
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            setMobileMenuOpen(false);
                                        }}
                                        className="text-sm font-medium text-red-600 text-left"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link href={ROUTES.LOGIN} className="text-sm font-medium text-slate-600" onClick={() => setMobileMenuOpen(false)}>
                                        Log In
                                    </Link>
                                    <Link
                                        href={ROUTES.BUILDER}
                                        className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-bold text-center shadow-lg"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Build Resume Free
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
