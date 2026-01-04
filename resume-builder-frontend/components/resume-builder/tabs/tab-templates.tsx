'use client';

import { useResumeStore } from '@/lib/stores/resume-store';
import { cn } from '@/lib/utils';

const templates = [
    // Original Templates
    { id: 'modern', name: 'Modern Executive', category: 'Best for Tech & SaaS' },
    { id: 'creative', name: 'Creative Sidebar', category: 'Design & Marketing' },
    { id: 'academic', name: 'Academic Elite', category: 'Formal & Corporate' },
    { id: 'minimal', name: 'Minimalist Bold', category: 'Clean & Functional' },

    // Executive & Professional
    { id: 'executive', name: 'Executive', category: 'Senior Leadership' },
    { id: 'professional', name: 'Professional', category: 'Corporate & Business' },
    { id: 'classic', name: 'Classic', category: 'Traditional & Formal' },

    // Modern & Tech
    { id: 'tech', name: 'Tech Developer', category: 'Software & Engineering' },
    { id: 'gradient', name: 'Gradient Modern', category: 'Creative & Bold' },
    { id: 'infographic', name: 'Infographic', category: 'Visual & Creative' },

    // Minimalist & Clean
    { id: 'swiss', name: 'Swiss Style', category: 'Minimalist & Clean' },
    { id: 'elegant', name: 'Elegant', category: 'Refined & Sophisticated' },
    { id: 'vertical', name: 'Vertical Accent', category: 'Modern & Clean' },

    // Structured & Organized
    { id: 'timeline', name: 'Timeline', category: 'Chronological Focus' },
    { id: 'split', name: 'Split Column', category: 'Organized & Balanced' },
    { id: 'columnar', name: 'Three Column', category: 'Information Dense' },
    { id: 'boxed', name: 'Boxed Layout', category: 'Structured & Clear' },

    // Bold & Colorful
    { id: 'bold', name: 'Bold Impact', category: 'Strong & Confident' },
    { id: 'colorblock', name: 'Color Block', category: 'Modern & Vibrant' },
    { id: 'striped', name: 'Striped', category: 'Dynamic & Engaging' },
    { id: 'bordered', name: 'Bordered', category: 'Classic & Framed' },
    { id: 'compact', name: 'Compact', category: 'Space Efficient' },
];

