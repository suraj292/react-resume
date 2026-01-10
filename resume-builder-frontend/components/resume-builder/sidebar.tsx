'use client';

import { useUIStore } from '@/lib/stores/ui-store';
import { cn } from '@/lib/utils';

export function Sidebar() {
    const { activeTab, setActiveTab, isMobileSidebarOpen, toggleMobileSidebar } = useUIStore();

    const tabs = [
        { id: 'upload' as const, icon: 'fa-cloud-arrow-up', label: 'Import & Job' },
        { id: 'manual' as const, icon: 'fa-pen-to-square', label: 'Manual Info' },
        { id: 'ai' as const, icon: 'fa-wand-magic-sparkles', label: 'AI Assistant' },
        { id: 'templates' as const, icon: 'fa-layer-group', label: 'Templates' },
        { id: 'colors' as const, icon: 'fa-palette', label: 'Color Palette' },
        { id: 'myresumes' as const, icon: 'fa-folder-open', label: 'My Resumes' },
    ];

    const handleTabClick = (tabId: typeof tabs[number]['id']) => {
        setActiveTab(tabId);
        if (isMobileSidebarOpen) {
            toggleMobileSidebar();
        }
    };

    return (
        <aside
            className={cn(
                'w-16 bg-white border-r border-slate-200 flex flex-col items-center py-6 gap-6 z-40',
                'fixed left-0 top-14 bottom-0 transition-transform duration-300',
                'lg:relative lg:translate-x-0',
                isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
            )}
        >
            <div className="flex flex-col gap-4">
                {tabs.map((tab) => (
                    <div key={tab.id} className="nav-item relative">
                        <button
                            onClick={() => handleTabClick(tab.id)}
                            className={cn(
                                'nav-btn w-10 h-10 flex items-center justify-center rounded-xl transition-all',
                                activeTab === tab.id
                                    ? 'bg-indigo-50 text-indigo-600 shadow-[inset_0_0_0_1px_#e0e7ff]'
                                    : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
                            )}
                        >
                            <i className={`fa-solid ${tab.icon} text-base`}></i>
                        </button>
                        <div className="tooltip">{tab.label}</div>
                    </div>
                ))}
            </div>

            <style jsx>{`
        .nav-item {
          position: relative;
        }
        .tooltip {
          position: absolute;
          left: 100%;
          top: 50%;
          transform: translateY(-50%) translateX(10px);
          background: #1e293b;
          color: white;
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 600;
          white-space: nowrap;
          opacity: 0;
          visibility: hidden;
          transition: all 0.2s ease;
          pointer-events: none;
          z-index: 100;
        }
        .nav-item:hover .tooltip {
          opacity: 1;
          visibility: visible;
          transform: translateY(-50%) translateX(15px);
        }
        .tooltip::before {
          content: '';
          position: absolute;
          right: 100%;
          top: 50%;
          margin-top: -4px;
          border-width: 4px;
          border-style: solid;
          border-color: transparent #1e293b transparent transparent;
        }
      `}</style>
        </aside>
    );
}
