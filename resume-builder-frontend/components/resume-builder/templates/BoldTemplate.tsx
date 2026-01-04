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

export function BoldTemplate({
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
            {/* Bold Colored Header */}
            <div className="mb-6 p-6 -mx-6 -mt-6 text-white" style={{ backgroundColor: accentColor }}>
                <h1
                    className="text-5xl font-black mb-2 outline-none hover:bg-white/10 px-2 -mx-2 rounded transition-colors cursor-text"
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
                    {personal.name || 'YOUR NAME'}
                </h1>
                <p
                    className="text-xl font-bold mb-4 opacity-90 outline-none hover:bg-white/10 px-2 -mx-2 rounded transition-colors cursor-text"
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
                <div className="flex gap-4 text-sm opacity-90">
                    {personal.email && (
                        <span>
                            <i className="fa-solid fa-envelope mr-2" />
                            <span
                                className="outline-none hover:bg-white/10 px-1 -mx-1 rounded transition-colors cursor-text"
                                contentEditable
                                suppressContentEditableWarning
                                onBlur={(e) => onUpdatePersonal('email', e.currentTarget.textContent || '')}
                            >
                                {personal.email}
                            </span>
                        </span>
                    )}
                    {personal.phone && (
                        <span>
                            <i className="fa-solid fa-phone mr-2" />
                            <span
                                className="outline-none hover:bg-white/10 px-1 -mx-1 rounded transition-colors cursor-text"
                                contentEditable
                                suppressContentEditableWarning
                                onBlur={(e) => onUpdatePersonal('phone', e.currentTarget.textContent || '')}
                            >
                                {personal.phone}
                            </span>
                        </span>
                    )}
                    {personal.location && (
                        <span>
                            <i className="fa-solid fa-location-dot mr-2" />
                            <span
                                className="outline-none hover:bg-white/10 px-1 -mx-1 rounded transition-colors cursor-text"
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

            {/* Summary */}
            {summary && (
                <div className="mb-6" style={{ pageBreakInside: 'avoid' }}>
                    <h3 className="text-lg font-black uppercase mb-3" style={{ color: accentColor }}>
                        Profile
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
                    <h3 className="text-lg font-black uppercase mb-4" style={{ color: accentColor }}>
                        Experience
                    </h3>
                    <div className="space-y-5">
                        {experience.map((exp) => (
                            <div key={exp.id} style={{ pageBreakInside: 'avoid' }}>
                                <div className="flex justify-between items-start mb-1">
                                    <div>
                                        <h4 className="text-base font-black text-slate-900">
                                            <span
                                                className="outline-none hover:bg-slate-50 px-1 -mx-1 rounded transition-colors cursor-text"
                                                contentEditable
                                                suppressContentEditableWarning
                                                onBlur={(e) => onUpdateExperience(exp.id, 'position', e.currentTarget.textContent || '')}
                                            >
                                                {exp.position}
                                            </span>
                                        </h4>
                                        <div className="text-sm font-bold" style={{ color: accentColor }}>
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
                                    <span className="text-xs font-bold text-slate-500 whitespace-nowrap ml-4">
                                        {exp.startDate} - {exp.current ? 'PRESENT' : exp.endDate}
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
                    <h3 className="text-lg font-black uppercase mb-4" style={{ color: accentColor }}>
                        Education
                    </h3>
                    <div className="space-y-3">
                        {education.map((edu) => (
                            <div key={edu.id}>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-black text-slate-900">
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
                                    <span className="text-xs font-bold text-slate-500 whitespace-nowrap ml-4">
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
                    <h3 className="text-lg font-black uppercase mb-4" style={{ color: accentColor }}>
                        Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {skills.map((skill, index) => (
                            <span
                                key={index}
                                className="px-4 py-2 text-sm font-black uppercase text-white rounded outline-none hover:shadow-lg transition-all cursor-text"
                                style={{ backgroundColor: accentColor }}
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
