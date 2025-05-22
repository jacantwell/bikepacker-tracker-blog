// src/data/plannedRoutePost.ts

export interface PlannedRoutePost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  author: {
    id: string;
    name: string;
    picture: string;
  };
  coverImage: string;
  ogImage: {
    url: string;
  };
  tags: string[];
  content: string;
  contentAfterMap: string;
}

export const PLANNED_ROUTE_POST: PlannedRoutePost = {
  slug: 'planned-route',
  title: 'The Planned Route: Santander to Baku',
  date: '2023-02-01T10:00:00.000Z',
  excerpt: "An overview of my planned cycling route from the UK across Europe and beyond. See where this adventure is meant to take me over the coming months.",
  author: {
    id: 'jasper-williams',
    name: 'Jasper Williams',
    picture: '/assets/images/authors/jj.jpeg',
  },
  coverImage: '/assets/images/covers/cover2.jpeg',
  ogImage: {
    url: '/assets/images/covers/cover2.jpeg',
  },
  tags: ['planning', 'route', 'journey', 'cycling', 'europe'],
  content: `

## The Planned Route

After popular demmand I have created this post to share a rough outline of my planned route for the cycling adventure that lies ahead. I will be catching the ferry from Plymouth to Santander and the map below shows the route all the way from the Atlantic coast of Spain to the Caspian Sea in Azerbaijan. The actual journey may deviate significantly from this - and that's exactly the point. The plan is a guide, not a rigid schedule.

Below you can explore my planned route interactively.`,

  contentAfterMap: `

## Following the Journey

I'll be documenting the actual route as it unfolds, simply check out the globe on the homepage to see where I am.
`};