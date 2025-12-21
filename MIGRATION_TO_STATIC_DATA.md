# Migration Guide: Strava API to Static Data

This guide explains how to migrate from live Strava API calls to static data.

## Overview

The website has been updated to use static, pre-scraped Strava data instead of making live API calls. This provides several benefits:
- Faster page loads (no API calls needed)
- No rate limiting concerns
- No authentication/token management
- Lower costs (no API usage)
- Works offline during development

## What Changed

### Removed
- Strava API client (`frontend/src/api/strava/client.ts` - kept but no longer used)
- OAuth token refresh flow
- Environment variables: `VITE_STRAVA_CLIENT_ID`, `VITE_STRAVA_CLIENT_SECRET`, `VITE_STRAVA_REFRESH_TOKEN`

### Added
- New static data loader service (`frontend/src/services/staticData.ts`)
- Static data directory structure (`frontend/public/strava_data/`)
- Photo URL configuration (`VITE_STRAVA_PHOTOS_BASE_URL`)

### Modified
- `frontend/src/services/strava.ts` - Now loads from static JSON files
- `frontend/src/components/journey/RouteMap.tsx` - Better error handling for missing data
- `.github/workflows/deploy_frontend.yml` - Updated environment variables

## Data Migration Steps

### 1. Place Your Scraped Data

Copy your scraped Strava data files into the `frontend/public/strava_data/` directory:

```bash
cp -r /path/to/your/strava_data/* frontend/public/strava_data/
```

### 2. Required Files

Ensure you have these files in `frontend/public/strava_data/`:

#### **activities_summary.json**
Array of all activity summaries:
```json
[
  {
    "id": 123456,
    "name": "Morning Ride",
    "type": "Ride",
    "sport_type": "Ride",
    "start_date": "2025-05-24T08:00:00Z",
    "start_date_local": "2025-05-24T09:00:00+01:00",
    "distance": 15000,
    "elapsed_time": 3600,
    "total_elevation_gain": 200,
    "start_latlng": [51.5, -0.1],
    "end_latlng": [51.6, -0.2],
    "map": {
      "summary_polyline": "encoded_polyline_string..."
    }
  }
]
```

#### **activities_detailed.json**
Object mapping activity IDs to detailed data:
```json
{
  "123456": {
    "id": 123456,
    "name": "Morning Ride",
    "description": "Great ride!",
    "distance": 15000,
    "moving_time": 3400,
    "elapsed_time": 3600,
    "total_elevation_gain": 200,
    "elev_high": 150,
    "elev_low": 50,
    "type": "Ride",
    "start_date": "2025-05-24T08:00:00Z",
    "start_latlng": [51.5, -0.1],
    "end_latlng": [51.6, -0.2],
    "map": {
      "summary_polyline": "encoded_polyline_string..."
    },
    "photo_count": 5,
    "achievement_count": 3,
    "kudos_count": 10
  }
}
```

#### **photos_all.json**
Object mapping activity IDs to photo arrays:
```json
{
  "123456": [
    {
      "unique_id": "photo_abc123",
      "activity_id": 123456,
      "activity_name": "Morning Ride",
      "urls": {
        "100": "123456/photo_100.jpg",
        "5000": "123456/photo_5000.jpg"
      },
      "sizes": {
        "100": [100, 75],
        "5000": [5000, 3750]
      },
      "uploaded_at": "2025-05-24T10:00:00Z",
      "type": 1
    }
  ]
}
```

**Important**: Photo URLs in `photos_all.json` should be relative paths that will be appended to `VITE_STRAVA_PHOTOS_BASE_URL`.

#### **planned_route.json**
Your planned route data:
```json
{
  "id": 3354080609481872430,
  "id_str": "3354080609481872430",
  "name": "My Bikepacking Route",
  "description": "Epic journey across...",
  "distance": 500000,
  "elevation_gain": 5000,
  "estimated_moving_time": 100000,
  "map": {
    "polyline": "encoded_polyline_string..."
  },
  "waypoints": [
    {
      "latlng": [51.5, -0.1],
      "title": "Start Point",
      "description": "Beginning of the journey",
      "distance_into_route": 0,
      "categories": ["start"]
    }
  ]
}
```

