"""Evacuation routing endpoints."""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db

router = APIRouter()


@router.get("/route")
async def get_evacuation_route(db: Session = Depends(get_db)):
    """Get AI-dynamic evacuation route."""
    # Placeholder for AI routing - use pass as specified
    pass
