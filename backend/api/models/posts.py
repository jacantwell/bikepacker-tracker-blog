from pydantic import BaseModel

from .authors import Author


class OgImage(BaseModel):
    url: str


class PostSummary(BaseModel):
    slug: str
    title: str
    date: str  # ISO date str
    excerpt: str
    author: Author
    coverImage: str
    tags: list[str]
    ogImage: OgImage


class Post(PostSummary):
    content: str  # HTML content transformed from markdown
    rawContent: str  # Original markdown content


class PaginatedPosts(BaseModel):
    posts: list[Post]
    total: int
    page: int
    per_page: int
    total_pages: int
