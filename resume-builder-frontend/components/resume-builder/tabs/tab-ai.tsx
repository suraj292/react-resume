'use client';

export function TabAI() {
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
            <div className="bg-gradient-to-br from-slate-50 to-indigo-50 p-6 rounded-2xl border border-indigo-100">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-slate-800">Current ATS Score</h3>
                    <span className="text-xs text-slate-500 italic">Last checked: 2m ago</span>
                </div>

                <div className="flex items-center gap-6">
                    {/* Circular Progress */}
                    <div className="relative w-20 h-20">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle
                                cx="40"
                                cy="40"
                                r="32"
                                stroke="#e2e8f0"
                                strokeWidth="8"
                                fill="none"
                            />
                            <circle
                                cx="40"
                                cy="40"
                                r="32"
                                stroke="#4f46e5"
                                strokeWidth="8"
                                fill="none"
                                strokeDasharray="201"
                                strokeDashoffset="56"
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-2xl font-black text-indigo-600">72</span>
                        </div>
                    </div>

                    <div className="flex-1">
                        <p className="text-xs text-slate-600 mb-2">
                            <span className="font-bold text-amber-600">Good</span> — Your resume is ATS-friendly but has room for improvement.
                        </p>
                        <div className="flex gap-2">
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded-full">
                                +12 Keywords
                            </span>
                            <span className="px-2 py-1 bg-red-100 text-red-700 text-[10px] font-bold rounded-full">
                                -3 Formatting
                            </span>
                        </div>
                    </div>
                </div>
            </div>

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
        </div>
    );
}
