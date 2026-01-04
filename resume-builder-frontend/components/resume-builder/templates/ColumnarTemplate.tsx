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

export function ColumnarTemplate({
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
            {/* Compact Header */}
            <div className="mb-5 pb-3 border-b" style={{ borderColor: accentColor }}>
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
                <div className="flex justify-between items-center">
                    <p
                        className="text-sm font-medium outline-none hover:bg-slate-50 px-2 -mx-2 rounded transition-colors cursor-text"
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
                    <div className="flex gap-3 text-[10px] text-slate-600">
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
                    </div>
                </div>
            </div>

            {/* Three Column Layout */}
            <div className="grid grid-cols-3 gap-4">
                {/* Left Column */}
                <div className="space-y-4">
                    {/* Summary */}
                    {summary && (
                        <div style={{ pageBreakInside: 'avoid' }}>
                            <h3 className="text-[10px] font-bold uppercase tracking-wider mb-2 pb-1 border-b" style={{ color: accentColor, borderColor: accentColor }}>
                                Profile
                            </h3>
                            <p
                                className="text-[10px] text-slate-700 leading-relaxed outline-none hover:bg-slate-50 px-1 -mx-1 rounded transition-colors cursor-text"
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
                        <div style={{ pageBreakInside: 'avoid' }}>
                            <h3 className="text-[10px] font-bold uppercase tracking-wider mb-2 pb-1 border-b" style={{ color: accentColor, borderColor: accentColor }}>
                                Skills
                            </h3>
                            <div className="space-y-1">
                                {skills.slice(0, Math.ceil(skills.length / 2)).map((skill, index) => (
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
                </div>

                {/* Middle Column */}
                <div className="space-y-4">
                    {/* More Skills */}
                    {skills.length > Math.ceil(skills.length / 2) && (
                        <div style={{ pageBreakInside: 'avoid' }}>
                            <h3 className="text-[10px] font-bold uppercase tracking-wider mb-2 pb-1 border-b" style={{ color: accentColor, borderColor: accentColor }}>
                                More Skills
                            </h3>
                            <div className="space-y-1">
                                {skills.slice(Math.ceil(skills.length / 2)).map((skill, index) => (
                                    <div
                                        key={index + Math.ceil(skills.length / 2)}
                                        className="text-[10px] text-slate-700 outline-none hover:bg-slate-50 px-1 -mx-1 rounded transition-colors cursor-text"
                                        contentEditable
                                        suppressContentEditableWarning
                                        onBlur={(e) => onUpdateSkill(index + Math.ceil(skills.length / 2), e.currentTarget.textContent || '')}
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
                                        <div className="font-bold text-slate-900">
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
                <div>
                    {experience.length > 0 && (
                        <div>
                            <h3 className="text-[10px] font-bold uppercase tracking-wider mb-2 pb-1 border-b" style={{ color: accentColor, borderColor: accentColor }}>
                                Experience
                            </h3>
                            <div className="space-y-3">
                                {experience.map((exp) => (
                                    <div key={exp.id} style={{ pageBreakInside: 'avoid' }}>
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
                                        <div className="text-[9px] text-slate-500 mb-1">
                                            {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                                        </div>
                                        {exp.description && (
                                            <p
                                                className="text-[10px] text-slate-600 leading-relaxed outline-none hover:bg-slate-50 px-1 -mx-1 rounded transition-colors cursor-text"
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