export function TabTemplates() {
    const { currentResume, setTemplate } = useResumeStore();
    const selectedTemplate = currentResume?.templateId || 'modern';

    return (
        <div>
            <header className="mb-8">
                <h2 className="text-xl font-display font-bold text-slate-800">Choose a Layout</h2>
                <p className="text-slate-400 text-xs mt-1 font-medium">
                    Select a design that matches your industry and seniority level.
                </p>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {templates.map((template) => (
                    <div
                        key={template.id}
                        onClick={() => setTemplate(template.id)}
                        className={cn(
                            'group relative bg-white border-2 p-2 rounded-2xl cursor-pointer hover:border-indigo-200 hover:shadow-lg transition-all',
                            selectedTemplate === template.id
                                ? 'border-indigo-600 shadow-[0_0_0_2px_#4f46e5]'
                                : 'border-slate-100'
                        )}
                    >
                        {/* Template Preview */}
                        <div className="aspect-[3/4] bg-slate-50 rounded-xl mb-3 overflow-hidden p-3 space-y-2">
                            {template.id === 'modern' && (
                                <>
                                    <div className="h-4 bg-slate-900 w-2/3 rounded-sm mb-4" />
                                    <div className="h-2 bg-indigo-200 w-full rounded-full" />
                                    <div className="h-2 bg-slate-200 w-full rounded-full" />
                                    <div className="h-2 bg-slate-200 w-3/4 rounded-full" />
                                    <div className="pt-2 grid grid-cols-2 gap-2">
                                        <div className="h-10 bg-slate-100 rounded-md" />
                                        <div className="h-10 bg-slate-100 rounded-md" />
                                    </div>
                                </>
                            )}
                            {template.id === 'creative' && (
                                <div className="flex h-full">
                                    <div className="w-1/3 bg-slate-800 p-2 space-y-2">
                                        <div className="w-6 h-6 bg-slate-600 rounded-full mx-auto" />
                                        <div className="h-1 bg-slate-600 w-full rounded-full" />
                                        <div className="h-1 bg-slate-600 w-full rounded-full" />
                                    </div>
                                    <div className="flex-1 p-3 space-y-3">
                                        <div className="h-3 bg-slate-300 w-1/2 rounded-sm" />
                                        <div className="space-y-1">
                                            <div className="h-1 bg-slate-200 w-full" />
                                            <div className="h-1 bg-slate-200 w-full" />
                                            <div className="h-1 bg-slate-200 w-2/3" />
                                        </div>
                                    </div>
                                </div>
                            )}
                            {template.id === 'academic' && (
                                <div className="flex flex-col items-center">
                                    <div className="h-2 bg-slate-900 w-1/2 rounded-full mb-1" />
                                    <div className="h-1 bg-slate-400 w-1/3 rounded-full mb-6" />
                                    <div className="w-full space-y-3">
                                        <div className="flex justify-between border-b border-slate-200 pb-1">
                                            <div className="h-2 bg-slate-800 w-1/4 rounded-full" />
                                            <div className="h-2 bg-slate-200 w-1/6 rounded-full" />
                                        </div>
                                        <div className="h-1 bg-slate-200 w-full" />
                                        <div className="h-1 bg-slate-200 w-full" />
                                        <div className="h-1 bg-slate-200 w-4/5" />
                                    </div>
                                </div>
                            )}
                            {template.id === 'minimal' && (
                                <div className="space-y-4 p-3">
                                    <div className="h-8 bg-slate-900 w-full rounded-sm" />
                                    <div className="space-y-2">
                                        <div className="h-2 bg-slate-300 w-1/4" />
                                        <div className="h-1 bg-slate-200 w-full" />
                                        <div className="h-1 bg-slate-200 w-full" />
                                    </div>
                                    <div className="space-y-2 pt-2">
                                        <div className="h-2 bg-slate-300 w-1/4" />
                                        <div className="h-1 bg-slate-200 w-full" />
                                        <div className="h-1 bg-slate-200 w-5/6" />
                                    </div>
                                </div>
                            )}

                            {/* Generic preview for new templates */}
                            {!['modern', 'creative', 'academic', 'minimal'].includes(template.id) && (
                                <div className="flex items-center justify-center h-full">
                                    <div className="text-center space-y-3 w-full p-3">
                                        <div className="h-3 bg-indigo-600 w-2/3 mx-auto rounded-sm" />
                                        <div className="h-1 bg-slate-300 w-full rounded-full" />
                                        <div className="h-1 bg-slate-300 w-full rounded-full" />
                                        <div className="h-1 bg-slate-300 w-4/5 mx-auto rounded-full" />
                                        <div className="pt-2 space-y-2">
                                            <div className="h-2 bg-slate-200 w-1/3 rounded-full" />
                                            <div className="h-1 bg-slate-100 w-full" />
                                            <div className="h-1 bg-slate-100 w-full" />
                                        </div>
                                        <div className="flex gap-1 justify-center pt-2">
                                            <div className="h-4 w-12 bg-indigo-100 rounded" />
                                            <div className="h-4 w-12 bg-indigo-100 rounded" />
                                            <div className="h-4 w-12 bg-indigo-100 rounded" />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Template Info */}
                        <div className="px-2 pb-2">
                            <div className="flex items-center justify-between">
                                <p className="text-xs font-bold text-slate-800">{template.name}</p>
                                {selectedTemplate === template.id && (
                                    <i className="fa-solid fa-circle-check text-indigo-600 text-sm" />
                                )}
                            </div>
                            <p className="text-[9px] text-slate-400 mt-0.5 uppercase tracking-wider font-bold">
                                {template.category}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
