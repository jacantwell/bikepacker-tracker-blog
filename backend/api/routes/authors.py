from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional

from ..models.authors import Author
from ..utils.content_loader import load_all_authors, get_author_by_id

router = APIRouter(tags=["Authors"], prefix="/api")


@router.get("/authors", response_model=List[Author])
def get_authors() -> List[Author]:
    """Get all authors"""
    return load_all_authors()


@router.get("/authors/{author_id}", response_model=Author)
def get_author(author_id: str) -> Author:
    """Get a specific author by ID"""
    author = get_author_by_id(author_id)
    if not author:
        raise HTTPException(status_code=404, detail=f"Author {author_id} not found")
    return author
