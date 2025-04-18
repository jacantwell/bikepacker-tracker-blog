from pydantic import BaseModel


class Author(BaseModel):
    id: str
    name: str
    picture: str
    bio: str | None = None
