import { PersonalInfo, SocialMedia, Experience, Education } from '@/lib/stores/resume-store';

interface EditableTemplateProps {
    personal: PersonalInfo;
    social?: SocialMedia;
    summary?: string;
    experience: Experience[];
    education: Education[];
    skills: string[];
    accentColor: string;
    onUpdatePersonal: (field: keyof PersonalInfo, value: string) => void;
    onUpdateSummary: (value: string) => void;
    onUpdateExperience: (id: string, field: string, value: string) => void;
    onUpdateEducation: (id: string, field: string, value: string) => void;
    onUpdateSkill: (index: number, value: string) => void;
}

export function ProfessionalTemplate({
    personal,
    social,
    summary,
    experience,
    education,
    skills,
    accentColor,
    onUpdatePersonal,
    onUpdateSummary,
    onUpdateExperience,
    onUpdateEducation,
    onUpdateSkill,
}: EditableTemplateProps) {
    return (
        <>
            {/* Professional Header with Left Accent Bar */}
            <div className="mb-6 pb-5 border-b-2 border-slate-200">
                <div className="flex gap-4">
                    <div className="w-1 flex-shrink-0 rounded" style={{ backgroundColor: accentColor }}></div>
                    <div className="flex-1">
                        <h1
                            className="text-3xl font-bold text-slate-900 mb-1 outline-none hover:bg-slate-50 px-2 -mx-2 rounded transition-colors cursor-text"
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) => onUpdatePersonal('name', e.currentTarget.textContent || '')}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    e.currentTarget.blur();
                                }
                            }}
                        >
                            {personal.name || 'Your Name'}
                        </h1>
                        <p
                            className="text-base font-medium mb-3 outline-none hover:bg-slate-50 px-2 -mx-2 rounded transition-colors cursor-text"
                            style={{ color: accentColor }}
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) => onUpdatePersonal('title', e.currentTarget.textContent || '')}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    e.currentTarget.blur();
                                }
                            }}
                        >
                            {personal.title || 'Professional Title'}
                        </p>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600">
                            {personal.email && (
                                <span className="flex items-center gap-1.5">
                                    <i className="fa-solid fa-envelope" style={{ color: accentColor }} />
                                    <span
                                        className="outline-none hover:bg-slate-50 px-1 -mx-1 rounded transition-colors cursor-text"
                                        contentEditable
                                        suppressContentEditableWarning
                                        onBlur={(e) => onUpdatePersonal('email', e.currentTarget.textContent || '')}
                                    >
                                        {personal.email}
                                    </span>
                                </span>
                            )}
                            {personal.phone && (
                                <span className="flex items-center gap-1.5">
                                    <i className="fa-solid fa-phone" style={{ color: accentColor }} />
                                    <span
                                        className="outline-none hover:bg-slate-50 px-1 -mx-1 rounded transition-colors cursor-text"
                                        contentEditable
                                        suppressContentEditableWarning
                                        onBlur={(e) => onUpdatePersonal('phone', e.currentTarget.textContent || '')}
                                    >
                                        {personal.phone}
                                    </span>
                                </span>
                            )}
                            {personal.location && (
                                <span className="flex items-center gap-1.5">
                                    <i className="fa-solid fa-location-dot" style={{ color: accentColor }} />
                                    <span
                                        className="outline-none hover:bg-slate-50 px-1 -mx-1 rounded transition-colors cursor-text"
                                        contentEditable
                                        suppressContentEditableWarning
                                        onBlur={(e) => onUpdatePersonal('location', e.currentTarget.textContent || '')}
                                    >
                                        {personal.location}
                                    </span>
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Summary */}
            {summary && (
                <div className="mb-6" style={{ pageBreakInside: 'avoid' }}>
                    <h3 className="text-sm font-bold uppercase tracking-wide mb-3 flex items-center gap-2">
                        <span className="w-6 h-px" style={{ backgroundColor: accentColor }}></span>
                        <span style={{ color: accentColor }}>Summary</span>
                    </h3>
                    <p
                        className="text-xs text-slate-700 leading-relaxed outline-none hover:bg-slate-50 px-2 -mx-2 rounded transition-colors cursor-text"
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => onUpdateSummary(e.currentTarget.textContent || '')}
                    >
                        {summary}
                    </p>
                </div>
            )}

            {/* Experience */}
            {experience.length > 0 && (
                <div className="mb-6">
                    <h3 className="text-sm font-bold uppercase tracking-wide mb-4 flex items-center gap-2">
                        <span className="w-6 h-px" style={{ backgroundColor: accentColor }}></span>
                        <span style={{ color: accentColor }}>Experience</span>
                    </h3>
                    <div className="space-y-5">
                        {experience.map((exp) => (
                            <div key={exp.id} style={{ pageBreakInside: 'avoid' }}>
                                <div className="flex justify-between items-start mb-1">
                                    <div>
                                        <h4 className="font-bold text-slate-900">
                                            <span
                                                className="outline-none hover:bg-slate-50 px-1 -mx-1 rounded transition-colors cursor-text"
                                                contentEditable
                                                suppressContentEditableWarning
                                                onBlur={(e) => onUpdateExperience(exp.id, 'position', e.currentTarget.textContent || '')}
                                            >
                                                {exp.position}
                                            </span>
                                        </h4>
                                        <div className="text-sm font-medium" style={{ color: accentColor }}>
                                            <span
                                                className="outline-none hover:bg-slate-50 px-1 -mx-1 rounded transition-colors cursor-text"
                                                contentEditable
                                                suppressContentEditableWarning
                                                onBlur={(e) => onUpdateExperience(exp.id, 'company', e.currentTarget.textContent || '')}
                                            >
                                                {exp.company}
                                            </span>
                                        </div>
                                    </div>
                                    <span className="text-xs text-slate-500 whitespace-nowrap ml-4">
                                        {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                                    </span>
                                </div>
                                {exp.description && (
                                    <p
                                        className="text-xs text-slate-600 leading-relaxed mt-2 outline-none hover:bg-slate-50 px-2 -mx-2 rounded transition-colors cursor-text"
                                        contentEditable
                                        suppressContentEditableWarning
                                        onBlur={(e) => onUpdateExperience(exp.id, 'description', e.currentTarget.textContent || '')}
                                    >
                                        {exp.description}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Education */}
            {education.length > 0 && (
                <div className="mb-6" style={{ pageBreakInside: 'avoid' }}>
                    <h3 className="text-sm font-bold uppercase tracking-wide mb-4 flex items-center gap-2">
                        <span className="w-6 h-px" style={{ backgroundColor: accentColor }}></span>
                        <span style={{ color: accentColor }}>Education</span>
                    </h3>
                    <div className="space-y-3">
                        {education.map((edu) => (
                            <div key={edu.id}>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-bold text-slate-900">
                                            <span
                                                className="outline-none hover:bg-slate-50 px-1 -mx-1 rounded transition-colors cursor-text"
                                                contentEditable
                                                suppressContentEditableWarning
                                                onBlur={(e) => onUpdateEducation(edu.id, 'degree', e.currentTarget.textContent || '')}
                                            >
                                                {edu.degree}
                                            </span>
                                        </h4>
                                        <p className="text-sm text-slate-600 mt-0.5">
                                            <span
                                                className="outline-none hover:bg-slate-50 px-1 -mx-1 rounded transition-colors cursor-text"
                                                contentEditable
                                                suppressContentEditableWarning
                                                onBlur={(e) => onUpdateEducation(edu.id, 'institution', e.currentTarget.textContent || '')}
                                            >
                                                {edu.institution}
                                            </span>
                                        </p>
                                    </div>
                                    <span className="text-xs text-slate-500 whitespace-nowrap ml-4">
                                        {edu.startDate} - {edu.endDate}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Skills */}
            {skills.length > 0 && (
                <div style={{ pageBreakInside: 'avoid' }}>
                    <h3 className="text-sm font-bold uppercase tracking-wide mb-4 flex items-center gap-2">
                        <span className="w-6 h-px" style={{ backgroundColor: accentColor }}></span>
                        <span style={{ color: accentColor }}>Skills</span>
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {skills.map((skill, index) => (
                            <span
                                key={index}
                                className="px-3 py-1.5 text-xs font-medium border rounded-md outline-none hover:shadow-md transition-all cursor-text"
                                style={{ borderColor: accentColor, color: accentColor }}
                                contentEditable
                                suppressContentEditableWarning
                                onBlur={(e) => onUpdateSkill(index, e.currentTarget.textContent || '')}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        e.currentTarget.blur();
                                    }
                                }}
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}
