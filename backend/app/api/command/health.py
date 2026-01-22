"""Command Center health monitoring endpoints."""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.post_disaster import HealthClusterResponse, MedicalDispatchCreate, MedicalDispatchResponse

router = APIRouter()


@router.get("/clusters", response_model=list[HealthClusterResponse])
async def get_health_clusters(db: Session = Depends(get_db)):
    """Get health outbreak clusters."""
    # Placeholder for AI cluster detection - use pass as specified
    pass


@router.post("/dispatch", response_model=MedicalDispatchResponse)
async def dispatch_medical_team(dispatch_data: MedicalDispatchCreate, db: Session = Depends(get_db)):
    """Dispatch a medical team."""
    # TODO: Implement medical dispatch logic
    pass
