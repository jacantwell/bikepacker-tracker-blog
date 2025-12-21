# Code Cleanup Summary

## Files Deleted (~18KB of dead code)

### Strava API Client
- **frontend/src/api/strava/client.ts** (5.5KB)
  - Strava OAuth client with token refresh
  - No longer needed - we use static data

### OpenAPI Generated Boilerplate
- **frontend/src/api/strava/base.ts** (2.4KB)
  - Base class for API methods
  - Only used by generated API code

- **frontend/src/api/strava/common.ts** (5.3KB)
  - Common utilities for OpenAPI client
  - Only used by generated API code

- **frontend/src/api/strava/configuration.ts** (4.1KB)
  - Configuration class for API client
  - Only used by generated API code

### Type Definitions
- **frontend/src/types/StravaTypes.tsx** (<1KB)
  - Duplicate type definitions
  - Replaced by types from `@/api/strava/api`

### Configuration
- **frontend/openapitools.json** (<1KB)
  - OpenAPI generator configuration
  - No longer regenerating API client code

### Cache Service
- **frontend/src/services/cache.ts** (2.4KB)
  - localStorage caching service
  - Browser HTTP cache is sufficient for static files

## Files Updated

### frontend/src/services/mocks.ts
- **Before**: `import { SummaryActivity } from '../types/StravaTypes'`
- **After**: `import { SummaryActivity } from '../api/strava/api'`
- Uses canonical type definitions

### frontend/src/components/journey/JourneyMap.tsx
- Removed `cacheService` import
- Removed manual localStorage caching logic
- Simplified activity loading - browser HTTP cache handles it

## Files Kept (Still Needed)

### Type Definitions
- **frontend/src/api/strava/api.ts** (260KB, 6,882 lines)
  - Kept for type definitions only
  - Provides: `SummaryActivity`, `DetailedActivity`, `Route`, `StravaPhoto`
  - API method implementations are tree-shaken from bundle

- **frontend/src/api/strava/index.ts**
  - Export barrel for API types
  - Still needed

### Service Layer
- **frontend/src/services/strava.ts** (3.1KB)
  - Public API that components import
  - Facade over staticData service
  - Kept for backward compatibility

- **frontend/src/services/staticData.ts** (3.8KB)
  - Implementation layer for loading JSON files
  - Core functionality

- **frontend/src/services/mocks.ts** (6.5KB)
  - Fallback mock data
  - Still used by posts service

## Benefits

1. **Code reduction**: ~18KB of unused code removed
2. **Simpler architecture**: No localStorage caching layer
3. **Fewer dependencies**: No cacheService dependency
4. **Cleaner imports**: Single source of truth for types
5. **Better performance**: Browser HTTP cache is more efficient

## Bundle Impact

- **Development**: Faster dev server startup (fewer files to process)
- **Production**: Minimal impact - tree-shaking already removed unused API methods
- **Maintenance**: Less code to maintain and understand
