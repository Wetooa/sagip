"""Authentication API routes."""
from fastapi import APIRouter

from app.api.auth import login

router = APIRouter()

# Include sub-routers
router.include_router(login.router, tags=["auth"])
