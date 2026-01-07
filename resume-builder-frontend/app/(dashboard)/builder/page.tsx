'use client';

import { useEffect, useState } from 'react';
import { useResumeStore } from '@/lib/stores/resume-store';
import { useUIStore } from '@/lib/stores/ui-store';
import { useAutoSave } from '@/hooks/use-auto-save';
import { useAuth } from '@/contexts/AuthContext';
import AuthRequiredModal from '@/components/auth-required-modal';
import { Navbar } from '@/components/resume-builder/navbar';
import { Sidebar } from '@/components/resume-builder/sidebar';
import { TabUpload } from '@/components/resume-builder/tabs/tab-upload';
import { TabManual } from '@/components/resume-builder/tabs/tab-manual';
import { TabAI } from '@/components/resume-builder/tabs/tab-ai';
import { TabTemplates } from '@/components/resume-builder/tabs/tab-templates';
import { TabColors } from '@/components/resume-builder/tabs/tab-colors';
import { PreviewPanel } from '@/components/resume-builder/preview-panel';
import { MobilePreview } from '@/components/resume-builder/mobile-preview';
import { Toaster } from 'sonner';

export default function ResumeBuilderPage() {
    // Use a default resume ID since we're now at /builder instead of /builder/[id]
    const resumeId = '1';

    const { loadResume, currentResume } = useResumeStore();
    const { activeTab, isMobileSidebarOpen, toggleMobileSidebar } = useUIStore();
    const { isSaving, isDirty } = useAutoSave(resumeId);
    const { user, loading } = useAuth();
    const [showAuthModal, setShowAuthModal] = useState(false);

    useEffect(() => {
        loadResume(resumeId);
    }, [resumeId, loadResume]);

    // Show auth modal if user is not logged in
    useEffect(() => {
        if (!loading && !user) {
            setShowAuthModal(true);
        }
    }, [user, loading]);

    if (!currentResume) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-slate-600">Loading resume...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <Toaster />

            {/* Navbar */}
            <Navbar isSaving={isSaving} isDirty={isDirty} />

            {/* Main Layout */}
            <div className="flex h-screen pt-14 lg:flex-row">
                {/* Icon-Only Sidebar */}
                <Sidebar />

                {/* Sidebar Overlay (Mobile) */}
                {isMobileSidebarOpen && (
                    <div
                        className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
                        onClick={toggleMobileSidebar}
                    />
                )}

                {/* Main Content Area */}
                <main className="flex-1 flex overflow-hidden">
                    {/* Editor Content (Left) */}
                    <section className="flex-1 lg:flex-[0.8] bg-white overflow-y-auto custom-scrollbar border-r border-slate-200 w-full">
                        <div className="max-w-xl mx-auto py-6 sm:py-10 px-4 sm:px-6 pb-24 lg:pb-10">
                            {activeTab === 'upload' && <TabUpload />}
                            {activeTab === 'manual' && <TabManual />}
                            {activeTab === 'ai' && <TabAI />}
                            {activeTab === 'templates' && <TabTemplates />}
                            {activeTab === 'colors' && <TabColors />}
                        </div>
                    </section>

                    {/* Preview Panel (Right) - Desktop Only */}
                    <PreviewPanel />
                </main>
            </div>

            {/* Mobile Preview Modal */}
            <MobilePreview />

            {/* Floating Preview Button (Mobile) */}
            <button
                onClick={() => useUIStore.getState().toggleMobilePreview()}
                className="preview-fab lg:hidden"
                aria-label="Preview Resume"
            >
                <i className="fa-solid fa-eye"></i>
            </button>

            <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .preview-fab {
          position: fixed;
          bottom: 80px;
          right: 20px;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
          box-shadow: 0 8px 24px rgba(79, 70, 229, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 20px;
          z-index: 50;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .preview-fab:hover {
          transform: scale(1.1);
          box-shadow: 0 12px 32px rgba(79, 70, 229, 0.5);
        }
        .preview-fab:active {
          transform: scale(0.95);
        }
      `}</style>

            {/* Auth Required Modal */}
            {showAuthModal && <AuthRequiredModal onClose={() => setShowAuthModal(false)} />}
        </>
    );
}
