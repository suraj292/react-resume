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

export function ColorBlockTemplate({
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
            <div className="flex gap-0">
                {/* Left Colored Sidebar */}
                <div className="w-1/3 p-6 -ml-6 -mt-6 text-white" style={{ backgroundColor: accentColor }}>
                    <div className="mb-6">
                        <h1
                            className="text-2xl font-bold mb-1 outline-none hover:bg-white/10 px-2 -mx-2 rounded transition-colors cursor-text"
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
                            className="text-sm font-light opacity-90 outline-none hover:bg-white/10 px-2 -mx-2 rounded transition-colors cursor-text"
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
                    </div>

                    {/* Contact */}
                    <div className="mb-6">
                        <h3 className="text-xs font-bold uppercase tracking-wider mb-3 opacity-80">Contact</h3>
                        <div className="space-y-2 text-xs opacity-90">
                            {personal.email && (
                                <div className="flex items-start gap-2">
                                    <i className="fa-solid fa-envelope mt-0.5" />
                                    <span
                                        className="outline-none hover:bg-white/10 px-1 -mx-1 rounded transition-colors cursor-text flex-1 break-all"
                                        contentEditable
                                        suppressContentEditableWarning
                                        onBlur={(e) => onUpdatePersonal('email', e.currentTarget.textContent || '')}
                                    >
                                        {personal.email}
                                    </span>
                                </div>
                            )}
                            {personal.phone && (
                                <div className="flex items-start gap-2">
                                    <i className="fa-solid fa-phone mt-0.5" />
                                    <span
                                        className="outline-none hover:bg-white/10 px-1 -mx-1 rounded transition-colors cursor-text flex-1"
                                        contentEditable
                                        suppressContentEditableWarning
                                        onBlur={(e) => onUpdatePersonal('phone', e.currentTarget.textContent || '')}
                                    >
                                        {personal.phone}
                                    </span>
                                </div>
                            )}
                            {personal.location && (
                                <div className="flex items-start gap-2">
                                    <i className="fa-solid fa-location-dot mt-0.5" />
                                    <span
                                        className="outline-none hover:bg-white/10 px-1 -mx-1 rounded transition-colors cursor-text flex-1"
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

                    {/* Skills */}
                    {skills.length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-xs font-bold uppercase tracking-wider mb-3 opacity-80">Skills</h3>
                            <div className="space-y-1.5">
                                {skills.map((skill, index) => (
                                    <div
                                        key={index}
                                        className="text-xs opacity-90 outline-none hover:bg-white/10 px-2 -mx-2 rounded transition-colors cursor-text"
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
                                        • {skill}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Education */}
                    {education.length > 0 && (
                        <div>
                            <h3 className="text-xs font-bold uppercase tracking-wider mb-3 opacity-80">Education</h3>
                            <div className="space-y-3">
                                {education.map((edu) => (
                                    <div key={edu.id} className="text-xs">
                                        <div className="font-bold opacity-90">
                                            <span
                                                className="outline-none hover:bg-white/10 px-1 -mx-1 rounded transition-colors cursor-text"
                                                contentEditable
                                                suppressContentEditableWarning
                                                onBlur={(e) => onUpdateEducation(edu.id, 'degree', e.currentTarget.textContent || '')}
                                            >
                                                {edu.degree}
                                            </span>
                                        </div>
                                        <div className="opacity-80 mt-1">
                                            <span
                                                className="outline-none hover:bg-white/10 px-1 -mx-1 rounded transition-colors cursor-text"
                                                contentEditable
                                                suppressContentEditableWarning
                                                onBlur={(e) => onUpdateEducation(edu.id, 'institution', e.currentTarget.textContent || '')}
                                            >
                                                {edu.institution}
                                            </span>
                                        </div>
                                        <div className="opacity-70 text-[10px] mt-0.5">
                                            {edu.startDate} - {edu.endDate}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Content Area */}
                <div className="flex-1 pl-6">
                    {/* Summary */}
                    {summary && (
                        <div className="mb-6" style={{ pageBreakInside: 'avoid' }}>
                            <h3 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: accentColor }}>
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
                        <div>
                            <h3 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: accentColor }}>
                                Experience
                            </h3>
                            <div className="space-y-5">
                                {experience.map((exp) => (
                                    <div key={exp.id} style={{ pageBreakInside: 'avoid' }}>
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
                                            </h4>
                                            <span className="text-[10px] text-slate-500 whitespace-nowrap ml-4">
                                                {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                                            </span>
                                        </div>
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
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
