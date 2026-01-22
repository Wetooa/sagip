"""Citizen census endpoints."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.schemas.citizen import CensusDataCreate, CensusDataResponse, CensusDataUpdate
from app.models.citizen import Citizen, CensusData, VulnerabilityProfile, RiskLevel
from app.utils.helpers import not_found_error, validation_error

router = APIRouter()


@router.post("/", response_model=CensusDataResponse, status_code=status.HTTP_201_CREATED)
async def submit_census(
    census_data: CensusDataCreate,
    current_user: Citizen = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Submit digital census data (optional, requires auth)."""
    # Check if census data already exists for this citizen
    existing_census = db.query(CensusData).filter(CensusData.citizen_id == current_user.id).first()
    if existing_census:
        raise validation_error("Census data already exists. Use PUT to update.")
    
    # Create new census data
    new_census = CensusData(
        citizen_id=current_user.id,
        family_size=census_data.family_size,
        medical_needs=census_data.medical_needs,
        volunteer_willingness=census_data.volunteer_willingness,
        address=census_data.address,
        barangay=census_data.barangay,
        city=census_data.city,
        province=census_data.province,
        additional_info=census_data.additional_info
    )
    
    db.add(new_census)
    db.commit()
    db.refresh(new_census)
    
    # TODO: Calculate vulnerability profile (to be implemented as a service)
    # For now, create a basic vulnerability profile
    # This is a placeholder - actual algorithm should be in a service
    risk_score = 0.5  # Placeholder
    risk_level = RiskLevel.MEDIUM  # Placeholder
    
    vulnerability_profile = VulnerabilityProfile(
        citizen_id=current_user.id,
        census_data_id=new_census.id,
        risk_score=risk_score,
        risk_level=risk_level,
        factors={"note": "Placeholder - vulnerability profiling algorithm pending"}
    )
    
    db.add(vulnerability_profile)
    db.commit()
    
    response = CensusDataResponse(
        id=new_census.id,
        citizen_id=new_census.citizen_id,
        family_size=new_census.family_size,
        medical_needs=new_census.medical_needs,
        volunteer_willingness=new_census.volunteer_willingness,
        address=new_census.address,
        barangay=new_census.barangay,
        city=new_census.city,
        province=new_census.province,
        additional_info=new_census.additional_info,
        submitted_at=new_census.submitted_at,
        created_at=new_census.created_at,
        updated_at=new_census.updated_at
    )
    
    return response


@router.get("/", response_model=CensusDataResponse)
async def get_census_data(
    current_user: Citizen = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get own census data (requires auth)."""
    census_data = db.query(CensusData).filter(CensusData.citizen_id == current_user.id).first()
    if not census_data:
        raise not_found_error("Census data")
    
    response = CensusDataResponse(
        id=census_data.id,
        citizen_id=census_data.citizen_id,
        family_size=census_data.family_size,
        medical_needs=census_data.medical_needs,
        volunteer_willingness=census_data.volunteer_willingness,
        address=census_data.address,
        barangay=census_data.barangay,
        city=census_data.city,
        province=census_data.province,
        additional_info=census_data.additional_info,
        submitted_at=census_data.submitted_at,
        created_at=census_data.created_at,
        updated_at=census_data.updated_at
    )
    
    return response


@router.put("/", response_model=CensusDataResponse)
async def update_census_data(
    census_data: CensusDataUpdate,
    current_user: Citizen = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update census data (requires auth)."""
    existing_census = db.query(CensusData).filter(CensusData.citizen_id == current_user.id).first()
    if not existing_census:
        raise not_found_error("Census data")
    
    # Update fields if provided
    if census_data.family_size is not None:
        existing_census.family_size = census_data.family_size
    if census_data.medical_needs is not None:
        existing_census.medical_needs = census_data.medical_needs
    if census_data.volunteer_willingness is not None:
        existing_census.volunteer_willingness = census_data.volunteer_willingness
    if census_data.address is not None:
        existing_census.address = census_data.address
    if census_data.barangay is not None:
        existing_census.barangay = census_data.barangay
    if census_data.city is not None:
        existing_census.city = census_data.city
    if census_data.province is not None:
        existing_census.province = census_data.province
    if census_data.additional_info is not None:
        existing_census.additional_info = census_data.additional_info
    
    db.commit()
    db.refresh(existing_census)
    
    # TODO: Recalculate vulnerability profile after update
    # This should trigger a recalculation of the vulnerability profile
    
    response = CensusDataResponse(
        id=existing_census.id,
        citizen_id=existing_census.citizen_id,
        family_size=existing_census.family_size,
        medical_needs=existing_census.medical_needs,
        volunteer_willingness=existing_census.volunteer_willingness,
        address=existing_census.address,
        barangay=existing_census.barangay,
        city=existing_census.city,
        province=existing_census.province,
        additional_info=existing_census.additional_info,
        submitted_at=existing_census.submitted_at,
        created_at=existing_census.created_at,
        updated_at=existing_census.updated_at
    )
    
    return response
