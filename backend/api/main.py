from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routes import authors_router, posts_router

app = FastAPI()

# Add Cross-Origin Resource Sharing (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(authors_router)
app.include_router(posts_router)


# Healthcheck endpoint for ecs monitoring
@app.get("/health")
def health():
    return True
