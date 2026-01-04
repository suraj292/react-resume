'use client';

import { useState } from 'react';
import { useResumeStore } from '@/lib/stores/resume-store';

export function TabManual() {
    const {
        currentResume,
        updatePersonal,
        updateSocial,
        updateField,
        addExperience,
        updateExperience,
        removeExperience,
        addEducation,
        updateEducation,
        removeEducation,
    } = useResumeStore();

    const [expandedSections, setExpandedSections] = useState({
        personal: true,
        social: false,
        summary: false,
        skills: false,
        education: false,
        experience: false,
    });

    if (!currentResume) return null;

    const { personal, summary, experience = [], education = [], skills = [] } = currentResume;

    const toggleSection = (section: keyof typeof expandedSections) => {
        setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const addSkill = () => {
        updateField('skills', [...skills, '']);
    };

    const updateSkill = (index: number, value: string) => {
        const updatedSkills = [...skills];
        updatedSkills[index] = value;
        updateField('skills', updatedSkills);
    };

    const removeSkill = (index: number) => {
        const updatedSkills = skills.filter((_, i) => i !== index);
        updateField('skills', updatedSkills);
    };

    return (
        <div className="space-y-6">
            {/* Personal Details Section */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                <button
                    onClick={() => toggleSection('personal')}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
                >
                    <div className="flex items-center gap-3">
                        <i className="fa-solid fa-user text-indigo-600" />
                        <h3 className="font-bold text-slate-800">Personal Details</h3>
                    </div>
                    <i className={`fa-solid fa-chevron-${expandedSections.personal ? 'up' : 'down'} text-slate-400`} />
                </button>

                {expandedSections.personal && personal && (
                    <div className="px-6 pb-6 space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-600 mb-2">Full Name</label>
                            <input
                                type="text"
                                value={personal.name || ''}
                                onChange={(e) => updatePersonal('name', e.target.value)}
                                className="w-full px-4 py-2 text-slate-500 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none placeholder:text-slate-300"
                                placeholder="John Doe"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-600 mb-2">Professional Title</label>
                            <input
                                type="text"
                                value={personal.title || ''}
                                onChange={(e) => updatePersonal('title', e.target.value)}
                                className="w-full px-4 py-2 text-slate-500 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none placeholder:text-slate-300"
                                placeholder="Software Engineer"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-600 mb-2">Email</label>
                            <input
                                type="email"
                                value={personal.email || ''}
                                onChange={(e) => updatePersonal('email', e.target.value)}
                                className="w-full px-4 py-2 text-slate-500 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none placeholder:text-slate-300"
                                placeholder="john@example.com"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-600 mb-2">Phone</label>
                            <input
                                type="tel"
                                value={personal.phone || ''}
                                onChange={(e) => updatePersonal('phone', e.target.value)}
                                className="w-full px-4 py-2 text-slate-500 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none placeholder:text-slate-300"
                                placeholder="+1 (555) 000-0000"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-600 mb-2">Location</label>
                            <input
                                type="text"
                                value={personal.location || ''}
                                onChange={(e) => updatePersonal('location', e.target.value)}
                                className="w-full px-4 py-2 text-slate-500 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none placeholder:text-slate-300"
                                placeholder="New York, NY"
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Social Media Section */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                <button
                    onClick={() => toggleSection('social')}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
                >
                    <div className="flex items-center gap-3">
                        <i className="fa-solid fa-share-nodes text-indigo-600" />
                        <h3 className="font-bold text-slate-800">Social Media</h3>
                    </div>
                    <i className={`fa-solid fa-chevron-${expandedSections.social ? 'up' : 'down'} text-slate-400`} />
                </button>

                {expandedSections.social && (
                    <div className="px-6 pb-6 space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-600 mb-2 flex items-center gap-2">
                                <i className="fa-brands fa-github" />
                                GitHub
                            </label>
                            <input
                                type="url"
                                value={currentResume.social?.github || ''}
                                onChange={(e) => updateSocial('github', e.target.value)}
                                className="w-full px-4 py-2 text-slate-500 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none placeholder:text-slate-300"
                                placeholder="https://github.com/username"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-600 mb-2 flex items-center gap-2">
                                <i className="fa-brands fa-linkedin" />
                                LinkedIn
                            </label>
                            <input
                                type="url"
                                value={currentResume.social?.linkedin || ''}
                                onChange={(e) => updateSocial('linkedin', e.target.value)}
                                className="w-full px-4 py-2 text-slate-500 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none placeholder:text-slate-300"
                                placeholder="https://linkedin.com/in/username"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-600 mb-2 flex items-center gap-2">
                                <i className="fa-brands fa-twitter" />
                                Twitter
                            </label>
                            <input
                                type="url"
                                value={currentResume.social?.twitter || ''}
                                onChange={(e) => updateSocial('twitter', e.target.value)}
                                className="w-full px-4 py-2 text-slate-500 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none placeholder:text-slate-300"
                                placeholder="https://twitter.com/username"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-600 mb-2 flex items-center gap-2">
                                <i className="fa-brands fa-instagram" />
                                Instagram
                            </label>
                            <input
                                type="url"
                                value={currentResume.social?.instagram || ''}
                                onChange={(e) => updateSocial('instagram', e.target.value)}
                                className="w-full px-4 py-2 text-slate-500 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none placeholder:text-slate-300"
                                placeholder="https://instagram.com/username"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-600 mb-2 flex items-center gap-2">
                                <i className="fa-brands fa-pinterest" />
                                Pinterest
                            </label>
                            <input
                                type="url"
                                value={currentResume.social?.pinterest || ''}
                                onChange={(e) => updateSocial('pinterest', e.target.value)}
                                className="w-full px-4 py-2 text-slate-500 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none placeholder:text-slate-300"
                                placeholder="https://pinterest.com/username"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-600 mb-2 flex items-center gap-2">
                                <i className="fa-solid fa-globe" />
                                Website / Portfolio
                            </label>
                            <input
                                type="url"
                                value={currentResume.social?.website || ''}
                                onChange={(e) => updateSocial('website', e.target.value)}
                                className="w-full px-4 py-2 text-slate-500 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none placeholder:text-slate-300"
                                placeholder="https://yourwebsite.com"
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Summary Section */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                <button
                    onClick={() => toggleSection('summary')}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
                >
                    <div className="flex items-center gap-3">
                        <i className="fa-solid fa-align-left text-indigo-600" />
                        <h3 className="font-bold text-slate-800">Professional Summary</h3>
                    </div>
                    <i className={`fa-solid fa-chevron-${expandedSections.summary ? 'up' : 'down'} text-slate-400`} />
                </button>

                {expandedSections.summary && (
                    <div className="px-6 pb-6">
                        <textarea
                            value={summary || ''}
                            onChange={(e) => updateField('summary', e.target.value)}
                            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                            rows={5}
                            placeholder="Write a brief professional summary highlighting your key skills and experience..."
                        />
                    </div>
                )}
            </div>

            {/* Skills Section */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                <button
                    onClick={() => toggleSection('skills')}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
                >
                    <div className="flex items-center gap-3">
                        <i className="fa-solid fa-lightbulb text-indigo-600" />
                        <h3 className="font-bold text-slate-800">Skills</h3>
                        <span className="text-xs text-slate-400">({skills.length})</span>
                    </div>
                    <i className={`fa-solid fa-chevron-${expandedSections.skills ? 'up' : 'down'} text-slate-400`} />
                </button>

                {expandedSections.skills && (
                    <div className="px-6 pb-6 space-y-3">
                        {skills.map((skill, index) => (
                            <div key={index} className="flex gap-2">
                                <input
                                    type="text"
                                    value={skill}
                                    onChange={(e) => updateSkill(index, e.target.value)}
                                    className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                    placeholder="e.g. JavaScript, React, Node.js"
                                />
                                <button
                                    onClick={() => removeSkill(index)}
                                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <i className="fa-solid fa-trash" />
                                </button>
                            </div>
                        ))}
                        <button
                            onClick={addSkill}
                            className="w-full px-4 py-2 border-2 border-dashed border-slate-300 rounded-lg text-slate-600 hover:border-indigo-400 hover:text-indigo-600 transition-colors font-semibold text-sm"
                        >
                            <i className="fa-solid fa-plus mr-2" />
                            Add Skill
                        </button>
                    </div>
                )}
            </div>

            {/* Education Section */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                <button
                    onClick={() => toggleSection('education')}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
                >
                    <div className="flex items-center gap-3">
                        <i className="fa-solid fa-graduation-cap text-indigo-600" />
                        <h3 className="font-bold text-slate-800">Education</h3>
                        <span className="text-xs text-slate-400">({education.length})</span>
                    </div>
                    <i className={`fa-solid fa-chevron-${expandedSections.education ? 'up' : 'down'} text-slate-400`} />
                </button>

                {expandedSections.education && (
                    <div className="px-6 pb-6 space-y-4">
                        {education.map((edu) => (
                            <div key={edu.id} className="p-4 border border-slate-200 rounded-lg space-y-3">
                                <div className="flex justify-between items-start">
                                    <h4 className="font-semibold text-slate-800">Education Entry</h4>
                                    <button
                                        onClick={() => removeEducation(edu.id)}
                                        className="text-red-600 hover:bg-red-50 px-2 py-1 rounded transition-colors"
                                    >
                                        <i className="fa-solid fa-trash text-sm" />
                                    </button>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-600 mb-1">Degree</label>
                                        <input
                                            type="text"
                                            value={edu.degree || ''}
                                            onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                                            placeholder="Bachelor's"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-600 mb-1">Field</label>
                                        <input
                                            type="text"
                                            value={edu.field || ''}
                                            onChange={(e) => updateEducation(edu.id, { field: e.target.value })}
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                                            placeholder="Computer Science"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-600 mb-1">Institution</label>
                                    <input
                                        type="text"
                                        value={edu.institution || ''}
                                        onChange={(e) => updateEducation(edu.id, { institution: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                                        placeholder="University Name"
                                    />
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-600 mb-1">Start Date</label>
                                        <input
                                            type="text"
                                            value={edu.startDate || ''}
                                            onChange={(e) => updateEducation(edu.id, { startDate: e.target.value })}
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                                            placeholder="2019"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-600 mb-1">End Date</label>
                                        <input
                                            type="text"
                                            value={edu.endDate || ''}
                                            onChange={(e) => updateEducation(edu.id, { endDate: e.target.value })}
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                                            placeholder="2023"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-600 mb-1">GPA (Optional)</label>
                                        <input
                                            type="text"
                                            value={edu.gpa || ''}
                                            onChange={(e) => updateEducation(edu.id, { gpa: e.target.value })}
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                                            placeholder="3.8"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                        <button
                            onClick={addEducation}
                            className="w-full px-4 py-3 border-2 border-dashed border-slate-300 rounded-lg text-slate-600 hover:border-indigo-400 hover:text-indigo-600 transition-colors font-semibold text-sm"
                        >
                            <i className="fa-solid fa-plus mr-2" />
                            Add Education
                        </button>
                    </div>
                )}
            </div>

            {/* Experience Section */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                <button
                    onClick={() => toggleSection('experience')}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
                >
                    <div className="flex items-center gap-3">
                        <i className="fa-solid fa-briefcase text-indigo-600" />
                        <h3 className="font-bold text-slate-800">Work Experience</h3>
                        <span className="text-xs text-slate-400">({experience.length})</span>
                    </div>
                    <i className={`fa-solid fa-chevron-${expandedSections.experience ? 'up' : 'down'} text-slate-400`} />
                </button>

                {expandedSections.experience && (
                    <div className="px-6 pb-6 space-y-4">
                        {experience.map((exp) => (
                            <div key={exp.id} className="p-4 border border-slate-200 rounded-lg space-y-3">
                                <div className="flex justify-between items-start">
                                    <h4 className="font-semibold text-slate-800">Experience Entry</h4>
                                    <button
                                        onClick={() => removeExperience(exp.id)}
                                        className="text-red-600 hover:bg-red-50 px-2 py-1 rounded transition-colors"
                                    >
                                        <i className="fa-solid fa-trash text-sm" />
                                    </button>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-600 mb-1">Position</label>
                                        <input
                                            type="text"
                                            value={exp.position || ''}
                                            onChange={(e) => updateExperience(exp.id, { position: e.target.value })}
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                                            placeholder="Software Engineer"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-600 mb-1">Company</label>
                                        <input
                                            type="text"
                                            value={exp.company || ''}
                                            onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                                            placeholder="Company Name"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-600 mb-1">Start Date</label>
                                        <input
                                            type="text"
                                            value={exp.startDate || ''}
                                            onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })}
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                                            placeholder="2023-01"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-600 mb-1">End Date</label>
                                        <input
                                            type="text"
                                            value={exp.endDate || ''}
                                            onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })}
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                                            placeholder="2024-01"
                                            disabled={exp.current}
                                        />
                                    </div>
                                    <div className="flex items-end">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={exp.current}
                                                onChange={(e) => updateExperience(exp.id, { current: e.target.checked, endDate: e.target.checked ? null : exp.endDate })}
                                                className="w-4 h-4 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                                            />
                                            <span className="text-xs font-bold text-slate-600">Current</span>
                                        </label>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-600 mb-1">Description</label>
                                    <textarea
                                        value={exp.description || ''}
                                        onChange={(e) => updateExperience(exp.id, { description: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm resize-none"
                                        rows={3}
                                        placeholder="Describe your responsibilities and achievements..."
                                    />
                                </div>
                            </div>
                        ))}
                        <button
                            onClick={addExperience}
                            className="w-full px-4 py-3 border-2 border-dashed border-slate-300 rounded-lg text-slate-600 hover:border-indigo-400 hover:text-indigo-600 transition-colors font-semibold text-sm"
                        >
                            <i className="fa-solid fa-plus mr-2" />
                            Add Experience
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
