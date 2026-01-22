"""Citizen-related Pydantic schemas."""
from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional
from uuid import UUID

from app.schemas.common import BaseSchema, TimestampSchema


class CitizenBase(BaseSchema):
    """Base citizen schema."""
    email: EmailStr
    phone_number: Optional[str] = None
    full_name: str


class CitizenCreate(CitizenBase):
    """Schema for creating a citizen."""
    password: str


class CitizenUpdate(BaseSchema):
    """Schema for updating a citizen."""
    email: Optional[EmailStr] = None
    phone_number: Optional[str] = None
    full_name: Optional[str] = None
    is_active: Optional[bool] = None


class CitizenResponse(CitizenBase, TimestampSchema):
    """Schema for citizen response."""
    id: UUID
    role: str
    is_active: bool
    has_census_data: Optional[bool] = None  # Indicates if census data exists


class CensusDataBase(BaseSchema):
    """Base census data schema."""
    family_size: int
    medical_needs: Optional[str] = None
    volunteer_willingness: bool = False
    address: str
    barangay: str
    city: str
    province: str
    additional_info: Optional[dict] = None


class CensusDataCreate(CensusDataBase):
    """Schema for creating census data."""
    pass


class CensusDataUpdate(BaseSchema):
    """Schema for updating census data."""
    family_size: Optional[int] = None
    medical_needs: Optional[str] = None
    volunteer_willingness: Optional[bool] = None
    address: Optional[str] = None
    barangay: Optional[str] = None
    city: Optional[str] = None
    province: Optional[str] = None
    additional_info: Optional[dict] = None


class CensusDataResponse(CensusDataBase, TimestampSchema):
    """Schema for census data response."""
    id: UUID
    citizen_id: UUID
    submitted_at: datetime


class VulnerabilityProfileResponse(TimestampSchema):
    """Schema for vulnerability profile response."""
    id: UUID
    citizen_id: UUID
    census_data_id: UUID
    risk_score: float
    risk_level: str
    factors: Optional[dict] = None
    last_calculated_at: datetime
