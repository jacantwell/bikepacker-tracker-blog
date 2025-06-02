import { useState, useEffect } from 'react'
import { Post, PostSummary, BlogPostsIndex } from '../types/blog'

const CONTENT_BASE_URL = import.meta.env.VITE_API_URL || '/content'

export const useAllPosts = () => {
  const [posts, setPosts] = useState<PostSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${CONTENT_BASE_URL}/content/index.json`)
        if (!response.ok) {
          throw new Error(`Failed to fetch posts: ${response.statusText}`)
        }
        const data: BlogPostsIndex = await response.json()
        setPosts(data.posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()))
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load posts')
        setPosts([])
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  return { posts, loading, error }
}

export const usePost = (slug: string) => {
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) {
      setLoading(false)
      return
    }

    const fetchPost = async () => {
      try {
        setLoading(true)
        
        // First get the metadata
        const indexResponse = await fetch(`${CONTENT_BASE_URL}/content/index.json`)
        if (!indexResponse.ok) {
          throw new Error('Failed to fetch posts index')
        }
        const index: BlogPostsIndex = await indexResponse.json()
        const postMetadata = index.posts.find(p => p.slug === slug)
        
        if (!postMetadata) {
          throw new Error('Post not found')
        }

        // Then get the full markdown content
        const contentResponse = await fetch(`${CONTENT_BASE_URL}/content/posts/${slug}.md`)
        if (!contentResponse.ok) {
          throw new Error('Failed to fetch post content')
        }
        const markdownContent = await contentResponse.text()

        setPost({
          ...postMetadata,
          content: markdownContent
        })
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load post')
        setPost(null)
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [slug])

  return { post, loading, error }
}