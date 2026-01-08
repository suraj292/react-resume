'use client';

import { useResumeStore } from '@/lib/stores/resume-store';
import { cn } from '@/lib/utils';
import { templateAPI, TemplateData } from '@/lib/api';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/stores/auth-store';

export function TabTemplates() {
    const { currentResume, setTemplate } = useResumeStore();
    const { user } = useAuthStore();
    const selectedTemplate = currentResume?.templateId || 'modern';

    const [templates, setTemplates] = useState<TemplateData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch templates from API
    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                setLoading(true);
                const response = await templateAPI.getAll();
                if (response.data.success) {
                    setTemplates(response.data.data);
                }
            } catch (err) {
                console.error('Error fetching templates:', err);
                setError('Failed to load templates. Using default templates.');
                // Fallback to hardcoded templates if API fails
                setTemplates(getFallbackTemplates());
            } finally {
                setLoading(false);
            }
        };

        fetchTemplates();
    }, []);

    // Check if user has premium access
    const hasPremiumAccess = user?.subscription?.status === 'active' || user?.subscription?.plan_type === 'premium';

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

    // Handle template selection
    const handleTemplateSelect = async (template: TemplateData) => {
        // Check if template is premium and user doesn't have access
        if (template.is_premium && !hasPremiumAccess) {
            // Show upgrade modal or message
            alert('This is a premium template. Please upgrade your plan to use it.');
            return;
        }

        // Track analytics
        try {
            await templateAPI.trackSelection(template.id);
        } catch (err) {
            console.error('Failed to track template selection:', err);
        }

        // Set the template
        setTemplate(template.id);
    };

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

            // Add more template thumbnails as needed...
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

    if (loading) {
        return (
            <div>
                <header className="mb-8">
                    <h2 className="text-xl font-display font-bold text-slate-800">Choose a Layout</h2>
                    <p className="text-slate-400 text-xs mt-1 font-medium">
                        Select a design that matches your industry and seniority level.
                    </p>
                </header>
                <div className="grid grid-cols-2 gap-3 sm:gap-6">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="bg-white border-2 border-slate-100 p-2 rounded-2xl animate-pulse">
                            <div className="aspect-[3/4] bg-slate-200 rounded-xl mb-3" />
                            <div className="px-2 pb-2">
                                <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
                                <div className="h-3 bg-slate-100 rounded w-1/2" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div>
            <header className="mb-8">
                <h2 className="text-xl font-display font-bold text-slate-800">Choose a Layout</h2>
                <p className="text-slate-400 text-xs mt-1 font-medium">
                    Select a design that matches your industry and seniority level.
                </p>
                {error && (
                    <p className="text-amber-600 text-xs mt-2 font-medium">
                        <i className="fa-solid fa-triangle-exclamation mr-1" />
                        {error}
                    </p>
                )}
            </header>

            <div className="grid grid-cols-2 gap-3 sm:gap-6">
                {templates.map((template) => (
                    <div
                        key={template.id}
                        onClick={() => handleTemplateSelect(template)}
                        className={cn(
                            'group relative bg-white border-2 p-2 rounded-2xl cursor-pointer hover:border-indigo-200 hover:shadow-lg transition-all',
                            selectedTemplate === template.id
                                ? 'border-indigo-600 shadow-[0_0_0_2px_#4f46e5]'
                                : 'border-slate-100',
                            template.is_premium && !hasPremiumAccess && 'opacity-75'
                        )}
                    >
                        {/* Premium Badge */}
                        {template.is_premium && (
                            <div className="absolute top-4 right-4 z-10">
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-[9px] font-bold bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg">
                                    <i className="fa-solid fa-crown mr-1" />
                                    PRO
                                </span>
                            </div>
                        )}

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

                            {/* Complexity Badge */}
                            <div className="mt-2">
                                <span className={cn(
                                    "inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wide",
                                    template.complexity_level === 'beginner' && 'bg-green-100 text-green-700',
                                    template.complexity_level === 'intermediate' && 'bg-blue-100 text-blue-700',
                                    template.complexity_level === 'advanced' && 'bg-purple-100 text-purple-700'
                                )}>
                                    {template.complexity_level}
                                </span>
                            </div>
                        </div>

                        {/* Premium Lock Overlay */}
                        {template.is_premium && !hasPremiumAccess && (
                            <div className="absolute inset-0 bg-slate-900/5 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="bg-white rounded-full p-3 shadow-lg">
                                    <i className="fa-solid fa-lock text-slate-600 text-lg" />
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

// Fallback templates in case API fails
function getFallbackTemplates(): TemplateData[] {
    return [
        {
            id: 'modern',
            name: 'Modern Executive',
            category: 'Best for Tech & SaaS',
            description: 'A sleek, modern template perfect for tech professionals',
            preview_image: null,
            thumbnail_image: null,
            supported_colors: ['indigo', 'emerald', 'rose', 'slate', 'amber', 'violet'],
            features: ['Clean Layout', 'ATS-Friendly', 'Modern Design'],
            is_premium: false,
            best_for: 'Software Engineers, Product Managers',
            complexity_level: 'intermediate',
        },
        {
            id: 'creative',
            name: 'Creative Sidebar',
            category: 'Design & Marketing',
            description: 'Stand out with this creative sidebar design',
            preview_image: null,
            thumbnail_image: null,
            supported_colors: ['indigo', 'emerald', 'rose', 'slate', 'amber', 'violet'],
            features: ['Sidebar Layout', 'Visual Appeal'],
            is_premium: false,
            best_for: 'Designers, Marketers',
            complexity_level: 'intermediate',
        },
        {
            id: 'academic',
            name: 'Academic Elite',
            category: 'Formal & Corporate',
            description: 'Traditional and formal template',
            preview_image: null,
            thumbnail_image: null,
            supported_colors: ['indigo', 'emerald', 'rose', 'slate', 'amber', 'violet'],
            features: ['Formal Design', 'Traditional Layout'],
            is_premium: false,
            best_for: 'Professors, Researchers',
            complexity_level: 'beginner',
        },
        {
            id: 'minimal',
            name: 'Minimalist Bold',
            category: 'Clean & Functional',
            description: 'Less is more',
            preview_image: null,
            thumbnail_image: null,
            supported_colors: ['indigo', 'emerald', 'rose', 'slate', 'amber', 'violet'],
            features: ['Minimalist', 'Clean Lines'],
            is_premium: false,
            best_for: 'All Industries',
            complexity_level: 'beginner',
        },
    ];
}
