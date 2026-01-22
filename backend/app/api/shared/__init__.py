"""Shared API routes."""
from fastapi import APIRouter

from app.api.shared import chatbot, mesh, location

router = APIRouter()

# Include sub-routers
router.include_router(chatbot.router, prefix="/chatbot", tags=["shared-chatbot"])
router.include_router(mesh.router, prefix="/mesh", tags=["shared-mesh"])
router.include_router(location.router, prefix="/location", tags=["shared-location"])
