"""Device-related Pydantic schemas."""
from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from uuid import UUID

from app.schemas.common import BaseSchema, TimestampSchema


class DeviceBase(BaseSchema):
    """Base device schema."""
    device_type: str
    device_identifier: str
    device_name: Optional[str] = None


class DeviceCreate(DeviceBase):
    """Schema for creating a device."""
    pass


class DeviceUpdate(BaseSchema):
    """Schema for updating a device."""
    device_name: Optional[str] = None
    is_active: Optional[bool] = None
    current_latitude: Optional[float] = None
    current_longitude: Optional[float] = None


class DeviceResponse(DeviceBase, TimestampSchema):
    """Schema for device response."""
    id: UUID
    citizen_id: Optional[UUID] = None
    is_active: bool
    current_latitude: Optional[float] = None
    current_longitude: Optional[float] = None
    last_seen_at: Optional[datetime] = None
    registered_at: datetime


class LoRaDeviceBase(BaseSchema):
    """Base LoRa device schema."""
    device_id: str
    device_name: Optional[str] = None


class LoRaDeviceCreate(LoRaDeviceBase):
    """Schema for creating a LoRa device."""
    pass


class LoRaDeviceUpdate(BaseSchema):
    """Schema for updating a LoRa device."""
    device_name: Optional[str] = None
    is_active: Optional[bool] = None
    current_latitude: Optional[float] = None
    current_longitude: Optional[float] = None


class LoRaDeviceResponse(LoRaDeviceBase, TimestampSchema):
    """Schema for LoRa device response."""
    id: UUID
    citizen_id: Optional[UUID] = None
    is_active: bool
    current_latitude: Optional[float] = None
    current_longitude: Optional[float] = None
    last_seen_at: Optional[datetime] = None
    registered_at: datetime
