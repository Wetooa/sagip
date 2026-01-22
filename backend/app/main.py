"""FastAPI application main file."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.database import engine, Base
from app.api import citizen, command, shared, debug, chatbot

# Create database tables (in production, use Alembic migrations)
# Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Project Disaster API - Disaster preparedness and response system",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(citizen.router, prefix=f"{settings.API_PREFIX}/citizen", tags=["citizen"])
app.include_router(command.router, prefix=f"{settings.API_PREFIX}/command", tags=["command"])
app.include_router(shared.router, prefix=f"{settings.API_PREFIX}/shared", tags=["shared"])
app.include_router(debug.router, prefix=f"{settings.API_PREFIX}/debug", tags=["debug"])
app.include_router(chatbot.router, prefix=f"{settings.API_PREFIX}/chat", tags=["chat"])


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "message": "Project Disaster API",
        "version": settings.VERSION,
        "docs": "/docs",
    }


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}
