from fastapi import APIRouter, HTTPException, Query
from typing import List, Dict, Any, Optional

from ..models.posts import Post
from ..handlers.posts import content_handler

router = APIRouter(tags=["Posts"], prefix="/api")


@router.get("/posts", response_model=Dict[str, Any])
def get_posts(
    page: int = Query(1, ge=1, description="Page number"),
    per_page: int = Query(10, ge=1, le=100, description="Items per page"),
    tag: Optional[str] = Query(None, description="Filter posts by tag"),
) -> Dict[str, Any]:
    """
    Get paginated posts, optionally filtered by tag
    """
    if tag:
        # If a tag is specified, filter posts by that tag
        filtered_posts = content_handler.get_posts_by_tag(tag)
        # Manual pagination for filtered posts
        total = len(filtered_posts)
        total_pages = (total + per_page - 1) // per_page  # Ceiling division
        start_idx = (page - 1) * per_page
        end_idx = start_idx + per_page
        posts_page = filtered_posts[start_idx:end_idx]

        return {
            "posts": posts_page,
            "total": total,
            "page": page,
            "per_page": per_page,
            "total_pages": total_pages,
            "tag": tag,
        }
    else:
        # If no tag is specified, return all posts with pagination
        return content_handler.get_posts_paginated(page, per_page)


@router.get("/posts/{slug}", response_model=Post)
def get_post(slug: str) -> Post:
    """
    Get a specific post by slug
    """
    post = content_handler.get_post_by_slug(slug)
    if not post:
        raise HTTPException(
            status_code=404, detail=f"Post with slug '{slug}' not found"
        )
    return post


@router.get("/posts/tag/{tag}", response_model=List[Post])
def get_posts_with_tag(tag: str) -> List[Post]:
    """
    Get all posts with a specific tag
    """
    posts = content_handler.get_posts_by_tag(tag)
    if not posts:
        # Return empty list instead of 404 as this is a valid case
        return []
    return posts


@router.get("/tags", response_model=List[str])
def get_all_tags() -> List[str]:
    """
    Get all unique tags used in posts
    """
    posts = content_handler.load_all_posts()
    # Collect all tags from all posts and remove duplicates
    all_tags = set()
    for post in posts:
        for tag in post.tags:
            all_tags.add(tag)
    return sorted(list(all_tags))
