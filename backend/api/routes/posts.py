from fastapi import APIRouter

from models.posts import Post

router = APIRouter(tags=["Posts"])

router.get("/posts", response_model=list[Post])


def get_posts() -> list[Post]:
    return []
