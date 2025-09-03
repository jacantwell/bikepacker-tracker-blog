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
  title: 'The Planned Route (part 2): Aktau to Dhaka',
  date: '2023-02-01T10:00:00.000Z',
  excerpt: "An overview of my planned cycling route from the UK across Europe and beyond. See where this adventure is meant to take me over the coming months.",
  author: {
    id: 'jasper-cantwell',
    name: 'Jasper Cantwell',
    picture: '/assets/images/authors/jj.jpeg',
  },
  coverImage: '/assets/images/covers/cover2.jpeg',
  ogImage: {
    url: '/assets/images/covers/cover2.jpeg',
  },
  tags: ['planning', 'route', 'journey', 'cycling', 'europe'],
  content: `

## The Planned Route

As I get to the end of the first leg of this trip, I thought I’d update this page with my planned route for the next stages. Georgia has ended up being the final stop on my continuous line. With Russia to the north and Iran to the south, the options are limited and pricey. The boat across the Caspian Sea isn’t no longer a possibility either since the Azerbaijan border has stayed closed since Covid. So the only option left is to fly from Tbilisi to Aktau in Kazakhstan.

From Aktau I’ll ride across the desert to the Uzbek border, but here things get tricky again. The land crossing has been shut for a few years, so the only way through is the overnight train from Beyneu to Nukus. It’s a ~12 hour ride and luckily I can take my bike with me. From Nukus I’ll head south east towards Bukhara and Samarkand before crossing into Tajikistan. Hopefully I can pick up my Indian visa there which I’ll need to get in from Pakistan.

If all goes to plan the next step is Afghanistan. I’ll probably end up changing the route here, either going north to the Wakhan Corridor or further south towards Kandahar. From Afghanistan I’ll head into Pakistan, ride to Lahore, then continue on into India. The final leg will take me across India to Dhaka in Bangladesh. From there I’ll get a flight to somewhere new, most likely decided by how much money I have left!

Below you can explore my planned route interactively.`,

  contentAfterMap: `

## Following the Journey

I'll be documenting the actual route as it unfolds, simply check out the globe on the homepage to see where I am.
`};