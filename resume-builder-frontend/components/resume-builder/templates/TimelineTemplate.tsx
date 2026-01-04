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

export function TimelineTemplate({
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
            {/* Centered Header */}
            <div className="text-center mb-8 pb-6 border-b">
                <h1
                    className="text-4xl font-bold text-slate-900 mb-2 outline-none hover:bg-slate-50 px-2 -mx-2 rounded transition-colors cursor-text"
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
                    className="text-base font-semibold mb-4 outline-none hover:bg-slate-50 px-2 -mx-2 rounded transition-colors cursor-text"
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
                <div className="flex justify-center gap-4 text-xs text-slate-600">
                    {personal.email && (
                        <span>
                            <i className="fa-solid fa-envelope mr-1" style={{ color: accentColor }} />
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
                            <i className="fa-solid fa-phone mr-1" style={{ color: accentColor }} />
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
                            <i className="fa-solid fa-location-dot mr-1" style={{ color: accentColor }} />
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

            {/* Summary */}
            {summary && (
                <div className="mb-6" style={{ pageBreakInside: 'avoid' }}>
                    <p
                        className="text-xs text-slate-700 leading-relaxed text-center italic outline-none hover:bg-slate-50 px-2 -mx-2 rounded transition-colors cursor-text"
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => onUpdateSummary(e.currentTarget.textContent || '')}
                    >
                        "{summary}"
                    </p>
                </div>
            )}

            {/* Experience Timeline */}
            {experience.length > 0 && (
                <div className="mb-6">
                    <h3 className="text-sm font-bold uppercase tracking-wider mb-5 text-center" style={{ color: accentColor }}>
                        Professional Journey
                    </h3>
                    <div className="relative">
                        {/* Timeline Line */}
                        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 -ml-px" style={{ backgroundColor: accentColor }}></div>

                        <div className="space-y-8">
                            {experience.map((exp, index) => (
                                <div key={exp.id} className={`relative ${index % 2 === 0 ? 'pr-1/2 text-right' : 'pl-1/2 text-left'}`} style={{ pageBreakInside: 'avoid' }}>
                                    {/* Timeline Dot */}
                                    <div
                                        className="absolute top-0 w-3 h-3 rounded-full border-2 border-white shadow"
                                        style={{
                                            backgroundColor: accentColor,
                                            [index % 2 === 0 ? 'right' : 'left']: 'calc(50% - 6px)'
                                        }}
                                    ></div>

                                    <div className={`${index % 2 === 0 ? 'pr-8' : 'pl-8'}`}>
                                        <div className="text-[10px] font-bold mb-1" style={{ color: accentColor }}>
                                            {exp.startDate} — {exp.current ? 'PRESENT' : exp.endDate}
                                        </div>
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
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Education & Skills Grid */}
            <div className="grid grid-cols-2 gap-6">
                {/* Education */}
                {education.length > 0 && (
                    <div style={{ pageBreakInside: 'avoid' }}>
                        <h3 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: accentColor }}>
                            Education
                        </h3>
                        <div className="space-y-3">
                            {education.map((edu) => (
                                <div key={edu.id}>
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
                        <h3 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: accentColor }}>
                            Skills
                        </h3>
                        <div className="space-y-1.5">
                            {skills.map((skill, index) => (
                                <div
                                    key={index}
                                    className="text-xs text-slate-700 outline-none hover:bg-slate-50 px-2 -mx-2 rounded transition-colors cursor-text"
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
            </div>
        </>
    );
}
