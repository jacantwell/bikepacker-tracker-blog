from pydantic import BaseModel

from .authors import Author


class OgImage(BaseModel):
    url: str


class Post(BaseModel):
    slug: str
    title: str
    content: str  # HTML content transformed from markdown
    rawContent: str  # Original markdown content
    date: str  # ISO date str
    excerpt: str
    author: Author
    coverImage: str
    tags: list[str]
    ogImage: OgImage
