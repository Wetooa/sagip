"""Citizen-related database models."""

import uuid
from datetime import datetime
from sqlalchemy import (
    Column,
    String,
    Integer,
    Boolean,
    Text,
    DateTime,
    Date,
    Float,
    ForeignKey,
    Enum as SQLEnum,
    JSON,
    Index,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import enum

from app.core.database import Base


class UserRole(str, enum.Enum):
    """User role enumeration."""

    CITIZEN = "citizen"
    COMMAND_CENTER = "command_center"


class RiskLevel(str, enum.Enum):
    """Risk level enumeration."""

    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class Citizen(Base):
    """Citizen/user account model."""

    __tablename__ = "citizens"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, nullable=False, index=True)
    phone_number = Column(String, nullable=True)
    full_name = Column(String, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(SQLEnum(UserRole), nullable=False, default=UserRole.CITIZEN)
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(
        DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    # Relationships
    census_data = relationship(
        "CensusData", back_populates="citizen", cascade="all, delete-orphan"
    )
    vulnerability_profiles = relationship(
        "VulnerabilityProfile",
        back_populates="citizen",
        uselist=False,
        cascade="all, delete-orphan",
    )
    devices = relationship(
        "Device", back_populates="citizen", cascade="all, delete-orphan"
    )
    lora_devices = relationship(
        "LoRaDevice", back_populates="citizen", cascade="all, delete-orphan"
    )
    location_history = relationship(
        "LocationHistory", back_populates="citizen", cascade="all, delete-orphan"
    )
    needs_tickets = relationship(
        "NeedsTicket", back_populates="citizen", cascade="all, delete-orphan"
    )
    health_reports = relationship(
        "HealthReport", back_populates="citizen", cascade="all, delete-orphan"
    )


class CensusData(Base):
    """Digital census data model."""

    __tablename__ = "census_data"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    citizen_id = Column(UUID(as_uuid=True), ForeignKey("citizens.id"), nullable=False)
    family_size = Column(Integer, nullable=False)
    medical_needs = Column(Text, nullable=True)
    volunteer_willingness = Column(Boolean, nullable=False, default=False)
    address = Column(String, nullable=False)
    barangay = Column(String, nullable=False, index=True)
    city = Column(String, nullable=False)
    province = Column(String, nullable=False)
    government_id = Column(String, nullable=True)
    birth_date = Column(Date, nullable=True)
    has_vulnerable_family_member = Column(Boolean, nullable=False, default=False)
    additional_info = Column(JSON, nullable=True)
    submitted_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(
        DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    # Relationships
    citizen = relationship("Citizen", back_populates="census_data")
    vulnerability_profile = relationship(
        "VulnerabilityProfile",
        back_populates="census_data",
        uselist=False,
        cascade="all, delete-orphan",
    )
    family_members = relationship(
        "FamilyMember",
        back_populates="census_data",
        cascade="all, delete-orphan",
    )


class VulnerabilityProfile(Base):
    """Vulnerability profiling model."""

    __tablename__ = "vulnerability_profiles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    citizen_id = Column(
        UUID(as_uuid=True), ForeignKey("citizens.id"), nullable=False, unique=True
    )
    census_data_id = Column(
        UUID(as_uuid=True), ForeignKey("census_data.id"), nullable=False, unique=True
    )
    risk_score = Column(Float, nullable=False)
    risk_level = Column(SQLEnum(RiskLevel), nullable=False)
    factors = Column(JSON, nullable=True)
    last_calculated_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(
        DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    # Relationships
    citizen = relationship("Citizen", back_populates="vulnerability_profiles")
    census_data = relationship("CensusData", back_populates="vulnerability_profile")


class FamilyMember(Base):
    """Family member model for census data."""

    __tablename__ = "family_members"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    census_data_id = Column(
        UUID(as_uuid=True), ForeignKey("census_data.id"), nullable=False, index=True
    )
    full_name = Column(String, nullable=False)
    relationship = Column(String, nullable=False)  # e.g., "spouse", "child", "parent", "sibling"
    age = Column(Integer, nullable=True)
    government_id = Column(String, nullable=True)
    is_vulnerable = Column(Boolean, nullable=False, default=False, index=True)
    vulnerability_type = Column(String, nullable=True)  # e.g., "elderly", "PWD", "bed-ridden", "sickly"
    medical_conditions = Column(Text, nullable=True)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(
        DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    # Relationships
    census_data = relationship("CensusData", back_populates="family_members")
