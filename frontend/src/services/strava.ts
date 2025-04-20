import { SummaryActivity } from '@/api/strava/api';
import { StravaClient } from '@/api/strava/client';
import { cacheService } from './cache';

// Cache TTL for Strava data (4 hours)
const STRAVA_CACHE_TTL = 4 * 60 * 60 * 1000;

/**
 * Gets journey activities from Strava using the refresh token flow
 * with caching support
 * @param startDate The date from which to fetch activities, in ISO format
 * @param skipCache Force a fresh API call, bypassing cache
 */
export async function getJourneyActivities(
  startDate: string = '2023-01-01T00:00:00Z',
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
    
    return result;
  } catch (error) {
    console.error('Error fetching Strava activities:', error);
    // Fall back to mock data if the API fails
    return getMockActivities(startDate);
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