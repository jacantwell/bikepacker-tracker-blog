import { useState, useEffect, useCallback } from "react";
import { ViewState, ViewStateChangeEvent } from "react-map-gl/mapbox";
import { SummaryActivity } from "@/api/strava/api";

export function useMapControl() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentViewState, setCurrentViewState] = useState<ViewState>({
    longitude: 0,
    latitude: 30,
    zoom: 2,
    bearing: 0,
    pitch: 0,
    padding: { top: 40, bottom: 40, left: 40, right: 40 },
  });

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

  // Calculate appropriate zoom level
  const calculateZoom = useCallback((lngDiff: number, latDiff: number) => {
    const maxDiff = Math.max(lngDiff, latDiff);
    
    // Logarithmic scale for zoom - adjust constants as needed
    let zoom = 1;
    if (maxDiff > 0) {
      zoom = Math.min(
        15,
        Math.max(1, Math.floor(8 - Math.log(maxDiff) / Math.log(2))),
      );
    }
    
    return zoom;
  }, []);

  // Auto fit bounds when map data changes
  const fitBounds = useCallback((bounds: number[] | null) => {
    if (!bounds) return;

    // Get map element to calculate the right padding
    const mapContainer = document.getElementById("journey-map");
    if (!mapContainer) return;

    // Extract bounds
    const [minLng, minLat, maxLng, maxLat] = bounds;

    // Calculate the center
    const centerLng = (minLng + maxLng) / 2;
    const centerLat = (minLat + maxLat) / 2;

    // Calculate appropriate zoom level
    const lngDiff = Math.abs(maxLng - minLng);
    const latDiff = Math.abs(maxLat - minLat);
    const zoom = calculateZoom(lngDiff, latDiff);

    // Update the view state
    setCurrentViewState((prev) => ({
      ...prev,
      longitude: centerLng,
      latitude: centerLat,
      zoom: zoom,
    }));
  }, [calculateZoom]);

  // Handle view state change
  const handleViewStateChange = useCallback((evt: ViewStateChangeEvent) => {
    setCurrentViewState(evt.viewState);
  }, []);

  // Map style based on dark/light mode
  const mapStyle = isDarkMode
    ? "mapbox://styles/mapbox/dark-v11"
    : "mapbox://styles/mapbox/outdoors-v12";

  return {
    currentViewState,
    isDarkMode,
    mapStyle,
    fitBounds,
    handleViewStateChange,
  };
}
