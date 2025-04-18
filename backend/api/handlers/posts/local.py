import os
import json
import glob
from pathlib import Path
from typing import List, Dict, Any, Optional
import frontmatter
from datetime import datetime

from .base import ContentHandler
from ...models.posts import Post, OgImage
from ...models.authors import Author


class LocalContentHandler(ContentHandler):
    """
    Content handler implementation that loads content from local files.
    """

    def __init__(self, content_dir: str = None):
        """
        Initialize the handler with the content directory path.

        Args:
            content_dir: Path to the content directory. If None, uses the CONTENT_DIR environment variable
                        or defaults to "content" in the current directory.
        """
        if content_dir is None:
            content_dir = os.environ.get("CONTENT_DIR", "content")

        self.content_dir = Path(content_dir)
        self.posts_dir = self.content_dir / "posts"
        self.authors_dir = self.content_dir / "authors"

        # Ensure directories exist
        os.makedirs(self.posts_dir, exist_ok=True)
        os.makedirs(self.authors_dir, exist_ok=True)

    def load_all_authors(self) -> List[Author]:
        """Load all author data from JSON files in the authors directory."""
        author_files = glob.glob(str(self.authors_dir / "*.json"))
        authors = []

        for file_path in author_files:
            try:
                with open(file_path, "r", encoding="utf-8") as f:
                    author_data = json.load(f)
                    authors.append(
                        Author(
                            id=author_data.get("id", ""),
                            name=author_data.get("name", ""),
                            picture=author_data.get("picture", ""),
                            bio=author_data.get("bio"),
                        )
                    )
            except Exception as e:
                print(f"Error loading author from {file_path}: {e}")

        return authors

    def get_author_by_id(self, author_id: str) -> Optional[Author]:
        """Get a specific author by ID."""
        try:
            file_path = self.authors_dir / f"{author_id}.json"
            if not file_path.exists():
                return None

            with open(file_path, "r", encoding="utf-8") as f:
                author_data = json.load(f)
                return Author(
                    id=author_data.get("id", ""),
                    name=author_data.get("name", ""),
                    picture=author_data.get("picture", ""),
                    bio=author_data.get("bio"),
                )
        except Exception as e:
            print(f"Error loading author {author_id}: {e}")
            return None

    def _load_post_from_file(self, file_path: Path) -> Optional[Post]:
        """Load a single post from a Markdown file."""
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                post = frontmatter.load(f)

                # Extract author information
                author_data = post.get("author", {})
                author = Author(
                    id=author_data.get("id", ""),
                    name=author_data.get("name", ""),
                    picture=author_data.get("picture", ""),
                    bio=None,
                )

                # If only the author name is provided, try to find their full details
                if author.id == "" and author.name:
                    # Try to find the author by name
                    for full_author in self.load_all_authors():
                        if full_author.name == author.name:
                            author = full_author
                            break

                # Extract og_image
                og_image_data = post.get("ogImage", {})
                og_image = OgImage(url=og_image_data.get("url", ""))

                # Create Post object
                return Post(
                    slug=file_path.stem,  # Use the filename as the slug
                    title=post.get("title", ""),
                    content=post.content,  # This is the HTML content
                    rawContent=post.content,  # Store the raw markdown too
                    date=post.get("date", datetime.now().isoformat()),
                    excerpt=post.get("excerpt", ""),
                    author=author,
                    coverImage=post.get("coverImage", ""),
                    tags=post.get("tags", []),
                    ogImage=og_image,
                )
        except Exception as e:
            print(f"Error loading post from {file_path}: {e}")
            return None

    def load_all_posts(self) -> List[Post]:
        """Load all posts from Markdown files in the posts directory."""
        post_files = glob.glob(str(self.posts_dir / "*.md"))
        posts = []

        for file_path in post_files:
            post = self._load_post_from_file(Path(file_path))
            if post:
                posts.append(post)

        # Sort by date, most recent first
        return sorted(posts, key=lambda p: p.date, reverse=True)

    def get_post_by_slug(self, slug: str) -> Optional[Post]:
        """Get a specific post by slug."""
        file_path = self.posts_dir / f"{slug}.md"
        return self._load_post_from_file(file_path) if file_path.exists() else None

    def get_posts_by_tag(self, tag: str) -> List[Post]:
        """Get all posts with a specific tag."""
        all_posts = self.load_all_posts()
        return [post for post in all_posts if tag in post.tags]

    def get_posts_paginated(self, page: int = 1, per_page: int = 10) -> Dict[str, Any]:
        """Get paginated posts."""
        all_posts = self.load_all_posts()

        # Calculate pagination
        total = len(all_posts)
        total_pages = (total + per_page - 1) // per_page  # Ceiling division

        # Get the requested page
        start_idx = (page - 1) * per_page
        end_idx = start_idx + per_page
        posts_page = all_posts[start_idx:end_idx]

        return {
            "posts": posts_page,
            "total": total,
            "page": page,
            "per_page": per_page,
            "total_pages": total_pages,
        }
