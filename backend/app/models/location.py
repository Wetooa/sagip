"""Location tracking database models."""
import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, DateTime, ForeignKey, Enum as SQLEnum, Index
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import enum

from app.core.database import Base


class LocationSource(str, enum.Enum):
    """Location source enumeration."""
    GPS = "gps"
    LORA = "lora"
    MANUAL = "manual"
    PREDICTED = "predicted"


class LocationHistory(Base):
    """Location history tracking model."""
    __tablename__ = "location_history"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    device_id = Column(UUID(as_uuid=True), ForeignKey("devices.id"), nullable=True)
    lora_device_id = Column(UUID(as_uuid=True), ForeignKey("lora_devices.id"), nullable=True)
    citizen_id = Column(UUID(as_uuid=True), ForeignKey("citizens.id"), nullable=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    accuracy = Column(Float, nullable=True)
    altitude = Column(Float, nullable=True)
    heading = Column(Float, nullable=True)
    speed = Column(Float, nullable=True)
    source = Column(SQLEnum(LocationSource), nullable=False)
    recorded_at = Column(DateTime, nullable=False, index=True)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)

    # Relationships
    device = relationship("Device", back_populates="location_history")
    lora_device = relationship("LoRaDevice", back_populates="location_history")
    citizen = relationship("Citizen", back_populates="location_history")
    predicted_locations = relationship("PredictedLocation", back_populates="location_history", cascade="all, delete-orphan")


class PredictedLocation(Base):
    """Predicted location model (AI-based predictions)."""
    __tablename__ = "predicted_locations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    location_history_id = Column(UUID(as_uuid=True), ForeignKey("location_history.id"), nullable=False)
    citizen_id = Column(UUID(as_uuid=True), ForeignKey("citizens.id"), nullable=True, index=True)
    device_id = Column(UUID(as_uuid=True), ForeignKey("devices.id"), nullable=True)
    lora_device_id = Column(UUID(as_uuid=True), ForeignKey("lora_devices.id"), nullable=True)
    predicted_latitude = Column(Float, nullable=False)
    predicted_longitude = Column(Float, nullable=False)
    confidence_score = Column(Float, nullable=False)
    prediction_method = Column(String, nullable=False)
    predicted_for_timestamp = Column(DateTime, nullable=False, index=True)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)

    # Relationships
    location_history = relationship("LocationHistory", back_populates="predicted_locations")
    citizen = relationship("Citizen")
    device = relationship("Device", back_populates="predicted_locations")
    lora_device = relationship("LoRaDevice", back_populates="predicted_locations")
