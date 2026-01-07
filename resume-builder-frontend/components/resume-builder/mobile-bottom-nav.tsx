'use client';

import { useUIStore } from '@/lib/stores/ui-store';
import { cn } from '@/lib/utils';

export function MobileBottomNav() {
    const { activeTab, setActiveTab } = useUIStore();

    const tabs = [
        { id: 'upload' as const, icon: 'fa-cloud-arrow-up', label: 'Import' },
        { id: 'manual' as const, icon: 'fa-pen-to-square', label: 'Manual' },
        { id: 'ai' as const, icon: 'fa-wand-magic-sparkles', label: 'AI' },
        { id: 'templates' as const, icon: 'fa-layer-group', label: 'Templates' },
        { id: 'colors' as const, icon: 'fa-palette', label: 'Colors' },
    ];

    return (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-40 safe-area-bottom">
            <div className="flex items-center justify-around px-2 py-2">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                            'flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all min-w-[60px]',
                            activeTab === tab.id
                                ? 'text-indigo-600'
                                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                        )}
                    >
                        <i className={`fa-solid ${tab.icon} text-lg`}></i>
                        <span className="text-[10px] font-bold">{tab.label}</span>
                    </button>
                ))}
            </div>

            <style jsx>{`
                .safe-area-bottom {
                    padding-bottom: env(safe-area-inset-bottom);
                }
            `}</style>
        </nav>
    );
}
