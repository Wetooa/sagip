"""Command Center monitoring endpoints."""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.monitoring import WaterLevelReadingResponse

router = APIRouter()


@router.get("/water-level", response_model=list[WaterLevelReadingResponse])
async def get_water_level_data(db: Session = Depends(get_db)):
    """Get water level monitoring data."""
    # TODO: Implement water level data retrieval
    pass


@router.get("/hazard-map")
async def get_hazard_map(db: Session = Depends(get_db)):
    """Get hazard map data from external APIs."""
    # Placeholder for external API integration - use pass as specified
    pass
