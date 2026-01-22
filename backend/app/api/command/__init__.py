"""Command Center API routes."""
from fastapi import APIRouter

from app.api.command import incidents, monitoring, roll_call, rescue, needs, health, volunteers

router = APIRouter()

# Include sub-routers
router.include_router(incidents.router, prefix="/incidents", tags=["command-incidents"])
router.include_router(monitoring.router, prefix="/monitoring", tags=["command-monitoring"])
router.include_router(roll_call.router, prefix="/roll-call", tags=["command-roll-call"])
router.include_router(rescue.router, prefix="/rescue", tags=["command-rescue"])
router.include_router(needs.router, prefix="/needs", tags=["command-needs"])
router.include_router(health.router, prefix="/health", tags=["command-health"])
router.include_router(volunteers.router, prefix="/volunteers", tags=["command-volunteers"])
