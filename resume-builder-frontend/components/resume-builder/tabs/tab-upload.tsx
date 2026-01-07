'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { useUIStore } from '@/lib/stores/ui-store';
import { useResumeStore } from '@/lib/stores/resume-store';
import { FileUploadZone } from '../file-upload-zone';
import { UploadProgress } from '../upload-progress';

export function TabUpload() {
    const { resumeInputMode, jobInputMode, setResumeInputMode, setJobInputMode, setActiveTab } = useUIStore();
    const { currentResume, updateField } = useResumeStore();

    const [resumeText, setResumeText] = useState('');
    const [jobText, setJobText] = useState('');
    const [uploadId, setUploadId] = useState<number | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [parsedData, setParsedData] = useState<any>(null);

    // Handle resume file upload
    const handleResumeFileSelect = async (file: File) => {
        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('/api/uploads/resume', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Upload failed');
            }

            const data = await response.json();
            setUploadId(data.upload_id);
            toast.success('File uploaded successfully');
        } catch (error) {
            toast.error('Upload failed. Please try again.');
            setIsUploading(false);
        }
    };

    // Handle parsing completion
    const handleParseComplete = (data: any) => {
        setParsedData(data);
        setIsUploading(false);
        toast.success('Resume parsed successfully! Applying data...');

        // Auto-apply the parsed data
        if (data && currentResume) {
            // Update entire objects at once
            if (data.personal) {
                updateField('personal', data.personal);
            }
            if (data.summary) {
                updateField('summary', data.summary);
            }
            if (data.experience) {
                updateField('experience', data.experience);
            }
            if (data.education) {
                updateField('education', data.education);
            }
            if (data.skills) {
                updateField('skills', data.skills);
            }

            // Clear upload state
            setUploadId(null);

            // Show success and switch to AI tab to show ATS score
            setTimeout(() => {
                toast.success('Resume data applied! Check your ATS score in the AI tab.');
                setActiveTab('ai');
            }, 1000);
        }
    };

    // Handle parsing error
    const handleParseError = (error: string) => {
        toast.error(error);
        setIsUploading(false);
        setUploadId(null);
    };

    // Apply parsed data to resume
    const handleApplyParsedData = () => {
        if (!parsedData || !currentResume) return;

        // Update entire objects at once to prevent null reference issues
        if (parsedData.personal) {
            updateField('personal', parsedData.personal);
        }

        if (parsedData.summary) {
            updateField('summary', parsedData.summary);
        }

        if (parsedData.experience) {
            updateField('experience', parsedData.experience);
        }

        if (parsedData.education) {
            updateField('education', parsedData.education);
        }

        if (parsedData.skills) {
            updateField('skills', parsedData.skills);
        }

        toast.success('Resume data applied! Check the Manual tab and Live Preview.');
        setParsedData(null);
        setUploadId(null);

        // Switch to Manual tab to show the applied data
        setTimeout(() => setActiveTab('manual'), 500);
    };

    // Handle job description paste
    const handleSaveJobDescription = async () => {
        if (!jobText.trim()) {
            toast.error('Please enter a job description');
            return;
        }

        try {
            const response = await fetch('/api/uploads/job-description', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: jobText }),
            });

            if (!response.ok) {
                throw new Error('Parsing failed');
            }

            const data = await response.json();
            toast.success('Job description analyzed!');
            // TODO: Store JD data for ATS optimization
            console.log('Parsed JD:', data);
        } catch (error) {
            toast.error('Failed to analyze job description');
        }
    };

    return (
        <div>
            <header className="mb-8">
                <h2 className="text-xl font-display font-bold text-slate-800">Upload & Context</h2>
                <p className="text-slate-400 text-xs mt-1 font-medium">
                    Import your existing resume and paste the job description to tailor your content.
                </p>
            </header>

            {/* Resume Upload Section */}
            <div className="mb-8">
                <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                    <i className="fa-solid fa-file-pdf text-indigo-600" />
                    Your Existing Resume
                </h3>

                {/* Toggle Buttons */}
                <div className="flex gap-2 mb-4">
                    <button
                        onClick={() => setResumeInputMode('upload')}
                        className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${resumeInputMode === 'upload'
                            ? 'bg-white shadow-sm text-indigo-600 border border-indigo-100'
                            : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                            }`}
                    >
                        <i className="fa-solid fa-cloud-arrow-up mr-2" />
                        Upload File
                    </button>
                    <button
                        onClick={() => setResumeInputMode('paste')}
                        className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${resumeInputMode === 'paste'
                            ? 'bg-white shadow-sm text-indigo-600 border border-indigo-100'
                            : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                            }`}
                    >
                        <i className="fa-solid fa-paste mr-2" />
                        Paste Text
                    </button>
                </div>

                {/* Upload Mode */}
                {resumeInputMode === 'upload' && (
                    <div>
                        {!uploadId ? (
                            <FileUploadZone onFileSelect={handleResumeFileSelect} disabled={isUploading} />
                        ) : (
                            <UploadProgress
                                uploadId={uploadId}
                                onComplete={handleParseComplete}
                                onError={handleParseError}
                            />
                        )}

                        {/* Parsed Data Preview */}
                        {parsedData && (
                            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-start gap-2">
                                        <i className="fa-solid fa-circle-check text-green-600 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-semibold text-green-800">
                                                Resume parsed successfully!
                                            </p>
                                            <p className="text-xs text-green-600 mt-0.5">
                                                Found: {parsedData.personal?.name || 'Unknown'} •{' '}
                                                {parsedData.experience?.length || 0} jobs •{' '}
                                                {parsedData.skills?.length || 0} skills
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={handleApplyParsedData}
                                    className="w-full py-2.5 bg-green-600 text-white font-bold text-sm rounded-lg hover:bg-green-500 transition-colors flex items-center justify-center gap-2"
                                >
                                    <i className="fa-solid fa-check" />
                                    Apply to Resume
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Paste Mode */}
                {resumeInputMode === 'paste' && (
                    <div>
                        <textarea
                            value={resumeText}
                            onChange={(e) => setResumeText(e.target.value)}
                            placeholder="Paste your resume text here..."
                            className="w-full h-40 p-4 border border-slate-200 rounded-2xl text-sm text-slate-700 resize-none focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                        />
                        <button
                            onClick={() => toast.info('Text parsing coming soon!')}
                            className="mt-3 w-full py-2.5 bg-indigo-600 text-white font-bold text-sm rounded-lg hover:bg-indigo-500 transition-colors"
                        >
                            Parse Text
                        </button>
                    </div>
                )}
            </div>

            {/* Job Description Section */}
            <div>
                <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                    <i className="fa-solid fa-briefcase text-amber-600" />
                    Job Description (Optional)
                </h3>

                {/* Toggle Buttons */}
                <div className="flex gap-2 mb-4">
                    <button
                        onClick={() => setJobInputMode('upload')}
                        className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${jobInputMode === 'upload'
                            ? 'bg-white shadow-sm text-indigo-600 border border-indigo-100'
                            : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                            }`}
                    >
                        <i className="fa-solid fa-cloud-arrow-up mr-2" />
                        Upload File
                    </button>
                    <button
                        onClick={() => setJobInputMode('paste')}
                        className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${jobInputMode === 'paste'
                            ? 'bg-white shadow-sm text-indigo-600 border border-indigo-100'
                            : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                            }`}
                    >
                        <i className="fa-solid fa-paste mr-2" />
                        Paste Text
                    </button>
                </div>

                {/* Upload Mode */}
                {jobInputMode === 'upload' && (
                    <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:border-amber-300 transition-colors cursor-pointer bg-slate-50/50">
                        <i className="fa-solid fa-file-lines text-3xl text-slate-300 mb-2" />
                        <p className="text-xs font-bold text-slate-700 mb-1">Upload job posting</p>
                        <p className="text-[10px] text-slate-400">Coming soon!</p>
                    </div>
                )}

                {/* Paste Mode */}
                {jobInputMode === 'paste' && (
                    <div>
                        <textarea
                            value={jobText}
                            onChange={(e) => setJobText(e.target.value)}
                            placeholder="Paste the job description here to optimize your resume for ATS..."
                            className="w-full h-32 p-4 border border-slate-200 rounded-2xl text-sm text-slate-700 resize-none focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
                        />
                        <button
                            onClick={handleSaveJobDescription}
                            className="mt-4 w-full py-3 bg-slate-900 text-white font-bold text-sm rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                        >
                            <i className="fa-solid fa-floppy-disk" />
                            Analyze Job Description
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
