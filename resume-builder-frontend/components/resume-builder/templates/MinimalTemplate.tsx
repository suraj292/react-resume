import { PersonalInfo, Experience, Education } from '@/lib/stores/resume-store';

interface TemplateProps {
    personal: PersonalInfo;
    summary?: string;
    experience: Experience[];
    education: Education[];
    skills: string[];
    accentColor: string;
}

export function MinimalTemplate({ personal, summary, experience, education, skills, accentColor }: TemplateProps) {
    return (
        <>
            {/* Header - Bold and Minimal */}
            <div className="mb-8">
                <h1 className="text-5xl font-black text-slate-900 mb-2">
                    {personal.name || 'YOUR NAME'}
                </h1>
                <div className="h-1 w-20 mb-3" style={{ backgroundColor: accentColor }}></div>
                <p className="text-sm font-bold text-slate-600 mb-3">
                    {personal.title || 'Professional Title'}
                </p>
                <div className="flex gap-4 text-[10px] text-slate-500">
                    {personal.email && <span>{personal.email}</span>}
                    {personal.phone && <span>{personal.phone}</span>}
                    {personal.location && <span>{personal.location}</span>}
                </div>
            </div>

            {/* Summary */}
            {summary && (
                <div className="mb-6">
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-2">
                        Profile
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{summary}</p>
                </div>
            )}

            {/* Experience */}
            {experience.length > 0 && (
                <div className="mb-6">
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-3">
                        Experience
                    </h3>
                    <div className="space-y-4">
                        {experience.map((exp) => (
                            <div key={exp.id}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <h4 className="font-bold text-slate-800">
                                        {exp.position}
                                    </h4>
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">
                                        {exp.startDate} — {exp.current ? 'NOW' : exp.endDate}
                                    </span>
                                </div>
                                <p className="text-xs font-semibold mb-1" style={{ color: accentColor }}>
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
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-3">
                        Education
                    </h3>
                    <div className="space-y-3">
                        {education.map((edu) => (
                            <div key={edu.id}>
                                <div className="flex justify-between items-baseline">
                                    <h4 className="font-bold text-slate-800">
                                        {edu.degree}{edu.field ? ` - ${edu.field}` : ''}
                                    </h4>
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">
                                        {edu.startDate} — {edu.endDate}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-600">
                                    {edu.institution}
                                    {edu.gpa && ` • ${edu.gpa}`}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Skills */}
            {skills.length > 0 && (
                <div>
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-3">
                        Skills
                    </h3>
                    <div className="grid grid-cols-3 gap-2">
                        {skills.map((skill, index) => (
                            <div
                                key={index}
                                className="text-xs font-bold text-slate-700 py-1 px-2 border-l-2"
                                style={{ borderColor: accentColor }}
                            >
                                {skill}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}
