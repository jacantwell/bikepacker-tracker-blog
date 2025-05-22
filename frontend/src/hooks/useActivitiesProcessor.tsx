import { useState, useEffect, useCallback } from "react";
import { SummaryActivity } from "@/api/strava/api";
import { processActivities, calculateBounds } from "@/lib/activity-processor";

export function useActivitiesProcessor(activities: SummaryActivity[], startDate: string) {
  const [journeyData, setJourneyData] = useState<any>(null);
  const [processingData, setProcessingData] = useState(false);
  const [stats, setStats] = useState({
    totalDistance: 0,
    totalElevationGain: 0,
    totalActivities: 0,
    activityTypes: {} as Record<string, number>,
  });
  const [currentLocation, setCurrentLocation] = useState<{
    longitude: number;
    latitude: number;
    activity: SummaryActivity;
  } | null>(null);

  // Find most recent activity and set current location
  const findCurrentLocation = useCallback((activities: SummaryActivity[]) => {
    if (!activities || activities.length === 0) return;

    // Sort activities by date, most recent first
    const sortedActivities = [...activities].sort((a, b) => {
      const dateA = new Date(a.start_date || "").getTime();
      const dateB = new Date(b.start_date || "").getTime();
      return dateB - dateA; // Descending order
    });

    const mostRecent = sortedActivities[0];

    // Try to get the end point if available
    if (mostRecent.end_latlng && mostRecent.end_latlng.length === 2) {
      setCurrentLocation({
        latitude: mostRecent.end_latlng[0],
        longitude: mostRecent.end_latlng[1],
        activity: mostRecent,
      });
    }
  }, []);

  // Calculate bounds for the activities
  const getBounds = useCallback(() => {
    if (!activities || activities.length === 0) return null;
    return calculateBounds(activities);
  }, [activities]);

  // Process activities and calculate stats
  useEffect(() => {
    if (activities && activities.length) {
      setProcessingData(true);

      // Process GeoJSON data - move to a setTimeout to avoid blocking the UI
      const timeoutId = setTimeout(() => {
        try {
          // Process GeoJSON data
          const processedData = processActivities(activities, startDate);
          setJourneyData(processedData);

          // Calculate statistics
          let totalDistance = 0;
          let totalElevationGain = 0;
          const activityTypes: Record<string, number> = {};

          activities.forEach((activity) => {
            if (activity.distance) {
              totalDistance += activity.distance;
            }

            if (activity.total_elevation_gain) {
              totalElevationGain += activity.total_elevation_gain;
            }

            if (activity.type) {
              activityTypes[activity.type] =
                (activityTypes[activity.type] || 0) + 1;
            }
          });

          setStats({
            totalDistance,
            totalElevationGain,
            totalActivities: activities.length,
            activityTypes,
          });

          // Find current location marker (most recent activity)
          findCurrentLocation(activities);
        } finally {
          setProcessingData(false);
        }
      }, 10);

      return () => clearTimeout(timeoutId);
    } else {
      // Reset data if no activities
      setJourneyData(null);
      setStats({
        totalDistance: 0,
        totalElevationGain: 0,
        totalActivities: 0,
        activityTypes: {},
      });
    }
  }, [activities, startDate, findCurrentLocation]);

  return {
    journeyData,
    processingData,
    stats,
    currentLocation,
    getBounds,
  };
}