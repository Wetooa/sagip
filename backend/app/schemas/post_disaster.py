"""Post-disaster Pydantic schemas."""
from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List
from uuid import UUID

from app.schemas.common import BaseSchema, TimestampSchema


class NeedsTicketBase(BaseSchema):
    """Base needs ticket schema."""
    need_type: str
    description: str
    priority: str
    status: str


class NeedsTicketCreate(NeedsTicketBase):
    """Schema for creating a needs ticket."""
    pass


class NeedsTicketUpdate(BaseSchema):
    """Schema for updating a needs ticket."""
    status: Optional[str] = None
    verified_at: Optional[datetime] = None
    fulfilled_at: Optional[datetime] = None


class NeedsTicketResponse(NeedsTicketBase, TimestampSchema):
    """Schema for needs ticket response."""
    id: UUID
    citizen_id: UUID
    ticket_number: str
    verified_at: Optional[datetime] = None
    matched_with: Optional[UUID] = None
    fulfilled_at: Optional[datetime] = None


class HealthReportBase(BaseSchema):
    """Base health report schema."""
    symptoms: List[str]
    severity: str
    location_latitude: Optional[float] = None
    location_longitude: Optional[float] = None
    is_anonymized: bool = True


class HealthReportCreate(HealthReportBase):
    """Schema for creating a health report."""
    reported_at: datetime


class HealthReportResponse(HealthReportBase):
    """Schema for health report response."""
    id: UUID
    citizen_id: Optional[UUID] = None
    reported_at: datetime
    created_at: datetime


class HealthClusterBase(BaseSchema):
    """Base health cluster schema."""
    cluster_name: str
    cluster_type: str
    center_latitude: float
    center_longitude: float
    radius_km: float
    affected_count: int
    severity: str
    status: str


class HealthClusterCreate(HealthClusterBase):
    """Schema for creating a health cluster."""
    detected_at: datetime


class HealthClusterResponse(HealthClusterBase, TimestampSchema):
    """Schema for health cluster response."""
    id: UUID
    detected_at: datetime
    resolved_at: Optional[datetime] = None


class MedicalDispatchBase(BaseSchema):
    """Base medical dispatch schema."""
    team_name: str
    team_size: int
    status: str
    target_latitude: float
    target_longitude: float
    notes: Optional[str] = None


class MedicalDispatchCreate(MedicalDispatchBase):
    """Schema for creating a medical dispatch."""
    health_cluster_id: UUID
    dispatched_at: datetime


class MedicalDispatchResponse(MedicalDispatchBase, TimestampSchema):
    """Schema for medical dispatch response."""
    id: UUID
    health_cluster_id: UUID
    dispatched_at: datetime
    arrived_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
