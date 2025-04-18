import { Post, PostSummary } from '../types/Post';
import { mockPosts, mockPostContent } from './mocks';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function getAllPosts(page = 1, limit = 10): Promise<{
  posts: PostSummary[];
  total: number;
  page: number;
  totalPages: number;
}> {
  // Simulate API request
  await delay(500);
  
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedPosts = mockPosts.slice(startIndex, endIndex);
  
  return {
    posts: paginatedPosts,
    total: mockPosts.length,
    page,
    totalPages: Math.ceil(mockPosts.length / limit)
  };
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  // Simulate API request
  await delay(700);
  
  const post = mockPosts.find(p => p.slug === slug);
  
  if (!post) {
    return null;
  }
  
  return {
    ...post,
    content: mockPostContent
  };
}