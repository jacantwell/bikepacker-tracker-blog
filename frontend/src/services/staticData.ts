import { SummaryActivity, DetailedActivity, StravaPhoto } from '@/types/StravaTypes';

/**
 * Static data loader service for Strava data
 * Replaces live API calls with pre-scraped static JSON files
 */

// Base path for static data
const STATIC_DATA_BASE = '/strava_data';

// Photo base URL - can be configured for S3 or local storage
const PHOTO_BASE_URL = import.meta.env.VITE_STRAVA_PHOTOS_BASE_URL || 'https://jaspercycles.com/content/strava_data/media';

/**
 * Fetch JSON data from a static file
 */
async function fetchStaticJSON<T>(path: string): Promise<T> {
  try {
    const response = await fetch(`${STATIC_DATA_BASE}/${path}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${path}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error loading static data from ${path}:`, error);
    throw error;
  }
}

/**
 * Load all summary activities
 */
export async function loadActivitiesSummary(): Promise<SummaryActivity[]> {
  return fetchStaticJSON<SummaryActivity[]>('activities_summary.json');
}

/**
 * Load all detailed activities
 * Returns a map of activity ID to detailed activity data
 */
export async function loadActivitiesDetailed(): Promise<Record<string, DetailedActivity>> {
  return fetchStaticJSON<Record<string, DetailedActivity>>('activities_detailed.json');
}

/**
 * Load detailed activity by ID
 */
export async function loadDetailedActivity(activityId: string): Promise<DetailedActivity | null> {
  try {
    // First try to load from the combined file
    const allDetailed = await loadActivitiesDetailed();
    if (allDetailed[activityId]) {
      return allDetailed[activityId];
    }

    // Fallback: try to load individual activity file
    return await fetchStaticJSON<DetailedActivity>(`activities/${activityId}.json`);
  } catch (error) {
    console.warn(`Could not load detailed activity ${activityId}:`, error);
    return null;
  }
}

/**
 * Load all photos
 * Returns a map of activity ID to array of photos
 */
export async function loadAllPhotos(): Promise<Record<string, StravaPhoto[]>> {
  return fetchStaticJSON<Record<string, StravaPhoto[]>>('photos_all.json');
}

/**
 * Load photos for a specific activity
 */
export async function loadActivityPhotos(activityId: string): Promise<StravaPhoto[]> {
  try {
    // First try to load from the combined file
    const allPhotos = await loadAllPhotos();
    if (allPhotos[activityId]) {
      return processPhotoUrls(allPhotos[activityId]);
    }

    // Fallback: try to load individual photo file
    const photos = await fetchStaticJSON<StravaPhoto[]>(`photos/${activityId}.json`);
    return processPhotoUrls(photos);
  } catch (error) {
    console.warn(`Could not load photos for activity ${activityId}:`, error);
    return [];
  }
}

/**
 * Process photo URLs to use the configured base URL
 * This allows switching between local and S3 storage
 */
function processPhotoUrls(photos: StravaPhoto[]): StravaPhoto[] {
  return photos.map(photo => {
    const processedUrls: Record<string, string> = {};

    // If the photo already has full URLs (starting with http), use them as-is
    // Otherwise, prepend the base URL
    Object.entries(photo.urls || {}).forEach(([size, url]) => {
      if (url.startsWith('http://') || url.startsWith('https://')) {
        processedUrls[size] = url;
      } else {
        // Assume url is a relative path like "123456/photo_5000.jpg"
        processedUrls[size] = `${PHOTO_BASE_URL}/${url}`;
      }
    });

    return {
      ...photo,
      urls: processedUrls
    };
  });
}


/**
 * Get photo base URL (useful for debugging and configuration)
 */
export function getPhotoBaseUrl(): string {
  return PHOTO_BASE_URL;
}
