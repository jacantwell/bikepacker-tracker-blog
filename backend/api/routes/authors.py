from fastapi import APIRouter

from models.authors import Author

router = APIRouter(tags=["Authors"])

router.get("/authors", response_model=list[Author])


def get_authors() -> list[Author]:
    return []
