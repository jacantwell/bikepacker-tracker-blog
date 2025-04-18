from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional

from ...models.posts import Post
from ...models.authors import Author


class ContentHandler(ABC):
    """
    Abstract base class for content handlers.
    All content handlers must implement these methods.
    """

    @abstractmethod
    def load_all_posts(self) -> List[Post]:
        """Load all blog posts"""
        pass

    @abstractmethod
    def get_post_by_slug(self, slug: str) -> Optional[Post]:
        """Get a specific post by slug"""
        pass

    @abstractmethod
    def get_posts_by_tag(self, tag: str) -> List[Post]:
        """Get all posts with a specific tag"""
        pass

    @abstractmethod
    def get_posts_paginated(self, page: int = 1, per_page: int = 10) -> Dict[str, Any]:
        """Get paginated posts"""
        pass

    @abstractmethod
    def load_all_authors(self) -> List[Author]:
        """Load all authors"""
        pass

    @abstractmethod
    def get_author_by_id(self, author_id: str) -> Optional[Author]:
        """Get a specific author by ID"""
        pass
