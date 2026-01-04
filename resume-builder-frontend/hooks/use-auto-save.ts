import { useEffect, useRef } from 'react';
import { useResumeStore } from '@/lib/stores/resume-store';
import { toast } from 'sonner';

const AUTOSAVE_DELAY = 3000; // 3 seconds

export function useAutoSave(resumeId: string) {
    const { currentResume, isDirty, isSaving, saveResume, markClean } = useResumeStore();
    const saveTimerRef = useRef<NodeJS.Timeout | null>(null);
    const offlineQueueRef = useRef<any[]>([]);

    // Auto-save when resume changes
    useEffect(() => {
        if (!isDirty || isSaving || !currentResume) return;

        // Clear existing timer
        if (saveTimerRef.current) {
            clearTimeout(saveTimerRef.current);
        }

        // Set new timer
        saveTimerRef.current = setTimeout(async () => {
            try {
                await saveResume();
                toast.success('Draft saved', {
                    duration: 2000,
                    position: 'top-center',
                });
            } catch (error) {
                console.error('Auto-save failed:', error);
                toast.error('Failed to save. Changes stored locally.', {
                    duration: 3000,
                });

                // Queue for offline save
                if (!navigator.onLine) {
                    queueOfflineSave(currentResume);
                }
            }
        }, AUTOSAVE_DELAY);

        return () => {
            if (saveTimerRef.current) {
                clearTimeout(saveTimerRef.current);
            }
        };
    }, [currentResume, isDirty, isSaving, saveResume]);

    // Handle offline/online transitions
    useEffect(() => {
        const handleOnline = async () => {
            if (offlineQueueRef.current.length > 0) {
                toast.info('Connection restored. Syncing changes...', {
                    duration: 2000,
                });

                try {
                    await saveResume();
                    offlineQueueRef.current = [];
                    toast.success('Changes synced successfully', {
                        duration: 2000,
                    });
                } catch (error) {
                    toast.error('Failed to sync changes', {
                        duration: 3000,
                    });
                }
            }
        };

        const handleOffline = () => {
            toast.warning('You are offline. Changes will be saved locally.', {
                duration: 3000,
            });
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, [saveResume]);

    // Queue offline saves using IndexedDB
    const queueOfflineSave = (resume: any) => {
        offlineQueueRef.current.push({
            resume,
            timestamp: Date.now(),
        });

        // Store in IndexedDB for persistence
        if (typeof window !== 'undefined' && 'indexedDB' in window) {
            const request = indexedDB.open('ResumeBuilderDB', 1);

            request.onupgradeneeded = (event: any) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains('offlineQueue')) {
                    db.createObjectStore('offlineQueue', { keyPath: 'timestamp' });
                }
            };

            request.onsuccess = (event: any) => {
                const db = event.target.result;
                const transaction = db.transaction(['offlineQueue'], 'readwrite');
                const store = transaction.objectStore('offlineQueue');
                store.put({
                    resume,
                    timestamp: Date.now(),
                });
            };
        }
    };

    // Force save (for manual save button or Cmd+S)
    const forceSave = async () => {
        if (!currentResume) return;

        try {
            await saveResume();
            toast.success('Resume saved', {
                duration: 2000,
            });
        } catch (error) {
            toast.error('Failed to save resume', {
                duration: 3000,
            });
            throw error;
        }
    };

    return {
        forceSave,
        isSaving,
        isDirty,
    };
}
