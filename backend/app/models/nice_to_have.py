"""Nice-to-have feature database models."""
import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, Text, DateTime, Float, ForeignKey, Enum as SQLEnum, Index, Numeric, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import enum

from app.core.database import Base


class AssetType(str, enum.Enum):
    """Asset type enumeration."""
    BOAT = "boat"
    VEHICLE = "vehicle"
    EQUIPMENT = "equipment"
    OTHER = "other"


class AvailabilityStatus(str, enum.Enum):
    """Volunteer availability status enumeration."""
    AVAILABLE = "available"
    BUSY = "busy"
    UNAVAILABLE = "unavailable"


class FundStatus(str, enum.Enum):
    """Donation fund status enumeration."""
    PENDING = "pending"
    CONFIRMED = "confirmed"
    AUTHORIZED = "authorized"
    DISTRIBUTED = "distributed"


class OrganizationType(str, enum.Enum):
    """External help organization type enumeration."""
    NGO = "ngo"
    PRIVATE_DONOR = "private_donor"
    GOVERNMENT = "government"
    OTHER = "other"


class HelpRequestStatus(str, enum.Enum):
    """External help request status enumeration."""
    PENDING = "pending"
    MATCHED = "matched"
    FULFILLED = "fulfilled"
    CANCELLED = "cancelled"


class HazardType(str, enum.Enum):
    """Crowdsourced hazard type enumeration."""
    FLOOD = "flood"
    LANDSLIDE = "landslide"
    DEBRIS = "debris"
    DAMAGE = "damage"
    OTHER = "other"


class HazardSeverity(str, enum.Enum):
    """Crowdsourced hazard severity enumeration."""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


class HazardStatus(str, enum.Enum):
    """Crowdsourced hazard status enumeration."""
    PENDING = "pending"
    VERIFIED = "verified"
    REJECTED = "rejected"


class Asset(Base):
    """Asset registry model."""
    __tablename__ = "assets"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    citizen_id = Column(UUID(as_uuid=True), ForeignKey("citizens.id"), nullable=False)
    asset_type = Column(SQLEnum(AssetType), nullable=False)
    asset_name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    is_available = Column(Boolean, nullable=False, default=True)
    location_latitude = Column(Float, nullable=True)
    location_longitude = Column(Float, nullable=True)
    registered_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    citizen = relationship("Citizen")


class Volunteer(Base):
    """Volunteer registry model."""
    __tablename__ = "volunteers"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    citizen_id = Column(UUID(as_uuid=True), ForeignKey("citizens.id"), nullable=False, unique=True)
    skills = Column(JSON, nullable=False)  # Array of skills
    availability_status = Column(SQLEnum(AvailabilityStatus), nullable=False)
    barangay = Column(String, nullable=False, index=True)
    registered_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    citizen = relationship("Citizen")


class DonationFund(Base):
    """Blockchain donation fund model."""
    __tablename__ = "donation_funds"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    transaction_hash = Column(String, unique=True, nullable=False)
    donor_address = Column(String, nullable=True)
    amount = Column(Numeric, nullable=False)
    currency = Column(String, nullable=False, default="PHP")
    purpose = Column(Text, nullable=True)
    status = Column(SQLEnum(FundStatus), nullable=False)
    blockchain_network = Column(String, nullable=False)
    transaction_timestamp = Column(DateTime, nullable=False, index=True)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)


class ExternalHelpRequest(Base):
    """External help portal request model."""
    __tablename__ = "external_help_requests"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    needs_ticket_id = Column(UUID(as_uuid=True), ForeignKey("needs_tickets.id"), nullable=True)
    organization_name = Column(String, nullable=False)
    organization_type = Column(SQLEnum(OrganizationType), nullable=False)
    contact_info = Column(JSON, nullable=False)
    offered_resources = Column(JSON, nullable=False)
    status = Column(SQLEnum(HelpRequestStatus), nullable=False)
    matched_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    needs_ticket = relationship("NeedsTicket")


class CrowdsourcedHazard(Base):
    """Crowdsourced hazard report model."""
    __tablename__ = "crowdsourced_hazards"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    reporter_citizen_id = Column(UUID(as_uuid=True), ForeignKey("citizens.id"), nullable=True)
    hazard_type = Column(SQLEnum(HazardType), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    description = Column(Text, nullable=False)
    severity = Column(SQLEnum(HazardSeverity), nullable=False)
    status = Column(SQLEnum(HazardStatus), nullable=False)
    verified_by = Column(UUID(as_uuid=True), nullable=True)  # Command center user ID
    verified_at = Column(DateTime, nullable=True)
    reported_at = Column(DateTime, nullable=False, index=True)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    reporter = relationship("Citizen")
