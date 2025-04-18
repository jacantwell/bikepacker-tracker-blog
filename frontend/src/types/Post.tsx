import { Author } from './Author'

export interface PostSummary {
  slug: string
  title: string
  content: string
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