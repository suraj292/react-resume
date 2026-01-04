'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

interface UploadStatus {
    id: number;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    progress: number;
    parsed_data?: any;
    error_message?: string;
}

interface UploadProgressProps {
    uploadId: number;
    onComplete: (data: any) => void;
    onError: (error: string) => void;
}

export function UploadProgress({ uploadId, onComplete, onError }: UploadProgressProps) {
    const [hasCompleted, setHasCompleted] = useState(false);

    const { data: status, isLoading } = useQuery<UploadStatus>({
        queryKey: ['upload-status', uploadId],
        queryFn: async () => {
            const response = await fetch(`/api/uploads/${uploadId}/status`);
            if (!response.ok) throw new Error('Failed to fetch status');
            return response.json();
        },
        refetchInterval: (query) => {
            // Stop polling if completed or failed
            const data = query.state.data;
            if (data?.status === 'completed' || data?.status === 'failed') {
                return false;
            }
            return 2000; // Poll every 2 seconds
        },
        enabled: !hasCompleted,
    });

    // Handle completion and errors in useEffect to avoid setState during render
    useEffect(() => {
        if (!status || hasCompleted) return;

        if (status.status === 'completed') {
            setHasCompleted(true);
            onComplete(status.parsed_data);
        } else if (status.status === 'failed') {
            setHasCompleted(true);
            onError(status.error_message || 'Parsing failed');
        }
    }, [status, hasCompleted, onComplete, onError]);

    if (isLoading || !status) {
        return (
            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600" />
                <span className="text-sm text-slate-600">Uploading...</span>
            </div>
        );
    }

    const statusConfig = {
        pending: {
            icon: 'fa-clock',
            color: 'text-slate-500',
            bg: 'bg-slate-50',
            text: 'Queued for processing...',
        },
        processing: {
            icon: 'fa-gear',
            color: 'text-indigo-600',
            bg: 'bg-indigo-50',
            text: 'Analyzing your resume...',
        },
        completed: {
            icon: 'fa-circle-check',
            color: 'text-green-600',
            bg: 'bg-green-50',
            text: 'Resume parsed successfully!',
        },
        failed: {
            icon: 'fa-circle-xmark',
            color: 'text-red-600',
            bg: 'bg-red-50',
            text: 'Parsing failed',
        },
    };

    const config = statusConfig[status.status];

    return (
        <div className={`p-4 rounded-lg ${config.bg}`}>
            <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                    {status.status === 'processing' ? (
                        <i className={`fa-solid ${config.icon} ${config.color} text-lg animate-spin`} />
                    ) : (
                        <i className={`fa-solid ${config.icon} ${config.color} text-lg`} />
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold ${config.color} mb-1`}>{config.text}</p>

                    {status.status === 'processing' && (
                        <div className="mt-2">
                            <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                                <span>Progress</span>
                                <span className="font-semibold">{status.progress}%</span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                                <div
                                    className="bg-indigo-600 h-full rounded-full transition-all duration-500 ease-out"
                                    style={{ width: `${status.progress}%` }}
                                />
                            </div>
                        </div>
                    )}

                    {status.status === 'failed' && status.error_message && (
                        <p className="text-xs text-red-600 mt-1">{status.error_message}</p>
                    )}
                </div>
            </div>
        </div>
    );
}
