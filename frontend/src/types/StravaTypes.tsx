// Simplified Strava types for the frontend
export interface SummaryActivity {
  id?: number;
  name?: string;
  type?: string;
  start_date?: string;
  start_date_local?: string;
  distance?: number;
  elapsed_time?: number;
  total_elevation_gain?: number;
  start_latlng?: number[];
  end_latlng?: number[];
  map?: {
    summary_polyline?: string;
  };
  sport_type?: string;
}

/**
 * An enumeration of the types an activity may have. Note that this enumeration does not include new sport types (e.g. MountainBikeRide, EMountainBikeRide), activities with these sport types will have the corresponding activity type (e.g. Ride for MountainBikeRide, EBikeRide for EMountainBikeRide)
 * @export
 * @enum {string}
 */

export const ActivityType = {
    AlpineSki: 'AlpineSki',
    BackcountrySki: 'BackcountrySki',
    Canoeing: 'Canoeing',
    Crossfit: 'Crossfit',
    EBikeRide: 'EBikeRide',
    Elliptical: 'Elliptical',
    Golf: 'Golf',
    Handcycle: 'Handcycle',
    Hike: 'Hike',
    IceSkate: 'IceSkate',
    InlineSkate: 'InlineSkate',
    Kayaking: 'Kayaking',
    Kitesurf: 'Kitesurf',
    NordicSki: 'NordicSki',
    Ride: 'Ride',
    RockClimbing: 'RockClimbing',
    RollerSki: 'RollerSki',
    Rowing: 'Rowing',
    Run: 'Run',
    Sail: 'Sail',
    Skateboard: 'Skateboard',
    Snowboard: 'Snowboard',
    Snowshoe: 'Snowshoe',
    Soccer: 'Soccer',
    StairStepper: 'StairStepper',
    StandUpPaddling: 'StandUpPaddling',
    Surfing: 'Surfing',
    Swim: 'Swim',
    Velomobile: 'Velomobile',
    VirtualRide: 'VirtualRide',
    VirtualRun: 'VirtualRun',
    Walk: 'Walk',
    WeightTraining: 'WeightTraining',
    Wheelchair: 'Wheelchair',
    Windsurf: 'Windsurf',
    Workout: 'Workout',
    Yoga: 'Yoga'
} as const;

export type ActivityType = typeof ActivityType[keyof typeof ActivityType];

/**
 * An enumeration of the sport types an activity may have. Distinct from ActivityType in that it has new types (e.g. MountainBikeRide)
 * @export
 * @enum {string}
 */

export const SportType = {
    AlpineSki: 'AlpineSki',
    BackcountrySki: 'BackcountrySki',
    Badminton: 'Badminton',
    Canoeing: 'Canoeing',
    Crossfit: 'Crossfit',
    EBikeRide: 'EBikeRide',
    Elliptical: 'Elliptical',
    EMountainBikeRide: 'EMountainBikeRide',
    Golf: 'Golf',
    GravelRide: 'GravelRide',
    Handcycle: 'Handcycle',
    HighIntensityIntervalTraining: 'HighIntensityIntervalTraining',
    Hike: 'Hike',
    IceSkate: 'IceSkate',
    InlineSkate: 'InlineSkate',
    Kayaking: 'Kayaking',
    Kitesurf: 'Kitesurf',
    MountainBikeRide: 'MountainBikeRide',
    NordicSki: 'NordicSki',
    Pickleball: 'Pickleball',
    Pilates: 'Pilates',
    Racquetball: 'Racquetball',
    Ride: 'Ride',
    RockClimbing: 'RockClimbing',
    RollerSki: 'RollerSki',
    Rowing: 'Rowing',
    Run: 'Run',
    Sail: 'Sail',
    Skateboard: 'Skateboard',
    Snowboard: 'Snowboard',
    Snowshoe: 'Snowshoe',
    Soccer: 'Soccer',
    Squash: 'Squash',
    StairStepper: 'StairStepper',
    StandUpPaddling: 'StandUpPaddling',
    Surfing: 'Surfing',
    Swim: 'Swim',
    TableTennis: 'TableTennis',
    Tennis: 'Tennis',
    TrailRun: 'TrailRun',
    Velomobile: 'Velomobile',
    VirtualRide: 'VirtualRide',
    VirtualRow: 'VirtualRow',
    VirtualRun: 'VirtualRun',
    Walk: 'Walk',
    WeightTraining: 'WeightTraining',
    Wheelchair: 'Wheelchair',
    Windsurf: 'Windsurf',
    Workout: 'Workout',
    Yoga: 'Yoga'
} as const;

