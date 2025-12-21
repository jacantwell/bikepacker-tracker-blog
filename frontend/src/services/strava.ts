import { SummaryActivity, Route } from '@/api/strava/api';
import { cacheService } from './cache';
import {
  loadActivitiesSummary,
  loadDetailedActivity,
  loadActivityPhotos,
  loadPlannedRoute,
  loadRouteById
} from './staticData';

// Cache TTL for Strava data (4 hours) - still useful for in-memory caching
const STRAVA_CACHE_TTL = 4 * 60 * 60 * 1000;

/**
 * Gets journey activities from static data
 * with caching support
 * @param startDate The date from which to filter activities, in ISO format
 * @param skipCache Force a fresh load, bypassing cache
 */
export async function getJourneyActivities(
  startDate: string = '2025-05-024T00:00:00Z',
  skipCache: boolean = false
) {
  // Generate cache key
  const cacheKey = cacheService.generateStravaKey(startDate);

  // Try to get from cache first (unless skipCache is true)
  if (!skipCache) {
    const cachedData = cacheService.getItem<{
      activities: SummaryActivity[];
      startDate: string;
      timestamp: number;
    }>(cacheKey, STRAVA_CACHE_TTL);

    if (cachedData) {
      console.log('Using cached Strava data from:', new Date(cachedData.timestamp).toLocaleString());
      return cachedData;
    }
  }

  // Load from static JSON files
  try {
    // Load all activities from static data
    const allActivities = await loadActivitiesSummary();

    // Filter activities by date and type (same logic as before)
    const afterTimestamp = new Date(startDate).getTime();
    const activities = allActivities.filter(activity => {
      const activityTime = new Date(activity.start_date || '').getTime();
      return activityTime >= afterTimestamp && activity.type === 'Ride';
    });

    console.log(`Loaded ${activities.length} activities from static data`);

    // Cache the result
    const result = {
      activities,
      startDate,
      timestamp: Date.now()
    };

    cacheService.setItem(cacheKey, result, STRAVA_CACHE_TTL);

    return result;
  } catch (error) {
    console.error('Error loading static Strava data:', error);
    // Fall back to empty data if loading fails
    return {
      activities: [],
      startDate,
      timestamp: Date.now()
    };
  }
}

/**
 * Get detailed activity data from static files
 * @param activity_id The activity ID
 */
export async function getDetailedActivity(activity_id: string) {
  const cacheKey = cacheService.generateStravaDetailedKey(activity_id);

  // Try cache first
  const cachedActivity = cacheService.getItem(cacheKey, STRAVA_CACHE_TTL);
  if (cachedActivity) {
    console.log(`Using cached detailed activity ${activity_id}`);
    return cachedActivity;
  }

  // Load from static data
  const activity = await loadDetailedActivity(activity_id);

  if (activity) {
    // Cache it
    cacheService.setItem(cacheKey, activity, STRAVA_CACHE_TTL);
  }

  return activity;
}

/**
 * Get activity photos from static data
 * Note: The 'size' parameter is kept for API compatibility but is not used
 * since static data will include all available sizes
 * @param activity_id The activity ID
 * @param size Legacy parameter (not used with static data)
 */
export async function getActivityPhotos(activity_id: string, size: number = 5000) {
  const cacheKey = `cache:strava:photos:${activity_id}:${size}`;

  // Try cache first
  const cachedPhotos = cacheService.getItem(cacheKey, STRAVA_CACHE_TTL);
  if (cachedPhotos) {
    console.log(`Using cached photos for activity ${activity_id}`);
    return cachedPhotos;
  }

  // Load from static data
  const photos = await loadActivityPhotos(activity_id);

  if (photos) {
    // Cache it
    cacheService.setItem(cacheKey, photos, STRAVA_CACHE_TTL);
  }

  return photos;
}

/**
 * Get a route from static data by its ID
 * @param routeId The ID of the route to fetch
 * @param skipCache Force a fresh load, bypassing cache
 */
export async function getRouteById(routeId: string, skipCache: boolean = false): Promise<Route | null> {
  const cacheKey = `cache:strava:route:${routeId}`;

  // Try to get from cache first (unless skipCache is true)
  if (!skipCache) {
    const cachedRoute = cacheService.getItem<Route>(cacheKey, STRAVA_CACHE_TTL);
    if (cachedRoute) {
      console.log(`Using cached route data for route ID: ${routeId}`);
      return cachedRoute;
    }
  }

  try {
    // Load from static data
    console.log(`Loading route with ID: ${routeId}`);
    const route = await loadRouteById(routeId);

    if (route) {
      console.log('Successfully loaded route:', route.name);
      // Cache the result
      cacheService.setItem(cacheKey, route, STRAVA_CACHE_TTL);
    }

    return route;
  } catch (error) {
    console.error(`Error loading route with ID ${routeId}:`, error);
    return null;
  }
}

/**
 * Get the planned route from static data
 * @param skipCache Force a fresh load, bypassing cache
 */
export async function getPlannedRoute(skipCache: boolean = false): Promise<Route | null> {
  const cacheKey = 'cache:strava:planned-route';

  // Try to get from cache first (unless skipCache is true)
  if (!skipCache) {
    const cachedRoute = cacheService.getItem<Route>(cacheKey, STRAVA_CACHE_TTL);
    if (cachedRoute) {
      console.log('Using cached planned route data');
      return cachedRoute;
    }
  }

  try {
    // Load from static data
    console.log('Loading planned route from static data');
    const route = await loadPlannedRoute();

    if (route) {
      console.log('Successfully loaded planned route:', route.name);
      // Cache the result
      cacheService.setItem(cacheKey, route, STRAVA_CACHE_TTL);
    }

    return route;
  } catch (error) {
    console.error('Error loading planned route:', error);
    return null;
  }
}

