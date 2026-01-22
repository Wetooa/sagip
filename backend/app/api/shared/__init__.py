"""Shared API routes."""
from fastapi import APIRouter

from app.api.shared import chatbot, mesh, location, hazard_mapping, prediction, rescue_request, geojson, routing

router = APIRouter()

# Include sub-routers
router.include_router(chatbot.router, prefix="/chatbot", tags=["shared-chatbot"])
router.include_router(mesh.router, prefix="/mesh", tags=["shared-mesh"])
router.include_router(location.router, prefix="/location", tags=["shared-location"])
router.include_router(hazard_mapping.router, prefix="/hazard-mapping", tags=["shared-hazard-mapping"])
router.include_router(prediction.router, prefix="/prediction", tags=["shared-prediction"])
router.include_router(routing.router, prefix="/routing", tags=["shared-routing"])
router.include_router(geojson.router, prefix="/geojson", tags=["shared-geojson"])
