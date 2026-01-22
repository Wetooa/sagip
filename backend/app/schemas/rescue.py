"""Rescue request Pydantic schemas."""
from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import Field, field_validator

from app.schemas.common import BaseSchema, TimestampSchema


class RescueNeeds(BaseSchema):
    """Fixed checklist of needs with optional free text."""

    water: bool = False
    food: bool = False
    medical: bool = False
    shelter: bool = False
    evacuation: bool = False
    other: Optional[str] = None


class RescueRequestBase(BaseSchema):
    """Shared fields for rescue request payloads."""

    latitude: float
    longitude: float
    urgency: str = "normal"
    needs: RescueNeeds
    name: Optional[str] = None
    contact: Optional[str] = None
    household_size: Optional[int] = Field(None, ge=1)
    note: Optional[str] = None
    photo_url: Optional[str] = None

    @field_validator("urgency")
    @classmethod
    def validate_urgency(cls, value: str) -> str:
        allowed = {"normal", "high", "critical"}
        if value not in allowed:
            raise ValueError(f"urgency must be one of {', '.join(sorted(allowed))}")
        return value

    @field_validator("needs", mode="before")
    @classmethod
    def coerce_needs(cls, value):
        if isinstance(value, RescueNeeds):
            return value
        if isinstance(value, dict):
            return RescueNeeds(
                water=bool(value.get("water", False)),
                food=bool(value.get("food", False)),
                medical=bool(value.get("medical", False)),
                shelter=bool(value.get("shelter", False)),
                evacuation=bool(value.get("evacuation", False)),
                other=value.get("other"),
            )
        raise ValueError("needs must be an object")


class RescueRequestCreate(RescueRequestBase):
    """Payload to create a rescue request."""

    pass


class RescueRequestUpdate(BaseSchema):
    """Payload to update rescue urgency, note, or status."""

    urgency: Optional[str] = None
    note: Optional[str] = None
    status: Optional[str] = None

    @field_validator("urgency")
    @classmethod
    def validate_update_urgency(cls, value: Optional[str]) -> Optional[str]:
        if value is None:
            return value
        allowed = {"normal", "high", "critical"}
        if value not in allowed:
            raise ValueError(f"urgency must be one of {', '.join(sorted(allowed))}")
        return value

    @field_validator("status")
    @classmethod
    def validate_update_status(cls, value: Optional[str]) -> Optional[str]:
        if value is None:
            return value
        allowed = {"open", "in_progress", "resolved", "cancelled"}
        if value not in allowed:
            raise ValueError(f"status must be one of {', '.join(sorted(allowed))}")
        return value


class RescueRequestResponse(RescueRequestBase, TimestampSchema):
    """Response model for rescue requests."""

    id: UUID
    citizen_id: Optional[UUID] = None
    status: str