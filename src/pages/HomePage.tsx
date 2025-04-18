import { useEffect, useState } from 'react'
import Container from '../components/layout/Container'
import Intro from '../components/blog/Intro'
// import MoreStories from '../components/blog/MoreStories'
// import JourneyMap from '../components/journey/JourneyMap'
import { useAllPosts } from '../hooks/usePosts'
import { useStravaData } from '../hooks/useStravaData'

const HomePage = () => {
  const { posts, loading: postsLoading } = useAllPosts()
  const { activities, loading: activitiesLoading } = useStravaData('2023-01-01T00:00:00Z')
  
  if (postsLoading || activitiesLoading) {
    return (
      <Container>
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="animate-pulse">Loading...</div>
        </div>
      </Container>
    )
  }

  return (
    <Container>
      <Intro />
      {/* <JourneyMap activities={activities} startDate="2023-01-01T00:00:00Z" />
      {posts.length > 0 && <MoreStories posts={posts} />} */}
    </Container>
  )
}

export default HomePage