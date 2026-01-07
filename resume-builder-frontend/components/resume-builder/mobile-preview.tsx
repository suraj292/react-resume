'use client';

import { useUIStore } from '@/lib/stores/ui-store';
import { useResumeStore } from '@/lib/stores/resume-store';
import { cn } from '@/lib/utils';

// Import all templates
import { ModernTemplate } from './templates/ModernTemplate';
import { CreativeTemplate } from './templates/CreativeTemplate';
import { AcademicTemplate } from './templates/AcademicTemplate';
import { MinimalTemplate } from './templates/MinimalTemplate';
import { ExecutiveTemplate } from './templates/ExecutiveTemplate';
import { ProfessionalTemplate } from './templates/ProfessionalTemplate';
import { ClassicTemplate } from './templates/ClassicTemplate';
import { TechTemplate } from './templates/TechTemplate';
import { GradientTemplate } from './templates/GradientTemplate';
import { InfographicTemplate } from './templates/InfographicTemplate';
import { SwissTemplate } from './templates/SwissTemplate';
import { ElegantTemplate } from './templates/ElegantTemplate';
import { VerticalTemplate } from './templates/VerticalTemplate';
import { TimelineTemplate } from './templates/TimelineTemplate';
import { SplitTemplate } from './templates/SplitTemplate';
import { ColumnarTemplate } from './templates/ColumnarTemplate';
import { BoxedTemplate } from './templates/BoxedTemplate';
import { BoldTemplate } from './templates/BoldTemplate';
import { ColorBlockTemplate } from './templates/ColorBlockTemplate';
import { StripedTemplate } from './templates/StripedTemplate';
import { BorderedTemplate } from './templates/BorderedTemplate';
import { CompactTemplate } from './templates/CompactTemplate';

