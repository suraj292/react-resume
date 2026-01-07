import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { resumeAPI } from '@/lib/api';

export interface PersonalInfo {
    name: string;
    title: string;
    email: string;
    phone: string;
    location: string;
}

export interface SocialMedia {
    github?: string;
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    pinterest?: string;
    website?: string;
}

export interface Experience {
    id: string;
    company: string;
    position: string;
    startDate: string;
    endDate: string | null;
    current: boolean;
    description: string;
}

export interface Education {
    id: string;
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
    gpa?: string;
}

export interface Resume {
    id: string;
    title: string;
    personal: PersonalInfo;
    social?: SocialMedia;
    summary?: string;
    experience: Experience[];
    education: Education[];
    skills: string[];
    templateId: string;
    colorId: string;
    data: any; // Full resume data
    etag: string | null;
    lastSavedAt: Date | null;
}

interface ResumeStore {
    // State
    currentResume: Resume | null;
    isDirty: boolean;
    isSaving: boolean;
    lastSaved: Date | null;
    etag: string | null;
    saveError: string | null;

    // Actions
    setResume: (resume: Resume) => void;
    updateField: (path: string, value: any) => void;
    updatePersonal: (field: keyof PersonalInfo, value: string) => void;
    updateSocial: (field: keyof SocialMedia, value: string) => void;
    addExperience: () => void;
    updateExperience: (id: string, experience: Partial<Experience>) => void;
    removeExperience: (id: string) => void;
    reorderExperience: (startIndex: number, endIndex: number) => void;
    addEducation: () => void;
    updateEducation: (id: string, education: Partial<Education>) => void;
    removeEducation: (id: string) => void;
    saveResume: () => Promise<void>;
    loadResume: (id: string) => Promise<void>;
    setTemplate: (templateId: string) => void;
    setColor: (colorId: string) => void;
    markDirty: () => void;
    markClean: () => void;
}

