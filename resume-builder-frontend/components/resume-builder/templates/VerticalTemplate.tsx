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

export function VerticalTemplate({
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
            {/* Vertical Accent Bar Header */}
            <div className="flex gap-0 mb-6">
                <div className="w-2 flex-shrink-0" style={{ backgroundColor: accentColor }}></div>
                <div className="flex-1 pl-6">
                    <h1
                        className="text-4xl font-bold text-slate-900 mb-1 outline-none hover:bg-slate-50 px-2 -mx-2 rounded transition-colors cursor-text"
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
                        className="text-base font-semibold mb-3 outline-none hover:bg-slate-50 px-2 -mx-2 rounded transition-colors cursor-text"
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
                    <div className="flex gap-4 text-xs text-slate-600">
                        {personal.email && (
                            <span
                                className="outline-none hover:bg-slate-50 px-1 -mx-1 rounded transition-colors cursor-text"
                                contentEditable
                                suppressContentEditableWarning
                                onBlur={(e) => onUpdatePersonal('email', e.currentTarget.textContent || '')}
                            >
                                📧 {personal.email}
                            </span>
                        )}
                        {personal.phone && (
                            <span
                                className="outline-none hover:bg-slate-50 px-1 -mx-1 rounded transition-colors cursor-text"
                                contentEditable
                                suppressContentEditableWarning
                                onBlur={(e) => onUpdatePersonal('phone', e.currentTarget.textContent || '')}
                            >
                                📱 {personal.phone}
                            </span>
                        )}
                        {personal.location && (
                            <span
                                className="outline-none hover:bg-slate-50 px-1 -mx-1 rounded transition-colors cursor-text"
                                contentEditable
                                suppressContentEditableWarning
                                onBlur={(e) => onUpdatePersonal('location', e.currentTarget.textContent || '')}
                            >
                                📍 {personal.location}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Summary with Vertical Bar */}
            {summary && (
                <div className="flex gap-0 mb-6" style={{ pageBreakInside: 'avoid' }}>
                    <div className="w-2 flex-shrink-0" style={{ backgroundColor: accentColor }}></div>
                    <div className="flex-1 pl-6">
                        <h3 className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: accentColor }}>
                            About Me
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
                </div>
            )}

            {/* Experience with Vertical Bar */}
            {experience.length > 0 && (
                <div className="flex gap-0 mb-6">
                    <div className="w-2 flex-shrink-0" style={{ backgroundColor: accentColor }}></div>
                    <div className="flex-1 pl-6">
                        <h3 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: accentColor }}>
                            Experience
                        </h3>
                        <div className="space-y-5">
                            {experience.map((exp) => (
                                <div key={exp.id} style={{ pageBreakInside: 'avoid' }}>
                                    <div className="flex justify-between items-start mb-1">
                                        <div>
                                            <h4 className="font-bold text-slate-900 text-base">
                                                <span
                                                    className="outline-none hover:bg-slate-50 px-1 -mx-1 rounded transition-colors cursor-text"
                                                    contentEditable
                                                    suppressContentEditableWarning
                                                    onBlur={(e) => onUpdateExperience(exp.id, 'position', e.currentTarget.textContent || '')}
                                                >
                                                    {exp.position}
                                                </span>
                                            </h4>
                                            <div className="text-sm font-semibold" style={{ color: accentColor }}>
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
                                        <span className="text-xs font-medium text-slate-500 whitespace-nowrap ml-4">
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
                </div>
            )}

            {/* Education with Vertical Bar */}
            {education.length > 0 && (
                <div className="flex gap-0 mb-6" style={{ pageBreakInside: 'avoid' }}>
                    <div className="w-2 flex-shrink-0" style={{ backgroundColor: accentColor }}></div>
                    <div className="flex-1 pl-6">
                        <h3 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: accentColor }}>
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
                </div>
            )}

            {/* Skills with Vertical Bar */}
            {skills.length > 0 && (
                <div className="flex gap-0" style={{ pageBreakInside: 'avoid' }}>
                    <div className="w-2 flex-shrink-0" style={{ backgroundColor: accentColor }}></div>
                    <div className="flex-1 pl-6">
                        <h3 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: accentColor }}>
                            Skills
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {skills.map((skill, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1.5 text-xs font-medium rounded-full outline-none hover:shadow-md transition-all cursor-text"
                                    style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
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
                </div>
            )}
        </>
    );
}
