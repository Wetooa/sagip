"""Shared location endpoints."""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.location import LocationHistoryCreate, LocationHistoryResponse, PredictedLocationResponse

router = APIRouter()


@router.post("/history", response_model=LocationHistoryResponse)
async def create_location_history(location_data: LocationHistoryCreate, db: Session = Depends(get_db)):
    """Create location history entry."""
    # TODO: Implement location history creation logic
    pass


@router.get("/history", response_model=list[LocationHistoryResponse])
async def get_location_history(db: Session = Depends(get_db)):
    """Get location history."""
    # TODO: Implement location history retrieval
    pass


@router.post("/predict", response_model=PredictedLocationResponse)
async def predict_location(db: Session = Depends(get_db)):
    """Predict location using AI (remote sensing concept)."""
    # Placeholder for AI location prediction - use pass as specified
    pass
