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

export function BoxedTemplate({
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
            {/* Boxed Header */}
            <div className="mb-6 p-5 border-2 rounded-lg" style={{ borderColor: accentColor }}>
                <div className="text-center">
                    <h1
                        className="text-3xl font-bold text-slate-900 mb-2 outline-none hover:bg-slate-50 px-2 -mx-2 rounded transition-colors cursor-text"
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
                        className="text-sm font-semibold mb-3 outline-none hover:bg-slate-50 px-2 -mx-2 rounded transition-colors cursor-text"
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
            </div>

            {/* Summary Box */}
            {summary && (
                <div className="mb-6 p-4 border rounded-lg bg-slate-50" style={{ pageBreakInside: 'avoid' }}>
                    <h3 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: accentColor }}>
                        Summary
                    </h3>
                    <p
                        className="text-xs text-slate-700 leading-relaxed outline-none hover:bg-white px-2 -mx-2 rounded transition-colors cursor-text"
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => onUpdateSummary(e.currentTarget.textContent || '')}
                    >
                        {summary}
                    </p>
                </div>
            )}

            {/* Experience Boxes */}
            {experience.length > 0 && (
                <div className="mb-6">
                    <h3 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: accentColor }}>
                        Experience
                    </h3>
                    <div className="space-y-4">
                        {experience.map((exp) => (
                            <div key={exp.id} className="p-4 border rounded-lg" style={{ pageBreakInside: 'avoid', borderColor: accentColor }}>
                                <div className="flex justify-between items-start mb-2">
                                    <div>
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
                                        <div className="text-sm font-medium" style={{ color: accentColor }}>
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
                                    <span className="text-xs text-slate-500 whitespace-nowrap ml-4">
                                        {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
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

            {/* Education & Skills Grid */}
            <div className="grid grid-cols-2 gap-4">
                {/* Education Box */}
                {education.length > 0 && (
                    <div className="p-4 border rounded-lg bg-slate-50" style={{ pageBreakInside: 'avoid' }}>
                        <h3 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: accentColor }}>
                            Education
                        </h3>
                        <div className="space-y-3">
                            {education.map((edu) => (
                                <div key={edu.id} className="text-xs">
                                    <div className="font-bold text-slate-900">
                                        <span
                                            className="outline-none hover:bg-white px-1 -mx-1 rounded transition-colors cursor-text"
                                            contentEditable
                                            suppressContentEditableWarning
                                            onBlur={(e) => onUpdateEducation(edu.id, 'degree', e.currentTarget.textContent || '')}
                                        >
                                            {edu.degree}
                                        </span>
                                    </div>
                                    <div className="text-slate-600 mt-0.5">
                                        <span
                                            className="outline-none hover:bg-white px-1 -mx-1 rounded transition-colors cursor-text"
                                            contentEditable
                                            suppressContentEditableWarning
                                            onBlur={(e) => onUpdateEducation(edu.id, 'institution', e.currentTarget.textContent || '')}
                                        >
                                            {edu.institution}
                                        </span>
                                    </div>
                                    <div className="text-slate-500 text-[10px] mt-0.5">
                                        {edu.startDate} - {edu.endDate}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Skills Box */}
                {skills.length > 0 && (
                    <div className="p-4 border rounded-lg bg-slate-50" style={{ pageBreakInside: 'avoid' }}>
                        <h3 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: accentColor }}>
                            Skills
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {skills.map((skill, index) => (
                                <span
                                    key={index}
                                    className="px-2 py-1 text-xs font-medium rounded border outline-none hover:shadow-sm transition-all cursor-text"
                                    style={{ borderColor: accentColor, color: accentColor, backgroundColor: 'white' }}
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
            </div>
        </>
    );
}
