// Simplified Strava types for the frontend
export interface SummaryActivity {
    id?: number
    name?: string
    type?: string
    start_date?: string
    start_date_local?: string
    distance?: number
    elapsed_time?: number
    total_elevation_gain?: number
    start_latlng?: number[]
    end_latlng?: number[]
    map?: {
      summary_polyline?: string
    }
    sport_type?: string
  }