"""Emergency response Pydantic schemas."""
from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from uuid import UUID

from app.schemas.common import BaseSchema, TimestampSchema


class IncidentBase(BaseSchema):
    """Base incident schema."""
    incident_name: str
    incident_type: str
    status: str
    severity: str
    affected_region: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    description: Optional[str] = None


class IncidentCreate(IncidentBase):
    """Schema for creating an incident."""
    pass


class IncidentUpdate(BaseSchema):
    """Schema for updating an incident."""
    incident_name: Optional[str] = None
    status: Optional[str] = None
    severity: Optional[str] = None
    description: Optional[str] = None
    activated_at: Optional[datetime] = None
    resolved_at: Optional[datetime] = None


class IncidentResponse(IncidentBase, TimestampSchema):
    """Schema for incident response."""
    id: UUID
    activated_at: Optional[datetime] = None
    resolved_at: Optional[datetime] = None


class SOSSignalBase(BaseSchema):
    """Base SOS signal schema."""
    latitude: float
    longitude: float
    signal_type: str
    status: str
    priority: str
    message: Optional[str] = None


class SOSSignalCreate(SOSSignalBase):
    """Schema for creating an SOS signal."""
    incident_id: Optional[UUID] = None
    received_at: datetime


class SOSSignalUpdate(BaseSchema):
    """Schema for updating an SOS signal."""
    status: Optional[str] = None
    resolved_at: Optional[datetime] = None


class SOSSignalResponse(SOSSignalBase, TimestampSchema):
    """Schema for SOS signal response."""
    id: UUID
    citizen_id: UUID
    incident_id: Optional[UUID] = None
    received_at: datetime
    resolved_at: Optional[datetime] = None


class RollCallBase(BaseSchema):
    """Base roll call schema."""
    roll_call_name: str
    affected_region: str
    status: str


class RollCallCreate(RollCallBase):
    """Schema for creating a roll call."""
    triggered_at: datetime


class RollCallResponse(RollCallBase, TimestampSchema):
    """Schema for roll call response."""
    id: UUID
    incident_id: UUID
    triggered_at: datetime
    completed_at: Optional[datetime] = None


class RollCallResponseBase(BaseSchema):
    """Base roll call response schema."""
    response_status: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    message: Optional[str] = None


class RollCallResponseCreate(RollCallResponseBase):
    """Schema for creating a roll call response."""
    roll_call_id: UUID
    responded_at: datetime


class RollCallResponseItem(RollCallResponseBase):
    """Schema for roll call response item."""
    id: UUID
    roll_call_id: UUID
    citizen_id: UUID
    responded_at: datetime
    created_at: datetime


class RescueDispatchBase(BaseSchema):
    """Base rescue dispatch schema."""
    team_name: str
    team_size: int
    status: str
    target_latitude: float
    target_longitude: float
    notes: Optional[str] = None


class RescueDispatchCreate(RescueDispatchBase):
    """Schema for creating a rescue dispatch."""
    incident_id: UUID
    sos_signal_id: Optional[UUID] = None
    dispatched_at: datetime


class RescueDispatchResponse(RescueDispatchBase, TimestampSchema):
    """Schema for rescue dispatch response."""
    id: UUID
    incident_id: UUID
    sos_signal_id: Optional[UUID] = None
    dispatched_at: datetime
    arrived_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
