import { useState, useEffect } from 'react';
import { Post } from '../api/posts';
import { PostSummary } from '../types/Post';
import { getAllPosts, getPostBySlug } from '../services/posts';

export function useAllPosts(page = 1, limit = 10) {
  const [posts, setPosts] = useState<PostSummary[]>([]);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true);
        const data = await getAllPosts(page, limit);
        setPosts(data.posts);
        setTotalPosts(data.total);
        setTotalPages(data.total_pages);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch posts'));
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, [page, limit]);

  return { posts, totalPosts, totalPages, loading, error, currentPage: page };
}

export function usePost(slug: string) {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchPost() {
      if (!slug) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const data = await getPostBySlug(slug);
        setPost(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch post'));
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [slug]);

  return { post, loading, error };
}