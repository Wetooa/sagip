"""Monitoring-related database models."""

import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, DateTime, Enum as SQLEnum, JSON, Index
from sqlalchemy.dialects.postgresql import UUID
import enum

from app.core.database import Base


class SensorStatus(str, enum.Enum):
    """Sensor status enumeration."""

    ACTIVE = "active"
    MAINTENANCE = "maintenance"
    OFFLINE = "offline"


class WaterLevelReading(Base):
    """Water level sensor reading model."""

    __tablename__ = "water_level_readings"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    sensor_id = Column(String, nullable=False, index=True)
    location_name = Column(String, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    water_level_cm = Column(Float, nullable=False)
    reading_timestamp = Column(DateTime, nullable=False, index=True)
    sensor_status = Column(SQLEnum(SensorStatus), nullable=False)
    sensor_metadata = Column(
        JSON, nullable=True
    )  # Renamed from 'metadata' to avoid SQLAlchemy conflict
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
