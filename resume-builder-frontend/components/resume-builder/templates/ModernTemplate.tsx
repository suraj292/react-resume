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

export function ModernTemplate({
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
            {/* Header */}
            <div className="border-b-4 pb-6" style={{ borderColor: accentColor }}>
                <h1
                    className="text-4xl font-black text-slate-900 tracking-tight uppercase outline-none hover:bg-slate-50 px-2 -mx-2 rounded transition-colors cursor-text"
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
                    className="text-lg font-bold mt-2 outline-none hover:bg-slate-50 px-2 -mx-2 rounded transition-colors cursor-text"
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
                <div className="flex flex-wrap gap-4 mt-4 text-[11px] font-bold text-slate-400">
                    {personal.email && (
                        <span>
                            <i className="fa-solid fa-envelope mr-1.5" />
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
                        <span>
                            <i className="fa-solid fa-phone mr-1.5" />
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
                        <span>
                            <i className="fa-solid fa-location-dot mr-1.5" />
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

                    {/* Social Media Links */}
                    {social && Object.values(social).some(link => link) && (
                        <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3 text-[11px]">
                            {social.github && (
                                <span className="flex items-center gap-1.5">
                                    <i className="fa-brands fa-github text-slate-400" />
                                    <a
                                        href={social.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-slate-600 hover:text-indigo-600 transition-colors underline"
                                    >
                                        {social.github.replace('https://', '').replace('http://', '')}
                                    </a>
                                </span>
                            )}
                            {social.linkedin && (
                                <span className="flex items-center gap-1.5">
                                    <i className="fa-brands fa-linkedin text-slate-400" />
                                    <a
                                        href={social.linkedin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-slate-600 hover:text-indigo-600 transition-colors underline"
                                    >
                                        {social.linkedin.replace('https://', '').replace('http://', '')}
                                    </a>
                                </span>
                            )}
                            {social.twitter && (
                                <span className="flex items-center gap-1.5">
                                    <i className="fa-brands fa-twitter text-slate-400" />
                                    <a
                                        href={social.twitter}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-slate-600 hover:text-indigo-600 transition-colors underline"
                                    >
                                        {social.twitter.replace('https://', '').replace('http://', '')}
                                    </a>
                                </span>
                            )}
                            {social.instagram && (
                                <span className="flex items-center gap-1.5">
                                    <i className="fa-brands fa-instagram text-slate-400" />
                                    <a
                                        href={social.instagram}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-slate-600 hover:text-indigo-600 transition-colors underline"
                                    >
                                        {social.instagram.replace('https://', '').replace('http://', '')}
                                    </a>
                                </span>
                            )}
                            {social.pinterest && (
                                <span className="flex items-center gap-1.5">
                                    <i className="fa-brands fa-pinterest text-slate-400" />
                                    <a
                                        href={social.pinterest}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-slate-600 hover:text-indigo-600 transition-colors underline"
                                    >
                                        {social.pinterest.replace('https://', '').replace('http://', '')}
                                    </a>
                                </span>
                            )}
                            {social.website && (
                                <span className="flex items-center gap-1.5">
                                    <i className="fa-solid fa-globe text-slate-400" />
                                    <a
                                        href={social.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-slate-600 hover:text-indigo-600 transition-colors underline"
                                    >
                                        {social.website.replace('https://', '').replace('http://', '')}
                                    </a>
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Summary */}
            {summary && (
                <div style={{ pageBreakInside: 'avoid' }}>
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 border-b border-slate-100 pb-1">
                        Professional Summary
                    </h3>
                    <p
                        className="text-xs text-slate-600 leading-relaxed outline-none hover:bg-slate-50 px-2 -mx-2 rounded transition-colors cursor-text"
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
                <div>
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-100 pb-1">
                        Experience
                    </h3>
                    <div className="space-y-5">
                        {experience.map((exp) => (
                            <div key={exp.id} style={{ pageBreakInside: 'avoid' }}>
                                <div className="flex justify-between items-baseline">
                                    <h4 className="font-bold text-slate-800">
                                        <span
                                            className="outline-none hover:bg-slate-50 px-1 -mx-1 rounded transition-colors cursor-text"
                                            contentEditable
                                            suppressContentEditableWarning
                                            onBlur={(e) => onUpdateExperience(exp.id, 'position', e.currentTarget.textContent || '')}
                                        >
                                            {exp.position}
                                        </span>
                                        {' at '}
                                        <span
                                            className="outline-none hover:bg-slate-50 px-1 -mx-1 rounded transition-colors cursor-text"
                                            contentEditable
                                            suppressContentEditableWarning
                                            onBlur={(e) => onUpdateExperience(exp.id, 'company', e.currentTarget.textContent || '')}
                                        >
                                            {exp.company}
                                        </span>
                                    </h4>
                                    <span className="text-[10px] font-bold text-slate-400 italic whitespace-nowrap ml-2">
                                        {exp.startDate} — {exp.current ? 'PRESENT' : exp.endDate}
                                    </span>
                                </div>
                                {exp.description && (
                                    <p
                                        className="text-xs text-slate-500 mt-1.5 leading-relaxed outline-none hover:bg-slate-50 px-2 -mx-2 rounded transition-colors cursor-text"
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
                <div style={{ pageBreakInside: 'avoid' }}>
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-100 pb-1">
                        Education
                    </h3>
                    <div className="space-y-4">
                        {education.map((edu) => (
                            <div key={edu.id}>
                                <div className="flex justify-between items-baseline">
                                    <h4 className="font-bold text-slate-800">
                                        <span
                                            className="outline-none hover:bg-slate-50 px-1 -mx-1 rounded transition-colors cursor-text"
                                            contentEditable
                                            suppressContentEditableWarning
                                            onBlur={(e) => onUpdateEducation(edu.id, 'degree', e.currentTarget.textContent || '')}
                                        >
                                            {edu.degree}
                                        </span>
                                        {edu.field && (
                                            <>
                                                {' in '}
                                                <span
                                                    className="outline-none hover:bg-slate-50 px-1 -mx-1 rounded transition-colors cursor-text"
                                                    contentEditable
                                                    suppressContentEditableWarning
                                                    onBlur={(e) => onUpdateEducation(edu.id, 'field', e.currentTarget.textContent || '')}
                                                >
                                                    {edu.field}
                                                </span>
                                            </>
                                        )}
                                    </h4>
                                    <span className="text-[10px] font-bold text-slate-400 italic whitespace-nowrap ml-2">
                                        {edu.startDate} — {edu.endDate}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-500 mt-1">
                                    <span
                                        className="outline-none hover:bg-slate-50 px-1 -mx-1 rounded transition-colors cursor-text"
                                        contentEditable
                                        suppressContentEditableWarning
                                        onBlur={(e) => onUpdateEducation(edu.id, 'institution', e.currentTarget.textContent || '')}
                                    >
                                        {edu.institution}
                                    </span>
                                    {edu.gpa && ` • GPA: ${edu.gpa} `}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Skills */}
            {skills.length > 0 && (
                <div style={{ pageBreakInside: 'avoid' }}>
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-100 pb-1">
                        Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {skills.map((skill, index) => (
                            <span
                                key={index}
                                className="px-3 py-1.5 text-xs font-bold rounded-full outline-none hover:ring-2 transition-all cursor-text"
                                style={{
                                    backgroundColor: `${accentColor} 15`,
                                    color: accentColor,
                                }}
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
