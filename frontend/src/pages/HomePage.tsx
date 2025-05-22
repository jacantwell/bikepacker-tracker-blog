import Container from '../components/layout/Container'
import Intro from '../components/blog/Intro'
// import MoreStories from '../components/blog/MoreStories'
import { JourneyMap } from '../components/journey/JourneyMap'
// import { useAllPosts } from '../hooks/usePosts'
import useStravaData from '../hooks/useStravaData'

const HomePage = () => {
  // const { posts, loading: postsLoading } = useAllPosts()
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
      <JourneyMap 
        activities={activities || []} 
        startDate={import.meta.env.VITE_JOURNEY_START_DATE || "2023-01-01T00:00:00Z"}
        isLoading={activitiesLoading}
        isRefreshing={activitiesRefreshing}
        lastUpdated={lastUpdated}
        onRefresh={refresh}
      />

      <div className="my-12 flex justify-center">
        <div className="text-lg">More coming soon...</div>
      </div>
      
      {/* Show blog posts if loaded, otherwise show loading state */}
      {/* {postsLoading ? (
        <div className="my-12 flex justify-center">
          <div className="animate-pulse text-lg">Loading blog posts...</div>
        </div>
      ) : (
        posts.length > 0 && <MoreStories posts={posts} />
      )} */}
    </Container>
  )
}

export default HomePage