import Container from '../components/layout/Container'
import Intro from '../components/blog/Intro'
import MoreStories from '../components/blog/MoreStories'
import { JourneyMap } from '../components/journey/JourneyMap'
import { useAllPosts } from '../hooks/usePosts'
import { JourneyStats } from '@/components/journey/JourneyStats'
import useStravaData from '../hooks/useStravaData'

const HomePage = () => {
  const { posts, loading: postsLoading, error: postsError } = useAllPosts()
  const {
    activities,
    loading: activitiesLoading,
    refreshing: activitiesRefreshing,
    lastUpdated,
    refresh
  } = useStravaData(import.meta.env.VITE_JOURNEY_START_DATE || '2023-01-01T00:00:00Z')

  return (
    <Container>
      <Intro />

      {/* Map renders immediately with loading and refreshing states */}
      <h2 className="mb-4 text-4xl font-bold leading-tight tracking-tighter md:text-5xl">
        Journey Map
      </h2>
      <JourneyStats
        activities={activities || []}
        startDate={import.meta.env.VITE_JOURNEY_START_DATE || "2023-01-01T00:00:00Z"}
        isLoading={activitiesLoading}
      ></JourneyStats>
      <JourneyMap
        activities={activities || []}
        startDate={import.meta.env.VITE_JOURNEY_START_DATE || "2023-01-01T00:00:00Z"}
        isLoading={activitiesLoading}
        isRefreshing={activitiesRefreshing}
        lastUpdated={lastUpdated}
        onRefresh={refresh}
      />

      {/* Blog posts section using existing MoreStories component */}
      {postsLoading ? (
        <div className="my-12 flex justify-center">
          <div className="animate-pulse text-lg">Loading stories from the road...</div>
        </div>
      ) : postsError ? (
        <div className="my-12 flex justify-center">
          <div className="text-red-600">Failed to load blog posts: {postsError}</div>
        </div>
      ) : posts.length > 0 ? (
        <MoreStories posts={posts} />
      ) : (
        <div className="my-12 flex justify-center">
          <div className="text-lg text-gray-500">No stories yet... adventure coming soon!</div>
        </div>
      )}
    </Container>
  )
}

export default HomePage