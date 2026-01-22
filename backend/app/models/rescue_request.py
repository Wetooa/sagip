"""Rescue request database model."""
import uuid
import enum
from datetime import datetime
from sqlalchemy import (
    Column,
    String,
    Integer,
    Float,
    DateTime,
    Text,
    ForeignKey,
    Enum as SQLEnum,
    Index,
)
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship

from app.core.database import Base


class RescueRequestStatus(str, enum.Enum):
    """Lifecycle of a rescue request."""

    OPEN = "open"
    IN_PROGRESS = "in_progress"
    RESOLVED = "resolved"
    CANCELLED = "cancelled"


class RescueUrgency(str, enum.Enum):
    """Urgency levels for rescue requests."""

    NORMAL = "normal"
    HIGH = "high"
    CRITICAL = "critical"


class RescueRequest(Base):
    """Citizen or anonymous rescue request dropped on the map."""

    __tablename__ = "rescue_requests"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    citizen_id = Column(UUID(as_uuid=True), ForeignKey("citizens.id"), nullable=True, index=True)
    name = Column(String, nullable=True)
    contact = Column(String, nullable=True)
    household_size = Column(Integer, nullable=True)
    status = Column(SQLEnum(RescueRequestStatus), nullable=False, default=RescueRequestStatus.OPEN)
    urgency = Column(SQLEnum(RescueUrgency), nullable=False, default=RescueUrgency.NORMAL)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    needs = Column(JSONB, nullable=False, default=dict)
    note = Column(Text, nullable=True)
    photo_url = Column(String, nullable=True)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

    citizen = relationship("Citizen")

    __table_args__ = (
        Index("ix_rescue_requests_status_created_at", "status", "created_at"),
        Index("ix_rescue_requests_location", "latitude", "longitude"),
    )
