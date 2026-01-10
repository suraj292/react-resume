'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { resumeAPI } from '@/lib/api';
import { useResumeStore } from '@/lib/stores/resume-store';
import { useUIStore } from '@/lib/stores/ui-store';
import { formatDistanceToNow } from 'date-fns';

interface Resume {
    id: number;
    title: string;
    template: string;
    template_id: string;
    color_id: string;
    ats_score?: number;
    updated_at: string;
    created_at: string;
    deleted_at?: string | null;
    data: any;
}

export function TabMyResumes() {
    const { user } = useAuth();
    const { loadResume } = useResumeStore();
    const { setActiveTab } = useUIStore();
    const [resumes, setResumes] = useState<Resume[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        loadResumes();
    }, [user]);

    const loadResumes = async () => {
        if (!user) {
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            const response = await resumeAPI.getAll();

            if (Array.isArray(response.data)) {
                // Filter out deleted resumes
                const activeResumes = response.data.filter((r: Resume) => !r.deleted_at);
                setResumes(activeResumes);
            }
        } catch (error) {
            console.error('Failed to load resumes:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLoadResume = async (resume: Resume) => {
        try {
            // Load the resume using the store's loadResume function
            await loadResume(resume.id.toString());
            // Switch to manual tab to show the loaded data
            setActiveTab('manual');
        } catch (error) {
            console.error('Failed to load resume:', error);
        }
    };

    const filteredResumes = resumes.filter(resume =>
        resume.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getAtsScoreColor = (score?: number) => {
        if (!score) return 'slate';
        if (score >= 85) return 'green';
        if (score >= 70) return 'yellow';
        return 'red';
    };

    if (!user) {
        return (
            <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4 text-2xl">
                    <i className="fa-solid fa-user-lock"></i>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Login Required</h3>
                <p className="text-sm text-slate-500 mb-6">
                    Please log in to view your saved resumes
                </p>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
                <p className="text-slate-600">Loading resumes...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-display font-bold text-slate-900 mb-2">
                    My Resumes
                </h2>
                <p className="text-sm text-slate-500">
                    Load a saved resume to continue editing
                </p>
            </div>

            {/* Search */}
            <div className="relative">
                <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
                <input
                    type="text"
                    placeholder="Search resumes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all"
                />
            </div>

            {/* Resumes List */}
            {filteredResumes.length === 0 ? (
                <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4 text-2xl">
                        <i className="fa-solid fa-file-lines"></i>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">
                        {searchQuery ? 'No resumes found' : 'No resumes yet'}
                    </h3>
                    <p className="text-sm text-slate-500">
                        {searchQuery
                            ? 'Try adjusting your search query'
                            : 'Start creating your first resume'}
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredResumes.map((resume) => (
                        <div
                            key={resume.id}
                            onClick={() => handleLoadResume(resume)}
                            className="group p-4 bg-white border border-slate-200 rounded-xl hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer"
                        >
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-slate-900 text-sm truncate group-hover:text-indigo-600 transition-colors">
                                        {resume.title}
                                    </h3>
                                    <p className="text-xs text-slate-400 mt-1">
                                        Updated {formatDistanceToNow(new Date(resume.updated_at), { addSuffix: true })}
                                    </p>
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleLoadResume(resume);
                                    }}
                                    className="ml-3 px-3 py-1.5 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-lg hover:bg-indigo-100 transition-colors opacity-0 group-hover:opacity-100"
                                >
                                    <i className="fa-solid fa-arrow-right-to-bracket mr-1"></i>
                                    Load
                                </button>
                            </div>

                            <div className="flex items-center gap-2 mt-3">
                                {/* ATS Score Badge */}
                                {resume.ats_score ? (
                                    <span className={`inline-flex items-center gap-1.5 px-2 py-1 bg-${getAtsScoreColor(resume.ats_score)}-50 text-${getAtsScoreColor(resume.ats_score)}-700 text-[10px] font-bold rounded border border-${getAtsScoreColor(resume.ats_score)}-100`}>
                                        <span className={`w-1.5 h-1.5 bg-${getAtsScoreColor(resume.ats_score)}-500 rounded-full`}></span>
                                        {resume.ats_score}/100 ATS
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-slate-100 text-slate-500 text-[10px] font-bold rounded border border-slate-200">
                                        Not Scored
                                    </span>
                                )}

                                {/* Template Badge */}
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                                    {resume.template || resume.template_id || 'Modern'}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Stats */}
            {resumes.length > 0 && (
                <div className="pt-4 border-t border-slate-200">
                    <p className="text-xs text-slate-500 text-center">
                        {resumes.length} {resumes.length === 1 ? 'resume' : 'resumes'} saved
                    </p>
                </div>
            )}
        </div>
    );
}
