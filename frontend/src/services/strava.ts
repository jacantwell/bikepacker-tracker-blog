import {
  loadActivitiesSummary,
  loadDetailedActivity,
  loadActivityPhotos,
} from './staticData';

/**
 * Gets journey activities from static data
 * Browser HTTP cache handles caching of the JSON files
 * @param startDate The date from which to filter activities, in ISO format
 * @param skipCache Unused parameter (kept for API compatibility)
 */
export async function getJourneyActivities(
  startDate: string = '2025-05-024T00:00:00Z',
) {
  try {
    // Load all activities from static data
    const allActivities = await loadActivitiesSummary();

    // Filter activities by date and type
    const afterTimestamp = new Date(startDate).getTime();
    const activities = allActivities.filter(activity => {
      const activityTime = new Date(activity.start_date || '').getTime();
      return activityTime >= afterTimestamp && activity.type === 'Ride';
    });

    console.log(`Loaded ${activities.length} activities from static data`);

    return {
      activities,
      startDate,
      timestamp: Date.now()
    };
  } catch (error) {
    console.error('Error loading static Strava data:', error);
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
  return loadDetailedActivity(activity_id);
}

/**
 * Get activity photos from static data
 * Note: The 'size' parameter is kept for API compatibility but is not used
 * since static data will include all available sizes
 * @param activity_id The activity ID
 * @param size Legacy parameter (not used with static data)
 */
export async function getActivityPhotos(activity_id: string) {
  return loadActivityPhotos(activity_id);
}
