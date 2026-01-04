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

export function ClassicTemplate({
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
            {/* Classic Header */}
            <div className="text-center mb-6 pb-4 border-b-4 border-slate-900">
                <h1
                    className="text-4xl font-serif font-bold text-slate-900 mb-1 outline-none hover:bg-slate-50 px-2 -mx-2 rounded transition-colors cursor-text"
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
                    className="text-sm font-medium uppercase tracking-widest mb-3 outline-none hover:bg-slate-50 px-2 -mx-2 rounded transition-colors cursor-text"
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
                <div className="flex justify-center gap-3 text-xs text-slate-700">
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
                            <span>|</span>
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
                            <span>|</span>
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
                <div className="mb-6" style={{ pageBreakInside: 'avoid' }}>
                    <h3 className="text-sm font-serif font-bold uppercase tracking-wider mb-3 text-center" style={{ color: accentColor }}>
                        Professional Summary
                    </h3>
                    <p
                        className="text-xs text-slate-700 leading-relaxed text-center outline-none hover:bg-slate-50 px-2 -mx-2 rounded transition-colors cursor-text"
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
                    <h3 className="text-sm font-serif font-bold uppercase tracking-wider mb-4 pb-2 border-b-2 border-slate-900 text-center">
                        Professional Experience
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
                                        <div className="text-sm italic text-slate-700">
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
                                    <span className="text-xs text-slate-600 whitespace-nowrap ml-4">
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
                    <h3 className="text-sm font-serif font-bold uppercase tracking-wider mb-4 pb-2 border-b-2 border-slate-900 text-center">
                        Education
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
                                        <p className="text-sm italic text-slate-700 mt-0.5">
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
                                    <span className="text-xs text-slate-600 whitespace-nowrap ml-4">
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
                    <h3 className="text-sm font-serif font-bold uppercase tracking-wider mb-4 pb-2 border-b-2 border-slate-900 text-center">
                        Skills & Competencies
                    </h3>
                    <div className="text-center">
                        {skills.map((skill, index) => (
                            <span key={index} className="inline-block text-xs text-slate-700">
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
                                {index < skills.length - 1 && <span className="mx-2">•</span>}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}
