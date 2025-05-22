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
import { getPlannedRoute } from "@/services/strava";
import { Route } from "@/api/strava/api";
import { decodePolyline } from "@/lib/polyline";
import { formatDistance, formatTime } from "@/lib/dates";

interface PlannedRouteMapProps {
  className?: string;
  useMockData?: boolean;
}

// Function to convert Strava Route to GeoJSON
const processStravaRoute = (route: Route) => {
  if (!route.map?.polyline) {
    throw new Error('Route does not contain polyline data');
  }

  try {
    // Decode the polyline to get coordinates
    const coordinates = decodePolyline(route.map.polyline);
    
    // Convert from [lat, lng] to [lng, lat] format for GeoJSON
    const geoJsonCoordinates = coordinates.map(([lat, lng]) => [lng, lat]);

    const geoJson = {
      type: "FeatureCollection" as const,
      features: [
        {
          type: "Feature" as const,
          properties: {
            id: route.id,
            name: route.name,
            description: route.description,
            distance: route.distance,
            elevation_gain: route.elevation_gain,
            estimated_moving_time: route.estimated_moving_time,
            route_type: "strava_planned_route"
          },
          geometry: {
            type: "LineString" as const,
            coordinates: geoJsonCoordinates
          }
        }
      ]
    };

    // Process waypoints if available
    const waypoints = route.waypoints?.map((waypoint, index) => ({
      name: waypoint.title || `Waypoint ${index + 1}`,
      coordinates: [waypoint.latlng || [0][1], waypoint.latlng ||[0][0]], // lng, lat
      description: waypoint.description,
      distance_into_route: waypoint.distance_into_route,
      categories: waypoint.categories || [],
    })) || [];

    return {
      geoJson,
      waypoints,
      stats: {
        name: route.name,
        totalDistance: route.distance,
        totalElevationGain: route.elevation_gain,
        estimatedTime: route.estimated_moving_time,
        description: route.description
      }
    };
  } catch (error) {
    console.error('Error processing Strava route:', error);
    throw error;
  }
};

// Mock data for fallback
const mockRouteData = {
  geoJson: {
    type: "FeatureCollection" as const,
    features: [
      {
        type: "Feature" as const,
        properties: {
          name: "Planned Route (Mock)",
          route_type: "mock_route"
        },
        geometry: {
          type: "LineString" as const,
          coordinates: [
            [1.25, 51.13], // Dover, UK
            [1.85, 50.95], // Calais, France
            [2.35, 48.86], // Paris, France
            [-0.58, 44.84], // Bordeaux, France
            [-2.17, 43.31], // San Sebastián, Spain
            [2.17, 41.38],  // Barcelona, Spain
            [-9.13, 38.71], // Lisbon, Portugal
          ]
        }
      }
    ]
  },
  waypoints: [
    { name: "Dover, UK", coordinates: [1.25, 51.13] },
    { name: "Paris, France", coordinates: [2.35, 48.86] },
    { name: "Barcelona, Spain", coordinates: [2.17, 41.38] },
    { name: "Lisbon, Portugal", coordinates: [-9.13, 38.71] },
  ],
  stats: {
    name: "Planned Route (Mock Data)",
    totalDistance: 5000000, // 5000km
    totalElevationGain: 50000, // 50km
    estimatedTime: 360000, // 100 hours
    description: "Mock planned route for testing"
  }
};

