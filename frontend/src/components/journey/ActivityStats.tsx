import { formatDistance } from "@/lib/dates";

interface ActivityStatsProps {
  stats: {
    totalDistance: number;
    totalElevationGain: number;
    totalActivities: number;
    activityTypes: Record<string, number>;
  };
  isLoading: boolean;
}

export function ActivityStats({ stats, isLoading }: ActivityStatsProps) {
  return (
    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div className="rounded-lg bg-white p-3 shadow-sm dark:bg-slate-800">
        <h3 className="text-lg font-semibold">Total Distance</h3>
        {isLoading ? (
          <div className="mt-1 h-8 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
        ) : (
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {formatDistance(stats.totalDistance, "km")}
          </p>
        )}
      </div>
      <div className="rounded-lg bg-white p-3 shadow-sm dark:bg-slate-800">
        <h3 className="text-lg font-semibold">Activities</h3>
        {isLoading ? (
          <div className="mt-1 h-8 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
        ) : (
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {stats.totalActivities}
          </p>
        )}
      </div>
      <div className="rounded-lg bg-white p-3 shadow-sm dark:bg-slate-800">
        <h3 className="text-lg font-semibold">Total Elevation</h3>
        {isLoading ? (
          <div className="mt-1 h-8 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
        ) : (
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {formatDistance(stats.totalElevationGain, undefined)}
          </p>
        )}
      </div>
    </div>
  );
}