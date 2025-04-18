import os
import json
import glob
from pathlib import Path
from typing import List, Dict, Any, Optional
import frontmatter
from datetime import datetime

from ..models.posts import Post, OgImage
from ..models.authors import Author

# Base content directory
CONTENT_DIR = Path(os.environ.get("CONTENT_DIR", "content"))
POSTS_DIR = CONTENT_DIR / "posts"
AUTHORS_DIR = CONTENT_DIR / "authors"


def load_all_authors() -> List[Author]:
    """Load all author data from JSON files in the authors directory."""
    author_files = glob.glob(str(AUTHORS_DIR / "*.json"))
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


def get_author_by_id(author_id: str) -> Optional[Author]:
    """Get a specific author by ID."""
    try:
        file_path = AUTHORS_DIR / f"{author_id}.json"
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


def load_post_from_file(file_path: Path) -> Optional[Post]:
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
                # This is a simplified way to find the author - in a real app,
                # you might want a more robust lookup mechanism
                for full_author in load_all_authors():
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


def load_all_posts() -> List[Post]:
    """Load all posts from Markdown files in the posts directory."""
    post_files = glob.glob(str(POSTS_DIR / "*.md"))
    posts = []

    for file_path in post_files:
        post = load_post_from_file(Path(file_path))
        if post:
            posts.append(post)

    # Sort by date, most recent first
    return sorted(posts, key=lambda p: p.date, reverse=True)


def get_post_by_slug(slug: str) -> Optional[Post]:
    """Get a specific post by slug."""
    file_path = POSTS_DIR / f"{slug}.md"
    return load_post_from_file(file_path) if file_path.exists() else None


def get_posts_by_tag(tag: str) -> List[Post]:
    """Get all posts with a specific tag."""
    all_posts = load_all_posts()
    return [post for post in all_posts if tag in post.tags]


def get_posts_paginated(page: int = 1, per_page: int = 10) -> Dict[str, Any]:
    """Get paginated posts."""
    all_posts = load_all_posts()

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
