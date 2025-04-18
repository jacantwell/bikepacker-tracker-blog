import { useState, useEffect } from 'react'
import { Post, PostSummary } from '../types/Post'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

export function useAllPosts(page = 1, limit = 10) {
  const [posts, setPosts] = useState<PostSummary[]>([])
  const [totalPosts, setTotalPosts] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true)
        const response = await fetch(
          `${API_URL}/posts?page=${page}&limit=${limit}`
        )
        if (!response.ok) {
          throw new Error('Failed to fetch posts')
        }
        const data = await response.json()
        setPosts(data.posts)
        setTotalPosts(data.total)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch posts'))
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [page, limit])

  return { posts, totalPosts, loading, error, currentPage: page }
}

export function usePost(slug: string) {
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchPost() {
      try {
        setLoading(true)
        const response = await fetch(`${API_URL}/posts/${slug}`)
        if (!response.ok) {
          throw new Error('Failed to fetch post')
        }
        const data = await response.json()
        setPost(data)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch post'))
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchPost()
    }
  }, [slug])

  return { post, loading, error }
}