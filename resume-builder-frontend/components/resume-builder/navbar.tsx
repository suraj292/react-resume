'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { useResumeStore } from '@/lib/stores/resume-store';
import { useUIStore } from '@/lib/stores/ui-store';
import { useAuth } from '@/contexts/AuthContext';
import { pdfAPI } from '@/lib/api';

interface NavbarProps {
    isSaving: boolean;
    isDirty: boolean;
}

export function Navbar({ isSaving, isDirty }: NavbarProps) {
    const router = useRouter();
    const { lastSaved, currentResume } = useResumeStore();
    const { toggleMobileSidebar } = useUIStore();
    const { user, logout } = useAuth();
    const [isExporting, setIsExporting] = useState(false);
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

    const getSaveStatus = () => {
        if (isSaving) return 'Saving...';
        if (isDirty) return 'Unsaved changes';
        if (lastSaved) {
            return `Draft saved ${formatDistanceToNow(lastSaved, { addSuffix: true })}`;
        }
        return 'All changes saved';
    };

    const handleLogout = async () => {
        await logout();
        router.push('/login');
    };

    const handleExportPDF = async () => {
        setIsExporting(true);
        try {
            const resumeElement = document.getElementById('resume-sheet');
            if (!resumeElement) {
                alert('Resume preview not found');
                setIsExporting(false);
                return;
            }

            // Clone the element to avoid modifying the original
            const clonedElement = resumeElement.cloneNode(true) as HTMLElement;

            // Remove shadow and transform for PDF
            clonedElement.style.boxShadow = 'none';
            clonedElement.style.transform = 'none';
            clonedElement.classList.remove('shadow-2xl');

            // Get all CSS rules from stylesheets
            let allStyles = '';
            try {
                allStyles = Array.from(document.styleSheets)
                    .map(styleSheet => {
                        try {
                            return Array.from(styleSheet.cssRules)
                                .map(rule => rule.cssText)
                                .join('\n');
                        } catch (e) {
                            // Skip external stylesheets that cause CORS issues
                            return '';
                        }
                    })
                    .join('\n');
            } catch (e) {
                console.warn('Could not extract all styles:', e);
            }

            // Add PDF-specific styles for proper page breaks
            const pdfStyles = `
                @page {
                    size: A4;
                    margin: 0;
                }
                
                #resume-sheet {
                    box-shadow: none !important;
                    transform: none !important;
                }
                
                /* Hide page break indicators in PDF */
                .page-break-indicator {
                    display: none !important;
                }
                
                /* Prevent page breaks inside important elements */
                h1, h2, h3, h4, h5, h6 {
                    page-break-after: avoid;
                    break-after: avoid;
                }
                
                /* Allow page breaks between sections and add padding after breaks */
                .space-y-8 > * {
                    page-break-inside: avoid;
                    break-inside: avoid;
                }
            `;

            // Create complete HTML with all styles
            const completeHtml = `
                <style>
                    ${allStyles}
                    ${pdfStyles}
                </style>
                ${clonedElement.outerHTML}
            `;

            // Generate filename
            const filename = currentResume?.personal?.name
                ? `${currentResume.personal.name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}_${new Date().toISOString().split('T')[0]}.pdf`
                : `resume_${new Date().toISOString().split('T')[0]}.pdf`;

            // Call backend API
            const response = await pdfAPI.export({
                html: completeHtml,
                filename: filename,
            });

            // Download the PDF
            // response.data is the blob because of responseType: 'blob' in api client
            const blob = response.data;
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            setIsExporting(false);

        } catch (error) {
            console.error('Error exporting PDF:', error);
            alert('Failed to export PDF. Please try again.');
            setIsExporting(false);
        }
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
        <nav className="fixed top-0 left-0 right-0 h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 z-50">
            <div className="flex items-center gap-3">
                {/* Mobile Menu Toggle */}
                <button
                    onClick={toggleMobileSidebar}
                    className="lg:hidden w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
                >
                    <i className="fa-solid fa-bars text-base"></i>
                </button>
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold italic shadow-indigo-200 shadow-lg">
                        R
                    </div>
                    <span className="font-display font-bold text-lg tracking-tight hidden md:block">
                        ResumeBP
                    </span>
                </Link>

            </div>

            <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-400 hidden sm:block italic">
                    {getSaveStatus()}
                </span>
                <button
                    onClick={handleExportPDF}
                    disabled={isExporting}
                    className="bg-slate-900 hover:bg-slate-800 text-white px-3 sm:px-4 py-1.5 rounded-lg font-bold text-xs transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <i className={`fa-solid ${isExporting ? 'fa-spinner fa-spin' : 'fa-download'} text-[10px]`}></i>
                    <span className="hidden sm:inline">{isExporting ? 'Exporting...' : 'Export PDF'}</span>
                    <span className="sm:hidden">{isExporting ? '...' : 'Export'}</span>
                </button>

                {/* User Menu or Login */}
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
                            <span className="hidden md:block text-sm font-medium text-slate-700 max-w-[120px] truncate">
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
                                    href="/profile"
                                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors text-sm text-slate-700"
                                    onClick={() => setShowUserMenu(false)}
                                >
                                    <i className="fa-solid fa-user w-4 text-slate-400"></i>
                                    Profile
                                </Link>
                                <Link
                                    href="/my-resume"
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
                    <Link
                        href="/login"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-lg font-bold text-xs transition-all"
                    >
                        Login
                    </Link>
                )}
            </div>
        </nav>
    );
}
