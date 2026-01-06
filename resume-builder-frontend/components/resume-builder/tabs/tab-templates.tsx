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
    { id: 'gradient', name: 'Gradient Modern', category: 'Creative &  Bold' },
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

    // Color mapping
    const colors: Record<string, string> = {
        indigo: '#4f46e5',
        emerald: '#059669',
        rose: '#e11d48',
        slate: '#334155',
        amber: '#d97706',
        violet: '#7c3aed',
    };

    const accentColor = colors[currentResume?.colorId || 'indigo'] || colors.indigo;

    // Render template thumbnail
    const renderThumbnail = (templateId: string) => {
        const baseClasses = "aspect-[3/4] bg-slate-50 rounded-xl mb-3 overflow-hidden";

        switch (templateId) {
            case 'modern':
                return (
                    <div className={`${baseClasses} p-3 space-y-2`}>
                        <div className="h-5 w-2/3 rounded-sm mb-3" style={{ backgroundColor: 'rgb(15, 23, 42)' }} />
                        <div className="h-1 w-full rounded-full" style={{ backgroundColor: accentColor }} />
                        <div className="h-1 bg-slate-200 w-full rounded-full" />
                        <div className="h-1 bg-slate-200 w-3/4 rounded-full" />
                        <div className="pt-3 grid grid-cols-2 gap-2">
                            <div className="h-12 bg-slate-100 rounded-md" />
                            <div className="h-12 bg-slate-100 rounded-md" />
                        </div>
                    </div>
                );

            case 'creative':
                return (
                    <div className={`${baseClasses} flex h-full`}>
                        <div className="w-1/3 p-2 space-y-2" style={{ backgroundColor: accentColor }}>
                            <div className="w-7 h-7 bg-white/20 rounded-full mx-auto" />
                            <div className="h-1 bg-white/30 w-full rounded-full" />
                            <div className="h-1 bg-white/30 w-full rounded-full" />
                        </div>
                        <div className="flex-1 p-3 space-y-2">
                            <div className="h-3 w-1/2 rounded-sm" style={{ backgroundColor: 'rgb(15, 23, 42)' }} />
                            <div className="space-y-1">
                                <div className="h-1 bg-slate-200 w-full" />
                                <div className="h-1 bg-slate-200 w-full" />
                                <div className="h-1 bg-slate-200 w-2/3" />
                            </div>
                        </div>
                    </div>
                );

            case 'academic':
                return (
                    <div className={`${baseClasses} p-3 flex flex-col items-center`}>
                        <div className="h-2 w-1/2 rounded-full mb-1" style={{ backgroundColor: 'rgb(15, 23, 42)' }} />
                        <div className="h-0.5 bg-slate-300 w-1/3 rounded-full mb-4" />
                        <div className="w-full border-b mb-3" style={{ borderColor: accentColor }}>
                            <div className="flex justify-between pb-1">
                                <div className="h-1.5 w-1/4 rounded-full" style={{ backgroundColor: accentColor }} />
                                <div className="h-1.5 bg-slate-200 w-1/6 rounded-full" />
                            </div>
                        </div>
                        <div className="space-y-1 w-full">
                            <div className="h-0.5 bg-slate-200 w-full" />
                            <div className="h-0.5 bg-slate-200 w-full" />
                            <div className="h-0.5 bg-slate-200 w-4/5" />
                        </div>
                    </div>
                );

            case 'minimal':
                return (
                    <div className={`${baseClasses} space-y-3 p-3`}>
                        <div className="h-10 w-full rounded-sm" style={{ backgroundColor: 'rgb(15, 23, 42)' }} />
                        <div className="h-1 w-16" style={{ backgroundColor: accentColor }} />
                        <div className="space-y-1.5">
                            <div className="h-1 bg-slate-200 w-full" />
                            <div className="h-1 bg-slate-200 w-full" />
                            <div className="h-1 bg-slate-200 w-5/6" />
                        </div>
                    </div>
                );

            case 'executive':
                return (
                    <div className={`${baseClasses} p-3`}>
                        <div className="text-center border-b pb-2 mb-2" style={{ borderColor: accentColor }}>
                            <div className="h-4 w-2/3 mx-auto rounded-sm" style={{ backgroundColor: 'rgb(15, 23, 42)' }} />
                            <div className="h-1 bg-slate-300 w-1/2 mx-auto rounded-full mt-1" />
                        </div>
                        <div className="space-y-2">
                            <div className="h-1 bg-slate-200 w-full" />
                            <div className="h-1 bg-slate-200 w-full" />
                        </div>
                    </div>
                );

            case 'professional':
                return (
                    <div className={`${baseClasses} p-3`}>
                        <div className="h-3 w-2/3 rounded-sm mb-2" style={{ backgroundColor: 'rgb(15, 23, 42)' }} />
                        <div className="flex gap-2 text-[6px] mb-3">
                            <div className="h-0.5 bg-slate-300 w-1/4" />
                            <div className="h-0.5 bg-slate-300 w-1/4" />
                        </div>
                        <div className="border-l-2 pl-2 space-y-1" style={{ borderColor: accentColor }}>
                            <div className="h-1 bg-slate-200 w-full" />
                            <div className="h-1 bg-slate-200 w-3/4" />
                        </div>
                    </div>
                );

            case 'classic':
                return (
                    <div className={`${baseClasses} p-3`}>
                        <div className="text-center mb-3">
                            <div className="h-3 w-2/3 mx-auto rounded-sm mb-1" style={{ backgroundColor: 'rgb(15, 23, 42)' }} />
                            <div className="h-0.5 bg-slate-300 w-1/2 mx-auto rounded-full" />
                        </div>
                        <div className="border-t pt-2" style={{ borderColor: accentColor }}>
                            <div className="space-y-1">
                                <div className="h-1 bg-slate-200 w-full" />
                                <div className="h-1 bg-slate-200 w-full" />
                            </div>
                        </div>
                    </div>
                );

            case 'tech':
                return (
                    <div className={`${baseClasses} p-3 space-y-2`}>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-md" style={{ backgroundColor: accentColor }} />
                            <div className="flex-1 space-y-1">
                                <div className="h-1.5 w-2/3 rounded" style={{ backgroundColor: 'rgb(15, 23, 42)' }} />
                                <div className="h-0.5 bg-slate-300 w-1/2 rounded" />
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-1">
                            <div className="h-4 rounded" style={{ backgroundColor: `${accentColor}20` }} />
                            <div className="h-4 rounded" style={{ backgroundColor: `${accentColor}20` }} />
                            <div className="h-4 rounded" style={{ backgroundColor: `${accentColor}20` }} />
                        </div>
                    </div>
                );

            case 'gradient':
                return (
                    <div className={`${baseClasses} p-3 relative overflow-hidden`}>
                        <div className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-20"
                            style={{ background: `radial-gradient(circle, ${accentColor}, transparent)` }} />
                        <div className="h-4 w-2/3 rounded-sm mb-2" style={{
                            background: `linear-gradient(90deg, ${accentColor}, ${accentColor}80)`
                        }} />
                        <div className="space-y-1">
                            <div className="h-1 bg-slate-200 w-full" />
                            <div className="h-1 bg-slate-200 w-3/4" />
                        </div>
                    </div>
                );

            case 'infographic':
                return (
                    <div className={`${baseClasses} p-2`}>
                        <div className="flex items-center gap-1.5 mb-2">
                            <div className="w-6 h-6 rounded-full" style={{ backgroundColor: accentColor }} />
                            <div className="h-2 w-1/2 rounded" style={{ backgroundColor: 'rgb(15, 23, 42)' }} />
                        </div>
                        <div className="flex gap-1">
                            <div className="w-1/4 space-y-1">
                                <div className="h-8 rounded" style={{ backgroundColor: `${accentColor}40` }} />
                            </div>
                            <div className="flex-1 space-y-1">
                                <div className="h-1 bg-slate-200 w-full" />
                                <div className="h-1 bg-slate-200 w-3/4" />
                            </div>
                        </div>
                    </div>
                );

            case 'swiss':
                return (
                    <div className={`${baseClasses} p-4 space-y-3`}>
                        <div className="h-3 w-1/2 rounded-none bg-black" />
                        <div className="space-y-1.5">
                            <div className="h-0.5 bg-slate-300 w-full" />
                            <div className="h-0.5 bg-slate-300 w-full" />
                            <div className="h-0.5 bg-slate-300 w-2/3" />
                        </div>
                        <div className="h-px w-full" style={{ backgroundColor: accentColor }} />
                    </div>
                );

            case 'elegant':
                return (
                    <div className={`${baseClasses} p-3 space-y-2`}>
                        <div className="text-center">
                            <div className="h-3 w-2/3 mx-auto rounded-sm mb-1" style={{
                                backgroundColor: accentColor,
                                opacity: 0.2
                            }} />
                            <div className="h-1 bg-slate-800 w-1/2 mx-auto" />
                        </div>
                        <div className="space-y-1 pt-2">
                            <div className="h-0.5 bg-slate-200 w-full" />
                            <div className="h-0.5 bg-slate-200 w-full" />
                        </div>
                    </div>
                );

            case 'vertical':
                return (
                    <div className={`${baseClasses} flex`}>
                        <div className="w-1" style={{ backgroundColor: accentColor }} />
                        <div className="flex-1 p-3 space-y-2">
                            <div className="h-3 w-2/3 rounded-sm" style={{ backgroundColor: 'rgb(15, 23, 42)' }} />
                            <div className="space-y-1">
                                <div className="h-1 bg-slate-200 w-full" />
                                <div className="h-1 bg-slate-200 w-3/4" />
                            </div>
                        </div>
                    </div>
                );

            case 'timeline':
                return (
                    <div className={`${baseClasses} p-3`}>
                        <div className="flex gap-2">
                            <div className="flex flex-col items-center">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
                                <div className="w-px flex-1 bg-slate-300" />
                            </div>
                            <div className="flex-1 space-y-1">
                                <div className="h-1.5 bg-slate-800 w-2/3" />
                                <div className="h-0.5 bg-slate-200 w-full" />
                                <div className="h-0.5 bg-slate-200 w-3/4" />
                            </div>
                        </div>
                    </div>
                );

            case 'split':
                return (
                    <div className={`${baseClasses} flex gap-2 p-2`}>
                        <div className="flex-1 space-y-2">
                            <div className="h-2 bg-slate-800 w-3/4" />
                            <div className="space-y-1">
                                <div className="h-0.5 bg-slate-200 w-full" />
                                <div className="h-0.5 bg-slate-200 w-2/3" />
                            </div>
                        </div>
                        <div className="w-px" style={{ backgroundColor: accentColor }} />
                        <div className="flex-1 space-y-2">
                            <div className="h-2 w-3/4" style={{ backgroundColor: accentColor }} />
                            <div className="space-y-1">
                                <div className="h-0.5 bg-slate-200 w-full" />
                            </div>
                        </div>
                    </div>
                );

            case 'columnar':
                return (
                    <div className={`${baseClasses} flex gap-1 p-2`}>
                        <div className="flex-1 space-y-1">
                            <div className="h-1.5 bg-slate-800 w-full" />
                            <div className="h-0.5 bg-slate-200 w-full" />
                        </div>
                        <div className="flex-1 space-y-1">
                            <div className="h-1.5 w-full" style={{ backgroundColor: accentColor }} />
                            <div className="h-0.5 bg-slate-200 w-full" />
                        </div>
                        <div className="flex-1 space-y-1">
                            <div className="h-1.5 bg-slate-300 w-full" />
                            <div className="h-0.5 bg-slate-200 w-full" />
                        </div>
                    </div>
                );

            case 'boxed':
                return (
                    <div className={`${baseClasses} p-2 space-y-2`}>
                        <div className="border-2 rounded p-1.5" style={{ borderColor: accentColor }}>
                            <div className="h-1.5 bg-slate-800 w-2/3" />
                        </div>
                        <div className="border-2 border-slate-200 rounded p-1.5">
                            <div className="h-1 bg-slate-200 w-full" />
                        </div>
                    </div>
                );

            case 'bold':
                return (
                    <div className={`${baseClasses} p-3`}>
                        <div className="h-8 w-full rounded mb-2" style={{ backgroundColor: accentColor }} />
                        <div className="space-y-1.5">
                            <div className="h-1.5 bg-slate-800 w-3/4" />
                            <div className="h-1 bg-slate-200 w-full" />
                            <div className="h-1 bg-slate-200 w-2/3" />
                        </div>
                    </div>
                );

            case 'colorblock':
                return (
                    <div className={`${baseClasses} p-2 space-y-1.5`}>
                        <div className="flex gap-1.5">
                            <div className="w-1/3 h-10 rounded" style={{ backgroundColor: accentColor }} />
                            <div className="flex-1 space-y-1">
                                <div className="h-1.5 bg-slate-800 w-3/4" />
                                <div className="h-0.5 bg-slate-200 w-full" />
                            </div>
                        </div>
                    </div>
                );

            case 'striped':
                return (
                    <div className={`${baseClasses} p-2 space-y-1`}>
                        <div className="h-3 w-full" style={{ backgroundColor: `${accentColor}20` }} />
                        <div className="h-3 w-full bg-white" />
                        <div className="h-3 w-full" style={{ backgroundColor: `${accentColor}20` }} />
                    </div>
                );

            case 'bordered':
                return (
                    <div className={`${baseClasses} border-4 p-2`} style={{ borderColor: accentColor }}>
                        <div className="space-y-2">
                            <div className="h-2 bg-slate-800 w-2/3" />
                            <div className="space-y-1">
                                <div className="h-0.5 bg-slate-200 w-full" />
                                <div className="h-0.5 bg-slate-200 w-3/4" />
                            </div>
                        </div>
                    </div>
                );

            case 'compact':
                return (
                    <div className={`${baseClasses} p-2 text-[6px] space-y-1.5`}>
                        <div className="h-2 bg-slate-800 w-1/2" />
                        <div className="space-y-0.5">
                            <div className="h-0.5 bg-slate-200 w-full" />
                            <div className="h-0.5 bg-slate-200 w-full" />
                            <div className="h-0.5 bg-slate-200 w-3/4" />
                            <div className="h-0.5 bg-slate-200 w-full" />
                        </div>
                        <div className="flex gap-1">
                            <div className="h-3 w-1/4 rounded" style={{ backgroundColor: `${accentColor}30` }} />
                            <div className="h-3 w-1/4 rounded" style={{ backgroundColor: `${accentColor}30` }} />
                        </div>
                    </div>
                );

            default:
                return (
                    <div className={`${baseClasses} flex items-center justify-center p-3`}>
                        <div className="text-center space-y-3 w-full">
                            <div className="h-3 w-2/3 mx-auto rounded-sm" style={{ backgroundColor: accentColor }} />
                            <div className="h-1 bg-slate-300 w-full rounded-full" />
                            <div className="h-1 bg-slate-300 w-full rounded-full" />
                            <div className="h-1 bg-slate-300 w-4/5 mx-auto rounded-full" />
                        </div>
                    </div>
                );
        }
    };

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
                        {renderThumbnail(template.id)}

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
