"""Shared location endpoints."""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, desc
from typing import Optional
from datetime import datetime
from uuid import UUID

from app.core.database import get_db
from app.core.security import get_current_user, get_current_user_optional
from app.schemas.location import LocationHistoryCreate, LocationHistoryResponse, PredictedLocationResponse
from app.models.location import LocationHistory, LocationSource
from app.models.citizen import Citizen
from app.utils.helpers import paginate_query, not_found_error, validation_error

router = APIRouter()


@router.post("/history", response_model=LocationHistoryResponse, status_code=status.HTTP_201_CREATED)
async def create_location_history(
    location_data: LocationHistoryCreate,
    current_user: Optional[Citizen] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    """Create location history entry."""
    # Validate that at least one device reference is provided
    if not location_data.device_id and not location_data.lora_device_id:
        raise validation_error("Either device_id or lora_device_id must be provided")
    
    # If citizen is authenticated, use their citizen_id
    citizen_id = current_user.id if current_user else None
    
    # Validate device ownership if citizen is authenticated
    if current_user and location_data.device_id:
        from app.models.devices import Device
        device = db.query(Device).filter(
            and_(Device.id == location_data.device_id, Device.citizen_id == current_user.id)
        ).first()
        if not device:
            raise validation_error("Device not found or not owned by user")
    
    if current_user and location_data.lora_device_id:
        from app.models.devices import LoRaDevice
        lora_device = db.query(LoRaDevice).filter(
            and_(LoRaDevice.id == location_data.lora_device_id, LoRaDevice.citizen_id == current_user.id)
        ).first()
        if not lora_device:
            raise validation_error("LoRa device not found or not owned by user")
    
    # Create location history entry
    new_location = LocationHistory(
        device_id=location_data.device_id,
        lora_device_id=location_data.lora_device_id,
        citizen_id=citizen_id,
        latitude=location_data.latitude,
        longitude=location_data.longitude,
        accuracy=location_data.accuracy,
        altitude=location_data.altitude,
        heading=location_data.heading,
        speed=location_data.speed,
        source=LocationSource(location_data.source),
        recorded_at=location_data.recorded_at
    )
    
    db.add(new_location)
    db.commit()
    db.refresh(new_location)
    
    response = LocationHistoryResponse(
        id=new_location.id,
        device_id=new_location.device_id,
        lora_device_id=new_location.lora_device_id,
        citizen_id=new_location.citizen_id,
        latitude=new_location.latitude,
        longitude=new_location.longitude,
        accuracy=new_location.accuracy,
        altitude=new_location.altitude,
        heading=new_location.heading,
        speed=new_location.speed,
        source=new_location.source.value,
        recorded_at=new_location.recorded_at,
        created_at=new_location.created_at
    )
    
    return response


@router.get("/history", response_model=list[LocationHistoryResponse])
async def get_location_history(
    device_id: Optional[UUID] = Query(None, description="Filter by device ID"),
    lora_device_id: Optional[UUID] = Query(None, description="Filter by LoRa device ID"),
    citizen_id: Optional[UUID] = Query(None, description="Filter by citizen ID"),
    start_date: Optional[datetime] = Query(None, description="Start date for date range filter"),
    end_date: Optional[datetime] = Query(None, description="End date for date range filter"),
    limit: Optional[int] = Query(100, ge=1, le=1000, description="Maximum number of results"),
    offset: Optional[int] = Query(0, ge=0, description="Number of results to skip"),
    current_user: Optional[Citizen] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    """Get location history (with filters: device_id, citizen_id, date range)."""
    # Build query
    query = db.query(LocationHistory)
    
    # Apply filters
    if device_id:
        query = query.filter(LocationHistory.device_id == device_id)
    
    if lora_device_id:
        query = query.filter(LocationHistory.lora_device_id == lora_device_id)
    
    # If user is authenticated, only show their own data unless they're command center
    if current_user:
        if current_user.role.value == "citizen":
            query = query.filter(LocationHistory.citizen_id == current_user.id)
        elif citizen_id:
            # Command center can filter by any citizen_id
            query = query.filter(LocationHistory.citizen_id == citizen_id)
    elif citizen_id:
        # Unauthenticated requests can filter by citizen_id
        query = query.filter(LocationHistory.citizen_id == citizen_id)
    
    # Date range filter
    if start_date:
        query = query.filter(LocationHistory.recorded_at >= start_date)
    if end_date:
        query = query.filter(LocationHistory.recorded_at <= end_date)
    
    # Order by most recent first
    query = query.order_by(desc(LocationHistory.recorded_at))
    
    # Apply pagination
    query, total_count = paginate_query(query, limit=limit, offset=offset)
    
    locations = query.all()
    
    return [
        LocationHistoryResponse(
            id=loc.id,
            device_id=loc.device_id,
            lora_device_id=loc.lora_device_id,
            citizen_id=loc.citizen_id,
            latitude=loc.latitude,
            longitude=loc.longitude,
            accuracy=loc.accuracy,
            altitude=loc.altitude,
            heading=loc.heading,
            speed=loc.speed,
            source=loc.source.value,
            recorded_at=loc.recorded_at,
            created_at=loc.created_at
        )
        for loc in locations
    ]


@router.get("/history/last", response_model=LocationHistoryResponse)
async def get_last_location(
    device_id: Optional[UUID] = Query(None, description="Get last location for device ID"),
    lora_device_id: Optional[UUID] = Query(None, description="Get last location for LoRa device ID"),
    citizen_id: Optional[UUID] = Query(None, description="Get last location for citizen ID"),
    current_user: Optional[Citizen] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    """Get last known location for device/citizen."""
    query = db.query(LocationHistory)
    
    # At least one filter must be provided
    if not device_id and not lora_device_id and not citizen_id:
        raise validation_error("At least one of device_id, lora_device_id, or citizen_id must be provided")
    
    # Apply filters
    if device_id:
        query = query.filter(LocationHistory.device_id == device_id)
    
    if lora_device_id:
        query = query.filter(LocationHistory.lora_device_id == lora_device_id)
    
    # If user is authenticated, only show their own data unless they're command center
    if current_user:
        if current_user.role.value == "citizen":
            query = query.filter(LocationHistory.citizen_id == current_user.id)
        elif citizen_id:
            query = query.filter(LocationHistory.citizen_id == citizen_id)
    elif citizen_id:
        query = query.filter(LocationHistory.citizen_id == citizen_id)
    
    # Get most recent location
    last_location = query.order_by(desc(LocationHistory.recorded_at)).first()
    
    if not last_location:
        raise not_found_error("Location history")
    
    return LocationHistoryResponse(
        id=last_location.id,
        device_id=last_location.device_id,
        lora_device_id=last_location.lora_device_id,
        citizen_id=last_location.citizen_id,
        latitude=last_location.latitude,
        longitude=last_location.longitude,
        accuracy=last_location.accuracy,
        altitude=last_location.altitude,
        heading=last_location.heading,
        speed=last_location.speed,
        source=last_location.source.value,
        recorded_at=last_location.recorded_at,
        created_at=last_location.created_at
    )


@router.post("/predict", response_model=PredictedLocationResponse)
async def predict_location(db: Session = Depends(get_db)):
    """Predict location using AI (remote sensing concept)."""
    # Placeholder for AI location prediction - use pass as specified
    pass