// Helper function to format dates
function formatDate(dateString: string | null): string {
    if (!dateString) return 'Present';
    if (dateString.match(/^\d{4}-\d{2}$/)) {
        const [year, month] = dateString.split('-');
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${monthNames[parseInt(month) - 1]} ${year}`;
    }
    if (dateString.match(/^\d{4}$/)) {
        return dateString;
    }
    return dateString;
}

export function MobilePreview() {
    const { isMobilePreviewOpen, toggleMobilePreview } = useUIStore();
    const { currentResume, updatePersonal, updateField, updateExperience } = useResumeStore();

    if (!currentResume) return null;

    const { personal, social, summary, experience = [], education = [], skills = [], templateId, colorId } = currentResume;

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

    // Format experience and education dates
    const formattedExperience = experience.map(exp => ({
        ...exp,
        startDate: formatDate(exp.startDate),
        endDate: formatDate(exp.endDate),
    }));

    const formattedEducation = education.map(edu => ({
        ...edu,
        startDate: formatDate(edu.startDate),
        endDate: formatDate(edu.endDate),
    }));

    // Select template component (same as desktop)
    const renderTemplate = () => {
        const handleUpdatePersonal = (field: keyof typeof personal, value: string) => {
            updatePersonal(field, value);
        };

        const handleUpdateSummary = (value: string) => {
            updateField('summary', value);
        };

        const handleUpdateExperience = (id: string, field: string, value: string) => {
            updateExperience(id, { [field]: value });
        };

        const handleUpdateEducation = (id: string, field: string, value: string) => {
            const eduIndex = education.findIndex(edu => edu.id === id);
            if (eduIndex !== -1) {
                const updatedEducation = [...education];
                updatedEducation[eduIndex] = { ...updatedEducation[eduIndex], [field]: value };
                updateField('education', updatedEducation);
            }
        };

        const handleUpdateSkill = (index: number, value: string) => {
            const updatedSkills = [...skills];
            updatedSkills[index] = value;
            updateField('skills', updatedSkills);
        };

        const templateProps = {
            personal,
            social,
            summary,
            experience: formattedExperience,
            education: formattedEducation,
            skills,
            accentColor,
            onUpdatePersonal: handleUpdatePersonal,
            onUpdateSummary: handleUpdateSummary,
            onUpdateExperience: handleUpdateExperience,
            onUpdateEducation: handleUpdateEducation,
            onUpdateSkill: handleUpdateSkill,
        };

        switch (templateId) {
            case 'creative': return <CreativeTemplate {...templateProps} />;
            case 'academic': return <AcademicTemplate {...templateProps} />;
            case 'minimal': return <MinimalTemplate {...templateProps} />;
            case 'executive': return <ExecutiveTemplate {...templateProps} />;
            case 'professional': return <ProfessionalTemplate {...templateProps} />;
            case 'classic': return <ClassicTemplate {...templateProps} />;
            case 'tech': return <TechTemplate {...templateProps} />;
            case 'gradient': return <GradientTemplate {...templateProps} />;
            case 'infographic': return <InfographicTemplate {...templateProps} />;
            case 'swiss': return <SwissTemplate {...templateProps} />;
            case 'elegant': return <ElegantTemplate {...templateProps} />;
            case 'vertical': return <VerticalTemplate {...templateProps} />;
            case 'timeline': return <TimelineTemplate {...templateProps} />;
            case 'split': return <SplitTemplate {...templateProps} />;
            case 'columnar': return <ColumnarTemplate {...templateProps} />;
            case 'boxed': return <BoxedTemplate {...templateProps} />;
            case 'bold': return <BoldTemplate {...templateProps} />;
            case 'colorblock': return <ColorBlockTemplate {...templateProps} />;
            case 'striped': return <StripedTemplate {...templateProps} />;
            case 'bordered': return <BorderedTemplate {...templateProps} />;
            case 'compact': return <CompactTemplate {...templateProps} />;
            case 'modern':
            default: return <ModernTemplate {...templateProps} />;
        }
    };

    return (
        <div
            className={cn(
                'lg:hidden fixed inset-0 bg-slate-50 z-50 transition-transform duration-300',
                isMobilePreviewOpen ? 'translate-y-0' : 'translate-y-full'
            )}
        >
            {/* Fixed Header - Stays in place during zoom */}
            <div className="fixed top-0 left-0 right-0 z-20 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-sm">
                <h3 className="font-display font-bold text-lg">Live Preview</h3>
                <button
                    onClick={toggleMobilePreview}
                    className="w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
                >
                    <i className="fa-solid fa-xmark text-xl" />
                </button>
            </div>

            {/* Preview Content - Scrollable with Zoom (below fixed header) */}
            <div
                className="overflow-auto bg-slate-100"
                style={{
                    touchAction: 'pan-x pan-y pinch-zoom',
                    height: 'calc(100vh - 57px)',
                    marginTop: '57px',
                }}
            >
                <div className="w-full flex justify-center p-4 min-h-full">
                    {/* A4 Container - 794px width (A4 at 96 DPI) */}
                    <div
                        className="relative"
                        style={{
                            width: '794px',
                        }}
                    >
                        {/* Scale wrapper - zoomed out on mobile, user can zoom in */}
                        <div
                            className="origin-top-left transition-transform duration-200"
                            style={{
                                transform: 'scale(var(--mobile-zoom, 0.45))',
                                transformOrigin: 'top center',
                            }}
                        >
                            {/* Resume Sheet - A4 dimensions */}
                            <div
                                id="mobile-resume-sheet"
                                className="bg-white shadow-2xl w-full p-12 space-y-8"
                                style={{
                                    width: '794px',
                                    minHeight: '1123px', // A4 height at 96 DPI
                                    boxShadow: `0 25px 50px -12px ${accentColor}20`,
                                }}
                            >
                                {renderTemplate()}
                            </div>

                            {/* Multi-page indicator */}
                            {(experience.length > 2 || education.length > 2 || skills.length > 10) && (
                                <div className="mt-6 text-center pb-4">
                                    <p className="text-xs text-slate-400 italic">
                                        <i className="fa-solid fa-file-lines mr-2" />
                                        Multi-page resume detected
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Zoom hint */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 pointer-events-none">
                <div className="bg-slate-900/80 backdrop-blur-sm text-white px-4 py-2 rounded-full text-xs font-medium shadow-lg">
                    <i className="fa-solid fa-magnifying-glass-plus mr-2" />
                    Pinch to zoom
                </div>
            </div>

            {/* Responsive zoom levels */}
            <style jsx>{`
                @media (min-width: 640px) {
                    .origin-top-left {
                        --mobile-zoom: 0.6;
                    }
                }
                @media (min-width: 768px) {
                    .origin-top-left {
                        --mobile-zoom: 0.75;
                    }
                }
                @media (min-width: 1024px) {
                    .origin-top-left {
                        --mobile-zoom: 1;
                    }
                }
            `}</style>
        </div>
    );
}
