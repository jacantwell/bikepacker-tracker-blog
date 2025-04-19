import { PostsApi, Configuration} from '../api/posts';
import { Post, PaginatedPosts } from '../api/posts';
import { mockPosts, mockPostContent } from './mocks';

// API base URL from environment variable
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Use mock data when explicitly set or in development if API is unavailable
const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true';

// Create API configuration with base URL
const apiConfig = new Configuration({
  basePath: API_BASE_URL
});

// Create an instance of the PostsApi client
const postsApiClient = new PostsApi(apiConfig);

/**
 * Get all posts with pagination
 */
export async function getAllPosts(page = 1, limit = 10): Promise<PaginatedPosts> {
  try {
    // Make API request using the generated client
    const response = await postsApiClient.getPostsApiPostsGet(page, limit);
    
    // Return formatted response data
    return response.data
  } catch (error) {
    console.error('Error fetching posts:', error);
    if (!USE_MOCKS) {
      console.warn('API request failed. Falling back to mock data.');
    }
    // Fallback to mock data
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedPosts = mockPosts.slice(startIndex, endIndex);
    return {
      posts: paginatedPosts,
      total: mockPosts.length,
      page,
      totalPages: Math.ceil(mockPosts.length / limit)
    } as unknown as PaginatedPosts;
  }
  }

/**
 * Get a single post by slug
 */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    // Make API request using the generated client
    const response = await postsApiClient.getPostApiPostsSlugGet(slug);
    
    return response.data;
  } catch (error) {
    console.error(`Error fetching post with slug ${slug}:`, error);
    
    if (!USE_MOCKS) {
      console.warn('API request failed. Falling back to mock data.');
    }
    
    // Fallback to mock data
    const post = mockPosts.find(p => p.slug === slug);
    if (!post) return null;
    
    return {
      ...post,
      content: mockPostContent,
      rawContent: mockPostContent
    } as unknown as Post;
  }
}

/**
 * Get posts by tag with pagination
 */
export async function getPostsByTag(tag: string, page = 1, limit = 10): Promise<PaginatedPosts> {
  try {
    // Make API request using the generated client
    const response = await postsApiClient.getPostsApiPostsGet(page, limit, tag);
    
    return response.data;
  } catch (error) {
    console.error(`Error fetching posts with tag ${tag}:`, error);
    
    if (!USE_MOCKS) {
      console.warn('API request failed. Falling back to mock data.');
    }
    
    // Fallback to mock data
    const filteredPosts = mockPosts.filter(post => post.tags?.includes(tag));
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedPosts = filteredPosts.slice(startIndex, endIndex);
    
    return {
      posts: paginatedPosts,
      total: mockPosts.length,
      page,
      totalPages: Math.ceil(mockPosts.length / limit)
    } as unknown as PaginatedPosts;
  }
}

/**
 * Get all tags used in posts
 */
export async function getAllTags(): Promise<string[]> {
  try {
    // Make API request using the generated client
    const response = await postsApiClient.getAllTagsApiTagsGet();
    
    return response.data as string[];
  } catch (error) {
    console.error('Error fetching tags:', error);
    
    if (!USE_MOCKS) {
      console.warn('API request failed. Falling back to mock data.');
    }
    
    // Fallback: Extract all unique tags from mock posts
    const allTags = new Set<string>();
    mockPosts.forEach(post => {
      if (post.tags) {
        post.tags.forEach(tag => allTags.add(tag));
      }
    });
    
    return Array.from(allTags).sort();
  }
}