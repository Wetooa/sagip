"""Citizen registration endpoints."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user, get_password_hash
from app.schemas.citizen import CitizenCreate, CitizenResponse, CitizenUpdate
from app.models.citizen import Citizen
from app.utils.helpers import validation_error

router = APIRouter()


@router.post("/", response_model=CitizenResponse, status_code=status.HTTP_201_CREATED)
async def register_citizen(citizen_data: CitizenCreate, db: Session = Depends(get_db)):
    """Register a new citizen."""
    # Check if email already exists
    existing_citizen = db.query(Citizen).filter(Citizen.email == citizen_data.email).first()
    if existing_citizen:
        raise validation_error("Email already registered")
    
    # Create new citizen
    from app.models.citizen import UserRole
    hashed_password = get_password_hash(citizen_data.password)
    new_citizen = Citizen(
        email=citizen_data.email,
        phone_number=citizen_data.phone_number,
        full_name=citizen_data.full_name,
        password_hash=hashed_password,
        role=UserRole.CITIZEN  # Default role for new registrations
    )
    
    db.add(new_citizen)
    db.commit()
    db.refresh(new_citizen)
    
    # Check if census data exists
    has_census = len(new_citizen.census_data) > 0 if new_citizen.census_data else False
    
    response = CitizenResponse(
        id=new_citizen.id,
        email=new_citizen.email,
        phone_number=new_citizen.phone_number,
        full_name=new_citizen.full_name,
        role=new_citizen.role.value,
        is_active=new_citizen.is_active,
        created_at=new_citizen.created_at,
        updated_at=new_citizen.updated_at,
        has_census_data=has_census
    )
    
    return response


@router.get("/profile", response_model=CitizenResponse)
async def get_citizen_profile(
    current_user: Citizen = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get citizen profile."""
    # Check if census data exists
    has_census = len(current_user.census_data) > 0 if current_user.census_data else False
    
    response = CitizenResponse(
        id=current_user.id,
        email=current_user.email,
        phone_number=current_user.phone_number,
        full_name=current_user.full_name,
        role=current_user.role.value,
        is_active=current_user.is_active,
        created_at=current_user.created_at,
        updated_at=current_user.updated_at,
        has_census_data=has_census
    )
    
    return response


@router.put("/profile", response_model=CitizenResponse)
async def update_citizen_profile(
    citizen_data: CitizenUpdate,
    current_user: Citizen = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update citizen profile."""
    # Check if email is being changed and if it's already taken
    if citizen_data.email and citizen_data.email != current_user.email:
        existing_citizen = db.query(Citizen).filter(Citizen.email == citizen_data.email).first()
        if existing_citizen:
            raise validation_error("Email already registered")
        current_user.email = citizen_data.email
    
    if citizen_data.phone_number is not None:
        current_user.phone_number = citizen_data.phone_number
    
    if citizen_data.full_name is not None:
        current_user.full_name = citizen_data.full_name
    
    if citizen_data.is_active is not None:
        current_user.is_active = citizen_data.is_active
    
    db.commit()
    db.refresh(current_user)
    
    # Check if census data exists
    has_census = len(current_user.census_data) > 0 if current_user.census_data else False
    
    response = CitizenResponse(
        id=current_user.id,
        email=current_user.email,
        phone_number=current_user.phone_number,
        full_name=current_user.full_name,
        role=current_user.role.value,
        is_active=current_user.is_active,
        created_at=current_user.created_at,
        updated_at=current_user.updated_at,
        has_census_data=has_census
    )
    
    return response
