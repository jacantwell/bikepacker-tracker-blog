import os
import json
import boto3
from botocore.exceptions import ClientError
from typing import List, Dict, Any, Optional, Union
import frontmatter
from io import BytesIO
from datetime import datetime
import logging

from .base import ContentHandler
from ...models.posts import Post, OgImage
from ...models.authors import Author

logger = logging.getLogger(__name__)


class S3ContentHandler(ContentHandler):
    """
    Content handler implementation that loads content from AWS S3.
    """

    def __init__(
        self,
        bucket_name: str = None,
        posts_prefix: str = "content/posts/",
        authors_prefix: str = "content/authors/",
        aws_region: str = None,
    ):
        """
        Initialize the handler with S3 bucket information.

        Args:
            bucket_name: Name of the S3 bucket. If None, uses the S3_BUCKET_NAME environment variable.
            posts_prefix: Prefix for post objects in the bucket. Default: "content/posts/"
            authors_prefix: Prefix for author objects in the bucket. Default: "content/authors/"
            aws_region: AWS region. If None, uses the AWS_REGION environment variable or boto3 default.
        """
        self.bucket_name = bucket_name or os.environ.get("S3_BUCKET_NAME")
        if not self.bucket_name:
            raise ValueError(
                "S3 bucket name must be provided or set in S3_BUCKET_NAME environment variable"
            )

        self.posts_prefix = posts_prefix
        self.authors_prefix = authors_prefix

        # Initialize S3 client
        self.s3 = boto3.client(
            "s3", region_name=aws_region or os.environ.get("AWS_REGION")
        )

        # Check if bucket exists and we have access
        try:
            self.s3.head_bucket(Bucket=self.bucket_name)
        except ClientError as e:
            error_code = e.response["Error"]["Code"]
            if error_code == "404":
                raise ValueError(f"S3 bucket '{self.bucket_name}' does not exist")
            elif error_code == "403":
                raise ValueError(f"Access denied to S3 bucket '{self.bucket_name}'")
            else:
                raise

    def _get_s3_object_content(self, key: str) -> Optional[bytes]:
        """
        Get the content of an S3 object.

        Args:
            key: Object key in S3

        Returns:
            Object content as bytes or None if the object doesn't exist
        """
        try:
            response = self.s3.get_object(Bucket=self.bucket_name, Key=key)
            return response["Body"].read()
        except ClientError as e:
            if e.response["Error"]["Code"] == "NoSuchKey":
                return None
            else:
                logger.error(f"Error getting S3 object {key}: {e}")
                raise

    def _list_s3_objects(self, prefix: str, suffix: str = "") -> List[str]:
        """
        List S3 objects with a given prefix and optional suffix.

        Args:
            prefix: Prefix to filter objects
            suffix: Optional suffix to further filter objects

        Returns:
            List of object keys
        """
        try:
            paginator = self.s3.get_paginator("list_objects_v2")
            result = []

            # Paginate through results
            for page in paginator.paginate(Bucket=self.bucket_name, Prefix=prefix):
                if "Contents" in page:
                    for obj in page["Contents"]:
                        key = obj["Key"]
                        if suffix and not key.endswith(suffix):
                            continue
                        result.append(key)

            return result
        except ClientError as e:
            logger.error(f"Error listing S3 objects with prefix {prefix}: {e}")
            raise

    def load_all_authors(self) -> List[Author]:
        """Load all author data from JSON files in S3."""
        author_keys = self._list_s3_objects(self.authors_prefix, ".json")
        authors = []

        for key in author_keys:
            try:
                content = self._get_s3_object_content(key)
                if not content:
                    continue

                author_data = json.loads(content.decode("utf-8"))
                authors.append(
                    Author(
                        id=author_data.get("id", ""),
                        name=author_data.get("name", ""),
                        picture=author_data.get("picture", ""),
                        bio=author_data.get("bio"),
                    )
                )
            except Exception as e:
                logger.error(f"Error loading author from {key}: {e}")

        return authors

    def get_author_by_id(self, author_id: str) -> Optional[Author]:
        """Get a specific author by ID."""
        key = f"{self.authors_prefix}{author_id}.json"

        try:
            content = self._get_s3_object_content(key)
            if not content:
                return None

            author_data = json.loads(content.decode("utf-8"))
            return Author(
                id=author_data.get("id", ""),
                name=author_data.get("name", ""),
                picture=author_data.get("picture", ""),
                bio=author_data.get("bio"),
            )
        except Exception as e:
            logger.error(f"Error loading author {author_id}: {e}")
            return None

    def _load_post_from_s3_key(self, key: str) -> Optional[Post]:
        """
        Load a single post from an S3 object key.

        Args:
            key: S3 object key for the post markdown file

        Returns:
            Post object or None if loading fails
        """
        try:
            content = self._get_s3_object_content(key)
            if not content:
                return None

            # Parse frontmatter
            post = frontmatter.loads(content.decode("utf-8"))

            # Extract slug from key
            # Assuming format like "content/posts/slug-name.md"
            slug = os.path.splitext(os.path.basename(key))[0]

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
                for full_author in self.load_all_authors():
                    if full_author.name == author.name:
                        author = full_author
                        break

            # Extract og_image
            og_image_data = post.get("ogImage", {})
            og_image = OgImage(url=og_image_data.get("url", ""))

            # Create Post object
            return Post(
                slug=slug,
                title=post.get("title", ""),
                content=post.content,
                rawContent=post.content,
                date=post.get("date", datetime.now().isoformat()),
                excerpt=post.get("excerpt", ""),
                author=author,
                coverImage=post.get("coverImage", ""),
                tags=post.get("tags", []),
                ogImage=og_image,
            )
        except Exception as e:
            logger.error(f"Error loading post from {key}: {e}")
            return None

    def load_all_posts(self) -> List[Post]:
        """Load all posts from S3."""
        post_keys = self._list_s3_objects(self.posts_prefix, ".md")
        posts = []

        for key in post_keys:
            post = self._load_post_from_s3_key(key)
            if post:
                posts.append(post)

        # Sort by date, most recent first
        return sorted(posts, key=lambda p: p.date, reverse=True)

    def get_post_by_slug(self, slug: str) -> Optional[Post]:
        """Get a specific post by slug."""
        key = f"{self.posts_prefix}{slug}.md"
        return self._load_post_from_s3_key(key)

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
