'use client';

import { useState, useEffect } from 'react';
import { useResumeStore } from '@/lib/stores/resume-store';

export function TabAI() {
    const { currentResume } = useResumeStore();
    const [showATSScore, setShowATSScore] = useState(true);
    const [animatedScore, setAnimatedScore] = useState(0);
    const targetScore = 72;

    // Calculate keywords count (from skills and experience descriptions)
    const keywordsCount = (() => {
        if (!currentResume) return 0;

        let count = 0;

        // Count skills
        count += currentResume.skills?.length || 0;

        // Count unique keywords from experience descriptions (simple word count > 4 chars)
        currentResume.experience?.forEach(exp => {
            if (exp.description) {
                const words = exp.description.split(/\s+/).filter(word => word.length > 4);
                count += words.length;
            }
        });

        return Math.min(count, 99); // Cap at 99 for display
    })();

    // Calculate formatting issues (simple heuristics)
    const formattingIssues = (() => {
        if (!currentResume) return 0;

        let issues = 0;

        // Check for missing email or phone
        if (!currentResume.personal?.email) issues++;
        if (!currentResume.personal?.phone) issues++;

        // Check for summary too short (< 50 characters)
        if (!currentResume.summary || currentResume.summary.length < 50) issues++;

        // Check for inconsistent date formats in experience
        const dateFormats = currentResume.experience?.map(exp => {
            const format = exp.startDate?.includes('/') ? 'slash' :
                exp.startDate?.includes('-') ? 'dash' : 'other';
            return format;
        }) || [];

        const uniqueFormats = new Set(dateFormats);
        if (uniqueFormats.size > 1) issues++; // Inconsistent dates count as 1 issue

        // Check for experience descriptions too short (< 50 characters)
        currentResume.experience?.forEach(exp => {
            if (exp.description && exp.description.length < 50) issues++;
        });

        return Math.min(issues, 99); // Cap at 99 for display
    })();

    // Animate score on mount or when shown
    useEffect(() => {
        if (showATSScore) {
            let start = 0;
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
    }, [showATSScore]);

    // Calculate circle progress
    const circumference = 2 * Math.PI * 32;
    const offset = circumference - (animatedScore / 100) * circumference;

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

                <button className="w-full p-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl hover:shadow-lg hover:shadow-emerald-200 transition-all group">
                    <div className="flex items-center justify-between">
                        <div className="text-left">
                            <p className="font-bold text-sm mb-1 flex items-center gap-2">
                                <i className="fa-solid fa-robot" />
                                Optimize for ATS
                            </p>
                            <p className="text-xs opacity-90">Improve keyword matching and formatting</p>
                        </div>
                        <i className="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform" />
                    </div>
                </button>
            </div>

            {/* ATS Score */}
            {showATSScore && currentResume && (
                <div className="bg-gradient-to-br from-slate-50 to-indigo-50 p-6 rounded-2xl border border-indigo-100 animate-fade-in">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-slate-800">Current ATS Score</h3>
                        <span className="text-xs text-slate-500 italic">Last checked: just now</span>
                    </div>

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
                                <span className="font-bold text-amber-600">Good</span> — Your resume is ATS-friendly but has room for improvement.
                            </p>
                            <div className="flex flex-wrap gap-2">
                                <span className="px-3 py-1.5 bg-green-100 text-green-700 text-xs font-bold rounded-full flex items-center gap-1">
                                    <i className="fa-solid fa-plus text-[10px]"></i>
                                    {keywordsCount} Keywords
                                </span>
                                <span className="px-3 py-1.5 bg-red-100 text-red-700 text-xs font-bold rounded-full flex items-center gap-1">
                                    <i className="fa-solid fa-minus text-[10px]"></i>
                                    {formattingIssues} Formatting
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* View Details Link */}
                    <button
                        onClick={() => {
                            // Store resume data for ATS checker
                            if (currentResume) {
                                const resumeText = `
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

                                localStorage.setItem('ats-resume-data', JSON.stringify({
                                    text: resumeText,
                                    timestamp: Date.now()
                                }));
                            }

                            // Redirect to ATS checker
                            window.location.href = '/ats-checker';
                        }}
                        className="mt-4 w-full py-2 text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors"
                    >
                        View Detailed Report <i className="fa-solid fa-arrow-right ml-1"></i>
                    </button>
                </div>
            )}

            {/* Tone Selection */}
            <div className="mt-8">
                <h3 className="text-sm font-bold text-slate-700 mb-3">Writing Tone</h3>
                <div className="grid grid-cols-3 gap-3">
                    {['Professional', 'Creative', 'Direct'].map((tone) => (
                        <button
                            key={tone}
                            className={`p-3 rounded-xl border-2 text-xs font-bold transition-all ${tone === 'Professional'
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
