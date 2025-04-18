import os
import logging

from .base import ContentHandler
from .local import LocalContentHandler
from .s3 import S3ContentHandler

logger = logging.getLogger(__name__)


def get_content_handler() -> ContentHandler:
    """
    Factory function to create and return the appropriate content handler
    based on environment configuration.

    Returns:
        An instance of a ContentHandler implementation
    """
    # Determine which handler to use based on environment variables
    storage_type = os.environ.get("STORAGE_TYPE", "local").lower()

    if storage_type == "s3":
        # Use S3 content handler
        bucket_name = os.environ.get("S3_BUCKET_NAME")
        posts_prefix = os.environ.get("S3_POSTS_PREFIX", "content/posts/")
        authors_prefix = os.environ.get("S3_AUTHORS_PREFIX", "content/authors/")
        aws_region = os.environ.get("AWS_REGION")

        logger.info(f"Using S3 content handler with bucket: {bucket_name}")

        try:
            return S3ContentHandler(
                bucket_name=bucket_name,
                posts_prefix=posts_prefix,
                authors_prefix=authors_prefix,
                aws_region=aws_region,
            )
        except Exception as e:
            logger.error(f"Failed to initialize S3 content handler: {e}")
            logger.warning("Falling back to local file content handler")
            # Fall back to local file handler
            content_dir = os.environ.get("CONTENT_DIR", "content")
            return LocalContentHandler(content_dir=content_dir)
    else:
        # Use local file content handler by default
        content_dir = os.environ.get("CONTENT_DIR", "content")
        logger.info(f"Using local file content handler with directory: {content_dir}")
        return LocalContentHandler(content_dir=content_dir)


# Create a singleton instance of the handler to be used throughout the application
content_handler = get_content_handler()
