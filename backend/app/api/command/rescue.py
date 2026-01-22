"""Command Center rescue coordination endpoints."""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.emergency import SOSSignalResponse, RescueDispatchCreate, RescueDispatchResponse

router = APIRouter()


@router.get("/sos/signals", response_model=list[SOSSignalResponse])
async def get_sos_signals(db: Session = Depends(get_db)):
    """Get SOS distress signals."""
    # TODO: Implement SOS signal retrieval
    pass


@router.post("/dispatch", response_model=RescueDispatchResponse)
async def dispatch_rescue_team(dispatch_data: RescueDispatchCreate, db: Session = Depends(get_db)):
    """Dispatch a rescue team."""
    # TODO: Implement rescue dispatch logic
    pass
