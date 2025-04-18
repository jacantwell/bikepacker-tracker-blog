from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from fastapi.staticfiles import StaticFiles
import logging

from .routes import authors_router, posts_router

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Bikepacker Tracker API",
    description="API for the Bikepacker Tracker blog",
    version="0.1.0",
)

# Add Cross-Origin Resource Sharing (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(authors_router)
app.include_router(posts_router)

# Mount a static files handler for the assets directory
app.mount("/assets", StaticFiles(directory=f"content/assets"), name="assets")


# Error handlers
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    logger.error(f"Validation error: {exc}")
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": exc.errors(), "body": exc.body},
    )


@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "Internal server error"},
    )


# Healthcheck endpoint for monitoring
@app.get("/health")
def health():
    return {"status": "healthy"}


# For documentation and testing
@app.get("/")
def read_root():
    return {
        "message": "Welcome to the Bikepacker Tracker API",
        "docs": "/docs",
        "endpoints": [
            "/api/posts",
            "/api/posts/{slug}",
            "/api/posts/tag/{tag}",
            "/api/tags",
            "/api/authors",
            "/api/authors/{author_id}",
        ],
    }
