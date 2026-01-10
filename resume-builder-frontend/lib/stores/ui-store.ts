import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type TabType = 'upload' | 'manual' | 'ai' | 'templates' | 'colors' | 'myresumes';

interface UIStore {
    // Sidebar & Navigation
    activeTab: TabType;
    isMobileSidebarOpen: boolean;
    isMobilePreviewOpen: boolean;

    // Template & Color
    selectedTemplate: string;
    selectedColor: string;

    // Upload Mode
    resumeInputMode: 'upload' | 'paste';
    jobInputMode: 'upload' | 'paste';

    // Actions
    setActiveTab: (tab: TabType) => void;
    toggleMobileSidebar: () => void;
    toggleMobilePreview: () => void;
    setTemplate: (id: string) => void;
    setColor: (id: string) => void;
    setResumeInputMode: (mode: 'upload' | 'paste') => void;
    setJobInputMode: (mode: 'upload' | 'paste') => void;
}

export const useUIStore = create<UIStore>()(
    devtools((set) => ({
        // Initial State
        activeTab: 'upload',
        isMobileSidebarOpen: false,
        isMobilePreviewOpen: false,
        selectedTemplate: 'modern',
        selectedColor: 'indigo',
        resumeInputMode: 'upload',
        jobInputMode: 'paste',

        // Actions
        setActiveTab: (tab) => set({ activeTab: tab, isMobileSidebarOpen: false }),

        toggleMobileSidebar: () =>
            set((state) => ({ isMobileSidebarOpen: !state.isMobileSidebarOpen })),

        toggleMobilePreview: () =>
            set((state) => ({ isMobilePreviewOpen: !state.isMobilePreviewOpen })),

        setTemplate: (id) => set({ selectedTemplate: id }),

        setColor: (id) => set({ selectedColor: id }),

        setResumeInputMode: (mode) => set({ resumeInputMode: mode }),

        setJobInputMode: (mode) => set({ jobInputMode: mode }),
    }))
);
