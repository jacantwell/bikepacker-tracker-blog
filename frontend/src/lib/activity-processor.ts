import { SummaryActivity } from '@/api/strava/api';
import { decodePolyline } from './polyline';

// GeoJSON types
interface GeoJSONFeature {
  type: 'Feature';
  properties: {
    id?: number;
    name?: string;
    type?: string;
    date?: string;
    distance?: number;
    [key: string]: any;
  };
  geometry: {
    type: 'LineString';
    coordinates: [number, number][];
  };
}

interface GeoJSONFeatureCollection {
  type: 'FeatureCollection';
  features: GeoJSONFeature[];
}

/**
 * Processes Strava activities into GeoJSON format for the map
 * 
 * @param activities List of activities from Strava API
 * @param startDate ISO date string for the beginning of the journey
 * @returns GeoJSON FeatureCollection
 */
export function processActivities(
  activities: SummaryActivity[], 
  startDate: string
): GeoJSONFeatureCollection {
  if (!activities || activities.length === 0) {
    return {
      type: 'FeatureCollection',
      features: []
    };
  }
  
  // Filter activities by startDate
  const filteredActivities = activities.filter(activity => 
    activity.start_date && new Date(activity.start_date) >= new Date(startDate)
  );
  
  // Sort chronologically
  const sortedActivities = filteredActivities.sort((a, b) => {
    const dateA = new Date(a.start_date || '').getTime();
    const dateB = new Date(b.start_date || '').getTime();
    return dateA - dateB;
  });
  
  // Transform to GeoJSON for the map
  const features: GeoJSONFeature[] = [];
  
  // Process each activity
  sortedActivities
    .filter(activity => !!activity.map?.summary_polyline)
    .forEach(activity => {
      // Decode the polyline into coordinate points
      const decodedPoints = decodePolyline(activity.map?.summary_polyline || '');
      
      // Convert from [lat, lng] to [lng, lat] format for GeoJSON
      const coordinates = decodedPoints.map(([lat, lng]) => [lng, lat] as [number, number]);
      
      // Skip if no valid coordinates
      if (coordinates.length === 0) return;
      
      // Add valid feature to the array
      features.push({
        type: 'Feature',
        properties: {
          id: activity.id,
          name: activity.name,
          type: activity.type,
          date: activity.start_date,
          distance: activity.distance,
          sport_type: activity.sport_type,
          start_date_local: activity.start_date_local,
          elapsed_time: activity.elapsed_time,
          total_elevation_gain: activity.total_elevation_gain
        },
        geometry: {
          type: 'LineString',
          coordinates
        }
      });
    });
    
  return {
    type: 'FeatureCollection',
    features
  };
}

/**
 * Calculate the bounding box of the most recent activities
 * Useful for setting the initial map view
 * 
 * @param activities List of activities
 * @param limit Number of most recent activities to consider (default: 3)
 * @returns [minLng, minLat, maxLng, maxLat] or null if no valid coordinates
 */
export function calculateBounds(activities: SummaryActivity[], limit: number = 7): [number, number, number, number] | null {
  if (!activities || activities.length === 0) {
    return null;
  }
  
  // Sort activities by start_date (most recent first) and take only the most recent ones
  const recentActivities = [...activities]
    .sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime())
    .slice(0, limit);
  
  let minLat = 90;
  let maxLat = -90;
  let minLng = 180;
  let maxLng = -180;
  let hasValidCoordinates = false;
  
  // Process start/end points (now only for recent activities)
  recentActivities.forEach(activity => {
    // Check start coordinates
    if (activity.start_latlng && activity.start_latlng.length === 2) {
      const [lat, lng] = activity.start_latlng;
      hasValidCoordinates = true;
      minLat = Math.min(minLat, lat);
      maxLat = Math.max(maxLat, lat);
      minLng = Math.min(minLng, lng);
      maxLng = Math.max(maxLng, lng);
    }
    
    // Check end coordinates
    if (activity.end_latlng && activity.end_latlng.length === 2) {
      const [lat, lng] = activity.end_latlng;
      hasValidCoordinates = true;
      minLat = Math.min(minLat, lat);
      maxLat = Math.max(maxLat, lat);
      minLng = Math.min(minLng, lng);
      maxLng = Math.max(maxLng, lng);
    }
    
    // Process polylines for more accurate bounds
    if (activity.map?.summary_polyline) {
      const points = decodePolyline(activity.map.summary_polyline);
      
      points.forEach(([lat, lng]) => {
        hasValidCoordinates = true;
        minLat = Math.min(minLat, lat);
        maxLat = Math.max(maxLat, lat);
        minLng = Math.min(minLng, lng);
        maxLng = Math.max(maxLng, lng);
      });
    }
  });
  
  return hasValidCoordinates ? [minLng, minLat, maxLng, maxLat] : null;
}