### 3. Configure Photo Storage

#### Option A: Local Photos (Development)
```bash
# .env.local
VITE_STRAVA_PHOTOS_BASE_URL=/strava_data/media
```

Place photos in `frontend/public/strava_data/media/`:
```
media/
├── 123456/
│   ├── photo_100.jpg
│   └── photo_5000.jpg
└── 789012/
    ├── photo_100.jpg
    └── photo_5000.jpg
```

#### Option B: S3 Photos (Production)
```bash
# GitHub Repository Variables
VITE_STRAVA_PHOTOS_BASE_URL=https://your-bucket.s3.amazonaws.com/strava-photos
```

Upload photos to S3:
```bash
aws s3 sync strava_data/media/ s3://your-bucket/strava-photos/ --recursive
```

Your photo URLs in `photos_all.json` should be relative:
```json
{
  "urls": {
    "100": "123456/photo_100.jpg",
    "5000": "123456/photo_5000.jpg"
  }
}
```

These will be resolved to:
- `https://your-bucket.s3.amazonaws.com/strava-photos/123456/photo_100.jpg`
- `https://your-bucket.s3.amazonaws.com/strava-photos/123456/photo_5000.jpg`

### 4. Update Environment Variables

#### Local Development
Create `frontend/.env.local`:
```bash
VITE_PUBLIC_MAPBOX_TOKEN=your_mapbox_token
VITE_STRAVA_PHOTOS_BASE_URL=/strava_data/media
VITE_JOURNEY_START_DATE=2025-05-24T00:00:00Z
```

#### GitHub Actions (Production)
Update repository settings:

**Variables** (Settings → Secrets and variables → Actions → Variables):
- `VITE_STRAVA_PHOTOS_BASE_URL`: Your S3 URL or CDN URL
- `VITE_JOURNEY_START_DATE`: Your journey start date

**Secrets**:
- Remove: `VITE_STRAVA_CLIENT_ID`, `VITE_STRAVA_CLIENT_SECRET`, `VITE_STRAVA_REFRESH_TOKEN`
- Keep: `VITE_PUBLIC_MAPBOX_TOKEN`

### 5. Test Locally

```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173` and verify:
- Activities load from static data
- Photos display correctly
- Planned route shows up
- No API errors in console

### 6. Deploy

```bash
git add .
git commit -m "Migrate from Strava API to static data"
git push origin main
```

## Updating Data

When your trip progresses and you want to update the data:

1. Re-run your Strava scraper to get latest data
2. Copy new JSON files to `frontend/public/strava_data/`
3. If using S3, upload new photos:
   ```bash
   aws s3 sync strava_data/media/ s3://your-bucket/strava-photos/ --recursive
   ```
4. Commit and push changes

## Troubleshooting

### Activities not loading
- Check browser console for errors
- Verify `activities_summary.json` exists and is valid JSON
- Check file permissions

### Photos not displaying
- Verify `VITE_STRAVA_PHOTOS_BASE_URL` is set correctly
- Check photo paths in `photos_all.json` are relative
- For S3: Ensure bucket has public read access or CloudFront is configured

### Route not showing
- Verify `planned_route.json` exists
- Check that polyline data is present in `map.polyline`

### Build failures
- Ensure all environment variables are set in GitHub repository settings
- Check that JSON files are valid (use `jq` or online JSON validator)

## Reverting to API Mode

If you need to revert to live API calls:

1. Restore environment variables: `VITE_STRAVA_CLIENT_ID`, `VITE_STRAVA_CLIENT_SECRET`, `VITE_STRAVA_REFRESH_TOKEN`
2. The API client code is still present, just not being used
3. You would need to restore the old `services/strava.ts` from git history

## Data Format Reference

The static data format matches Strava's API response structure. See [Strava API Documentation](https://developers.strava.com/docs/reference/) for field definitions.

## Notes

- The journey start date filter still works - activities before this date won't display
- Only "Ride" type activities are shown (configurable in `services/strava.ts`)
- Caching is still used in the browser to improve performance
- The old API client code remains in place but is no longer called
