export interface CacheItem<T> {
    data: T;
    timestamp: number;
    version: string;
  }
  
  // Current cache version - increment when data structure changes
  const CACHE_VERSION = '1.0.0';
  
  // Default TTL (time-to-live) in milliseconds (24 hours)
  const DEFAULT_TTL = 24 * 60 * 60 * 1000;
  
  export const cacheService = {
    /**
     * Set an item in cache with TTL
     */
    setItem<T>(key: string, data: T, ttl: number = DEFAULT_TTL): void {
      try {
        const item: CacheItem<T> = {
          data,
          timestamp: Date.now(),
          version: CACHE_VERSION,
        };
        
        localStorage.setItem(key, JSON.stringify(item));
      } catch (error) {
        console.error('Failed to cache data:', error);
      }
    },
  
    /**
     * Get an item from cache, returns null if expired or not found
     */
    getItem<T>(key: string, ttl: number = DEFAULT_TTL): T | null {
      try {
        const itemStr = localStorage.getItem(key);
        if (!itemStr) return null;
        
        const item: CacheItem<T> = JSON.parse(itemStr);
        
        // Check version and expiry
        if (
          item.version !== CACHE_VERSION || 
          Date.now() > item.timestamp + ttl
        ) {
          // Version mismatch or expired
          localStorage.removeItem(key);
          return null;
        }
        
        return item.data;
      } catch (error) {
        console.error('Failed to retrieve cached data:', error);
        return null;
      }
    },
  
    /**
     * Remove an item from cache
     */
    removeItem(key: string): void {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.error('Failed to remove cached data:', error);
      }
    },
    
    /**
     * Clear all cached data
     */
    clearCache(): void {
      try {
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('cache:')) {
            keysToRemove.push(key);
          }
        }
        
        keysToRemove.forEach(key => localStorage.removeItem(key));
      } catch (error) {
        console.error('Failed to clear cache:', error);
      }
    },
    
    /**
     * Generate a cache key for Strava activities
     */
    generateStravaKey(startDate: string): string {
      return `cache:strava:activities:${startDate}`;
    }
  };