export const useResumeStore = create<ResumeStore>()(
    devtools(
        persist(
            (set, get) => ({
                // Initial State
                currentResume: null,
                isDirty: false,
                isSaving: false,
                lastSaved: null,
                etag: null,
                saveError: null,

                // Actions
                setResume: (resume) => {
                    // Map API response structure to expected store structure
                    // API returns: { id, data: { personal, experience, ... }, template_id, color_id }
                    // Store expects: { id, personal, experience, ..., templateId, colorId }
                    const apiResume = resume as any; // API uses snake_case
                    const mappedResume = {
                        ...resume,
                        personal: resume.data?.personal || resume.personal,
                        social: resume.data?.social || resume.social,
                        summary: resume.data?.summary || resume.summary,
                        experience: resume.data?.experience || resume.experience || [],
                        education: resume.data?.education || resume.education || [],
                        skills: resume.data?.skills || resume.skills || [],
                        templateId: apiResume.template_id || resume.templateId || 'modern',
                        colorId: apiResume.color_id || resume.colorId || 'indigo',
                    };

                    set({
                        currentResume: mappedResume,
                        etag: resume.etag,
                        lastSaved: resume.lastSavedAt
                    });
                },

                updateField: (path, value) => {
                    const resume = get().currentResume;
                    if (!resume) return;

                    const keys = path.split('.');
                    const updated = { ...resume };
                    let current: any = updated;

                    for (let i = 0; i < keys.length - 1; i++) {
                        current[keys[i]] = { ...current[keys[i]] };
                        current = current[keys[i]];
                    }

                    current[keys[keys.length - 1]] = value;

                    // Also update the data object to maintain consistency with backend structure
                    // This ensures that when we save, the data field has the latest values
                    if (!updated.data) {
                        updated.data = {};
                    }

                    // Sync top-level fields to data object
                    updated.data = {
                        ...updated.data,
                        personal: updated.personal,
                        summary: updated.summary,
                        experience: updated.experience,
                        education: updated.education,
                        skills: updated.skills,
                    };

                    set({ currentResume: updated, isDirty: true });
                },

                updatePersonal: (field, value) => {
                    const resume = get().currentResume;
                    if (!resume) return;

                    const updatedPersonal = {
                        ...resume.personal,
                        [field]: value,
                    };

                    set({
                        currentResume: {
                            ...resume,
                            personal: updatedPersonal,
                            data: {
                                ...resume.data,
                                personal: updatedPersonal,
                            },
                        },
                        isDirty: true,
                    });
                },

                updateSocial: (field, value) => {
                    const resume = get().currentResume;
                    if (!resume) return;

                    const updatedSocial = {
                        ...resume.social,
                        [field]: value,
                    };

                    set({
                        currentResume: {
                            ...resume,
                            social: updatedSocial,
                            data: {
                                ...resume.data,
                                social: updatedSocial,
                            },
                        },
                        isDirty: true,
                    });
                },

                addExperience: () => {
                    const resume = get().currentResume;
                    if (!resume) return;

                    const newExperience: Experience = {
                        id: `exp-${Date.now()}`,
                        company: '',
                        position: '',
                        startDate: '',
                        endDate: null,
                        current: false,
                        description: '',
                    };

                    const updatedExperience = [...resume.experience, newExperience];

                    set({
                        currentResume: {
                            ...resume,
                            experience: updatedExperience,
                            data: {
                                ...resume.data,
                                experience: updatedExperience,
                            },
                        },
                        isDirty: true,
                    });
                },

                updateExperience: (id, updates) => {
                    const resume = get().currentResume;
                    if (!resume) return;

                    const updatedExperience = resume.experience.map((exp) =>
                        exp.id === id ? { ...exp, ...updates } : exp
                    );

                    set({
                        currentResume: {
                            ...resume,
                            experience: updatedExperience,
                            data: {
                                ...resume.data,
                                experience: updatedExperience,
                            },
                        },
                        isDirty: true,
                    });
                },

                removeExperience: (id) => {
                    const resume = get().currentResume;
                    if (!resume) return;

                    const updatedExperience = resume.experience.filter((exp) => exp.id !== id);

                    set({
                        currentResume: {
                            ...resume,
                            experience: updatedExperience,
                            data: {
                                ...resume.data,
                                experience: updatedExperience,
                            },
                        },
                        isDirty: true,
                    });
                },

                reorderExperience: (startIndex, endIndex) => {
                    const resume = get().currentResume;
                    if (!resume) return;

                    const result = Array.from(resume.experience);
                    const [removed] = result.splice(startIndex, 1);
                    result.splice(endIndex, 0, removed);

                    set({
                        currentResume: {
                            ...resume,
                            experience: result,
                            data: {
                                ...resume.data,
                                experience: result,
                            },
                        },
                        isDirty: true,
                    });
                },

                addEducation: () => {
                    const resume = get().currentResume;
                    if (!resume) return;

                    const newEducation: Education = {
                        id: `edu-${Date.now()}`,
                        institution: '',
                        degree: '',
                        field: '',
                        startDate: '',
                        endDate: '',
                        gpa: '',
                    };

                    const updatedEducation = [...resume.education, newEducation];

                    set({
                        currentResume: {
                            ...resume,
                            education: updatedEducation,
                            data: {
                                ...resume.data,
                                education: updatedEducation,
                            },
                        },
                        isDirty: true,
                    });
                },

                updateEducation: (id, updates) => {
                    const resume = get().currentResume;
                    if (!resume) return;

                    const updatedEducation = resume.education.map((edu) =>
                        edu.id === id ? { ...edu, ...updates } : edu
                    );

                    set({
                        currentResume: {
                            ...resume,
                            education: updatedEducation,
                            data: {
                                ...resume.data,
                                education: updatedEducation,
                            },
                        },
                        isDirty: true,
                    });
                },

                removeEducation: (id) => {
                    const resume = get().currentResume;
                    if (!resume) return;

                    const updatedEducation = resume.education.filter((edu) => edu.id !== id);

                    set({
                        currentResume: {
                            ...resume,
                            education: updatedEducation,
                            data: {
                                ...resume.data,
                                education: updatedEducation,
                            },
                        },
                        isDirty: true,
                    });
                },


                setTemplate: (templateId) => {
                    const resume = get().currentResume;
                    if (!resume) return;

                    set({
                        currentResume: {
                            ...resume,
                            templateId,
                            data: {
                                ...resume.data,
                            },
                        },
                        isDirty: true,
                    });
                },

                setColor: (colorId) => {
                    const resume = get().currentResume;
                    if (!resume) return;

                    set({
                        currentResume: {
                            ...resume,
                            colorId,
                            data: {
                                ...resume.data,
                            },
                        },
                        isDirty: true,
                    });
                },

                saveResume: async () => {
                    const { currentResume, etag } = get();
                    if (!currentResume) return;

                    set({ isSaving: true, saveError: null });

                    try {
                        // Restructure data for backend API
                        // Backend expects: { id, title, data: { personal, summary, ... }, template_id, color_id }
                        const payload = {
                            title: currentResume.title,
                            data: {
                                personal: currentResume.personal,
                                social: currentResume.social,
                                summary: currentResume.summary,
                                experience: currentResume.experience,
                                education: currentResume.education,
                                skills: currentResume.skills,
                            },
                            template_id: currentResume.templateId,
                            color_id: currentResume.colorId,
                        };

                        const response = await resumeAPI.update(currentResume.id, payload, {
                            headers: {
                                'If-Match': etag || '',
                            }
                        });

                        const newEtag = response.headers['etag'];
                        const savedResume = response.data;

                        // Use setResume to ensure proper data mapping
                        const resumeWithEtag = {
                            ...savedResume,
                            etag: newEtag,
                        };

                        get().setResume(resumeWithEtag);

                        set({
                            lastSaved: new Date(),
                            isDirty: false,
                            isSaving: false,
                        });
                    } catch (error: any) {
                        let errorMessage = error instanceof Error ? error.message : 'Unknown error';

                        // Handle Axios errors
                        if (error.response) {
                            if (error.response.status === 412) {
                                errorMessage = 'Conflict: Resume was modified by another session';
                            } else {
                                errorMessage = error.response.data?.message || errorMessage;
                            }
                        }

                        set({
                            isSaving: false,
                            saveError: errorMessage,
                        });
                        throw error;
                    }
                },

                loadResume: async (id: string) => {
                    try {
                        set({ isSaving: true });
                        const response = await resumeAPI.getOne(id);

                        const resume = response.data;
                        console.log('API Response:', resume);
                        console.log('Resume data:', resume.data);

                        const etag = response.headers['etag'];

                        // Use setResume to ensure proper data mapping
                        const resumeWithEtag = {
                            ...resume,
                            etag: etag || resume.etag,
                            lastSavedAt: resume.updated_at ? new Date(resume.updated_at) : null,
                        };

                        // Call setResume which handles the data structure mapping
                        get().setResume(resumeWithEtag);

                        // Update additional state
                        set({
                            isDirty: false,
                            isSaving: false,
                            saveError: null,
                        });
                    } catch (error) {
                        console.error('Load resume error:', error);
                        set({
                            saveError: error instanceof Error ? error.message : 'Failed to load resume',
                            isSaving: false
                        });
                        throw error;
                    }
                },

                markDirty: () => set({ isDirty: true }),
                markClean: () => set({ isDirty: false }),
            }),
            {
                name: 'resume-storage',
                partialize: (state) => ({
                    currentResume: state.currentResume,
                    etag: state.etag,
                }),
            }
        )
    )
);
