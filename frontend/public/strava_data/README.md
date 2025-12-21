# Strava Static Data

Place your scraped Strava data files in this directory structure:

```
strava_data/
├── activities_summary.json      # List of all activities
├── activities_detailed.json     # Combined detailed data
├── activities/                  # Individual activity files (optional)
│   ├── 123456.json
│   └── ...
├── photos/                      # Photo metadata per activity
│   ├── 123456.json
│   └── ...
├── photos_all.json              # Combined photo metadata
├── routes/                      # Route data (if needed)
├── planned_route.json           # The planned route (ID: 3354080609481872430 or 3398297883408418150)
└── collection_summary.json      # Stats (optional)
```

## Required Files

1. **activities_summary.json** - Array of SummaryActivity objects
2. **activities_detailed.json** - Object mapping activity IDs to DetailedActivity objects
3. **photos_all.json** - Object mapping activity IDs to arrays of StravaPhoto objects
4. **planned_route.json** - Route object for the planned route

## Photo URL Configuration

Photo URLs can be configured via environment variable `VITE_STRAVA_PHOTOS_BASE_URL`.
This allows you to:
- Use local photos during development: `http://localhost:5173/strava_data/media`
- Use S3 photos in production: `https://your-bucket.s3.amazonaws.com/photos`

The photo metadata in `photos_all.json` should include relative paths that will be appended to this base URL.
