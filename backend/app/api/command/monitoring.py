"""Command Center monitoring endpoints."""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import and_, desc
from typing import Optional
from datetime import datetime
from uuid import UUID

from app.core.database import get_db
from app.core.security import get_current_user, get_current_user_optional
from app.schemas.monitoring import WaterLevelReadingCreate, WaterLevelReadingResponse
from app.models.monitoring import WaterLevelReading, SensorStatus
from app.models.citizen import Citizen
from app.utils.helpers import paginate_query, not_found_error, validation_error

router = APIRouter()


@router.post("/water-level", response_model=WaterLevelReadingResponse, status_code=status.HTTP_201_CREATED)
async def create_water_level_reading(
    reading_data: WaterLevelReadingCreate,
    current_user: Optional[Citizen] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    """Create water level reading."""
    # Validate sensor status
    try:
        sensor_status = SensorStatus(reading_data.sensor_status)
    except ValueError:
        raise validation_error(f"Invalid sensor_status: {reading_data.sensor_status}")
    
    # Create water level reading
    new_reading = WaterLevelReading(
        sensor_id=reading_data.sensor_id,
        location_name=reading_data.location_name,
        latitude=reading_data.latitude,
        longitude=reading_data.longitude,
        water_level_cm=reading_data.water_level_cm,
        reading_timestamp=reading_data.reading_timestamp,
        sensor_status=sensor_status,
        sensor_metadata=reading_data.sensor_metadata
    )
    
    db.add(new_reading)
    db.commit()
    db.refresh(new_reading)
    
    response = WaterLevelReadingResponse(
        id=new_reading.id,
        sensor_id=new_reading.sensor_id,
        location_name=new_reading.location_name,
        latitude=new_reading.latitude,
        longitude=new_reading.longitude,
        water_level_cm=new_reading.water_level_cm,
        reading_timestamp=new_reading.reading_timestamp,
        sensor_status=new_reading.sensor_status.value,
        sensor_metadata=new_reading.sensor_metadata,
        created_at=new_reading.created_at
    )
    
    return response


@router.get("/water-level", response_model=list[WaterLevelReadingResponse])
async def get_water_level_data(
    sensor_id: Optional[str] = Query(None, description="Filter by sensor ID"),
    location_name: Optional[str] = Query(None, description="Filter by location name"),
    start_date: Optional[datetime] = Query(None, description="Start date for date range filter"),
    end_date: Optional[datetime] = Query(None, description="End date for date range filter"),
    latitude: Optional[float] = Query(None, description="Filter by latitude (approximate)"),
    longitude: Optional[float] = Query(None, description="Filter by longitude (approximate)"),
    radius_km: Optional[float] = Query(None, description="Radius in km for location filter (requires lat/long)"),
    limit: Optional[int] = Query(100, ge=1, le=1000, description="Maximum number of results"),
    offset: Optional[int] = Query(0, ge=0, description="Number of results to skip"),
    current_user: Optional[Citizen] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    """Get water level data (with filters: sensor_id, date range, location)."""
    query = db.query(WaterLevelReading)
    
    # Apply filters
    if sensor_id:
        query = query.filter(WaterLevelReading.sensor_id == sensor_id)
    
    if location_name:
        query = query.filter(WaterLevelReading.location_name.ilike(f"%{location_name}%"))
    
    # Date range filter
    if start_date:
        query = query.filter(WaterLevelReading.reading_timestamp >= start_date)
    if end_date:
        query = query.filter(WaterLevelReading.reading_timestamp <= end_date)
    
    # Location-based filter (approximate, using simple distance calculation)
    if latitude is not None and longitude is not None:
        if radius_km is not None:
            # Simple bounding box approximation (not exact circle, but good enough for filtering)
            # 1 degree latitude ≈ 111 km, 1 degree longitude ≈ 111 km * cos(latitude)
            lat_delta = radius_km / 111.0
            lon_delta = radius_km / (111.0 * abs(latitude) if latitude != 0 else 111.0)
            query = query.filter(
                and_(
                    WaterLevelReading.latitude >= latitude - lat_delta,
                    WaterLevelReading.latitude <= latitude + lat_delta,
                    WaterLevelReading.longitude >= longitude - lon_delta,
                    WaterLevelReading.longitude <= longitude + lon_delta
                )
            )
        else:
            # Exact match if no radius specified
            query = query.filter(
                and_(
                    WaterLevelReading.latitude == latitude,
                    WaterLevelReading.longitude == longitude
                )
            )
    
    # Order by most recent first
    query = query.order_by(desc(WaterLevelReading.reading_timestamp))
    
    # Apply pagination
    query, total_count = paginate_query(query, limit=limit, offset=offset)
    
    readings = query.all()
    
    return [
        WaterLevelReadingResponse(
            id=reading.id,
            sensor_id=reading.sensor_id,
            location_name=reading.location_name,
            latitude=reading.latitude,
            longitude=reading.longitude,
            water_level_cm=reading.water_level_cm,
            reading_timestamp=reading.reading_timestamp,
            sensor_status=reading.sensor_status.value,
            sensor_metadata=reading.sensor_metadata,
            created_at=reading.created_at
        )
        for reading in readings
    ]


@router.get("/hazard-map")
async def get_hazard_map(db: Session = Depends(get_db)):
    """Get hazard map data from external APIs."""
    # Placeholder for external API integration - use pass as specified
    pass
