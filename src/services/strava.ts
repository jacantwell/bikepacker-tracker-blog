import { SummaryActivity } from '../types/StravaTypes';
import { mockActivities } from './mocks';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function getJourneyActivities(startDate: string): Promise<{
  activities: SummaryActivity[];
  startDate: string;
}> {
  // Simulate API request
  await delay(800);
  
  // Filter activities by start date
  const filteredActivities = mockActivities.filter(
    activity => activity.start_date && new Date(activity.start_date) >= new Date(startDate)
  );
  
  return {
    activities: filteredActivities,
    startDate
  };
}