export type SportType = typeof SportType[keyof typeof SportType];

/**
 * 
 * @export
 * @interface PhotosSummary
 */
export interface PhotosSummary {
    /**
     * The number of photos
     * @type {number}
     * @memberof PhotosSummary
     */
    'count'?: number;
    /**
     * 
     * @type {PhotosSummaryPrimary}
     * @memberof PhotosSummary
     */
    'primary'?: PhotosSummaryPrimary;
}
/**
 * 
 * @export
 * @interface PhotosSummaryPrimary
 */
export interface PhotosSummaryPrimary {
    /**
     * 
     * @type {number}
     * @memberof PhotosSummaryPrimary
     */
    'id'?: number;
    /**
     * 
     * @type {number}
     * @memberof PhotosSummaryPrimary
     */
    'source'?: number;
    /**
     * 
     * @type {string}
     * @memberof PhotosSummaryPrimary
     */
    'unique_id'?: string;
    /**
     * 
     * @type {{ [key: string]: string; }}
     * @memberof PhotosSummaryPrimary
     */
    'urls'?: { [key: string]: string; };
}

/**
 * 
 * @export
 * @interface PolylineMap
 */
export interface PolylineMap {
    /**
     * The identifier of the map
     * @type {string}
     * @memberof PolylineMap
     */
    'id'?: string;
    /**
     * The polyline of the map, only returned on detailed representation of an object
     * @type {string}
     * @memberof PolylineMap
     */
    'polyline'?: string;
    /**
     * The summary polyline of the map
     * @type {string}
     * @memberof PolylineMap
     */
    'summary_polyline'?: string;
}

/**
 *
 * @export
 * @interface MetaAthlete
 */
export interface MetaAthlete {
  /**
   * The unique identifier of the athlete
   * @type {number}
   * @memberof MetaAthlete
   */
  id?: number;
}

/**
 *
 * @export
 * @interface DetailedActivity
 */
