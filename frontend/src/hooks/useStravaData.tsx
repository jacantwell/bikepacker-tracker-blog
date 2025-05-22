import { useState, useEffect, useCallback } from 'react';
import { SummaryActivity } from '../api/strava/api';
import { getJourneyActivities } from '../services/strava';

function useStravaData(startDate: string) {
  const [activities, setActivities] = useState<SummaryActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Memoize the loadData function to prevent unnecessary re-renders
  const loadData = useCallback(async (skipCache: boolean = false) => {
    // If skipping cache, we're doing a background refresh
    const isBackgroundRefresh = skipCache;
    
    try {
      // Only show loading indicator for initial load, not background refresh
      if (!isBackgroundRefresh) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }
      
      const data = await getJourneyActivities(startDate, skipCache);
      setActivities(data.activities);
      setLastUpdated(new Date(data.timestamp));
      setError(null);
    } catch (err) {
      console.error("Failed to fetch Strava data:", err);
      setError(err instanceof Error ? err : new Error('Failed to fetch journey data'));
    } finally {
      if (!isBackgroundRefresh) {
        setLoading(false);
      } else {
        setRefreshing(false);
      }
    }
  }, [startDate]); // Include startDate as dependency since it's used inside

  // Function to manually refresh data (also memoized)
  const refresh = useCallback(() => loadData(true), [loadData]);

  // Initial data load (try from cache first)
  useEffect(() => {
    loadData(false); // Try to use cache for initial load
  }, [loadData]); // Now we can safely include loadData in dependencies

  // Background refresh after initial load
  useEffect(() => {
    if (!loading && activities.length > 0) {
      // If we have data and aren't in initial loading state,
      // do a background refresh after a short delay
      const timer = setTimeout(() => {
        loadData(true); // Skip cache for background refresh
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [loading, activities.length, loadData]); // Include loadData in dependencies

  return { 
    activities, 
    loading, 
    refreshing, 
    error, 
    lastUpdated,
    refresh // Allow manual refresh from components
  };
}

export default useStravaData;