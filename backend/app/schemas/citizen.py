"""Citizen-related Pydantic schemas."""
from pydantic import BaseModel, EmailStr
from datetime import datetime, date
from typing import Optional
from uuid import UUID

from app.schemas.common import BaseSchema, TimestampSchema


class LoginRequest(BaseModel):
    """Schema for login request."""
    email: EmailStr
    password: str


class LoginResponse(BaseModel):
    """Schema for login response."""
    access_token: str
    token_type: str = "bearer"
    user: "CitizenResponse"


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


class FamilyMemberBase(BaseSchema):
    """Base family member schema."""
    full_name: str
    relationship: str
    age: Optional[int] = None
    government_id: Optional[str] = None
    is_vulnerable: bool = False
    vulnerability_type: Optional[str] = None
    medical_conditions: Optional[str] = None


class FamilyMemberCreate(FamilyMemberBase):
    """Schema for creating a family member."""
    pass


class FamilyMemberUpdate(BaseSchema):
    """Schema for updating a family member."""
    full_name: Optional[str] = None
    relationship: Optional[str] = None
    age: Optional[int] = None
    government_id: Optional[str] = None
    is_vulnerable: Optional[bool] = None
    vulnerability_type: Optional[str] = None
    medical_conditions: Optional[str] = None


class FamilyMemberResponse(FamilyMemberBase, TimestampSchema):
    """Schema for family member response."""
    id: UUID
    census_data_id: UUID


class CensusDataBase(BaseSchema):
    """Base census data schema."""
    family_size: int
    medical_needs: Optional[str] = None
    volunteer_willingness: bool = False
    address: str
    barangay: str
    city: str
    province: str
    government_id: Optional[str] = None
    birth_date: Optional[date] = None
    has_vulnerable_family_member: bool = False
    additional_info: Optional[dict] = None


class CensusDataCreate(CensusDataBase):
    """Schema for creating census data."""
    family_members: Optional[list[FamilyMemberCreate]] = None


class CensusDataUpdate(BaseSchema):
    """Schema for updating census data."""
    family_size: Optional[int] = None
    medical_needs: Optional[str] = None
    volunteer_willingness: Optional[bool] = None
    address: Optional[str] = None
    barangay: Optional[str] = None
    city: Optional[str] = None
    province: Optional[str] = None
    government_id: Optional[str] = None
    birth_date: Optional[date] = None
    has_vulnerable_family_member: Optional[bool] = None
    additional_info: Optional[dict] = None


class CensusDataResponse(CensusDataBase, TimestampSchema):
    """Schema for census data response."""
    id: UUID
    citizen_id: UUID
    submitted_at: datetime
    family_members: Optional[list[FamilyMemberResponse]] = None


class VulnerabilityProfileResponse(TimestampSchema):
    """Schema for vulnerability profile response."""
    id: UUID
    citizen_id: UUID
    census_data_id: UUID
    risk_score: float
    risk_level: str
    factors: Optional[dict] = None
    last_calculated_at: datetime
