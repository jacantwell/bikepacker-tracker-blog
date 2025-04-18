import { useState, useEffect } from 'react';
import { SummaryActivity } from '../api/strava/api';
import { getJourneyActivities } from '../services/strava';

export function useStravaData(startDate: string) {
  const [activities, setActivities] = useState<SummaryActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const data = await getJourneyActivities(startDate);
        setActivities(data.activities);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch journey data'));
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [startDate]);

  return { activities, loading, error };
}