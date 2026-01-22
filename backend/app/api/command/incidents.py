"""Command Center incident management endpoints."""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.emergency import IncidentCreate, IncidentResponse

router = APIRouter()


@router.get("/dashboard")
async def get_dashboard(db: Session = Depends(get_db)):
    """Get command center dashboard data."""
    # TODO: Implement dashboard data aggregation
    pass


@router.post("/", response_model=IncidentResponse)
async def create_incident(incident_data: IncidentCreate, db: Session = Depends(get_db)):
    """Create or activate an incident."""
    # TODO: Implement incident creation logic
    pass


@router.get("/", response_model=list[IncidentResponse])
async def list_incidents(db: Session = Depends(get_db)):
    """List all incidents."""
    # TODO: Implement incident listing logic
    pass
