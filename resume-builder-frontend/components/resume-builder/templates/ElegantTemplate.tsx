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

export function ElegantTemplate({
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
            {/* Elegant Centered Header */}
            <div className="text-center mb-8 pb-6">
                <h1
                    className="text-4xl font-serif font-light text-slate-900 mb-2 tracking-wide outline-none hover:bg-slate-50 px-2 -mx-2 rounded transition-colors cursor-text"
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
                <div className="w-16 h-px mx-auto mb-3" style={{ backgroundColor: accentColor }}></div>
                <p
                    className="text-sm font-light italic mb-4 outline-none hover:bg-slate-50 px-2 -mx-2 rounded transition-colors cursor-text"
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
                <div className="flex justify-center gap-3 text-xs text-slate-600">
                    {personal.email && (
                        <span
                            className="outline-none hover:bg-slate-50 px-1 -mx-1 rounded transition-colors cursor-text"
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) => onUpdatePersonal('email', e.currentTarget.textContent || '')}
                        >
                            {personal.email}
                        </span>
                    )}
                    {personal.phone && (
                        <>
                            <span style={{ color: accentColor }}>•</span>
                            <span
                                className="outline-none hover:bg-slate-50 px-1 -mx-1 rounded transition-colors cursor-text"
                                contentEditable
                                suppressContentEditableWarning
                                onBlur={(e) => onUpdatePersonal('phone', e.currentTarget.textContent || '')}
                            >
                                {personal.phone}
                            </span>
                        </>
                    )}
                    {personal.location && (
                        <>
                            <span style={{ color: accentColor }}>•</span>
                            <span
                                className="outline-none hover:bg-slate-50 px-1 -mx-1 rounded transition-colors cursor-text"
                                contentEditable
                                suppressContentEditableWarning
                                onBlur={(e) => onUpdatePersonal('location', e.currentTarget.textContent || '')}
                            >
                                {personal.location}
                            </span>
                        </>
                    )}
                </div>
            </div>

            {/* Summary */}
            {summary && (
                <div className="mb-6 text-center" style={{ pageBreakInside: 'avoid' }}>
                    <p
                        className="text-xs text-slate-700 leading-relaxed italic max-w-2xl mx-auto outline-none hover:bg-slate-50 px-2 -mx-2 rounded transition-colors cursor-text"
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => onUpdateSummary(e.currentTarget.textContent || '')}
                    >
                        {summary}
                    </p>
                    <div className="w-12 h-px mx-auto mt-4" style={{ backgroundColor: accentColor }}></div>
                </div>
            )}

            {/* Experience */}
            {experience.length > 0 && (
                <div className="mb-6">
                    <h3 className="text-center text-sm font-serif font-light tracking-widest uppercase mb-5" style={{ color: accentColor }}>
                        Professional Experience
                    </h3>
                    <div className="space-y-5">
                        {experience.map((exp) => (
                            <div key={exp.id} className="text-center" style={{ pageBreakInside: 'avoid' }}>
                                <h4 className="font-serif font-semibold text-slate-900 text-base">
                                    <span
                                        className="outline-none hover:bg-slate-50 px-1 -mx-1 rounded transition-colors cursor-text"
                                        contentEditable
                                        suppressContentEditableWarning
                                        onBlur={(e) => onUpdateExperience(exp.id, 'position', e.currentTarget.textContent || '')}
                                    >
                                        {exp.position}
                                    </span>
                                </h4>
                                <div className="text-sm font-light italic mt-1" style={{ color: accentColor }}>
                                    <span
                                        className="outline-none hover:bg-slate-50 px-1 -mx-1 rounded transition-colors cursor-text"
                                        contentEditable
                                        suppressContentEditableWarning
                                        onBlur={(e) => onUpdateExperience(exp.id, 'company', e.currentTarget.textContent || '')}
                                    >
                                        {exp.company}
                                    </span>
                                </div>
                                <div className="text-[10px] text-slate-500 mt-0.5">
                                    {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                                </div>
                                {exp.description && (
                                    <p
                                        className="text-xs text-slate-600 leading-relaxed mt-2 max-w-2xl mx-auto outline-none hover:bg-slate-50 px-2 -mx-2 rounded transition-colors cursor-text"
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
                    <h3 className="text-center text-sm font-serif font-light tracking-widest uppercase mb-5" style={{ color: accentColor }}>
                        Education
                    </h3>
                    <div className="space-y-3">
                        {education.map((edu) => (
                            <div key={edu.id} className="text-center">
                                <h4 className="font-serif font-semibold text-slate-900">
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
                                <p className="text-[10px] text-slate-500 mt-0.5">
                                    {edu.startDate} — {edu.endDate}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Skills */}
            {skills.length > 0 && (
                <div style={{ pageBreakInside: 'avoid' }}>
                    <h3 className="text-center text-sm font-serif font-light tracking-widest uppercase mb-4" style={{ color: accentColor }}>
                        Skills
                    </h3>
                    <div className="flex flex-wrap justify-center gap-x-3 gap-y-1">
                        {skills.map((skill, index) => (
                            <span key={index} className="text-xs text-slate-700">
                                <span
                                    className="outline-none hover:bg-slate-50 px-1 -mx-1 rounded transition-colors cursor-text"
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
                                {index < skills.length - 1 && <span className="mx-2" style={{ color: accentColor }}>•</span>}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}
