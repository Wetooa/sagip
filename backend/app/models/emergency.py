"""Emergency response database models."""
import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Boolean, Text, DateTime, Float, ForeignKey, Enum as SQLEnum, Index
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import enum

from app.core.database import Base


class IncidentType(str, enum.Enum):
    """Incident type enumeration."""
    TYPHOON = "typhoon"
    FLOOD = "flood"
    LANDSLIDE = "landslide"
    EARTHQUAKE = "earthquake"
    OTHER = "other"


class IncidentStatus(str, enum.Enum):
    """Incident status enumeration."""
    MONITORING = "monitoring"
    ACTIVE = "active"
    RESOLVED = "resolved"
    CANCELLED = "cancelled"


class Severity(str, enum.Enum):
    """Severity level enumeration."""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class SignalType(str, enum.Enum):
    """SOS signal type enumeration."""
    LORA = "lora"
    MESH = "mesh"
    MANUAL = "manual"


class SignalStatus(str, enum.Enum):
    """SOS signal status enumeration."""
    PENDING = "pending"
    RECEIVED = "received"
    DISPATCHED = "dispatched"
    RESOLVED = "resolved"


class RollCallStatus(str, enum.Enum):
    """Roll call status enumeration."""
    PENDING = "pending"
    ACTIVE = "active"
    COMPLETED = "completed"


class ResponseStatus(str, enum.Enum):
    """Roll call response status enumeration."""
    SAFE = "safe"
    STRANDED = "stranded"
    NEEDS_HELP = "needs_help"
    NO_RESPONSE = "no_response"


class DispatchStatus(str, enum.Enum):
    """Rescue/medical dispatch status enumeration."""
    DISPATCHED = "dispatched"
    EN_ROUTE = "en_route"
    ON_SITE = "on_site"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class Incident(Base):
    """Disaster incident model."""
    __tablename__ = "incidents"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    incident_name = Column(String, nullable=False)
    incident_type = Column(SQLEnum(IncidentType), nullable=False)
    status = Column(SQLEnum(IncidentStatus), nullable=False)
    severity = Column(SQLEnum(Severity), nullable=False)
    affected_region = Column(String, nullable=False, index=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    description = Column(Text, nullable=True)
    activated_at = Column(DateTime, nullable=True)
    resolved_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    sos_signals = relationship("SOSSignal", back_populates="incident", cascade="all, delete-orphan")
    roll_calls = relationship("RollCall", back_populates="incident", cascade="all, delete-orphan")
    rescue_dispatches = relationship("RescueDispatch", back_populates="incident", cascade="all, delete-orphan")


class SOSSignal(Base):
    """SOS distress signal model."""
    __tablename__ = "sos_signals"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    citizen_id = Column(UUID(as_uuid=True), ForeignKey("citizens.id"), nullable=False, index=True)
    incident_id = Column(UUID(as_uuid=True), ForeignKey("incidents.id"), nullable=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    signal_type = Column(SQLEnum(SignalType), nullable=False)
    status = Column(SQLEnum(SignalStatus), nullable=False)
    priority = Column(SQLEnum(Severity), nullable=False)
    message = Column(Text, nullable=True)
    received_at = Column(DateTime, nullable=False, index=True)
    resolved_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    citizen = relationship("Citizen")
    incident = relationship("Incident", back_populates="sos_signals")
    rescue_dispatches = relationship("RescueDispatch", back_populates="sos_signal", cascade="all, delete-orphan")


class RollCall(Base):
    """Automated roll call model."""
    __tablename__ = "roll_calls"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    incident_id = Column(UUID(as_uuid=True), ForeignKey("incidents.id"), nullable=False, index=True)
    roll_call_name = Column(String, nullable=False)
    affected_region = Column(String, nullable=False, index=True)
    status = Column(SQLEnum(RollCallStatus), nullable=False)
    triggered_at = Column(DateTime, nullable=False, index=True)
    completed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    incident = relationship("Incident", back_populates="roll_calls")
    responses = relationship("RollCallResponse", back_populates="roll_call", cascade="all, delete-orphan")


class RollCallResponse(Base):
    """Roll call response model."""
    __tablename__ = "roll_call_responses"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    roll_call_id = Column(UUID(as_uuid=True), ForeignKey("roll_calls.id"), nullable=False, index=True)
    citizen_id = Column(UUID(as_uuid=True), ForeignKey("citizens.id"), nullable=False, index=True)
    response_status = Column(SQLEnum(ResponseStatus), nullable=False)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    message = Column(Text, nullable=True)
    responded_at = Column(DateTime, nullable=False, index=True)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)

    # Relationships
    roll_call = relationship("RollCall", back_populates="responses")
    citizen = relationship("Citizen")


class RescueDispatch(Base):
    """Rescue team dispatch model."""
    __tablename__ = "rescue_dispatches"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    incident_id = Column(UUID(as_uuid=True), ForeignKey("incidents.id"), nullable=False)
    sos_signal_id = Column(UUID(as_uuid=True), ForeignKey("sos_signals.id"), nullable=True)
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
    incident = relationship("Incident", back_populates="rescue_dispatches")
    sos_signal = relationship("SOSSignal", back_populates="rescue_dispatches")
