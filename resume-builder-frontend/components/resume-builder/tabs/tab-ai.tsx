'use client';

import { useState, useEffect } from 'react';
import { useResumeStore } from '@/lib/stores/resume-store';
import { analyzeResume } from '@/lib/ats-api';
import { atsCache } from '@/lib/ats-cache';
import { toast } from 'sonner';

export function TabAI() {
    const { currentResume } = useResumeStore();
    const [showATSScore, setShowATSScore] = useState(true);
    const [animatedScore, setAnimatedScore] = useState(0);
    const [atsData, setAtsData] = useState<any>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [hasAnalyzed, setHasAnalyzed] = useState(false);
    const [selectedTone, setSelectedTone] = useState<'Professional' | 'Creative' | 'Direct'>('Professional');
    const [isGenerating, setIsGenerating] = useState(false);

    // Convert resume to text for analysis
    const getResumeText = () => {
        if (!currentResume) return '';

        return `
${currentResume.personal?.name || ''}
${currentResume.personal?.title || ''}
${currentResume.personal?.email || ''} | ${currentResume.personal?.phone || ''}
${currentResume.personal?.location || ''}

${currentResume.summary ? `PROFESSIONAL SUMMARY\n${currentResume.summary}\n` : ''}

${currentResume.experience?.length ? 'EXPERIENCE\n' + currentResume.experience.map(exp => `
${exp.position} at ${exp.company}
${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}
${exp.description}
`).join('\n') : ''}

${currentResume.education?.length ? 'EDUCATION\n' + currentResume.education.map(edu => `
${edu.degree} in ${edu.field}
${edu.institution}
${edu.startDate} - ${edu.endDate}
${edu.gpa ? `GPA: ${edu.gpa}` : ''}
`).join('\n') : ''}

${currentResume.skills?.length ? `SKILLS\n${currentResume.skills.join(', ')}` : ''}
`.trim();
    };

    // Analyze resume when component mounts or resume changes
    useEffect(() => {
        const analyzeCurrentResume = async () => {
            // First, check if we have cached data
            const cachedData = atsCache.getCachedAnalysis();
            if (cachedData) {
                setAtsData(cachedData);
                setHasAnalyzed(true);
                return;
            }

            if (!currentResume || hasAnalyzed || isAnalyzing) return;

            const resumeText = getResumeText();
            if (!resumeText || resumeText.length < 50) return;

            setIsAnalyzing(true);

            try {
                const result = await analyzeResume(resumeText);
                setAtsData(result);
                setHasAnalyzed(true);

                // Cache the result
                atsCache.updateCache(resumeText, result);
            } catch (error) {
                console.error('ATS analysis failed:', error);
                // Set fallback data
                setAtsData({
                    score: 70,
                    rating: 'good',
                    keywords: { found: 0, missing: 0 },
                    formatting: { issues: 0 }
                });
            } finally {
                setIsAnalyzing(false);
            }
        };

        analyzeCurrentResume();
    }, [currentResume, hasAnalyzed, isAnalyzing]);

    // Animate score when data is available
    useEffect(() => {
        if (showATSScore && atsData?.score) {
            let start = 0;
            const targetScore = atsData.score;
            const duration = 1500; // 1.5 seconds
            const startTime = Date.now();

            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // Easing function for smooth animation
                const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                start = Math.floor(easeOutQuart * targetScore);

                setAnimatedScore(start);

                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
            };

            animate();
        }
    }, [showATSScore, atsData]);

    // Calculate circle progress
    const circumference = 2 * Math.PI * 32;
    const offset = circumference - (animatedScore / 100) * circumference;

    // Get rating color and text
    const getRatingDisplay = () => {
        if (!atsData) return { color: 'text-slate-600', text: 'Analyzing...', bgColor: 'bg-slate-100' };

        const rating = atsData.rating;
        if (rating === 'excellent') return { color: 'text-green-600', text: 'Excellent', bgColor: 'bg-green-100' };
        if (rating === 'good') return { color: 'text-amber-600', text: 'Good', bgColor: 'bg-amber-100' };
        if (rating === 'fair') return { color: 'text-orange-600', text: 'Fair', bgColor: 'bg-orange-100' };
        return { color: 'text-red-600', text: 'Needs Work', bgColor: 'bg-red-100' };
    };

    const rating = getRatingDisplay();

    return (
        <div>
            <header className="mb-8">
                <h2 className="text-xl font-display font-bold text-slate-800">AI Assistant</h2>
                <p className="text-slate-400 text-xs mt-1 font-medium">
                    Let AI optimize your resume for ATS systems and generate compelling content.
                </p>
            </header>

            {/* AI Actions */}
            <div className="space-y-4 mb-8">
                <button className="w-full p-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-2xl hover:shadow-lg hover:shadow-indigo-200 transition-all group">
                    <div className="flex items-center justify-between">
                        <div className="text-left">
                            <p className="font-bold text-sm mb-1 flex items-center gap-2">
                                <i className="fa-solid fa-wand-magic-sparkles" />
                                Generate Entire Resume
                            </p>
                            <p className="text-xs opacity-90">AI will create a complete resume from your context</p>
                        </div>
                        <i className="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform" />
                    </div>
                </button>

                <button
                    onClick={async () => {
                        setHasAnalyzed(false);
                        setIsAnalyzing(false);
                    }}
                    className="w-full p-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl hover:shadow-lg hover:shadow-emerald-200 transition-all group"
                >
                    <div className="flex items-center justify-between">
                        <div className="text-left">
                            <p className="font-bold text-sm mb-1 flex items-center gap-2">
                                <i className="fa-solid fa-robot" />
                                {isAnalyzing ? 'Analyzing...' : 'Re-analyze ATS Score'}
                            </p>
                            <p className="text-xs opacity-90">
                                {isAnalyzing ? 'Please wait...' : 'Refresh your ATS compatibility score'}
                            </p>
                        </div>
                        {!isAnalyzing && <i className="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform" />}
                        {isAnalyzing && <i className="fa-solid fa-spinner fa-spin" />}
                    </div>
                </button>
            </div>

            {/* ATS Score */}
            {showATSScore && currentResume && (
                <div className="bg-gradient-to-br from-slate-50 to-indigo-50 p-6 rounded-2xl border border-indigo-100 animate-fade-in">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-slate-800">Current ATS Score</h3>
                        <span className="text-xs text-slate-500 italic">
                            {isAnalyzing ? 'Analyzing...' : 'Live analysis'}
                        </span>
                    </div>

                    {isAnalyzing ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="text-center">
                                <i className="fa-solid fa-spinner fa-spin text-4xl text-indigo-600 mb-3"></i>
                                <p className="text-sm text-slate-600">Analyzing your resume...</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="flex items-center gap-6">
                                {/* Circular Progress */}
                                <div className="relative w-24 h-24 flex-shrink-0">
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle
                                            cx="48"
                                            cy="48"
                                            r="32"
                                            stroke="#e2e8f0"
                                            strokeWidth="8"
                                            fill="none"
                                        />
                                        <circle
                                            cx="48"
                                            cy="48"
                                            r="32"
                                            stroke="#4f46e5"
                                            strokeWidth="8"
                                            fill="none"
                                            strokeDasharray={circumference}
                                            strokeDashoffset={offset}
                                            strokeLinecap="round"
                                            className="transition-all duration-500 ease-out"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-3xl font-black text-indigo-600">{animatedScore}</span>
                                    </div>
                                </div>

                                <div className="flex-1">
                                    <p className="text-sm text-slate-600 mb-3 leading-relaxed">
                                        <span className={`font-bold ${rating.color}`}>{rating.text}</span> —
                                        {atsData?.rating === 'excellent' && ' Your resume is excellently optimized for ATS!'}
                                        {atsData?.rating === 'good' && ' Your resume is ATS-friendly but has room for improvement.'}
                                        {atsData?.rating === 'fair' && ' Your resume needs some optimization for ATS.'}
                                        {atsData?.rating === 'needs_improvement' && ' Your resume needs significant ATS optimization.'}
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        <span className="px-3 py-1.5 bg-green-100 text-green-700 text-xs font-bold rounded-full flex items-center gap-1">
                                            <i className="fa-solid fa-check text-[10px]"></i>
                                            {atsData?.keywords?.found || 0} Keywords
                                        </span>
                                        <span className={`px-3 py-1.5 text-xs font-bold rounded-full flex items-center gap-1 ${(atsData?.formatting?.issues || 0) > 0
                                            ? 'bg-red-100 text-red-700'
                                            : 'bg-green-100 text-green-700'
                                            }`}>
                                            <i className={`fa-solid ${(atsData?.formatting?.issues || 0) > 0 ? 'fa-exclamation-triangle' : 'fa-check'} text-[10px]`}></i>
                                            {atsData?.formatting?.issues || 0} Issues
                                        </span>
                                        {atsData?.content?.action_verbs_percentage !== undefined && (
                                            <span className="px-3 py-1.5 bg-blue-100 text-blue-700 text-xs font-bold rounded-full flex items-center gap-1">
                                                <i className="fa-solid fa-bolt text-[10px]"></i>
                                                {atsData.content.action_verbs_percentage}% Action Verbs
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* View Details Link */}
                            <button
                                onClick={() => {
                                    // Store resume data for ATS checker
                                    if (currentResume) {
                                        const resumeText = getResumeText();

                                        // Check if resume has saved ATS data
                                        const hasSavedAtsData = currentResume.ats_data && Object.keys(currentResume.ats_data).length > 0;

                                        localStorage.setItem('ats-resume-data', JSON.stringify({
                                            text: resumeText,
                                            timestamp: Date.now(),
                                            // Include saved ATS data if available
                                            savedAtsData: hasSavedAtsData ? currentResume.ats_data : null,
                                            resumeId: currentResume.id !== 'new' ? currentResume.id : null,
                                        }));
                                    }

                                    // Redirect to ATS checker
                                    window.location.href = '/ats-checker';
                                }}
                                className="mt-4 w-full py-2 text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors"
                            >
                                View Detailed Report <i className="fa-solid fa-arrow-right ml-1"></i>
                            </button>
                        </>
                    )}
                </div>
            )}

            {/* Tone Selection */}
            <div className="mt-8">
                <h3 className="text-sm font-bold text-slate-700 mb-3">Writing Tone</h3>
                <div className="grid grid-cols-3 gap-3">
                    {(['Professional', 'Creative', 'Direct'] as const).map((tone) => (
                        <button
                            key={tone}
                            onClick={() => setSelectedTone(tone)}
                            className={`p-3 rounded-xl border-2 text-xs font-bold transition-all ${tone === selectedTone
                                ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                                }`}
                        >
                            {tone}
                        </button>
                    ))}
                </div>
            </div>

            <style jsx>{`
                @keyframes fade-in {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fade-in {
                    animation: fade-in 0.5s ease-out forwards;
                }
            `}</style>
        </div>
    );
}
