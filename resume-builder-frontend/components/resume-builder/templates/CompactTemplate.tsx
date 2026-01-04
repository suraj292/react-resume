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

export function CompactTemplate({
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
            {/* Ultra-Compact Header */}
            <div className="mb-4 pb-3 border-b" style={{ borderColor: accentColor }}>
                <div className="flex justify-between items-center">
                    <div>
                        <h1
                            className="text-2xl font-bold text-slate-900 outline-none hover:bg-slate-50 px-2 -mx-2 rounded transition-colors cursor-text"
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
                            className="text-xs font-semibold outline-none hover:bg-slate-50 px-2 -mx-2 rounded transition-colors cursor-text"
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
                    <div className="text-right text-[10px] text-slate-600 space-y-0.5">
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
            </div>

            {/* Summary */}
            {summary && (
                <div className="mb-4" style={{ pageBreakInside: 'avoid' }}>
                    <p
                        className="text-[11px] text-slate-700 leading-relaxed outline-none hover:bg-slate-50 px-2 -mx-2 rounded transition-colors cursor-text"
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => onUpdateSummary(e.currentTarget.textContent || '')}
                    >
                        {summary}
                    </p>
                </div>
            )}

            {/* Two Column Layout */}
            <div className="grid grid-cols-3 gap-4">
                {/* Left Column - Skills & Education */}
                <div className="space-y-4">
                    {/* Skills */}
                    {skills.length > 0 && (
                        <div style={{ pageBreakInside: 'avoid' }}>
                            <h3 className="text-[10px] font-bold uppercase tracking-wider mb-2 pb-1 border-b" style={{ color: accentColor, borderColor: accentColor }}>
                                Skills
                            </h3>
                            <div className="space-y-0.5">
                                {skills.map((skill, index) => (
                                    <div
                                        key={index}
                                        className="text-[10px] text-slate-700 outline-none hover:bg-slate-50 px-1 -mx-1 rounded transition-colors cursor-text"
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
                        <div style={{ pageBreakInside: 'avoid' }}>
                            <h3 className="text-[10px] font-bold uppercase tracking-wider mb-2 pb-1 border-b" style={{ color: accentColor, borderColor: accentColor }}>
                                Education
                            </h3>
                            <div className="space-y-2">
                                {education.map((edu) => (
                                    <div key={edu.id} className="text-[10px]">
                                        <div className="font-bold text-slate-800">
                                            <span
                                                className="outline-none hover:bg-slate-50 px-1 -mx-1 rounded transition-colors cursor-text"
                                                contentEditable
                                                suppressContentEditableWarning
                                                onBlur={(e) => onUpdateEducation(edu.id, 'degree', e.currentTarget.textContent || '')}
                                            >
                                                {edu.degree}
                                            </span>
                                        </div>
                                        <div className="text-slate-600">
                                            <span
                                                className="outline-none hover:bg-slate-50 px-1 -mx-1 rounded transition-colors cursor-text"
                                                contentEditable
                                                suppressContentEditableWarning
                                                onBlur={(e) => onUpdateEducation(edu.id, 'institution', e.currentTarget.textContent || '')}
                                            >
                                                {edu.institution}
                                            </span>
                                        </div>
                                        <div className="text-slate-500 text-[9px]">
                                            {edu.startDate} - {edu.endDate}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column - Experience */}
                <div className="col-span-2">
                    {experience.length > 0 && (
                        <div>
                            <h3 className="text-[10px] font-bold uppercase tracking-wider mb-3 pb-1 border-b" style={{ color: accentColor, borderColor: accentColor }}>
                                Experience
                            </h3>
                            <div className="space-y-3">
                                {experience.map((exp) => (
                                    <div key={exp.id} style={{ pageBreakInside: 'avoid' }}>
                                        <div className="flex justify-between items-start mb-0.5">
                                            <h4 className="font-bold text-slate-900 text-[11px]">
                                                <span
                                                    className="outline-none hover:bg-slate-50 px-1 -mx-1 rounded transition-colors cursor-text"
                                                    contentEditable
                                                    suppressContentEditableWarning
                                                    onBlur={(e) => onUpdateExperience(exp.id, 'position', e.currentTarget.textContent || '')}
                                                >
                                                    {exp.position}
                                                </span>
                                            </h4>
                                            <span className="text-[9px] text-slate-500 whitespace-nowrap ml-2">
                                                {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                                            </span>
                                        </div>
                                        <div className="text-[10px] font-medium mb-1" style={{ color: accentColor }}>
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
                                                className="text-[10px] text-slate-600 leading-relaxed outline-none hover:bg-slate-50 px-2 -mx-2 rounded transition-colors cursor-text"
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
