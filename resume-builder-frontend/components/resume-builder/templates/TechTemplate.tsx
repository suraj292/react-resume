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

export function TechTemplate({
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
            {/* Tech-Inspired Header */}
            <div className="mb-6 pb-6 border-b-2 border-slate-200">
                <div className="flex items-end justify-between">
                    <div>
                        <h1
                            className="text-5xl font-bold text-slate-900 mb-1 outline-none hover:bg-slate-50 px-2 -mx-2 rounded transition-colors cursor-text font-mono"
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
                            className="text-lg font-semibold outline-none hover:bg-slate-50 px-2 -mx-2 rounded transition-colors cursor-text"
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
                            {'<'}{personal.title || 'Professional Title'}{' />'}
                        </p>
                    </div>
                    <div className="text-right text-xs text-slate-600 space-y-1">
                        {personal.email && (
                            <div>
                                <span
                                    className="outline-none hover:bg-slate-50 px-1 -mx-1 rounded transition-colors cursor-text"
                                    contentEditable
                                    suppressContentEditableWarning
                                    onBlur={(e) => onUpdatePersonal('email', e.currentTarget.textContent || '')}
                                >
                                    {personal.email}
                                </span>
                            </div>
                        )}
                        {personal.phone && (
                            <div>
                                <span
                                    className="outline-none hover:bg-slate-50 px-1 -mx-1 rounded transition-colors cursor-text"
                                    contentEditable
                                    suppressContentEditableWarning
                                    onBlur={(e) => onUpdatePersonal('phone', e.currentTarget.textContent || '')}
                                >
                                    {personal.phone}
                                </span>
                            </div>
                        )}
                        {personal.location && (
                            <div>
                                <span
                                    className="outline-none hover:bg-slate-50 px-1 -mx-1 rounded transition-colors cursor-text"
                                    contentEditable
                                    suppressContentEditableWarning
                                    onBlur={(e) => onUpdatePersonal('location', e.currentTarget.textContent || '')}
                                >
                                    {personal.location}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Social Links */}
                {social && Object.values(social).some(link => link) && (
                    <div className="flex gap-3 mt-4">
                        {social.github && (
                            <a href={social.github} className="text-xs px-3 py-1 rounded-md font-mono" style={{ backgroundColor: `${accentColor}20`, color: accentColor }}>
                                <i className="fa-brands fa-github mr-1" />
                                GitHub
                            </a>
                        )}
                        {social.linkedin && (
                            <a href={social.linkedin} className="text-xs px-3 py-1 rounded-md font-mono" style={{ backgroundColor: `${accentColor}20`, color: accentColor }}>
                                <i className="fa-brands fa-linkedin mr-1" />
                                LinkedIn
                            </a>
                        )}
                        {social.website && (
                            <a href={social.website} className="text-xs px-3 py-1 rounded-md font-mono" style={{ backgroundColor: `${accentColor}20`, color: accentColor }}>
                                <i className="fa-solid fa-globe mr-1" />
                                Portfolio
                            </a>
                        )}
                    </div>
                )}
            </div>

            {/* Summary */}
            {summary && (
                <div className="mb-6" style={{ pageBreakInside: 'avoid' }}>
                    <h3 className="text-sm font-bold font-mono mb-3 flex items-center gap-2" style={{ color: accentColor }}>
                        <span className="text-slate-400">{'// '}</span>ABOUT
                    </h3>
                    <p
                        className="text-xs text-slate-700 leading-relaxed pl-4 border-l-2 outline-none hover:bg-slate-50 px-2 -mx-2 rounded transition-colors cursor-text"
                        style={{ borderColor: accentColor }}
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => onUpdateSummary(e.currentTarget.textContent || '')}
                    >
                        {summary}
                    </p>
                </div>
            )}

            {/* Skills */}
            {skills.length > 0 && (
                <div className="mb-6" style={{ pageBreakInside: 'avoid' }}>
                    <h3 className="text-sm font-bold font-mono mb-3 flex items-center gap-2" style={{ color: accentColor }}>
                        <span className="text-slate-400">{'// '}</span>TECH_STACK
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {skills.map((skill, index) => (
                            <span
                                key={index}
                                className="px-3 py-1 text-xs font-mono border-2 rounded outline-none hover:shadow-md transition-all cursor-text"
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

            {/* Experience */}
            {experience.length > 0 && (
                <div className="mb-6">
                    <h3 className="text-sm font-bold font-mono mb-4 flex items-center gap-2" style={{ color: accentColor }}>
                        <span className="text-slate-400">{'// '}</span>EXPERIENCE
                    </h3>
                    <div className="space-y-5">
                        {experience.map((exp) => (
                            <div key={exp.id} className="pl-4 border-l-2 border-slate-200" style={{ pageBreakInside: 'avoid' }}>
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className="font-bold text-slate-900">
                                        <span
                                            className="outline-none hover:bg-slate-50 px-1 -mx-1 rounded transition-colors cursor-text"
                                            contentEditable
                                            suppressContentEditableWarning
                                            onBlur={(e) => onUpdateExperience(exp.id, 'position', e.currentTarget.textContent || '')}
                                        >
                                            {exp.position}
                                        </span>
                                        {' @ '}
                                        <span
                                            className="outline-none hover:bg-slate-50 px-1 -mx-1 rounded transition-colors cursor-text"
                                            style={{ color: accentColor }}
                                            contentEditable
                                            suppressContentEditableWarning
                                            onBlur={(e) => onUpdateExperience(exp.id, 'company', e.currentTarget.textContent || '')}
                                        >
                                            {exp.company}
                                        </span>
                                    </h4>
                                    <span className="text-[10px] text-slate-500 font-mono whitespace-nowrap ml-4">
                                        {exp.startDate} → {exp.current ? 'NOW' : exp.endDate}
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
                <div style={{ pageBreakInside: 'avoid' }}>
                    <h3 className="text-sm font-bold font-mono mb-4 flex items-center gap-2" style={{ color: accentColor }}>
                        <span className="text-slate-400">{'// '}</span>EDUCATION
                    </h3>
                    <div className="space-y-3">
                        {education.map((edu) => (
                            <div key={edu.id} className="pl-4 border-l-2 border-slate-200">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-bold text-slate-900 text-sm">
                                            <span
                                                className="outline-none hover:bg-slate-50 px-1 -mx-1 rounded transition-colors cursor-text"
                                                contentEditable
                                                suppressContentEditableWarning
                                                onBlur={(e) => onUpdateEducation(edu.id, 'degree', e.currentTarget.textContent || '')}
                                            >
                                                {edu.degree}
                                            </span>
                                        </h4>
                                        <p className="text-xs text-slate-600 mt-0.5">
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
                                    <span className="text-[10px] text-slate-500 font-mono whitespace-nowrap ml-4">
                                        {edu.startDate} → {edu.endDate}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}
