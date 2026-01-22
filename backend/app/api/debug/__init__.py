"""Debug API routes."""
from fastapi import APIRouter

from app.api.debug import debug

router = APIRouter()

# Include debug router
router.include_router(debug.router, tags=["debug"])
