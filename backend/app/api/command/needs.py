"""Command Center needs ticket management endpoints."""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.post_disaster import NeedsTicketResponse

router = APIRouter()


@router.get("/tickets", response_model=list[NeedsTicketResponse])
async def get_needs_tickets(db: Session = Depends(get_db)):
    """Get all needs tickets."""
    # TODO: Implement needs ticket retrieval
    pass
