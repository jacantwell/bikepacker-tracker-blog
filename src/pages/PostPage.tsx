import { useParams } from 'react-router'
import Container from '../components/layout/Container'
import Header from '../components/layout/Header'
import PostHeader from '../components/blog/PostHeader'
import PostBody from '../components/blog/PostBody'
import { usePost } from '../hooks/usePosts'

const PostPage = () => {
  const { slug } = useParams<{ slug: string }>()
  const { post, loading, error } = usePost(slug || '')

  if (loading) {
    return (
      <Container>
        <Header />
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="animate-pulse">Loading post...</div>
        </div>
      </Container>
    )
  }

  if (error || !post) {
    return (
      <Container>
        <Header />
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="text-red-500">Post not found</div>
        </div>
      </Container>
    )
  }

  return (
    <Container>
      <Header />
      <article className="mb-32">
        <PostHeader
          title={post.title}
          coverImage={post.coverImage}
          date={post.date}
          author={post.author}
        />
        <PostBody content={post.content} />
      </article>
    </Container>
  )
}

export default PostPage