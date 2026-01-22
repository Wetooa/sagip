"""Location-related Pydantic schemas."""
from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from uuid import UUID

from app.schemas.common import BaseSchema


class LocationHistoryBase(BaseSchema):
    """Base location history schema."""
    latitude: float
    longitude: float
    accuracy: Optional[float] = None
    altitude: Optional[float] = None
    heading: Optional[float] = None
    speed: Optional[float] = None
    source: str


class LocationHistoryCreate(LocationHistoryBase):
    """Schema for creating location history."""
    device_id: Optional[UUID] = None
    lora_device_id: Optional[UUID] = None
    recorded_at: datetime


class LocationHistoryResponse(LocationHistoryBase):
    """Schema for location history response."""
    id: UUID
    device_id: Optional[UUID] = None
    lora_device_id: Optional[UUID] = None
    citizen_id: Optional[UUID] = None
    recorded_at: datetime
    created_at: datetime


class PredictedLocationBase(BaseSchema):
    """Base predicted location schema."""
    predicted_latitude: float
    predicted_longitude: float
    confidence_score: float
    prediction_method: str
    predicted_for_timestamp: datetime


class PredictedLocationCreate(PredictedLocationBase):
    """Schema for creating predicted location."""
    location_history_id: UUID
    device_id: Optional[UUID] = None
    lora_device_id: Optional[UUID] = None


class PredictedLocationResponse(PredictedLocationBase):
    """Schema for predicted location response."""
    id: UUID
    location_history_id: UUID
    citizen_id: Optional[UUID] = None
    device_id: Optional[UUID] = None
    lora_device_id: Optional[UUID] = None
    created_at: datetime
