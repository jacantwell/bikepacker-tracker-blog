import { SummaryActivity } from '@/api/strava/api';
import { StravaClient } from '@/api/strava/client';
import { RoutesApi, Route } from '@/api/strava/api';
import { Configuration } from '@/api/strava';
import { cacheService } from './cache';

// Cache TTL for Strava data (4 hours)
const STRAVA_CACHE_TTL = 4 * 60 * 60 * 1000;

// Hardcoded planned route ID
const PLANNED_ROUTE_ID = '3354080609481872430';

// Number of detailed activities to cache
const DETAILED_ACTIVITIES_CACHE_COUNT = 10;

/**
 * Gets journey activities from Strava using the refresh token flow
 * with caching support
 * @param startDate The date from which to fetch activities, in ISO format
 * @param skipCache Force a fresh API call, bypassing cache
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
  
  // If not in cache or skipCache is true, fetch from API
  try {
    // Create a new Strava client - this will use environment variables
    const stravaClient = new StravaClient();
    
    // Convert start date to epoch timestamp (required by Strava API)
    const after = Math.floor(new Date(startDate).getTime() / 1000);
    
    // Fetch all activities after the start date
    const activities = await stravaClient.getAllActivitiesAfter(after);
    
    console.log(`Fetched ${activities.length} activities from Strava API`);
    
    // Cache the result
    const result = {
      activities,
      startDate,
      timestamp: Date.now() // Add timestamp for debugging
    };
    
    cacheService.setItem(cacheKey, result, STRAVA_CACHE_TTL);
    
    // Fetch detailed activity data for the most recent activities
    const detailedActivities = await Promise.all(
      activities.slice(0, DETAILED_ACTIVITIES_CACHE_COUNT).map(activity => getDetailedActivity(activity.id?.toString() || '0'))
    );

    console.log(`Fetched detailed data for ${detailedActivities.length} activities`);

    // Cache detailed activities
    detailedActivities.forEach(activity => {
      const activityCacheKey = cacheService.generateStravaDetailedKey(activity.id?.toString() || "");
      cacheService.setItem(activityCacheKey, activity, STRAVA_CACHE_TTL);
    });

    return result;
  } catch (error) {
    console.error('Error fetching Strava activities:', error);
    // Fall back to mock data if the API fails
    return getMockActivities(startDate);
  }
}

export async function getDetailedActivity(activity_id: string) {
  const stravaClient = new StravaClient();

  const activity = await stravaClient.getActivity(activity_id);

  return activity
}

export async function getActivityPhotos(activity_id: string, size: number = 5000) {
  
  const stravaClient = new StravaClient();
  const photos = await stravaClient.getActivityPhotos(activity_id, size);
  return photos
}

/**
 * Get the planned route from Strava using the generated API client
 * @param skipCache Force a fresh API call, bypassing cache
 */
export async function getPlannedRoute(skipCache: boolean = false): Promise<Route> {
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
    // Get access token using the StravaClient
    const stravaClient = new StravaClient();
    const accessToken = await stravaClient.getValidAccessToken();

    // Configure the RoutesApi with the access token
    const configuration = new Configuration({
      accessToken: accessToken,
    });

    const routesApi = new RoutesApi(configuration);
    
    // Fetch the planned route
    console.log(`Fetching planned route with ID: ${PLANNED_ROUTE_ID}`);
    const response = await routesApi.getRouteById(PLANNED_ROUTE_ID);
    const route = response.data;
    
    console.log('Successfully fetched planned route:', route.name);
    
    // Cache the result
    cacheService.setItem(cacheKey, route, STRAVA_CACHE_TTL);
    
    return route;
  } catch (error) {
    console.error('Error fetching planned route:', error);
    throw new Error(`Failed to fetch planned route: ${error}`);
  }
}

/**
 * Get all routes for the authenticated athlete
 * @param page Page number (default: 1)
 * @param perPage Items per page (default: 30)
 */
export async function getAthleteRoutes(page: number = 1, perPage: number = 30): Promise<Route[]> {
  try {
    // Get access token using the StravaClient
    const stravaClient = new StravaClient();
    const accessToken = await stravaClient.getValidAccessToken();

    // Configure the RoutesApi
    const configuration = new Configuration({
      accessToken: accessToken,
    });

    const routesApi = new RoutesApi(configuration);
    
    // Fetch athlete routes
    const response = await routesApi.getRoutesByAthleteId(page, perPage);
    const routes = response.data;
    
    console.log(`Fetched ${routes.length} routes for athlete`);
    
    return routes;
  } catch (error) {
    console.error('Error fetching athlete routes:', error);
    throw new Error(`Failed to fetch athlete routes: ${error}`);
  }
}

/**
 * Fallback function to get mock data if API fails
 */
function getMockActivities(startDate: string) {
  console.log('Using mock Strava data');
  
  // Mock data for initial testing
  const mockActivities: SummaryActivity[] = [
    // Your existing mock data
  ];
  
  return {
    activities: mockActivities,
    startDate,
    timestamp: Date.now()
  };
}
