'use client';

import { useUIStore } from '@/lib/stores/ui-store';
import { useResumeStore } from '@/lib/stores/resume-store';
import { cn } from '@/lib/utils';

export function MobilePreview() {
    const { isMobilePreviewOpen, toggleMobilePreview } = useUIStore();
    const { currentResume } = useResumeStore();

    if (!currentResume) return null;

    const { personal, colorId } = currentResume;

    // Safety check for personal data
    if (!personal) return null;

    const colors: Record<string, string> = {
        indigo: '#4f46e5',
        emerald: '#059669',
        rose: '#e11d48',
        slate: '#334155',
        amber: '#d97706',
        violet: '#7c3aed',
    };

    const accentColor = colors[colorId] || colors.indigo;

    return (
        <div
            className={cn(
                'lg:hidden fixed inset-0 bg-white z-50 transition-transform duration-300',
                isMobilePreviewOpen ? 'translate-y-0' : 'translate-y-full'
            )}
        >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
                <h3 className="font-display font-bold text-lg">Resume Preview</h3>
                <button
                    onClick={toggleMobilePreview}
                    className="w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
                >
                    <i className="fa-solid fa-xmark text-xl" />
                </button>
            </div>

            {/* Preview Content */}
            <div className="preview-container p-6 overflow-y-auto h-full pb-24">
                <div className="bg-white shadow-2xl w-full min-h-[1000px] p-6 mx-auto max-w-2xl">
                    <div className="border-b-4 pb-8 mb-8" style={{ borderColor: accentColor }}>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase transition-colors duration-500">
                            {personal.name || 'Your Name'}
                        </h1>
                        <p
                            className="text-base font-bold mt-1 transition-colors duration-500"
                            style={{ color: accentColor }}
                        >
                            {personal.title || 'Professional Title'}
                        </p>
                        <div className="flex flex-wrap gap-3 mt-4 text-[10px] font-bold text-slate-400">
                            {personal.email && (
                                <span>
                                    <i className="fa-solid fa-envelope mr-1.5" />
                                    {personal.email}
                                </span>
                            )}
                            {personal.phone && (
                                <span>
                                    <i className="fa-solid fa-phone mr-1.5" />
                                    {personal.phone}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Mock Body Content */}
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-100 pb-1">
                                Experience
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between items-baseline flex-wrap gap-2">
                                        <h4 className="font-bold text-slate-800">Principal Engineer at TechCorp</h4>
                                        <span className="text-[10px] font-bold text-slate-400 italic">
                                            2021 — PRESENT
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                        Led the migration of legacy infrastructure to a modern microservices
                                        architecture, improving system uptime by 40%.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
