'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface FileUploadZoneProps {
    onFileSelect: (file: File) => void;
    accept?: Record<string, string[]>;
    maxSize?: number;
    disabled?: boolean;
}

export function FileUploadZone({
    onFileSelect,
    accept = {
        'application/pdf': ['.pdf'],
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
        'application/msword': ['.doc'],
    },
    maxSize = 10 * 1024 * 1024, // 10MB
    disabled = false,
}: FileUploadZoneProps) {
    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            if (acceptedFiles.length > 0) {
                onFileSelect(acceptedFiles[0]);
            }
        },
        [onFileSelect]
    );

    const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
        onDrop,
        accept,
        maxSize,
        multiple: false,
        disabled,
    });

    const fileRejectionErrors = fileRejections.map((rejection) => {
        const errors = rejection.errors.map((e) => e.message).join(', ');
        return `${rejection.file.name}: ${errors}`;
    });

    return (
        <div>
            <div
                {...getRootProps()}
                className={`
          relative border-2 border-dashed rounded-xl p-12 text-center cursor-pointer
          transition-all duration-300 ease-in-out
          ${isDragActive
                        ? 'border-indigo-500 bg-indigo-50 scale-[1.02]'
                        : 'border-slate-200 hover:border-indigo-400 hover:bg-slate-50'
                    }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
            >
                <input {...getInputProps()} />

                <div className="flex flex-col items-center gap-4">
                    {/* Icon */}
                    <div
                        className={`
              w-16 h-16 rounded-full flex items-center justify-center transition-all
              ${isDragActive ? 'bg-indigo-100 scale-110' : 'bg-slate-100'}
            `}
                    >
                        <i
                            className={`
                fa-solid fa-cloud-arrow-up text-2xl
                ${isDragActive ? 'text-indigo-600' : 'text-slate-400'}
              `}
                        />
                    </div>

                    {/* Text */}
                    <div>
                        <p className="text-base font-bold text-slate-800 mb-1">
                            {isDragActive ? 'Drop your resume here' : 'Drag & drop your resume'}
                        </p>
                        <p className="text-sm text-slate-500">
                            or <span className="text-indigo-600 font-semibold">browse files</span>
                        </p>
                    </div>

                    {/* Supported formats */}
                    <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-lg border border-slate-200">
                            <i className="fa-solid fa-file-pdf text-red-500 text-sm" />
                            <span className="text-xs font-medium text-slate-600">PDF</span>
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-lg border border-slate-200">
                            <i className="fa-solid fa-file-word text-blue-500 text-sm" />
                            <span className="text-xs font-medium text-slate-600">DOCX</span>
                        </div>
                    </div>

                    {/* Size limit */}
                    <p className="text-xs text-slate-400 mt-2">Maximum file size: 10MB</p>
                </div>
            </div>

            {/* Error messages */}
            {fileRejectionErrors.length > 0 && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-start gap-2">
                        <i className="fa-solid fa-circle-exclamation text-red-500 mt-0.5" />
                        <div className="flex-1">
                            <p className="text-sm font-semibold text-red-800 mb-1">Upload failed</p>
                            {fileRejectionErrors.map((error, index) => (
                                <p key={index} className="text-xs text-red-600">
                                    {error}
                                </p>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
