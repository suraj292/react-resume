import { PersonalInfo, Experience, Education } from '@/lib/stores/resume-store';

interface TemplateProps {
    personal: PersonalInfo;
    summary?: string;
    experience: Experience[];
    education: Education[];
    skills: string[];
    accentColor: string;
}

export function CreativeTemplate({ personal, summary, experience, education, skills, accentColor }: TemplateProps) {
    return (
        <div className="flex gap-0">
            {/* Sidebar */}
            <div className="w-1/3 p-6 text-white" style={{ backgroundColor: accentColor }}>
                {/* Profile */}
                <div className="mb-6">
                    <div className="w-20 h-20 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-bold">
                        {personal.name?.charAt(0) || 'U'}
                    </div>
                    <h1 className="text-xl font-black text-center mb-2">
                        {personal.name || 'Your Name'}
                    </h1>
                    <p className="text-xs text-center opacity-90 font-semibold">
                        {personal.title || 'Professional Title'}
                    </p>
                </div>

                {/* Contact */}
                <div className="mb-6">
                    <h3 className="text-xs font-black uppercase tracking-wider mb-3 opacity-80">
                        Contact
                    </h3>
                    <div className="space-y-2 text-xs">
                        {personal.email && (
                            <div className="flex items-start gap-2">
                                <i className="fa-solid fa-envelope mt-0.5 opacity-80" />
                                <span className="break-all">{personal.email}</span>
                            </div>
                        )}
                        {personal.phone && (
                            <div className="flex items-start gap-2">
                                <i className="fa-solid fa-phone mt-0.5 opacity-80" />
                                <span>{personal.phone}</span>
                            </div>
                        )}
                        {personal.location && (
                            <div className="flex items-start gap-2">
                                <i className="fa-solid fa-location-dot mt-0.5 opacity-80" />
                                <span>{personal.location}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Skills */}
                {skills.length > 0 && (
                    <div>
                        <h3 className="text-xs font-black uppercase tracking-wider mb-3 opacity-80">
                            Skills
                        </h3>
                        <div className="flex flex-wrap gap-1.5">
                            {skills.map((skill, index) => (
                                <span
                                    key={index}
                                    className="px-2 py-1 text-[10px] font-bold rounded bg-white/20"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Main Content */}
            <div className="flex-1 p-8 space-y-6">
                {/* Summary */}
                {summary && (
                    <div>
                        <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-2">
                            About Me
                        </h3>
                        <p className="text-xs text-slate-600 leading-relaxed">{summary}</p>
                    </div>
                )}

                {/* Experience */}
                {experience.length > 0 && (
                    <div>
                        <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-3">
                            Experience
                        </h3>
                        <div className="space-y-4">
                            {experience.map((exp) => (
                                <div key={exp.id}>
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className="font-bold text-slate-800 text-sm">
                                            {exp.position}
                                        </h4>
                                        <span className="text-[9px] font-bold text-slate-400 italic whitespace-nowrap ml-2">
                                            {exp.startDate} — {exp.current ? 'PRESENT' : exp.endDate}
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
                    <div>
                        <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-3">
                            Education
                        </h3>
                        <div className="space-y-3">
                            {education.map((edu) => (
                                <div key={edu.id}>
                                    <h4 className="font-bold text-slate-800 text-sm">
                                        {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                                    </h4>
                                    <p className="text-xs text-slate-500">
                                        {edu.institution} • {edu.startDate} — {edu.endDate}
                                        {edu.gpa && ` • GPA: ${edu.gpa}`}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
