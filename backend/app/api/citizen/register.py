"""Citizen registration endpoints."""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.citizen import CitizenCreate, CitizenResponse
from app.schemas.common import MessageResponse

router = APIRouter()


@router.post("/", response_model=CitizenResponse)
async def register_citizen(citizen_data: CitizenCreate, db: Session = Depends(get_db)):
    """Register a new citizen."""
    # TODO: Implement registration logic
    pass


@router.get("/profile", response_model=CitizenResponse)
async def get_citizen_profile(db: Session = Depends(get_db)):
    """Get citizen profile."""
    # TODO: Implement profile retrieval logic
    pass
