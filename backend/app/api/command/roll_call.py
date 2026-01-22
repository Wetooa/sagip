"""Command Center roll call endpoints."""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.emergency import RollCallCreate, RollCallResponse

router = APIRouter()


@router.post("/trigger", response_model=RollCallResponse)
async def trigger_roll_call(roll_call_data: RollCallCreate, db: Session = Depends(get_db)):
    """Trigger an automated roll call."""
    # TODO: Implement roll call trigger logic
    pass


@router.get("/responses")
async def get_roll_call_responses(db: Session = Depends(get_db)):
    """Get roll call responses."""
    # TODO: Implement roll call response retrieval
    pass
