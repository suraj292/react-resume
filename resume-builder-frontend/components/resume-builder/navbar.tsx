'use client';

import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useResumeStore } from '@/lib/stores/resume-store';
import { useUIStore } from '@/lib/stores/ui-store';

interface NavbarProps {
    isSaving: boolean;
    isDirty: boolean;
}

export function Navbar({ isSaving, isDirty }: NavbarProps) {
    const { lastSaved, currentResume } = useResumeStore();
    const { toggleMobileSidebar } = useUIStore();
    const [isExporting, setIsExporting] = useState(false);

    const getSaveStatus = () => {
        if (isSaving) return 'Saving...';
        if (isDirty) return 'Unsaved changes';
        if (lastSaved) {
            return `Draft saved ${formatDistanceToNow(lastSaved, { addSuffix: true })}`;
        }
        return 'All changes saved';
    };

    const handleExportPDF = async () => {
        setIsExporting(true);
        try {
            const resumeElement = document.getElementById('resume-sheet');
            if (!resumeElement) {
                alert('Resume preview not found');
                setIsExporting(false);
                return;
            }

            // Create a new window for printing
            const printWindow = window.open('', '_blank');
            if (!printWindow) {
                alert('Please allow popups to export PDF');
                setIsExporting(false);
                return;
            }

            // Get computed styles
            const styles = Array.from(document.styleSheets)
                .map(styleSheet => {
                    try {
                        return Array.from(styleSheet.cssRules)
                            .map(rule => rule.cssText)
                            .join('\n');
                    } catch (e) {
                        return '';
                    }
                })
                .join('\n');

            // Create print document
            printWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>${currentResume?.personal?.name || 'Resume'}</title>
                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
                    <style>
                        @page {
                            size: A4;
                            margin: 0;
                        }
                        body {
                            margin: 0;
                            padding: 0;
                            font-family: Arial, sans-serif;
                        }
                        @media print {
                            body {
                                -webkit-print-color-adjust: exact;
                                print-color-adjust: exact;
                            }
                        }
                        ${styles}
                    </style>
                </head>
                <body>
                    ${resumeElement.outerHTML}
                </body>
                </html>
            `);

            printWindow.document.close();

            // Wait for content to load
            printWindow.onload = () => {
                setTimeout(() => {
                    printWindow.print();
                    printWindow.close();
                    setIsExporting(false);
                }, 500);
            };

            // Fallback if onload doesn't fire
            setTimeout(() => {
                if (printWindow && !printWindow.closed) {
                    printWindow.print();
                    printWindow.close();
                }
                setIsExporting(false);
            }, 2000);

        } catch (error) {
            console.error('Error exporting PDF:', error);
            alert('Failed to export PDF. Please try again.');
            setIsExporting(false);
        }
    };

    return (
        <nav className="fixed top-0 left-0 right-0 h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 z-50">
            <div className="flex items-center gap-3">
                {/* Mobile Menu Toggle */}
                <button
                    onClick={toggleMobileSidebar}
                    className="lg:hidden w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
                >
                    <i className="fa-solid fa-bars text-base"></i>
                </button>

                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold italic shadow-indigo-200 shadow-lg">
                    R
                </div>
                <span className="font-display font-bold text-lg tracking-tight hidden md:block">
                    ResumeAI
                </span>
            </div>

            <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-400 hidden sm:block italic">
                    {getSaveStatus()}
                </span>
                <button
                    onClick={handleExportPDF}
                    disabled={isExporting}
                    className="bg-slate-900 hover:bg-slate-800 text-white px-3 sm:px-4 py-1.5 rounded-lg font-bold text-xs transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <i className={`fa-solid ${isExporting ? 'fa-spinner fa-spin' : 'fa-download'} text-[10px]`}></i>
                    <span className="hidden sm:inline">{isExporting ? 'Exporting...' : 'Export PDF'}</span>
                    <span className="sm:hidden">{isExporting ? '...' : 'Export'}</span>
                </button>
            </div>
        </nav>
    );
}
