import { useEffect, useCallback } from "react";
import { SummaryActivity } from "@/api/strava/api";
import { useActivitiesProcessor } from "../../hooks/useActivitiesProcessor";
import { useMapControl } from "../../hooks/useMapControl";
import { useActivitySelection } from "../../hooks/useActivitySelection";
import { ActivityStats } from "./ActivityStats";
import { ActivityDetails } from "./ActivityDetails";
import { LoadingOverlay } from "./LoadingOverlay";
import { MapContainer } from "./MapContainer";

interface JourneyMapProps {
  activities: SummaryActivity[];
  startDate: string;
  isLoading?: boolean;
  isRefreshing?: boolean;
  lastUpdated?: Date | null;
  onRefresh?: () => void;
}

export function JourneyMap({
  activities = [],
  startDate,
  isLoading = false,
  isRefreshing = false,
  lastUpdated = null,
  onRefresh,
}: JourneyMapProps) {
  // Use custom hooks to handle different aspects of functionality
  const {
    journeyData,
    processingData,
    stats,
    currentLocation,
    getBounds,
  } = useActivitiesProcessor(activities, startDate);

  const {
    currentViewState,
    isDarkMode,
    mapStyle,
    fitBounds,
    handleViewStateChange,
  } = useMapControl();

  const {
    selectedActivity,
    popupInfo,
    handleActivitySelect,
  } = useActivitySelection(activities);

  // Set initial bounds when data is loaded
  useEffect(() => {
    const bounds = getBounds();
    if (bounds && journeyData && !isLoading && !processingData) {
      setTimeout(() => {
        fitBounds(bounds);
      }, 300); // Short delay to ensure map is fully mounted
    }
  }, [journeyData, isLoading, processingData, getBounds, fitBounds]);

  // Button handler for fitting bounds
  const handleFitBounds = useCallback(() => {
    const bounds = getBounds();
    if (bounds) {
      fitBounds(bounds);
    }
  }, [getBounds, fitBounds]);

  // Determine if we're in a loading state
  const showLoadingOverlay = isLoading || processingData;

  return (
    <section className="mb-16 md:mb-20">
      <h2 className="mb-4 text-4xl font-bold leading-tight tracking-tighter md:text-5xl">
        My Journey Map
      </h2>

      {/* Stats summary with loading states */}
      <ActivityStats
        stats={stats}
        isLoading={showLoadingOverlay}
      />

      {/* Map container */}
      <MapContainer
        viewState={currentViewState}
        onViewStateChange={handleViewStateChange}
        mapStyle={mapStyle}
        journeyData={journeyData}
        currentLocation={currentLocation}
        isDarkMode={isDarkMode}
        onActivityClick={handleActivitySelect}
        activities={activities}
        onFitBounds={handleFitBounds}
        onRefresh={onRefresh}
        isRefreshing={isRefreshing}
        isLoading={isLoading}
      >
        <LoadingOverlay isVisible={showLoadingOverlay} />
      </MapContainer>

      {/* Selected activity details */}
      <ActivityDetails activity={selectedActivity} />
    </section>
  );
}