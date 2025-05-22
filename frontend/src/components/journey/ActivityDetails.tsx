import { DetailedActivity } from "@/api/strava/api";
import { formatDistance, formatTime } from "@/lib/dates";
import ActivityPhotos from "./ActivityPhotos";

interface ActivityDetailsProps {
  activity: DetailedActivity | null;
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

export function ActivityDetails({ activity }: ActivityDetailsProps) {
  if (!activity) return null;

  return (
    <div className="mt-6 rounded-lg bg-white p-5 shadow-md dark:bg-slate-800">
      <h3 className="mb-2 text-xl font-bold">{activity.name}</h3>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-5">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Date</p>
          <p>{formatDate(activity.start_date)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Distance</p>
          <p>{formatDistance(activity.distance, "km")}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Duration</p>
          <p>{formatTime(activity.elapsed_time)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Elevation Gain
          </p>
          <p>{activity.total_elevation_gain} m</p>
        </div>
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Activity Photos
          </p>
          <ActivityPhotos photoDetails={activity.photos} />
        </div>
      </div>
    </div>
  );
}
