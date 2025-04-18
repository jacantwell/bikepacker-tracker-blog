import { PostSummary } from '../types/Post';
import { SummaryActivity } from '../types/StravaTypes';

// Mock blog posts
export const mockPosts: PostSummary[] = [
  {
    slug: 'dynamic-routing',
    title: 'Dynamic Routing and Static Generation',
    date: '2020-03-16T05:35:07.322Z',
    coverImage: '/assets/blog/dynamic-routing/cover.jpg',
    excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Praesent elementum facilisis leo vel fringilla est ullamcorper eget.',
    author: {
      name: 'JJ Kasper',
      picture: '/assets/blog/authors/jj.jpeg',
    },
    ogImage: {
      url: '/assets/blog/dynamic-routing/cover.jpg',
    },
  },
  {
    slug: 'hello-world',
    title: 'Learn How to Pre-render Pages Using Static Generation with Next.js',
    date: '2020-03-16T05:35:07.322Z',
    coverImage: '/assets/blog/hello-world/cover.jpg',
    excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Praesent elementum facilisis leo vel fringilla est ullamcorper eget.',
    author: {
      name: 'Tim Neutkens',
      picture: '/assets/blog/authors/tim.jpeg',
    },
    ogImage: {
      url: '/assets/blog/hello-world/cover.jpg',
    },
  },
  {
    slug: 'preview',
    title: 'Preview Mode for Static Generation',
    date: '2020-03-16T05:35:07.322Z',
    coverImage: '/assets/blog/preview/cover.jpg',
    excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Praesent elementum facilisis leo vel fringilla est ullamcorper eget.',
    author: {
      name: 'Joe Haddad',
      picture: '/assets/blog/authors/joe.jpeg',
    },
    ogImage: {
      url: '/assets/blog/preview/cover.jpg',
    },
  },
];

// Mock full post content
export const mockPostContent = `
## Lorem Ipsum

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Praesent elementum facilisis leo vel fringilla est ullamcorper eget. At imperdiet dui accumsan sit amet nulla facilities morbi tempus. Praesent elementum facilisis leo vel fringilla. Congue mauris rhoncus aenean vel. Egestas sed tempus urna et pharetra pharetra massa massa ultricies.

Venenatis cras sed felis eget velit. Consectetur libero id faucibus nisl tincidunt. Gravida in fermentum et sollicitudin ac orci phasellus egestas tellus. Volutpat consequat mauris nunc congue nisi vitae. Id aliquet risus feugiat in ante metus dictum at tempor. Sed blandit libero volutpat sed cras. Sed odio morbi quis commodo odio aenean sed adipiscing. Velit euismod in pellentesque massa placerat. Mi bibendum neque egestas congue quisque egestas diam in arcu. Nisi lacus sed viverra tellus in. Nibh cras pulvinar mattis nunc sed. Luctus accumsan tortor posuere ac ut consequat semper viverra. Fringilla ut morbi tincidunt augue interdum velit euismod.

## Tristique Senectus

Tristique senectus et netus et malesuada fames ac turpis. Ridiculous mus mauris vitae ultricies leo integer malesuada nunc vel. In mollis nunc sed id semper. Egestas tellus rutrum tellus pellentesque. Phasellus vestibulum lorem sed risus ultricies tristique nulla. Quis blandit turpis cursus in hac habitasse platea dictumst quisque. Eros donec ac odio tempor orci dapibus ultrices. Aliquam sem et tortor consequat id porta nibh. Adipiscing elit duis tristique sollicitudin nibh sit amet commodo nulla. Diam vulputate ut pharetra sit amet. Ut tellus elementum sagittis vitae et leo. Arcu non odio euismod lacinia at quis risus sed vulputate.
`;

// Mock Strava activities
export const mockActivities: SummaryActivity[] = [
  {
    id: 1,
    name: 'Morning Ride in London',
    type: 'Ride',
    sport_type: 'Ride',
    start_date: '2025-01-05T08:00:00Z',
    start_date_local: '2025-01-05T09:00:00Z',
    distance: 15000, // 15km
    elapsed_time: 3600, // 1 hour
    total_elevation_gain: 120,
    start_latlng: [51.5074, -0.1278], // London
    end_latlng: [51.5074, -0.1278],
    map: {
      summary_polyline: 'mock_polyline_data'
    }
  },
  {
    id: 2,
    name: 'Evening Ride to Paris',
    type: 'Ride',
    sport_type: 'Ride',
    start_date: '2025-01-10T16:00:00Z',
    start_date_local: '2025-01-10T17:00:00Z',
    distance: 25000, // 25km
    elapsed_time: 5400, // 1.5 hours
    total_elevation_gain: 250,
    start_latlng: [48.8566, 2.3522], // Paris
    end_latlng: [48.8566, 2.3522],
    map: {
      summary_polyline: 'mock_polyline_data'
    }
  },
  {
    id: 3,
    name: 'Weekend Ride to Rome',
    type: 'Ride',
    sport_type: 'Ride',
    start_date: '2025-01-15T10:00:00Z',
    start_date_local: '2025-01-15T11:00:00Z',
    distance: 30000, // 30km
    elapsed_time: 7200, // 2 hours
    total_elevation_gain: 450,
    start_latlng: [41.9028, 12.4964], // Rome
    end_latlng: [41.9028, 12.4964],
    map: {
      summary_polyline: 'mock_polyline_data'
    }
  }
];