const PlannedRouteMap = ({ className, useMockData = false }: PlannedRouteMapProps) => {
  const [currentViewState, setCurrentViewState] = useState<ViewState>({
    longitude: 0,
    latitude: 45,
    zoom: 4,
    bearing: 0,
    pitch: 0,
    padding: { top: 40, bottom: 40, left: 40, right: 40 },
  });

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [routeData, setRouteData] = useState<any>(null);
  const [waypoints, setWaypoints] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [selectedWaypoint, setSelectedWaypoint] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Effect to handle dark mode
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    };

    checkDarkMode();

    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  // Load route data
  useEffect(() => {
    let mounted = true;

    async function loadRouteData() {
      if (useMockData) {
        if (mounted) {
          setRouteData(mockRouteData.geoJson);
          setWaypoints(mockRouteData.waypoints);
          setStats(mockRouteData.stats);
        }
        return;
      }

      if (mounted) {
        setLoading(true);
        setError(null);
      }

      try {
        console.log('Fetching planned route from Strava...');
        const route = await getPlannedRoute();
        console.log('Successfully fetched route:', route);
        
        const processedRoute = processStravaRoute(route);
        
        if (mounted) {
          setRouteData(processedRoute.geoJson);
          setWaypoints(processedRoute.waypoints);
          setStats(processedRoute.stats);
        }
      } catch (err) {
        console.error('Failed to load Strava route:', err);
        
        if (mounted) {
          setError('Failed to load route data from Strava');
          
          // Fallback to mock data
          console.log('Falling back to mock data');
          setRouteData(mockRouteData.geoJson);
          setWaypoints(mockRouteData.waypoints);
          setStats({
            ...mockRouteData.stats,
            name: "Planned Route (Fallback)"
          });
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadRouteData();

    return () => {
      mounted = false;
    };
  }, [useMockData]);

  // Calculate bounds and fit map to show the entire route
  const fitBounds = useCallback(() => {
    if (!routeData?.features?.length) return;

    const allCoords: number[][] = [];
    routeData.features.forEach((feature: any) => {
      if (feature.geometry.type === 'LineString') {
        allCoords.push(...feature.geometry.coordinates);
      }
    });

    if (allCoords.length === 0) return;

    const lngs = allCoords.map(coord => coord[0]);
    const lats = allCoords.map(coord => coord[1]);
    
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);

    const centerLng = (minLng + maxLng) / 2;
    const centerLat = (minLat + maxLat) / 2;

    const lngDiff = Math.abs(maxLng - minLng);
    const latDiff = Math.abs(maxLat - minLat);
    const maxDiff = Math.max(lngDiff, latDiff);

    let zoom = 1;
    if (maxDiff > 0) {
      zoom = Math.min(10, Math.max(2, Math.floor(8 - Math.log(maxDiff) / Math.log(2))));
    }

    setCurrentViewState(prev => ({
      ...prev,
      longitude: centerLng,
      latitude: centerLat,
      zoom: zoom,
    }));
  }, [routeData]);

  // Auto-fit bounds when route data changes
  useEffect(() => {
    if (routeData && !loading) {
      const timer = setTimeout(fitBounds, 300);
      return () => clearTimeout(timer);
    }
  }, [routeData, loading, fitBounds]);

  // Map style based on dark/light mode
  const mapStyle = isDarkMode
    ? "mapbox://styles/mapbox/dark-v11"
    : "mapbox://styles/mapbox/outdoors-v12";

  // Layer styles for the planned route
  const routeLayer: LineLayerSpecification = {
    id: "planned-route-lines",
    type: "line",
    source: "planned-route",
    paint: {
      "line-color": isDarkMode ? "#3b82f6" : "#2563eb", // Blue
      "line-width": 4,
      "line-opacity": 0.8,
    },
  };

  return (
    <div className={`relative ${className || ''}`}>
      {/* Stats display */}
      {stats && (
        <div className="mb-6 rounded-lg bg-white p-4 shadow-sm dark:bg-slate-800">
          <h3 className="text-lg font-semibold mb-2">{stats.name}</h3>
          {stats.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{stats.description}</p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Distance</p>
              <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                {formatDistance(stats.totalDistance, "km")}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Elevation Gain</p>
              <p className="text-xl font-bold text-green-600 dark:text-green-400">
                {Math.round(stats.totalElevationGain)} m
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Est. Time</p>
              <p className="text-xl font-bold text-purple-600 dark:text-purple-400">
                {formatTime(stats.estimatedTime)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error display */}
      {error && (
        <div className="mb-4 rounded-lg bg-yellow-50 border border-yellow-200 p-4 dark:bg-yellow-900/50 dark:border-yellow-800">
          <p className="text-yellow-800 dark:text-yellow-200">
            <strong>Note:</strong> {error}. Showing fallback route data.
          </p>
        </div>
      )}

      {/* Map container */}
      <div className="relative h-96 w-full overflow-hidden rounded-lg md:h-[600px]">
        {/* Loading overlay */}
        {loading && (
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
                <span>Loading planned route...</span>
              </div>
            </div>
          </div>
        )}

        <Map
          {...currentViewState}
          onMove={(evt: ViewStateChangeEvent) => setCurrentViewState(evt.viewState)}
          mapStyle={mapStyle}
          mapboxAccessToken={import.meta.env.VITE_PUBLIC_MAPBOX_TOKEN}
          style={{ width: "100%", height: "100%" }}
        >
          <NavigationControl position="top-right" />

          {/* Custom control for fit bounds */}
          <div className="absolute left-2 top-2">
            <button
              onClick={fitBounds}
              className="rounded bg-white p-2 shadow hover:bg-gray-100 dark:bg-slate-700 dark:hover:bg-slate-600"
              title="Fit map to planned route"
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

          {/* Render planned route */}
          {routeData && (
            <Source id="planned-route" type="geojson" data={routeData}>
              <Layer {...routeLayer} />
            </Source>
          )}

          {/* Waypoint markers */}
          {waypoints.map((waypoint, index) => (
            <Marker
              key={index}
              longitude={waypoint.coordinates[0]}
              latitude={waypoint.coordinates[1]}
              anchor="center"
            >
              <div
                className="h-3 w-3 cursor-pointer rounded-full border-2 border-white bg-red-500 hover:h-4 hover:w-4 transition-all"
                onClick={() => setSelectedWaypoint(waypoint)}
                title={waypoint.name}
              />
            </Marker>
          ))}
        </Map>
      </div>

      {/* Selected waypoint info */}
      {selectedWaypoint && (
        <div className="mt-4 rounded-lg bg-white p-4 shadow-md dark:bg-slate-800">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">{selectedWaypoint.name}</h3>
            <button
              onClick={() => setSelectedWaypoint(null)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          {selectedWaypoint.description && (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {selectedWaypoint.description}
            </p>
          )}
          {selectedWaypoint.distance_into_route && (
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
              {formatDistance(selectedWaypoint.distance_into_route, "km")} into route
            </p>
          )}
          {selectedWaypoint.categories && selectedWaypoint.categories.length > 0 && (
            <div className="mt-2">
              <p className="text-xs text-gray-500 dark:text-gray-500">Categories:</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {selectedWaypoint.categories.map((category: string, idx: number) => (
                  <span
                    key={idx}
                    className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PlannedRouteMap;