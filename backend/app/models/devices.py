"""Device-related database models."""
import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, Float, ForeignKey, Enum as SQLEnum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import enum

from app.core.database import Base


class DeviceType(str, enum.Enum):
    """Device type enumeration."""
    PHONE = "phone"
    TABLET = "tablet"
    OTHER = "other"


class Device(Base):
    """Device model (phones, tablets, etc.)."""
    __tablename__ = "devices"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    citizen_id = Column(UUID(as_uuid=True), ForeignKey("citizens.id"), nullable=True)
    device_type = Column(SQLEnum(DeviceType), nullable=False)
    device_identifier = Column(String, unique=True, nullable=False)
    device_name = Column(String, nullable=True)
    is_active = Column(Boolean, nullable=False, default=True)
    current_latitude = Column(Float, nullable=True)
    current_longitude = Column(Float, nullable=True)
    last_seen_at = Column(DateTime, nullable=True)
    registered_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    citizen = relationship("Citizen", back_populates="devices")
    location_history = relationship("LocationHistory", back_populates="device", cascade="all, delete-orphan")
    predicted_locations = relationship("PredictedLocation", back_populates="device", cascade="all, delete-orphan")


class LoRaDevice(Base):
    """LoRa device model."""
    __tablename__ = "lora_devices"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    citizen_id = Column(UUID(as_uuid=True), ForeignKey("citizens.id"), nullable=True)
    device_id = Column(String, unique=True, nullable=False)
    device_name = Column(String, nullable=True)
    is_active = Column(Boolean, nullable=False, default=True)
    current_latitude = Column(Float, nullable=True)
    current_longitude = Column(Float, nullable=True)
    last_seen_at = Column(DateTime, nullable=True)
    registered_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    citizen = relationship("Citizen", back_populates="lora_devices")
    location_history = relationship("LocationHistory", back_populates="lora_device", cascade="all, delete-orphan")
    predicted_locations = relationship("PredictedLocation", back_populates="lora_device", cascade="all, delete-orphan")
