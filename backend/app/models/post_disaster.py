"""Post-disaster database models."""
import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Boolean, Text, DateTime, Float, ForeignKey, Enum as SQLEnum, Index, Numeric, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import enum

from app.core.database import Base


class NeedType(str, enum.Enum):
    """Need type enumeration."""
    MEDICINE = "medicine"
    FOOD = "food"
    WATER = "water"
    SHELTER = "shelter"
    CLOTHING = "clothing"
    OTHER = "other"


class TicketStatus(str, enum.Enum):
    """Needs ticket status enumeration."""
    PENDING = "pending"
    VERIFIED = "verified"
    MATCHED = "matched"
    FULFILLED = "fulfilled"
    CANCELLED = "cancelled"


class Severity(str, enum.Enum):
    """Severity level enumeration."""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class HealthSeverity(str, enum.Enum):
    """Health report severity enumeration."""
    MILD = "mild"
    MODERATE = "moderate"
    SEVERE = "severe"


class ClusterStatus(str, enum.Enum):
    """Health cluster status enumeration."""
    DETECTED = "detected"
    INVESTIGATING = "investigating"
    RESOLVED = "resolved"


class DispatchStatus(str, enum.Enum):
    """Medical dispatch status enumeration."""
    DISPATCHED = "dispatched"
    EN_ROUTE = "en_route"
    ON_SITE = "on_site"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class NeedsTicket(Base):
    """Verified needs ticket model."""
    __tablename__ = "needs_tickets"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    citizen_id = Column(UUID(as_uuid=True), ForeignKey("citizens.id"), nullable=False, index=True)
    ticket_number = Column(String, unique=True, nullable=False)
    need_type = Column(SQLEnum(NeedType), nullable=False)
    description = Column(Text, nullable=False)
    priority = Column(SQLEnum(Severity), nullable=False)
    status = Column(SQLEnum(TicketStatus), nullable=False)
    verified_at = Column(DateTime, nullable=True)
    matched_with = Column(UUID(as_uuid=True), nullable=True)
    fulfilled_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, nullable=False, index=True)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    citizen = relationship("Citizen", back_populates="needs_tickets")


class HealthReport(Base):
    """Anonymized health symptom report model."""
    __tablename__ = "health_reports"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    citizen_id = Column(UUID(as_uuid=True), ForeignKey("citizens.id"), nullable=True, index=True)
    symptoms = Column(JSON, nullable=False)  # Array of symptoms
    severity = Column(SQLEnum(HealthSeverity), nullable=False)
    location_latitude = Column(Float, nullable=True)
    location_longitude = Column(Float, nullable=True)
    is_anonymized = Column(Boolean, nullable=False, default=True)
    reported_at = Column(DateTime, nullable=False, index=True)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)

    # Relationships
    citizen = relationship("Citizen", back_populates="health_reports")


class HealthCluster(Base):
    """Detected health outbreak cluster model."""
    __tablename__ = "health_clusters"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    cluster_name = Column(String, nullable=False)
    cluster_type = Column(String, nullable=False)
    center_latitude = Column(Float, nullable=False)
    center_longitude = Column(Float, nullable=False)
    radius_km = Column(Float, nullable=False)
    affected_count = Column(Integer, nullable=False)
    severity = Column(SQLEnum(Severity), nullable=False)
    status = Column(SQLEnum(ClusterStatus), nullable=False)
    detected_at = Column(DateTime, nullable=False, index=True)
    resolved_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    medical_dispatches = relationship("MedicalDispatch", back_populates="health_cluster", cascade="all, delete-orphan")


class MedicalDispatch(Base):
    """Medical team dispatch model."""
    __tablename__ = "medical_dispatches"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    health_cluster_id = Column(UUID(as_uuid=True), ForeignKey("health_clusters.id"), nullable=False)
    team_name = Column(String, nullable=False)
    team_size = Column(Integer, nullable=False)
    status = Column(SQLEnum(DispatchStatus), nullable=False)
    target_latitude = Column(Float, nullable=False)
    target_longitude = Column(Float, nullable=False)
    dispatched_at = Column(DateTime, nullable=False, index=True)
    arrived_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    health_cluster = relationship("HealthCluster", back_populates="medical_dispatches")
