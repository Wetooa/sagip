"""Monitoring-related Pydantic schemas."""
from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from uuid import UUID

from app.schemas.common import BaseSchema


class WaterLevelReadingBase(BaseSchema):
    """Base water level reading schema."""
    sensor_id: str
    location_name: str
    latitude: float
    longitude: float
    water_level_cm: float
    sensor_status: str
    sensor_metadata: Optional[dict] = None


class WaterLevelReadingCreate(WaterLevelReadingBase):
    """Schema for creating a water level reading."""
    reading_timestamp: datetime


class WaterLevelReadingResponse(WaterLevelReadingBase):
    """Schema for water level reading response."""
    id: UUID
    reading_timestamp: datetime
    created_at: datetime
