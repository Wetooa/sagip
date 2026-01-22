"""Citizen census endpoints."""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.citizen import CensusDataCreate, CensusDataResponse

router = APIRouter()


@router.post("/", response_model=CensusDataResponse)
async def submit_census(census_data: CensusDataCreate, db: Session = Depends(get_db)):
    """Submit digital census data."""
    # TODO: Implement census submission logic
    pass
