"""Debug endpoints."""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db

router = APIRouter()


@router.get("/status")
async def get_system_status(db: Session = Depends(get_db)):
    """Get system status."""
    # TODO: Implement system status check
    return {"status": "ok", "database": "connected"}


@router.get("/data")
async def get_debug_data(db: Session = Depends(get_db)):
    """Get debug data dump."""
    # TODO: Implement debug data retrieval
    pass


@router.post("/test")
async def test_endpoint(db: Session = Depends(get_db)):
    """Test endpoint."""
    return {"message": "Test endpoint working"}
