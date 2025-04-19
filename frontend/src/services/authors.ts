import { AuthorsApi, Configuration, Author } from '../api/posts';

// API base URL from environment variable
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Use mock data when explicitly set or in development if API is unavailable
const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true';

// Create API configuration with base URL
const apiConfig = new Configuration({
  basePath: API_BASE_URL
});

// Create an instance of the AuthorsApi client
const authorsApiClient = new AuthorsApi(apiConfig);

// Mock authors for fallback
const mockAuthors: Author[] = [
  {
    id: 'jasper-williams',
    name: 'Jasper Williams',
    picture: '/assets/images/authors/jasper.jpeg',
    bio: 'Lifelong cyclist and former software engineer who decided to trade the keyboard for a map and the office for the open road.'
  },
  {
    id: 'sofia-mendez',
    name: 'Sofia Mendez',
    picture: '/assets/images/authors/sofia.jpeg',
    bio: 'Adventure photographer and occasional cyclist based in Barcelona.'
  }
];

/**
 * Get all authors
 */
export async function getAllAuthors(): Promise<Author[]> {
  try {
    // Make API request using the generated client
    const response = await authorsApiClient.getAuthorsApiAuthorsGet();
    
    return response.data;
  } catch (error) {
    console.error('Error fetching authors:', error);
    
    if (!USE_MOCKS) {
      console.warn('API request failed. Falling back to mock data.');
    }
    
    // Fallback to mock data
    return mockAuthors;
  }
}

/**
 * Get author by ID
 */
export async function getAuthorById(id: string): Promise<Author | null> {
  try {
    // Make API request using the generated client
    const response = await authorsApiClient.getAuthorApiAuthorsAuthorIdGet(id);
    
    return response.data;
  } catch (error) {
    console.error(`Error fetching author with ID ${id}:`, error);
    
    if (!USE_MOCKS) {
      console.warn('API request failed. Falling back to mock data.');
    }
    
    // Fallback to mock data
    const author = mockAuthors.find(a => a.id === id);
    return author || null;
  }
}