import React, { useCallback } from "react";
import Map, {
  Source,
  Layer,
  NavigationControl,
  Marker,
  ViewState,
  ViewStateChangeEvent,
  LineLayerSpecification,
} from "react-map-gl/mapbox";
import { SummaryActivity } from "@/api/strava/api";

interface MapContainerProps {
  viewState: ViewState;
  onViewStateChange: (evt: ViewStateChangeEvent) => void;
  mapStyle: string;
  journeyData: any;
  currentLocation: {
    longitude: number;
    latitude: number;
    activity: SummaryActivity;
  } | null;
  isDarkMode: boolean;
  onActivityClick: (activityId: string | null) => void;
  activities: SummaryActivity[];
  onFitBounds: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  isLoading?: boolean;
  children?: React.ReactNode;
}

export function MapContainer({
  viewState,
  onViewStateChange,
  mapStyle,
  journeyData,
  currentLocation,
  isDarkMode,
  onActivityClick,
  activities,
  onFitBounds,
  onRefresh,
  isRefreshing,
  isLoading,
  children,
}: MapContainerProps) {
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
  const handleMapClick = useCallback((event: any) => {
    // Get features at click point
    const features = event.features || [];

    if (features.length > 0 && features[0].properties) {
      // Find the activity that corresponds to the clicked feature
      const featureId = features[0].properties.id;
      if (featureId) {
        onActivityClick(featureId.toString());
      }
    } else {
      // Clicked away from a feature
      onActivityClick(null);
    }
  }, [onActivityClick]);

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

  return (
    <div
      className="relative h-96 w-full overflow-hidden rounded-lg md:h-[600px]"
      id="journey-map"
    >
      <Map
        {...viewState}
        onMove={onViewStateChange}
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
            onClick={onFitBounds}
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
          {onRefresh && (
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
          )}
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

        {/* Render journey polylines if data is available */}
        {journeyData &&
          journeyData.features &&
          journeyData.features.length > 0 && (
            <Source id="journey-routes" type="geojson" data={journeyData}>
              <Layer {...lineLayer} />
            </Source>
          )}

        {children}
      </Map>
    </div>
  );
}