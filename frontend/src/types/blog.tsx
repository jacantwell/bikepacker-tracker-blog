// types/blog.ts - Updated to match existing interfaces

export interface Author {
  name: string
  picture: string
}

export interface PostSummary {
  slug: string
  title: string
  date: string
  coverImage: string
  excerpt: string
  author: Author
  ogImage: {
    url: string
  }
}

export interface Post extends PostSummary {
  content: string
}

// Additional interface for the content index
export interface BlogPostsIndex {
  posts: PostSummary[]
  lastUpdated: string
}

// Optional fields for frontmatter
export interface BlogFrontMatter {
  title: string
  date: string
  excerpt: string
  coverImage?: string
  tags?: string[]
  location?: {
    lat: number
    lng: number
    name: string
  }
  author?: {
    name: string
    picture: string
  }
}