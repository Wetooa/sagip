"""Common/base Pydantic schemas."""
from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from uuid import UUID


class BaseSchema(BaseModel):
    """Base schema with common configuration."""
    class Config:
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat(),
            UUID: lambda v: str(v),
        }


class TimestampSchema(BaseSchema):
    """Schema with timestamps."""
    created_at: datetime
    updated_at: Optional[datetime] = None


class IDSchema(BaseSchema):
    """Schema with ID."""
    id: UUID


class ResponseSchema(BaseSchema):
    """Base response schema."""
    pass


class MessageResponse(BaseSchema):
    """Standard message response."""
    message: str
