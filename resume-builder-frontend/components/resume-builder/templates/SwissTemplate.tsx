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

export function SwissTemplate({
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
            {/* Swiss-Style Minimalist Header */}
            <div className="mb-8">
                <h1
                    className="text-6xl font-light text-slate-900 mb-1 tracking-tight outline-none hover:bg-slate-50 px-2 -mx-2 rounded transition-colors cursor-text"
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
                <div className="flex items-center gap-4">
                    <div className="h-px flex-1" style={{ backgroundColor: accentColor }}></div>
                    <p
                        className="text-sm font-medium uppercase tracking-widest outline-none hover:bg-slate-50 px-2 -mx-2 rounded transition-colors cursor-text"
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
                    <div className="h-px flex-1" style={{ backgroundColor: accentColor }}></div>
                </div>
                <div className="flex justify-center gap-6 mt-4 text-xs text-slate-600">
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
                        <span
                            className="outline-none hover:bg-slate-50 px-1 -mx-1 rounded transition-colors cursor-text"
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) => onUpdatePersonal('phone', e.currentTarget.textContent || '')}
                        >
                            {personal.phone}
                        </span>
                    )}
                    {personal.location && (
                        <span
                            className="outline-none hover:bg-slate-50 px-1 -mx-1 rounded transition-colors cursor-text"
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) => onUpdatePersonal('location', e.currentTarget.textContent || '')}
                        >
                            {personal.location}
                        </span>
                    )}
                </div>
            </div>

            {/* Summary */}
            {summary && (
                <div className="mb-8" style={{ pageBreakInside: 'avoid' }}>
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
                <div className="mb-8">
                    <h3 className="text-xs font-bold uppercase tracking-widest mb-5" style={{ color: accentColor }}>
                        Experience
                    </h3>
                    <div className="space-y-6">
                        {experience.map((exp) => (
                            <div key={exp.id} style={{ pageBreakInside: 'avoid' }}>
                                <div className="grid grid-cols-4 gap-4 mb-2">
                                    <div className="text-[10px] text-slate-500 uppercase tracking-wide">
                                        {exp.startDate} — {exp.current ? 'Now' : exp.endDate}
                                    </div>
                                    <div className="col-span-3">
                                        <h4 className="font-bold text-slate-900 mb-0.5">
                                            <span
                                                className="outline-none hover:bg-slate-50 px-1 -mx-1 rounded transition-colors cursor-text"
                                                contentEditable
                                                suppressContentEditableWarning
                                                onBlur={(e) => onUpdateExperience(exp.id, 'position', e.currentTarget.textContent || '')}
                                            >
                                                {exp.position}
                                            </span>
                                        </h4>
                                        <div className="text-sm font-medium mb-2" style={{ color: accentColor }}>
                                            <span
                                                className="outline-none hover:bg-slate-50 px-1 -mx-1 rounded transition-colors cursor-text"
                                                contentEditable
                                                suppressContentEditableWarning
                                                onBlur={(e) => onUpdateExperience(exp.id, 'company', e.currentTarget.textContent || '')}
                                            >
                                                {exp.company}
                                            </span>
                                        </div>
                                        {exp.description && (
                                            <p
                                                className="text-xs text-slate-600 leading-relaxed outline-none hover:bg-slate-50 px-2 -mx-2 rounded transition-colors cursor-text"
                                                contentEditable
                                                suppressContentEditableWarning
                                                onBlur={(e) => onUpdateExperience(exp.id, 'description', e.currentTarget.textContent || '')}
                                            >
                                                {exp.description}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Education */}
            {education.length > 0 && (
                <div className="mb-8" style={{ pageBreakInside: 'avoid' }}>
                    <h3 className="text-xs font-bold uppercase tracking-widest mb-5" style={{ color: accentColor }}>
                        Education
                    </h3>
                    <div className="space-y-4">
                        {education.map((edu) => (
                            <div key={edu.id} className="grid grid-cols-4 gap-4">
                                <div className="text-[10px] text-slate-500 uppercase tracking-wide">
                                    {edu.startDate} — {edu.endDate}
                                </div>
                                <div className="col-span-3">
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
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Skills */}
            {skills.length > 0 && (
                <div style={{ pageBreakInside: 'avoid' }}>
                    <h3 className="text-xs font-bold uppercase tracking-widest mb-5" style={{ color: accentColor }}>
                        Skills
                    </h3>
                    <div className="grid grid-cols-3 gap-2">
                        {skills.map((skill, index) => (
                            <div
                                key={index}
                                className="text-xs text-slate-700 outline-none hover:bg-slate-50 px-2 py-1 -mx-2 rounded transition-colors cursor-text"
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
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}
