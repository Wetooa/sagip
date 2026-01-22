"""Health reporting endpoints."""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.post_disaster import HealthReportCreate, HealthReportResponse

router = APIRouter()


@router.post("/report", response_model=HealthReportResponse)
async def report_health_symptoms(report_data: HealthReportCreate, db: Session = Depends(get_db)):
    """Report health symptoms."""
    # TODO: Implement health report submission logic
    pass
