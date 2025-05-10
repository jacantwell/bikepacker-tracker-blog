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
import ActivityPhotos  from "./ActivityPhotos"
import { SummaryActivity, DetailedActivity } from "@/api/strava/api";
import { getDetailedActivity } from "@/services/strava"
import { processActivities, calculateBounds } from "@/lib/activity-processor";
import { formatDistance, formatTime } from "@/lib/dates";

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
  isLoading = false,
  isRefreshing = false,
  lastUpdated = null,
  onRefresh,
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

  // State for activity hover and selection
  const [selectedActivity, setSelectedActivity] =
    useState<DetailedActivity | null>(null);
  const [popupInfo, setPopupInfo] = useState<{
    longitude: number;
    latitude: number;
    activity: SummaryActivity;
  } | null>(null);

  // State for current location marker
  const [currentLocation, setCurrentLocation] = useState<{
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

  // Find most recent activity and set current location
  const findCurrentLocation = useCallback(() => {
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

          // Find current location marker
          findCurrentLocation();

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
  }, [activities, startDate, fitBounds, findCurrentLocation]);

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

  // Handle map click
  const handleMapClick = (event: any) => {
    // Get features at click point
    const features = event.features || [];

    if (features.length > 0) {
      // Find the activity that corresponds to the clicked feature
      const featureId = features[0].properties.id;
      const activity = activities.find((a) => a.id === featureId);
      console.log("Activity selected", activity)


      if (activity) {
        const activityId = activity.id?.toString() || "";
        getDetailedActivity(activityId).then((detailedActivity) => {
          console.log("Detailed activity:", detailedActivity);
          console.log("Photo info:", detailedActivity.photos);
          setSelectedActivity(detailedActivity);
        });

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

  // Callbacks for map interactions
  const onMouseEnter = useCallback(() => {
    // Change cursor to pointer when hovering over a feature
    const mapCanvas = document.querySelector(".mapboxgl-canvas-container");
    if (mapCanvas) {
      mapCanvas.classList.add("cursor-pointer");
    }
  }, []);

  const onMouseLeave = useCallback(() => {
    // Restore default cursor
    const mapCanvas = document.querySelector(".mapboxgl-canvas-container");
    if (mapCanvas) {
      mapCanvas.classList.remove("cursor-pointer");
    }
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
          interactiveLayerIds={["journey-lines"]}
          onClick={handleMapClick}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
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

          <div className="absolute right-2 top-2 flex space-x-2">
            {/* Refresh button */}
            <button
              onClick={onRefresh}
              disabled={isLoading || isRefreshing}
              className={`flex items-center rounded bg-white p-2 shadow dark:bg-slate-700 ${
                isLoading || isRefreshing
                  ? "cursor-not-allowed opacity-50"
                  : "hover:bg-gray-100 dark:hover:bg-slate-600"
              }`}
              title="Refresh journey data"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className={isRefreshing ? "animate-spin" : ""}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              {isRefreshing && (
                <span className="ml-2 text-xs">Refreshing...</span>
              )}
            </button>
          </div>

          {/* Current location marker */}
          {currentLocation && (
            <Marker
              longitude={currentLocation.longitude}
              latitude={currentLocation.latitude}
              anchor="center"
            >
              <div className="h-4 w-4 rounded-full border-2 border-white bg-red-500" />
            </Marker>
          )}

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
              </Source>
            )}
        </Map>
      </div>

      {/* Selected activity details */}
      {selectedActivity && (
        <div className="mt-6 rounded-lg bg-white p-5 shadow-md dark:bg-slate-800">
          <h3 className="mb-2 text-xl font-bold">{selectedActivity.name}</h3>
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
      )}
    </section>
  );
}
