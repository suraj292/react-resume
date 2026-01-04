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

export function InfographicTemplate({
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
            {/* Visual Header with Icons */}
            <div className="mb-6">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold text-white" style={{ backgroundColor: accentColor }}>
                        {personal.name ? personal.name.charAt(0).toUpperCase() : 'Y'}
                    </div>
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
                            className="text-base font-semibold outline-none hover:bg-slate-50 px-2 -mx-2 rounded transition-colors cursor-text"
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
                    </div>
                </div>

                {/* Contact Cards */}
                <div className="grid grid-cols-3 gap-3">
                    {personal.email && (
                        <div className="p-3 rounded-lg border-2" style={{ borderColor: accentColor }}>
                            <i className="fa-solid fa-envelope text-lg mb-1" style={{ color: accentColor }} />
                            <div
                                className="text-[10px] text-slate-700 outline-none hover:bg-slate-50 px-1 -mx-1 rounded transition-colors cursor-text break-all"
                                contentEditable
                                suppressContentEditableWarning
                                onBlur={(e) => onUpdatePersonal('email', e.currentTarget.textContent || '')}
                            >
                                {personal.email}
                            </div>
                        </div>
                    )}
                    {personal.phone && (
                        <div className="p-3 rounded-lg border-2" style={{ borderColor: accentColor }}>
                            <i className="fa-solid fa-phone text-lg mb-1" style={{ color: accentColor }} />
                            <div
                                className="text-[10px] text-slate-700 outline-none hover:bg-slate-50 px-1 -mx-1 rounded transition-colors cursor-text"
                                contentEditable
                                suppressContentEditableWarning
                                onBlur={(e) => onUpdatePersonal('phone', e.currentTarget.textContent || '')}
                            >
                                {personal.phone}
                            </div>
                        </div>
                    )}
                    {personal.location && (
                        <div className="p-3 rounded-lg border-2" style={{ borderColor: accentColor }}>
                            <i className="fa-solid fa-location-dot text-lg mb-1" style={{ color: accentColor }} />
                            <div
                                className="text-[10px] text-slate-700 outline-none hover:bg-slate-50 px-1 -mx-1 rounded transition-colors cursor-text"
                                contentEditable
                                suppressContentEditableWarning
                                onBlur={(e) => onUpdatePersonal('location', e.currentTarget.textContent || '')}
                            >
                                {personal.location}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Summary */}
            {summary && (
                <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: `${accentColor}15`, pageBreakInside: 'avoid' }}>
                    <div className="flex items-center gap-2 mb-2">
                        <i className="fa-solid fa-user text-sm" style={{ color: accentColor }} />
                        <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: accentColor }}>
                            About
                        </h3>
                    </div>
                    <p
                        className="text-xs text-slate-700 leading-relaxed outline-none hover:bg-white/50 px-2 -mx-2 rounded transition-colors cursor-text"
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => onUpdateSummary(e.currentTarget.textContent || '')}
                    >
                        {summary}
                    </p>
                </div>
            )}

            {/* Skills with Progress Bars */}
            {skills.length > 0 && (
                <div className="mb-6" style={{ pageBreakInside: 'avoid' }}>
                    <div className="flex items-center gap-2 mb-3">
                        <i className="fa-solid fa-star text-sm" style={{ color: accentColor }} />
                        <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: accentColor }}>
                            Skills
                        </h3>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        {skills.map((skill, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }}></div>
                                <span
                                    className="text-xs text-slate-700 outline-none hover:bg-slate-50 px-1 -mx-1 rounded transition-colors cursor-text"
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
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Experience */}
            {experience.length > 0 && (
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-4">
                        <i className="fa-solid fa-briefcase text-sm" style={{ color: accentColor }} />
                        <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: accentColor }}>
                            Experience
                        </h3>
                    </div>
                    <div className="space-y-4">
                        {experience.map((exp, index) => (
                            <div key={exp.id} className="relative pl-6" style={{ pageBreakInside: 'avoid' }}>
                                {/* Timeline Dot */}
                                <div className="absolute left-0 top-1 w-3 h-3 rounded-full border-2 border-white shadow" style={{ backgroundColor: accentColor }}></div>
                                {index < experience.length - 1 && (
                                    <div className="absolute left-1.5 top-4 bottom-0 w-px bg-slate-200"></div>
                                )}

                                <div className="flex justify-between items-start mb-1">
                                    <h4 className="font-bold text-slate-900 text-sm">
                                        <span
                                            className="outline-none hover:bg-slate-50 px-1 -mx-1 rounded transition-colors cursor-text"
                                            contentEditable
                                            suppressContentEditableWarning
                                            onBlur={(e) => onUpdateExperience(exp.id, 'position', e.currentTarget.textContent || '')}
                                        >
                                            {exp.position}
                                        </span>
                                    </h4>
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded" style={{ backgroundColor: `${accentColor}20`, color: accentColor }}>
                                        {exp.startDate} - {exp.current ? 'Now' : exp.endDate}
                                    </span>
                                </div>
                                <div className="text-sm font-medium mb-1" style={{ color: accentColor }}>
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

            {/* Education */}
            {education.length > 0 && (
                <div style={{ pageBreakInside: 'avoid' }}>
                    <div className="flex items-center gap-2 mb-3">
                        <i className="fa-solid fa-graduation-cap text-sm" style={{ color: accentColor }} />
                        <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: accentColor }}>
                            Education
                        </h3>
                    </div>
                    <div className="space-y-3">
                        {education.map((edu) => (
                            <div key={edu.id} className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ backgroundColor: accentColor }}>
                                    <i className="fa-solid fa-book" />
                                </div>
                                <div className="flex-1">
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
                                        {edu.startDate} - {edu.endDate}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}
