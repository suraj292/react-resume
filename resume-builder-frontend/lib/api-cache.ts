/**
 * API Cache Layer
 * In-memory cache for API responses to reduce redundant network requests
 */

interface CacheEntry {
    data: any;
    timestamp: number;
    expiresIn: number;
}

class APICache {
    private cache: Map<string, CacheEntry> = new Map();
    private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

    /**
     * Set a value in the cache
     */
    set(key: string, data: any, ttl: number = this.DEFAULT_TTL): void {
        this.cache.set(key, {
            data,
            timestamp: Date.now(),
            expiresIn: ttl,
        });
    }

    /**
     * Get a value from the cache
     * Returns null if not found or expired
     */
    get(key: string): any | null {
        const entry = this.cache.get(key);
        if (!entry) return null;

        const isExpired = Date.now() - entry.timestamp > entry.expiresIn;
        if (isExpired) {
            this.cache.delete(key);
            return null;
        }

        return entry.data;
    }

    /**
     * Check if a key exists and is not expired
     */
    has(key: string): boolean {
        return this.get(key) !== null;
    }

    /**
     * Clear cache entries matching a pattern
     */
    clear(pattern?: string): void {
        if (!pattern) {
            this.cache.clear();
            return;
        }

        for (const key of this.cache.keys()) {
            if (key.includes(pattern)) {
                this.cache.delete(key);
            }
        }
    }

    /**
     * Clear all cache entries
     */
    clearAll(): void {
        this.cache.clear();
    }

    /**
     * Get cache statistics
     */
    getStats(): { size: number; keys: string[] } {
        return {
            size: this.cache.size,
            keys: Array.from(this.cache.keys()),
        };
    }
}

export const apiCache = new APICache();

// Cache durations for different types of data
export const CACHE_DURATION = {
    SHORT: 1 * 60 * 1000,           // 1 minute - frequently changing data
    MEDIUM: 5 * 60 * 1000,          // 5 minutes - moderately changing data
    LONG: 30 * 60 * 1000,           // 30 minutes - rarely changing data
    VERY_LONG: 24 * 60 * 60 * 1000, // 24 hours - static data
};

/**
 * Helper function to create a cache-aware API call
 */
export async function cachedAPICall<T>(
    cacheKey: string,
    apiCall: () => Promise<T>,
    ttl: number = CACHE_DURATION.MEDIUM
): Promise<T> {
    // Check cache first
    const cached = apiCache.get(cacheKey);
    if (cached) {
        console.log(`[Cache HIT] ${cacheKey}`);
        return cached;
    }

    // Fetch from API
    console.log(`[Cache MISS] ${cacheKey} - fetching...`);
    const data = await apiCall();

    // Cache the result
    apiCache.set(cacheKey, data, ttl);
    console.log(`[Cache SET] ${cacheKey} - cached for ${ttl / 1000}s`);

    return data;
}
