import { PersonalInfo, Experience, Education } from '@/lib/stores/resume-store';

interface TemplateProps {
    personal: PersonalInfo;
    summary?: string;
    experience: Experience[];
    education: Education[];
    skills: string[];
    accentColor: string;
}

export function AcademicTemplate({ personal, summary, experience, education, skills, accentColor }: TemplateProps) {
    return (
        <>
            {/* Header - Centered */}
            <div className="text-center border-b-2 pb-6 mb-6" style={{ borderColor: accentColor }}>
                <h1 className="text-3xl font-bold text-slate-900 mb-1">
                    {personal.name || 'Your Name'}
                </h1>
                <p className="text-sm text-slate-600 mb-3">
                    {personal.title || 'Professional Title'}
                </p>
                <div className="flex justify-center gap-4 text-[10px] text-slate-500">
                    {personal.email && <span>{personal.email}</span>}
                    {personal.phone && <span>•</span>}
                    {personal.phone && <span>{personal.phone}</span>}
                    {personal.location && <span>•</span>}
                    {personal.location && <span>{personal.location}</span>}
                </div>
            </div>

            {/* Summary */}
            {summary && (
                <div className="mb-6">
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide mb-2 pb-1 border-b" style={{ borderColor: accentColor }}>
                        Summary
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{summary}</p>
                </div>
            )}

            {/* Experience */}
            {experience.length > 0 && (
                <div className="mb-6">
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide mb-3 pb-1 border-b" style={{ borderColor: accentColor }}>
                        Professional Experience
                    </h3>
                    <div className="space-y-4">
                        {experience.map((exp) => (
                            <div key={exp.id}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <h4 className="font-bold text-slate-800">
                                        {exp.position}
                                    </h4>
                                    <span className="text-[10px] text-slate-500 italic">
                                        {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                                    </span>
                                </div>
                                <p className="text-xs font-semibold text-slate-600 mb-1">
                                    {exp.company}
                                </p>
                                {exp.description && (
                                    <p className="text-xs text-slate-500 leading-relaxed">
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
                <div className="mb-6">
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide mb-3 pb-1 border-b" style={{ borderColor: accentColor }}>
                        Education
                    </h3>
                    <div className="space-y-3">
                        {education.map((edu) => (
                            <div key={edu.id}>
                                <div className="flex justify-between items-baseline">
                                    <h4 className="font-bold text-slate-800">
                                        {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                                    </h4>
                                    <span className="text-[10px] text-slate-500 italic">
                                        {edu.startDate} — {edu.endDate}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-600">
                                    {edu.institution}
                                    {edu.gpa && ` • GPA: ${edu.gpa}`}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Skills */}
            {skills.length > 0 && (
                <div>
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide mb-3 pb-1 border-b" style={{ borderColor: accentColor }}>
                        Skills & Competencies
                    </h3>
                    <div className="flex flex-wrap gap-x-3 gap-y-1">
                        {skills.map((skill, index) => (
                            <span key={index} className="text-xs text-slate-700">
                                • {skill}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}