export interface DetailedActivity {
  /**
   * The unique identifier of the activity
   * @type {number}
   * @memberof DetailedActivity
   */
  id?: number;
  /**
   * The identifier provided at upload time
   * @type {string}
   * @memberof DetailedActivity
   */
  external_id?: string;
  /**
   * The identifier of the upload that resulted in this activity
   * @type {number}
   * @memberof DetailedActivity
   */
  upload_id?: number;
  /**
   *
   * @type {MetaAthlete}
   * @memberof DetailedActivity
   */
  athlete?: MetaAthlete;
  /**
   * The name of the activity
   * @type {string}
   * @memberof DetailedActivity
   */
  name?: string;
  /**
   * The activity\'s distance, in meters
   * @type {number}
   * @memberof DetailedActivity
   */
  distance?: number;
  /**
   * The activity\'s moving time, in seconds
   * @type {number}
   * @memberof DetailedActivity
   */
  moving_time?: number;
  /**
   * The activity\'s elapsed time, in seconds
   * @type {number}
   * @memberof DetailedActivity
   */
  elapsed_time?: number;
  /**
   * The activity\'s total elevation gain.
   * @type {number}
   * @memberof DetailedActivity
   */
  total_elevation_gain?: number;
  /**
   * The activity\'s highest elevation, in meters
   * @type {number}
   * @memberof DetailedActivity
   */
  elev_high?: number;
  /**
   * The activity\'s lowest elevation, in meters
   * @type {number}
   * @memberof DetailedActivity
   */
  elev_low?: number;
  /**
   *
   * @type {ActivityType}
   * @memberof DetailedActivity
   */
  type?: ActivityType;
  /**
   *
   * @type {SportType}
   * @memberof DetailedActivity
   */
  sport_type?: SportType;
  /**
   * The time at which the activity was started.
   * @type {string}
   * @memberof DetailedActivity
   */
  start_date?: string;
  /**
   * The time at which the activity was started in the local timezone.
   * @type {string}
   * @memberof DetailedActivity
   */
  start_date_local?: string;
  /**
   * The timezone of the activity
   * @type {string}
   * @memberof DetailedActivity
   */
  timezone?: string;
  /**
   * A pair of latitude/longitude coordinates, represented as an array of 2 floating point numbers.
   * @type {Array<number>}
   * @memberof DetailedActivity
   */
  start_latlng?: Array<number>;
  /**
   * A pair of latitude/longitude coordinates, represented as an array of 2 floating point numbers.
   * @type {Array<number>}
   * @memberof DetailedActivity
   */
  end_latlng?: Array<number>;
  /**
   * The number of achievements gained during this activity
   * @type {number}
   * @memberof DetailedActivity
   */
  achievement_count?: number;
  /**
   * The number of kudos given for this activity
   * @type {number}
   * @memberof DetailedActivity
   */
  kudos_count?: number;
  /**
   * The number of comments for this activity
   * @type {number}
   * @memberof DetailedActivity
   */
  comment_count?: number;
  /**
   * The number of athletes for taking part in a group activity
   * @type {number}
   * @memberof DetailedActivity
   */
  athlete_count?: number;
  /**
   * The number of Instagram photos for this activity
   * @type {number}
   * @memberof DetailedActivity
   */
  photo_count?: number;
  /**
   * The number of Instagram and Strava photos for this activity
   * @type {number}
   * @memberof DetailedActivity
   */
  total_photo_count?: number;
  /**
   *
   * @type {PolylineMap}
   * @memberof DetailedActivity
   */
  map?: PolylineMap;
  /**
   * Whether this activity was recorded on a training machine
   * @type {boolean}
   * @memberof DetailedActivity
   */
  trainer?: boolean;
  /**
   * Whether this activity is a commute
   * @type {boolean}
   * @memberof DetailedActivity
   */
  commute?: boolean;
  /**
   * Whether this activity was created manually
   * @type {boolean}
   * @memberof DetailedActivity
   */
  manual?: boolean;
  /**
   * Whether this activity is private
   * @type {boolean}
   * @memberof DetailedActivity
   */
  private?: boolean;
  /**
   * Whether this activity is flagged
   * @type {boolean}
   * @memberof DetailedActivity
   */
  flagged?: boolean;
  /**
   * The activity\'s workout type
   * @type {number}
   * @memberof DetailedActivity
   */
  workout_type?: number;
  /**
   * The unique identifier of the upload in string format
   * @type {string}
   * @memberof DetailedActivity
   */
  upload_id_str?: string;
  /**
   * The activity\'s average speed, in meters per second
   * @type {number}
   * @memberof DetailedActivity
   */
  average_speed?: number;
  /**
   * The activity\'s max speed, in meters per second
   * @type {number}
   * @memberof DetailedActivity
   */
  max_speed?: number;
  /**
   * Whether the logged-in athlete has kudoed this activity
   * @type {boolean}
   * @memberof DetailedActivity
   */
  has_kudoed?: boolean;
  /**
   * Whether the activity is muted
   * @type {boolean}
   * @memberof DetailedActivity
   */
  hide_from_home?: boolean;
  /**
   * The id of the gear for the activity
   * @type {string}
   * @memberof DetailedActivity
   */
  gear_id?: string;
  /**
   * The total work done in kilojoules during this activity. Rides only
   * @type {number}
   * @memberof DetailedActivity
   */
  kilojoules?: number;
  /**
   * Average power output in watts during this activity. Rides only
   * @type {number}
   * @memberof DetailedActivity
   */
  average_watts?: number;
  /**
   * Whether the watts are from a power meter, false if estimated
   * @type {boolean}
   * @memberof DetailedActivity
   */
  device_watts?: boolean;
  /**
   * Rides with power meter data only
   * @type {number}
   * @memberof DetailedActivity
   */
  max_watts?: number;
  /**
   * Similar to Normalized Power. Rides with power meter data only
   * @type {number}
   * @memberof DetailedActivity
   */
  weighted_average_watts?: number;
  /**
   * The description of the activity
   * @type {string}
   * @memberof DetailedActivity
   */
  description?: string;
  /**
   *
   * @type {PhotosSummary}
   * @memberof DetailedActivity
   */
  photos?: PhotosSummary;
  /**
   *
   * @type {SummaryGear}
   * @memberof DetailedActivity
   */
  calories?: number;
  /**
   *
   * @type {Array<DetailedSegmentEffort>}
   * @memberof DetailedActivity
   */
  device_name?: string;
  /**
   * The token used to embed a Strava activity
   * @type {string}
   * @memberof DetailedActivity
   */
  embed_token?: string;
  /**
   * The splits of this activity in metric units (for runs)
   * @type {Array<Split>}
   * @memberof DetailedActivity
   */
}
