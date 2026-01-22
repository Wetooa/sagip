"""Citizen census endpoints."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.schemas.citizen import CensusDataCreate, CensusDataResponse, CensusDataUpdate, FamilyMemberResponse
from app.models.citizen import Citizen, CensusData, VulnerabilityProfile, FamilyMember, RiskLevel
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
    
    # Determine has_vulnerable_family_member flag
    # Check if explicitly set or if any family members are vulnerable
    has_vulnerable = census_data.has_vulnerable_family_member
    if census_data.family_members:
        has_vulnerable = has_vulnerable or any(member.is_vulnerable for member in census_data.family_members)
    
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
        government_id=census_data.government_id,
        birth_date=census_data.birth_date,
        has_vulnerable_family_member=has_vulnerable,
        additional_info=census_data.additional_info
    )
    
    db.add(new_census)
    db.commit()
    db.refresh(new_census)
    
    # Create family members if provided
    family_members_list = []
    if census_data.family_members:
        for member_data in census_data.family_members:
            family_member = FamilyMember(
                census_data_id=new_census.id,
                full_name=member_data.full_name,
                relationship=member_data.relationship,
                age=member_data.age,
                government_id=member_data.government_id,
                is_vulnerable=member_data.is_vulnerable,
                vulnerability_type=member_data.vulnerability_type,
                medical_conditions=member_data.medical_conditions
            )
            db.add(family_member)
            family_members_list.append(family_member)
        
        db.commit()
        # Refresh all family members to get their IDs
        for member in family_members_list:
            db.refresh(member)
    
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
    
    # Build family members response
    family_members_response = [
        FamilyMemberResponse(
            id=member.id,
            census_data_id=member.census_data_id,
            full_name=member.full_name,
            relationship=member.relationship,
            age=member.age,
            government_id=member.government_id,
            is_vulnerable=member.is_vulnerable,
            vulnerability_type=member.vulnerability_type,
            medical_conditions=member.medical_conditions,
            created_at=member.created_at,
            updated_at=member.updated_at
        )
        for member in family_members_list
    ] if family_members_list else None
    
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
        government_id=new_census.government_id,
        birth_date=new_census.birth_date,
        has_vulnerable_family_member=new_census.has_vulnerable_family_member,
        additional_info=new_census.additional_info,
        submitted_at=new_census.submitted_at,
        created_at=new_census.created_at,
        updated_at=new_census.updated_at,
        family_members=family_members_response
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
    
    # Get family members
    family_members = db.query(FamilyMember).filter(
        FamilyMember.census_data_id == census_data.id
    ).all()
    
    family_members_response = [
        FamilyMemberResponse(
            id=member.id,
            census_data_id=member.census_data_id,
            full_name=member.full_name,
            relationship=member.relationship,
            age=member.age,
            government_id=member.government_id,
            is_vulnerable=member.is_vulnerable,
            vulnerability_type=member.vulnerability_type,
            medical_conditions=member.medical_conditions,
            created_at=member.created_at,
            updated_at=member.updated_at
        )
        for member in family_members
    ] if family_members else None
    
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
        government_id=census_data.government_id,
        birth_date=census_data.birth_date,
        has_vulnerable_family_member=census_data.has_vulnerable_family_member,
        additional_info=census_data.additional_info,
        submitted_at=census_data.submitted_at,
        created_at=census_data.created_at,
        updated_at=census_data.updated_at,
        family_members=family_members_response
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
    if census_data.government_id is not None:
        existing_census.government_id = census_data.government_id
    if census_data.birth_date is not None:
        existing_census.birth_date = census_data.birth_date
    if census_data.has_vulnerable_family_member is not None:
        existing_census.has_vulnerable_family_member = census_data.has_vulnerable_family_member
    if census_data.additional_info is not None:
        existing_census.additional_info = census_data.additional_info
    
    db.commit()
    db.refresh(existing_census)
    
    # Get family members for response
    family_members = db.query(FamilyMember).filter(
        FamilyMember.census_data_id == existing_census.id
    ).all()
    
    # TODO: Recalculate vulnerability profile after update
    # This should trigger a recalculation of the vulnerability profile
    
    family_members_response = [
        FamilyMemberResponse(
            id=member.id,
            census_data_id=member.census_data_id,
            full_name=member.full_name,
            relationship=member.relationship,
            age=member.age,
            government_id=member.government_id,
            is_vulnerable=member.is_vulnerable,
            vulnerability_type=member.vulnerability_type,
            medical_conditions=member.medical_conditions,
            created_at=member.created_at,
            updated_at=member.updated_at
        )
        for member in family_members
    ] if family_members else None
    
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
        government_id=existing_census.government_id,
        birth_date=existing_census.birth_date,
        has_vulnerable_family_member=existing_census.has_vulnerable_family_member,
        additional_info=existing_census.additional_info,
        submitted_at=existing_census.submitted_at,
        created_at=existing_census.created_at,
        updated_at=existing_census.updated_at,
        family_members=family_members_response
    )
    
    return response
