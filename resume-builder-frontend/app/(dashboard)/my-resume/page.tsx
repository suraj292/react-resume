'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { resumeAPI } from '@/lib/api';

interface Resume {
    id: number;
    title: string;
    template: string;
    ats_score?: number;
    updated_at: string;
    created_at: string;
    is_draft?: boolean;
}

export default function MyResumePage() {
    const router = useRouter();
    const { user, loading, logout } = useAuth();
    const [resumes, setResumes] = useState<Resume[]>([]);
    const [isLoadingResumes, setIsLoadingResumes] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('last_edited');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [resumeToDelete, setResumeToDelete] = useState<number | null>(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [activeMenuId, setActiveMenuId] = useState<number | null>(null);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    useEffect(() => {
        const loadResumes = async () => {
            if (!user) return;

            try {
                setIsLoadingResumes(true);
                const response = await resumeAPI.getAll();
                if (response.data.success) {
                    setResumes(response.data.data || []);
                }
            } catch (error) {
                console.error('Failed to load resumes:', error);
                setResumes([]);
            } finally {
                setIsLoadingResumes(false);
            }
        };

        loadResumes();
    }, [user]);

    const handleLogout = async () => {
        await logout();
        router.push('/login');
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

    const handleDeleteClick = (resumeId: number) => {
        setResumeToDelete(resumeId);
        setShowDeleteModal(true);
        setActiveMenuId(null);
    };

    const confirmDelete = async () => {
        if (!resumeToDelete) return;

        try {
            await resumeAPI.delete(resumeToDelete);
            setResumes(resumes.filter(r => r.id !== resumeToDelete));
            setShowDeleteModal(false);
            setResumeToDelete(null);
            displayToast('Resume deleted successfully');
        } catch (error) {
            console.error('Failed to delete resume:', error);
            displayToast('Failed to delete resume');
        }
    };

    const displayToast = (message: string) => {
        setToastMessage(message);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    const filteredResumes = resumes.filter(resume =>
        resume.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getAverageAtsScore = () => {
        const scoresWithValues = resumes.filter(r => r.ats_score && r.ats_score > 0);
        if (scoresWithValues.length === 0) return 0;
        const sum = scoresWithValues.reduce((acc, r) => acc + (r.ats_score || 0), 0);
        return Math.round(sum / scoresWithValues.length);
    };

    const getTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMs = now.getTime() - date.getTime();
        const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
        const diffInDays = Math.floor(diffInHours / 24);

        if (diffInHours < 1) return 'Just now';
        if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
        if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
        return date.toLocaleDateString();
    };

    const getAtsScoreColor = (score?: number) => {
        if (!score) return 'slate';
        if (score >= 85) return 'green';
        if (score >= 70) return 'yellow';
        return 'red';
    };

    if (loading || isLoadingResumes) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
                    <p className="text-slate-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    const avgScore = getAverageAtsScore();

    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            {/* Header */}
            <header className="glass-header sticky top-0 z-50">
                <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center text-white text-sm shadow-md group-hover:scale-105 transition-transform">
                            <i className="fa-solid fa-file-contract"></i>
                        </div>
                        <span className="text-lg font-display font-bold text-slate-800 tracking-tight">
                            Resume<span className="text-indigo-600">AI</span>
                        </span>
                    </Link>

                    <nav className="hidden md:flex items-center gap-8">
                        <Link href="/" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Home</Link>
                        <Link href="/builder" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Resume Builder</Link>
                        <Link href="/ats-checker" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">ATS Checker</Link>
                        <Link href="/pricing" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Pricing</Link>
                        <Link href="/blog" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Blog</Link>
                        <Link href="/contact" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Contact</Link>
                    </nav>

                    <div className="flex items-center gap-4">
                        <button className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center transition-colors">
                            <i className="fa-regular fa-bell"></i>
                        </button>
                        <div className="relative">
                            <div
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="cursor-pointer"
                            >
                                {user.avatar ? (
                                    <img
                                        src={user.avatar}
                                        className="w-9 h-9 rounded-full border-2 border-white shadow-sm hover:border-indigo-200 transition-all object-cover"
                                        alt="Profile"
                                    />
                                ) : (
                                    <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold border-2 border-white shadow-sm hover:border-indigo-200 transition-all">
                                        {getUserInitials()}
                                    </div>
                                )}
                            </div>
                            {showUserMenu && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-2">
                                    <Link
                                        href="/profile"
                                        className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                                        onClick={() => setShowUserMenu(false)}
                                    >
                                        <i className="fa-solid fa-user mr-2"></i>
                                        Profile
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                    >
                                        <i className="fa-solid fa-right-from-bracket mr-2"></i>
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-grow container mx-auto px-6 py-8">
                {/* Page Title & Actions */}
                <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-8 gap-4 animate-[fadeIn_0.5s_ease-out_forwards]">
                    <div>
                        <h1 className="text-3xl font-display font-bold text-slate-900">My Resumes</h1>
                        <p className="text-slate-500 text-sm mt-1">Manage and optimize your career documents.</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-2 shadow-sm">
                            <i className="fa-solid fa-file-import"></i> Import
                        </button>
                        <Link
                            href="/builder"
                            className="px-5 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition-colors flex items-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform duration-200"
                        >
                            <i className="fa-solid fa-plus"></i> New Resume
                        </Link>
                    </div>
                </div>

                {/* Filters & Search */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-8 flex flex-col md:flex-row justify-between items-center gap-4 animate-[slideUp_0.5s_ease-out_forwards]">
                    <div className="relative w-full md:w-96">
                        <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
                        <input
                            type="text"
                            placeholder="Search resumes..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all"
                        />
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto">
                        <span className="text-xs font-bold text-slate-400 uppercase whitespace-nowrap">Sort By:</span>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="text-sm border-none bg-transparent font-medium text-slate-700 focus:ring-0 cursor-pointer"
                        >
                            <option value="last_edited">Last Edited</option>
                            <option value="name_az">Name (A-Z)</option>
                            <option value="ats_score">ATS Score (High-Low)</option>
                        </select>
                        <div className="h-4 w-px bg-slate-200"></div>
                        <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                <i className="fa-solid fa-grid-2"></i>
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                <i className="fa-solid fa-list"></i>
                            </button>
                        </div>
                    </div>
                </div>

                {/* ATS Insight Bar */}
                {avgScore > 0 && (
                    <div className="mb-8 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 flex items-center justify-between animate-[slideUp_0.5s_ease-out_forwards] [animation-delay:0.1s]">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                                <i className="fa-solid fa-chart-line"></i>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-800">Resume Performance</p>
                                <p className="text-xs text-slate-500">
                                    Your average ATS score is{' '}
                                    <span className={`font-bold ${avgScore >= 85 ? 'text-green-600' : avgScore >= 70 ? 'text-yellow-600' : 'text-red-600'}`}>
                                        {avgScore}/100
                                    </span>
                                    . Aim for 85+.
                                </p>
                            </div>
                        </div>
                        <Link href="/ats-checker" className="text-xs font-bold text-indigo-600 hover:underline">
                            Check ATS Score →
                        </Link>
                    </div>
                )}

                {/* Resume Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-[slideUp_0.5s_ease-out_forwards] [animation-delay:0.2s]">
                    {/* Create New Card */}
                    <Link
                        href="/builder"
                        className="border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-8 hover:border-indigo-400 hover:bg-indigo-50/30 transition-all group h-[320px] cursor-pointer"
                    >
                        <div className="w-14 h-14 rounded-full bg-slate-50 group-hover:bg-white text-slate-400 group-hover:text-indigo-600 flex items-center justify-center mb-4 shadow-sm transition-colors text-xl">
                            <i className="fa-solid fa-plus"></i>
                        </div>
                        <h3 className="font-bold text-slate-600 group-hover:text-slate-900 transition-colors">Create New Resume</h3>
                        <p className="text-xs text-slate-400 mt-1">Start from scratch or template</p>
                    </Link>

                    {/* Resume Cards */}
                    {filteredResumes.map((resume) => (
                        <div
                            key={resume.id}
                            className="resume-card bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col h-[320px] group relative hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                        >
                            {/* Thumbnail */}
                            <div className="h-40 bg-slate-100 relative overflow-hidden">
                                {/* Mock Document */}
                                <div className="absolute top-4 left-4 right-4 bottom-[-20px] bg-white shadow-sm p-4 text-[6px] text-slate-300 leading-relaxed rounded-t-lg pointer-events-none select-none">
                                    <div className="w-1/3 h-2 bg-slate-800 mb-2 rounded"></div>
                                    <div className="w-full h-1 bg-slate-200 mb-1 rounded"></div>
                                    <div className="w-full h-1 bg-slate-200 mb-1 rounded"></div>
                                    <div className="w-2/3 h-1 bg-slate-200 mb-4 rounded"></div>
                                    <div className="w-1/4 h-1.5 bg-slate-400 mb-2 rounded"></div>
                                    <div className="w-full h-1 bg-slate-200 mb-1 rounded"></div>
                                    <div className="w-full h-1 bg-slate-200 mb-1 rounded"></div>
                                </div>

                                {/* Overlay Actions */}
                                <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-2">
                                    <Link
                                        href={`/builder?id=${resume.id}`}
                                        className="px-4 py-2 bg-white text-slate-900 rounded-lg text-xs font-bold shadow hover:bg-indigo-50 transition-colors transform hover:scale-105"
                                    >
                                        <i className="fa-solid fa-pen mr-1"></i> Edit
                                    </Link>
                                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold shadow hover:bg-indigo-500 transition-colors transform hover:scale-105">
                                        <i className="fa-solid fa-download mr-1"></i> PDF
                                    </button>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="p-5 flex flex-col flex-grow">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-slate-800 text-sm truncate pr-2" title={resume.title}>
                                        {resume.title}
                                    </h3>
                                    <button
                                        onClick={() => setActiveMenuId(activeMenuId === resume.id ? null : resume.id)}
                                        className="text-slate-400 hover:text-slate-600"
                                    >
                                        <i className="fa-solid fa-ellipsis-vertical"></i>
                                    </button>
                                    {/* Dropdown Menu */}
                                    {activeMenuId === resume.id && (
                                        <div className="absolute right-4 top-48 bg-white border border-slate-100 shadow-xl rounded-xl w-36 py-1 z-10">
                                            <button className="w-full text-left px-4 py-2 text-xs text-slate-600 hover:bg-slate-50 hover:text-indigo-600">
                                                <i className="fa-regular fa-copy mr-2"></i> Duplicate
                                            </button>
                                            <button className="w-full text-left px-4 py-2 text-xs text-slate-600 hover:bg-slate-50 hover:text-indigo-600">
                                                <i className="fa-regular fa-pen-to-square mr-2"></i> Rename
                                            </button>
                                            <div className="h-px bg-slate-100 my-1"></div>
                                            <button
                                                onClick={() => handleDeleteClick(resume.id)}
                                                className="w-full text-left px-4 py-2 text-xs text-red-500 hover:bg-red-50"
                                            >
                                                <i className="fa-regular fa-trash-can mr-2"></i> Delete
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <p className="text-xs text-slate-400 mb-4">Edited {getTimeAgo(resume.updated_at)}</p>

                                <div className="mt-auto flex items-center justify-between">
                                    {resume.is_draft ? (
                                        <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-slate-100 text-slate-500 text-[10px] font-bold rounded border border-slate-200">
                                            Draft
                                        </span>
                                    ) : resume.ats_score ? (
                                        <span className={`inline-flex items-center gap-1.5 px-2 py-1 bg-${getAtsScoreColor(resume.ats_score)}-50 text-${getAtsScoreColor(resume.ats_score)}-700 text-[10px] font-bold rounded border border-${getAtsScoreColor(resume.ats_score)}-100`}>
                                            <span className={`w-1.5 h-1.5 bg-${getAtsScoreColor(resume.ats_score)}-500 rounded-full`}></span> {resume.ats_score}/100 ATS
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-slate-100 text-slate-500 text-[10px] font-bold rounded border border-slate-200">
                                            Not Scored
                                        </span>
                                    )}
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                                        {resume.template || 'Modern'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {filteredResumes.length === 0 && !isLoadingResumes && (
                    <div className="text-center py-16">
                        <div className="w-20 h-20 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4 text-2xl">
                            <i className="fa-solid fa-file-lines"></i>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">No resumes found</h3>
                        <p className="text-sm text-slate-500 mb-6">
                            {searchQuery ? 'Try adjusting your search query' : 'Get started by creating your first resume'}
                        </p>
                        {!searchQuery && (
                            <Link
                                href="/builder"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-500 transition-colors shadow-lg"
                            >
                                <i className="fa-solid fa-plus"></i> Create Your First Resume
                            </Link>
                        )}
                    </div>
                )}
            </main>

            {/* Delete Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50">
                    <div
                        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
                        onClick={() => setShowDeleteModal(false)}
                    ></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm animate-[pop_0.3s_cubic-bezier(0.175,0.885,0.32,1.275)_forwards]">
                        <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4 text-xl">
                            <i className="fa-solid fa-trash-can"></i>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 text-center mb-2">Delete Resume?</h3>
                        <p className="text-sm text-slate-500 text-center mb-6">
                            Are you sure you want to delete this resume? This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="flex-1 py-2.5 border border-slate-200 rounded-xl text-slate-600 font-bold hover:bg-slate-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="flex-1 py-2.5 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-200"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast Notification */}
            <div
                className={`fixed bottom-6 right-6 bg-slate-900 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 z-50 transition-transform duration-400 ${showToast ? 'translate-y-0' : 'translate-y-[200px]'
                    }`}
                style={{ transitionTimingFunction: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}
            >
                <i className="fa-solid fa-circle-check text-green-400"></i>
                <span className="text-sm font-medium">{toastMessage}</span>
            </div>

            <style jsx>{`
                @keyframes pop {
                    0% {
                        transform: translate(-50%, -50%) scale(0.95);
                        opacity: 0;
                    }
                    100% {
                        transform: translate(-50%, -50%) scale(1);
                        opacity: 1;
                    }
                }
            `}</style>
        </div>
    );
}
