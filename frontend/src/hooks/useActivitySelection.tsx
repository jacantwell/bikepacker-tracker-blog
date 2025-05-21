import { useState, useCallback } from "react";
import { SummaryActivity, DetailedActivity } from "@/api/strava/api";
import { getDetailedActivity } from "@/services/strava";

export function useActivitySelection(activities: SummaryActivity[]) {
  const [selectedActivity, setSelectedActivity] = useState<DetailedActivity | null>(null);
  const [popupInfo, setPopupInfo] = useState<{
    longitude: number;
    latitude: number;
    activity: SummaryActivity;
  } | null>(null);

  // Handle activity selection
  const handleActivitySelect = useCallback(async (activityId: string | null) => {
    if (!activityId) {
      setSelectedActivity(null);
      setPopupInfo(null);
      return;
    }

    // Find the activity in the activities array
    const activity = activities.find(a => a.id?.toString() === activityId);
    if (!activity) {
      console.error("Activity not found:", activityId);
      return;
    }
    
    try {
      const detailedActivity = await getDetailedActivity(activityId);
      setSelectedActivity(detailedActivity);

      // Get coordinates for the popup - use the first point of the activity
      if (activity.start_latlng && activity.start_latlng.length === 2) {
        setPopupInfo({
          longitude: activity.start_latlng[1],
          latitude: activity.start_latlng[0],
          activity,
        });
      }
    } catch (error) {
      console.error("Error fetching activity details:", error);
    }
  }, [activities]);

  return {
    selectedActivity,
    popupInfo,
    handleActivitySelect,
  };
}