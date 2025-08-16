import { useState, useEffect, useCallback } from "react";
import Map, {
  Source,
  Layer,
  NavigationControl,
  Marker,
  ViewState,
  ViewStateChangeEvent,
  LineLayerSpecification,
} from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import ActivityPhotos from "./ActivityPhotos";
import { SummaryActivity, DetailedActivity } from "@/api/strava/api";
import { getDetailedActivity } from "@/services/strava";
import { processActivities, calculateBounds } from "@/lib/activity-processor";
import { formatDistance, formatTime } from "@/lib/dates";
import { cacheService } from "@/services/cache"

interface JourneyMapProps {
  activities: SummaryActivity[];
  startDate: string;
  isLoading?: boolean;
  isRefreshing?: boolean;
  lastUpdated?: Date | null;
  onRefresh?: () => void;
}

// Helper function to format date
function formatDate(dateString: string | undefined): string {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function JourneyMap({
  activities = [],
  startDate,
  isLoading = false
}: JourneyMapProps) {
  const [currentViewState, setCurrentViewState] = useState<ViewState>({
    longitude: 0,
    latitude: 30,
    zoom: 2,
    bearing: 0,
    pitch: 0,
    padding: { top: 40, bottom: 40, left: 40, right: 40 },
  });

  const [journeyData, setJourneyData] = useState<any>(null);
  const [processingData, setProcessingData] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [cursor, setCursor] = useState<string>('auto');

  // State for activity hover and selection
  const [selectedActivity, setSelectedActivity] =
    useState<DetailedActivity | null>(null);
      const [popupInfo, setPopupInfo] = useState<{
    longitude: number;
    latitude: number;
    activity: SummaryActivity;
  } | null>(null);

  // Stats
  const [stats, setStats] = useState({
    totalDistance: 0,
    totalElevationGain: 0,
    totalActivities: 0,
    activityTypes: {} as Record<string, number>,
  });

  // Auto fit bounds when map data changes
  const fitBounds = useCallback(() => {
    if (!activities || activities.length === 0) return;

    const bounds = calculateBounds(activities);
    if (!bounds) return;

    // Get map element to calculate the right padding
    const mapContainer = document.getElementById("journey-map");
    if (!mapContainer) return;

    // Add some padding to the bounds
    const [minLng, minLat, maxLng, maxLat] = bounds;

    // Calculate the center
    const centerLng = (minLng + maxLng) / 2;
    const centerLat = (minLat + maxLat) / 2;

    // Calculate appropriate zoom level
    // This is an approximation - smaller differences need higher zoom
    const lngDiff = Math.abs(maxLng - minLng);
    const latDiff = Math.abs(maxLat - minLat);
    const maxDiff = Math.max(lngDiff, latDiff);

    // Logarithmic scale for zoom - adjust constants as needed
    let zoom = 1;
    if (maxDiff > 0) {
      zoom = Math.min(
        15,
        Math.max(1, Math.floor(8 - Math.log(maxDiff) / Math.log(2))),
      );
    }

    // Update the view state
    setCurrentViewState((prev) => ({
      ...prev,
      longitude: centerLng,
      latitude: centerLat,
      zoom: zoom,
    }));
  }, [activities]);

  // Effect to handle dark mode
  useEffect(() => {
    // Check if dark mode is enabled
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    };

    checkDarkMode();

    // Add listener for theme changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  // Process activities and calculate stats
  useEffect(() => {
    if (activities && activities.length) {
      setProcessingData(true);

      // Process GeoJSON data - move to a setTimeout to avoid blocking the UI
      setTimeout(() => {
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

          // Fit map to activity bounds after a short delay
          setTimeout(fitBounds, 300);
        } finally {
          setProcessingData(false);
        }
      }, 10);
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
  }, [activities, startDate, fitBounds]);

  // Map style based on dark/light mode
  const mapStyle = isDarkMode
    ? "mapbox://styles/mapbox/dark-v11"
    : "mapbox://styles/mapbox/outdoors-v12";

  // Layer styles
  const lineLayer: LineLayerSpecification = {
    id: "journey-lines",
    type: "line",
    source: "journey-routes",
    paint: {
      "line-color": [
        "match",
        ["get", "type"],
        "Ride",
        isDarkMode ? "#ff6b6b" : "#e03131",
        isDarkMode ? "#ff9f40" : "#f2711c", // default color
      ],
      "line-width": 3,
      "line-opacity": 0.8,
    },
  };

  // Add a second "ghost" layer with larger, invisible clickable area
  const hitAreaLayer: LineLayerSpecification = {
    id: "journey-lines-hit-area",
    type: "line",
    source: "journey-routes",
    paint: {
      "line-color": "transparent",
      "line-width": 10,
    },
  };

  // Handle map click
  const handleMapClick = (event: any) => {
    // Get features at click point
    const features = event.features || [];
      
    if (features.length > 0) {
      // Find the activity that corresponds to the clicked feature
      const featureId = features[0].properties.id;
      const activity = activities.find((a) => a.id === featureId);
      console.log("Activity selected", activity);

      if (activity) {
        const activityId = activity.id?.toString() || "";

        // Try fetching from the cache
        const cachedData = cacheService.getItem(`cache:strava:activity:${activityId}`)

        if (cachedData) {
          setSelectedActivity(cachedData);
        } else {
          getDetailedActivity(activityId).then((detailedActivity) => {
            setSelectedActivity(detailedActivity);
          });
        }
        
        // Get coordinates for the popup - use the first point of the activity
        if (activity.start_latlng && activity.start_latlng.length === 2) {
          setPopupInfo({
            longitude: activity.start_latlng[1],
            latitude: activity.start_latlng[0],
            activity,
          });
        }
      }
    } else {
      // Clicked away from a feature
      setSelectedActivity(null);
      setPopupInfo(null);
    }
  };

  // Handle mouse move over map - this will update cursor based on features
  const handleMouseMove = useCallback((event: any) => {
    const features = event.features || [];
    setCursor(features.length > 0 ? 'pointer' : 'auto');
  }, []);

  // Button handler for fitting bounds
  const handleFitBounds = () => {
    fitBounds();
  };

  // Determine if we're in a loading state
  const showLoadingOverlay = isLoading || processingData;

  return (
    <section className="mb-16 md:mb-20">
      <h2 className="mb-4 text-4xl font-bold leading-tight tracking-tighter md:text-5xl">
        My Journey Map
      </h2>

      {/* Stats summary with loading states */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg bg-white p-3 shadow-sm dark:bg-slate-800">
          <h3 className="text-lg font-semibold">Total Distance</h3>
          {showLoadingOverlay ? (
            <div className="mt-1 h-8 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
          ) : (
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {formatDistance(stats.totalDistance, "km")}
            </p>
          )}
        </div>
        <div className="rounded-lg bg-white p-3 shadow-sm dark:bg-slate-800">
          <h3 className="text-lg font-semibold">Activities</h3>
          {showLoadingOverlay ? (
            <div className="mt-1 h-8 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
          ) : (
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {stats.totalActivities}
            </p>
          )}
        </div>
        <div className="rounded-lg bg-white p-3 shadow-sm dark:bg-slate-800">
          <h3 className="text-lg font-semibold">Total Elevation</h3>
          {showLoadingOverlay ? (
            <div className="mt-1 h-8 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
          ) : (
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {formatDistance(stats.totalElevationGain, undefined)}
            </p>
          )}
        </div>
      </div>

      {/* The map container - always rendered */}
      <div
        className="relative h-96 w-full overflow-hidden rounded-lg md:h-[600px]"
        id="journey-map"
      >
        {/* The actual map component */}
        <Map
          {...currentViewState}
          onMove={(evt: ViewStateChangeEvent) =>
            setCurrentViewState(evt.viewState)
          }
          mapStyle={mapStyle}
          mapboxAccessToken={import.meta.env.VITE_PUBLIC_MAPBOX_TOKEN}
          style={{ width: "100%", height: "100%" }}
          interactiveLayerIds={["journey-lines-hit-area"]}
          onClick={handleMapClick}
          onMouseMove={handleMouseMove}
          cursor={cursor}
        >
          <NavigationControl position="top-right" />

          {/* Custom control for fit bounds */}
          <div className="absolute left-2 top-2">
            <button
              onClick={handleFitBounds}
              className="rounded bg-white p-2 shadow dark:bg-slate-700"
              title="Fit map to journey"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5"
                />
              </svg>
            </button>
          </div>

          {/* Loading overlay */}
          {showLoadingOverlay && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 dark:bg-black/60">
              <div className="rounded-lg bg-white p-4 shadow-lg dark:bg-slate-800">
                <div className="flex items-center">
                  <svg
                    className="-ml-1 mr-3 h-5 w-5 animate-spin text-blue-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Loading journey data...</span>
                </div>
              </div>
            </div>
          )}

          {/* Render journey polylines if data is available */}
          {journeyData &&
            journeyData.features &&
            journeyData.features.length > 0 && (
              <Source id="journey-routes" type="geojson" data={journeyData}>
                <Layer {...lineLayer} />
                <Layer {...hitAreaLayer} />
              </Source>
            )}
          {/* Activity endpoint markers */}
          {activities && activities.length > 0 && 
            activities.map((activity) => {
              // Use end coordinates if available, otherwise use start coordinates
              const coords = activity.end_latlng || activity.start_latlng;
              if (!coords || coords.length !== 2) return null;

              const [lat, lng] = coords;
              console.log("Activity endpoint:", activity.name, lat, lng);
              
              return (
                <Marker
                  key={`endpoint-${activity.id}`}
                  longitude={lng}
                  latitude={lat}
                  anchor="bottom"
                >
                  <div
                    className={`h-1 w-1 rounded-full border shadow-sm cursor-pointer transition-transform hover:scale-150 bg-red-500 ${
                      isDarkMode === true 
                        ? 'border-black' 
                        : 'border-white'
                    }`}
                    onClick={() => {
                      // Trigger the same click handler as the polylines
                      const activityId = activity.id?.toString() || "";
                      const cachedData = cacheService.getItem(`cache:strava:activity:${activityId}`)

                      if (cachedData) {
                        setSelectedActivity(cachedData);
                      } else {
                        getDetailedActivity(activityId).then((detailedActivity) => {
                          setSelectedActivity(detailedActivity);
                        });
                      }
                      
                      setPopupInfo({
                        longitude: lng,
                        latitude: lat,
                        activity,
                      });
                    }}
                    title={`${activity.name} - ${activity.type}`}
                  />
                </Marker>
              );
            })
          }
        </Map>
      </div>

      {/* Selected activity details or click prompt */}
      {selectedActivity ? (
        <div className="mt-6 rounded-lg bg-white p-5 shadow-md dark:bg-slate-800">
          <h3 className="mb-2 text-xl font-bold">{selectedActivity.name}</h3>
          <h3 className="mb-2 text-m">{selectedActivity.description}</h3>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-5">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Date</p>
              <p>{formatDate(selectedActivity.start_date)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Distance
              </p>
              <p>{formatDistance(selectedActivity.distance, "km")}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Duration
              </p>
              <p>{formatTime(selectedActivity.elapsed_time)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Elevation Gain
              </p>
              <p>{selectedActivity.total_elevation_gain} m</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Activity Photos
              </p>
              <ActivityPhotos photoDetails={selectedActivity.photos} />
            </div>
          </div>
        </div>
      ) : (
        <div className="my-12 flex justify-center">
          <div className="animate-pulse text-lg text-gray-600 dark:text-gray-400">
            Click on any part of the route for more details...
          </div>
        </div>
      )}
    </section>
  );
}