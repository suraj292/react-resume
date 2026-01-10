/**
 * LocalStorage Cache Manager
 * Persistent cache with automatic expiration and cleanup
 */

interface StorageCacheEntry {
    data: any;
    timestamp: number;
    expiresAt: number;
}

class StorageCache {
    private readonly prefix = 'resumebp_cache_';

    /**
     * Set a value in localStorage with expiration
     */
    set(key: string, data: any, ttl: number = 24 * 60 * 60 * 1000): void {
        try {
            const entry: StorageCacheEntry = {
                data,
                timestamp: Date.now(),
                expiresAt: Date.now() + ttl,
            };
            localStorage.setItem(this.prefix + key, JSON.stringify(entry));
        } catch (error) {
            console.error('Failed to set cache:', error);
            // If quota exceeded, try to cleanup and retry
            this.cleanup();
            try {
                const entry: StorageCacheEntry = {
                    data,
                    timestamp: Date.now(),
                    expiresAt: Date.now() + ttl,
                };
                localStorage.setItem(this.prefix + key, JSON.stringify(entry));
            } catch (retryError) {
                console.error('Failed to set cache after cleanup:', retryError);
            }
        }
    }

    /**
     * Get a value from localStorage
     * Returns null if not found or expired
     */
    get(key: string): any | null {
        try {
            const item = localStorage.getItem(this.prefix + key);
            if (!item) return null;

            const entry: StorageCacheEntry = JSON.parse(item);

            // Check if expired
            if (Date.now() > entry.expiresAt) {
                this.remove(key);
                return null;
            }

            return entry.data;
        } catch (error) {
            console.error('Failed to get cache:', error);
            // Remove corrupted entry
            this.remove(key);
            return null;
        }
    }

    /**
     * Check if a key exists and is not expired
     */
    has(key: string): boolean {
        return this.get(key) !== null;
    }

    /**
     * Remove a specific cache entry
     */
    remove(key: string): void {
        try {
            localStorage.removeItem(this.prefix + key);
        } catch (error) {
            console.error('Failed to remove cache:', error);
        }
    }

    /**
     * Clear all cache entries
     */
    clear(): void {
        try {
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.startsWith(this.prefix)) {
                    localStorage.removeItem(key);
                }
            });
        } catch (error) {
            console.error('Failed to clear cache:', error);
        }
    }

    /**
     * Clean up expired entries
     */
    cleanup(): void {
        try {
            const keys = Object.keys(localStorage);
            let cleanedCount = 0;

            keys.forEach(key => {
                if (key.startsWith(this.prefix)) {
                    const item = localStorage.getItem(key);
                    if (item) {
                        try {
                            const entry: StorageCacheEntry = JSON.parse(item);
                            if (Date.now() > entry.expiresAt) {
                                localStorage.removeItem(key);
                                cleanedCount++;
                            }
                        } catch (error) {
                            // Invalid entry, remove it
                            localStorage.removeItem(key);
                            cleanedCount++;
                        }
                    }
                }
            });

            if (cleanedCount > 0) {
                console.log(`[Storage Cache] Cleaned up ${cleanedCount} expired entries`);
            }
        } catch (error) {
            console.error('Failed to cleanup cache:', error);
        }
    }

    /**
     * Get cache statistics
     */
    getStats(): { count: number; totalSize: number; keys: string[] } {
        try {
            const keys = Object.keys(localStorage).filter(key => key.startsWith(this.prefix));
            let totalSize = 0;

            keys.forEach(key => {
                const item = localStorage.getItem(key);
                if (item) {
                    totalSize += item.length;
                }
            });

            return {
                count: keys.length,
                totalSize,
                keys: keys.map(k => k.replace(this.prefix, '')),
            };
        } catch (error) {
            console.error('Failed to get cache stats:', error);
            return { count: 0, totalSize: 0, keys: [] };
        }
    }

    /**
     * Get remaining storage quota (approximate)
     */
    getRemainingQuota(): number {
        try {
            const test = 'x'.repeat(1024); // 1KB
            let size = 0;

            // Try to estimate available space
            for (let i = 0; i < 10000; i++) {
                try {
                    localStorage.setItem('__test__', test.repeat(i));
                    size = i * 1024;
                } catch {
                    localStorage.removeItem('__test__');
                    return size;
                }
            }

            localStorage.removeItem('__test__');
            return size;
        } catch (error) {
            return 0;
        }
    }
}

export const storageCache = new StorageCache();

// Auto-cleanup on app load
if (typeof window !== 'undefined') {
    // Run cleanup after a short delay to not block initial render
    setTimeout(() => {
        storageCache.cleanup();
    }, 1000);
}

// Cache durations
export const STORAGE_CACHE_DURATION = {
    HOUR: 60 * 60 * 1000,           // 1 hour
    DAY: 24 * 60 * 60 * 1000,       // 1 day
    WEEK: 7 * 24 * 60 * 60 * 1000,  // 1 week
    MONTH: 30 * 24 * 60 * 60 * 1000, // 30 days
};
