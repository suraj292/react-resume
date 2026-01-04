'use client';

import { useState } from 'react';
import { useResumeStore } from '@/lib/stores/resume-store';

// Original Templates
import { ModernTemplate } from './templates/ModernTemplate';
import { CreativeTemplate } from './templates/CreativeTemplate';
import { AcademicTemplate } from './templates/AcademicTemplate';
import { MinimalTemplate } from './templates/MinimalTemplate';

// Executive & Professional
import { ExecutiveTemplate } from './templates/ExecutiveTemplate';
import { ProfessionalTemplate } from './templates/ProfessionalTemplate';
import { ClassicTemplate } from './templates/ClassicTemplate';

// Modern & Tech
import { TechTemplate } from './templates/TechTemplate';
import { GradientTemplate } from './templates/GradientTemplate';
import { InfographicTemplate } from './templates/InfographicTemplate';

// Minimalist & Clean
import { SwissTemplate } from './templates/SwissTemplate';
import { ElegantTemplate } from './templates/ElegantTemplate';
import { VerticalTemplate } from './templates/VerticalTemplate';

// Structured & Organized
import { TimelineTemplate } from './templates/TimelineTemplate';
import { SplitTemplate } from './templates/SplitTemplate';
import { ColumnarTemplate } from './templates/ColumnarTemplate';
import { BoxedTemplate } from './templates/BoxedTemplate';

// Bold & Colorful
import { BoldTemplate } from './templates/BoldTemplate';
import { ColorBlockTemplate } from './templates/ColorBlockTemplate';
import { StripedTemplate } from './templates/StripedTemplate';
import { BorderedTemplate } from './templates/BorderedTemplate';
import { CompactTemplate } from './templates/CompactTemplate';


// Helper function to format dates
function formatDate(dateString: string | null): string {
    if (!dateString) return 'Present';

    // Handle YYYY-MM format
    if (dateString.match(/^\d{4}-\d{2}$/)) {
        const [year, month] = dateString.split('-');
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${monthNames[parseInt(month) - 1]} ${year}`;
    }

    // Handle YYYY format
    if (dateString.match(/^\d{4}$/)) {
        return dateString;
    }

    return dateString;
}

export function PreviewPanel() {
    const { currentResume, updatePersonal, updateField, updateExperience } = useResumeStore();
    const [zoom, setZoom] = useState(100);

    if (!currentResume) return null;

    const { personal, social, summary, experience = [], education = [], skills = [], templateId, colorId } = currentResume;

    // Safety check for personal data
    if (!personal) {
        return (
            <section className="hidden lg:flex lg:flex-[1.2] bg-slate-50 overflow-y-auto custom-scrollbar p-8">
                <div className="w-full max-w-2xl mx-auto flex items-center justify-center h-full">
                    <p className="text-slate-400">Loading preview...</p>
                </div>
            </section>
        );
    }

    // Color mapping
    const colors: Record<string, string> = {
        indigo: '#4f46e5',
        emerald: '#059669',
        rose: '#e11d48',
        slate: '#334155',
        amber: '#d97706',
        violet: '#7c3aed',
    };

    const accentColor = colors[colorId] || colors.indigo;

    // Zoom functions
    const handleZoomIn = () => {
        setZoom(prev => Math.min(prev + 10, 150));
    };

    const handleZoomOut = () => {
        setZoom(prev => Math.max(prev - 10, 50));
    };

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

    // Select template component
    const renderTemplate = () => {
        // Update callbacks for inline editing
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
            // Education update - need to add this to store
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
            // Original Templates
            case 'creative':
                return <CreativeTemplate {...templateProps} />;
            case 'academic':
                return <AcademicTemplate {...templateProps} />;
            case 'minimal':
                return <MinimalTemplate {...templateProps} />;

            // Executive & Professional
            case 'executive':
                return <ExecutiveTemplate {...templateProps} />;
            case 'professional':
                return <ProfessionalTemplate {...templateProps} />;
            case 'classic':
                return <ClassicTemplate {...templateProps} />;

            // Modern & Tech
            case 'tech':
                return <TechTemplate {...templateProps} />;
            case 'gradient':
                return <GradientTemplate {...templateProps} />;
            case 'infographic':
                return <InfographicTemplate {...templateProps} />;

            // Minimalist & Clean
            case 'swiss':
                return <SwissTemplate {...templateProps} />;
            case 'elegant':
                return <ElegantTemplate {...templateProps} />;
            case 'vertical':
                return <VerticalTemplate {...templateProps} />;

            // Structured & Organized
            case 'timeline':
                return <TimelineTemplate {...templateProps} />;
            case 'split':
                return <SplitTemplate {...templateProps} />;
            case 'columnar':
                return <ColumnarTemplate {...templateProps} />;
            case 'boxed':
                return <BoxedTemplate {...templateProps} />;

            // Bold & Colorful
            case 'bold':
                return <BoldTemplate {...templateProps} />;
            case 'colorblock':
                return <ColorBlockTemplate {...templateProps} />;
            case 'striped':
                return <StripedTemplate {...templateProps} />;
            case 'bordered':
                return <BorderedTemplate {...templateProps} />;
            case 'compact':
                return <CompactTemplate {...templateProps} />;

            // Default
            case 'modern':
            default:
                return <ModernTemplate {...templateProps} />;
        }
    };

    return (
        <section className="hidden lg:flex lg:flex-[1.2] bg-slate-50 overflow-y-auto custom-scrollbar p-8">
            <div className="w-full max-w-2xl mx-auto">
                {/* Preview Header */}
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wider">
                        Live Preview
                    </h3>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500 font-medium">{zoom}%</span>
                        <button
                            onClick={handleZoomOut}
                            disabled={zoom <= 50}
                            className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-white rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            <i className="fa-solid fa-magnifying-glass-minus text-xs" />
                        </button>
                        <button
                            onClick={handleZoomIn}
                            disabled={zoom >= 150}
                            className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-white rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            <i className="fa-solid fa-magnifying-glass-plus text-xs" />
                        </button>
                    </div>
                </div>

                {/* Resume Sheet - All content flows naturally */}
                <div
                    id="resume-sheet"
                    className="bg-white shadow-2xl w-full p-12 mx-auto transition-all duration-500 space-y-8 origin-top"
                    style={{
                        boxShadow: `0 25px 50px -12px ${accentColor}20`,
                        transform: `scale(${zoom / 100})`,
                    }}
                >
                    {renderTemplate()}
                </div>

                {/* Multi-page indicator */}
                {(experience.length > 2 || education.length > 2 || skills.length > 10) && (
                    <div className="mt-6 text-center">
                        <p className="text-xs text-slate-400 italic">
                            <i className="fa-solid fa-file-lines mr-2" />
                            Multi-page resume • All content displayed
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}
