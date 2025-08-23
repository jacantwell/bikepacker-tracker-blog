import { useState, useEffect } from "react";
import { SummaryActivity } from "@/api/strava/api";
import { formatDistance } from "@/lib/dates";

interface JourneyStatsProps {
    activities: SummaryActivity[];
    startDate: string;
    isLoading?: boolean;
}

function getDaysSinceStart(startDate: string): number {
    const start = new Date(startDate);
    const now = new Date();
    // Calculate difference in ms and convert to days
    const diffTime = now.getTime() - start.getTime();
    return Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
}

export function JourneyStats({
    activities = [],
    startDate,
    isLoading = false
}: JourneyStatsProps) {

    // Stats
    const [stats, setStats] = useState({
        totalDistance: 0,
        totalElevationGain: 0,
        totalActivities: 0,
        activityTypes: {} as Record<string, number>,
    });

    // Process activities and calculate stats
    useEffect(() => {
        if (activities && activities.length) {
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

        } else {
            // Reset data if no activities
            setStats({
                totalDistance: 0,
                totalElevationGain: 0,
                totalActivities: 0,
                activityTypes: {},
            });
        }
    }, [activities, startDate]);

    return (
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-lg bg-white p-3 shadow-sm dark:bg-slate-800">
                <h3 className="text-lg font-semibold">Total Days</h3>
                {isLoading ? (
                    <div className="mt-1 h-8 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                ) : (
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {getDaysSinceStart(startDate)}
                    </p>
                )}
            </div>
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