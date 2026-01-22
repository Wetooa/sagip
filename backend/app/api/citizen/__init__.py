"""Citizen API routes."""
from fastapi import APIRouter

from app.api.citizen import register, census, assets, lora, evacuation, needs, health

router = APIRouter()

# Include sub-routers
router.include_router(register.router, prefix="/register", tags=["citizen-register"])
router.include_router(census.router, prefix="/census", tags=["citizen-census"])
router.include_router(assets.router, prefix="/assets", tags=["citizen-assets"])
router.include_router(lora.router, prefix="/lora", tags=["citizen-lora"])
router.include_router(evacuation.router, prefix="/evacuation", tags=["citizen-evacuation"])
router.include_router(needs.router, prefix="/needs", tags=["citizen-needs"])
router.include_router(health.router, prefix="/health", tags=["citizen-health"])
