"""Resource and volunteer finding tools."""
import uuid
from typing import Optional, List
from sqlalchemy.orm import Session
from sqlalchemy import and_

from app.models.nice_to_have import Asset, AssetType, Volunteer, AvailabilityStatus
from app.models.citizen import Citizen


def find_available_assets(
    db: Session,
    citizen_id: Optional[uuid.UUID] = None,
    asset_type: Optional[str] = None,
    location: Optional[str] = None,
    latitude: Optional[float] = None,
    longitude: Optional[float] = None
):
    """
    Find available assets (boats, vehicles, equipment) for disaster response.
    """
    query = db.query(Asset).filter(Asset.is_available == True)

    # Filter by asset type
    if asset_type:
        try:
            asset_type_enum = AssetType(asset_type.lower())
            query = query.filter(Asset.asset_type == asset_type_enum)
        except ValueError:
            pass

    # Filter by location if coordinates provided
    if latitude and longitude:
        lat_range = 0.18  # ~20km radius
        lng_range = 0.18
        query = query.filter(
            and_(
                Asset.location_latitude.between(latitude - lat_range, latitude + lat_range),
                Asset.location_longitude.between(longitude - lng_range, longitude + lng_range)
            )
        )

    assets = query.limit(20).all()

    result = {
        "location": location or (f"{latitude}, {longitude}" if latitude and longitude else "all_areas"),
        "asset_type": asset_type or "all",
        "assets": []
    }

    for asset in assets:
        # Get owner information
        owner = db.query(Citizen).filter(Citizen.id == asset.citizen_id).first()

        asset_info = {
            "asset_id": str(asset.id),
            "asset_type": asset.asset_type.value,
            "asset_name": asset.asset_name,
            "description": asset.description,
            "is_available": asset.is_available,
            "location": {
                "latitude": asset.location_latitude,
                "longitude": asset.location_longitude
            } if asset.location_latitude and asset.location_longitude else None,
            "registered_at": asset.registered_at.isoformat(),
            "owner": {
                "citizen_id": str(asset.citizen_id),
                "name": owner.full_name if owner else "Unknown",
                "phone": owner.phone_number if owner else None
            } if owner else None
        }

        result["assets"].append(asset_info)

    result["total_available"] = len(result["assets"])
    result["by_type"] = {}
    for asset in assets:
        asset_type = asset.asset_type.value
        result["by_type"][asset_type] = result["by_type"].get(asset_type, 0) + 1

    print(f"🛠️ [ASSETS] Found {len(assets)} available assets")
    return result


def find_volunteers(
    db: Session,
    citizen_id: Optional[uuid.UUID] = None,
    skills: Optional[List[str]] = None,
    barangay: Optional[str] = None
):
    """
    Find available volunteers with specific skills or in a specific barangay.
    """
    query = db.query(Volunteer).filter(
        Volunteer.availability_status == AvailabilityStatus.AVAILABLE
    )

    # Filter by barangay
    if barangay:
        query = query.filter(Volunteer.barangay.ilike(f"%{barangay}%"))

    volunteers = query.limit(50).all()

    # Filter by skills if provided (client-side filtering since skills is JSON)
    if skills:
        filtered_volunteers = []
        for volunteer in volunteers:
            volunteer_skills = volunteer.skills if isinstance(volunteer.skills, list) else []
            # Check if volunteer has any of the requested skills
            if any(skill.lower() in [s.lower() for s in volunteer_skills] for skill in skills):
                filtered_volunteers.append(volunteer)
        volunteers = filtered_volunteers

    result = {
        "barangay": barangay or "all",
        "skills": skills or [],
        "volunteers": []
    }

    for volunteer in volunteers:
        # Get citizen information
        citizen = db.query(Citizen).filter(Citizen.id == volunteer.citizen_id).first()

        volunteer_info = {
            "volunteer_id": str(volunteer.id),
            "citizen_id": str(volunteer.citizen_id),
            "name": citizen.full_name if citizen else "Unknown",
            "phone": citizen.phone_number if citizen else None,
            "email": citizen.email if citizen else None,
            "skills": volunteer.skills if isinstance(volunteer.skills, list) else [],
            "availability_status": volunteer.availability_status.value,
            "barangay": volunteer.barangay,
            "registered_at": volunteer.registered_at.isoformat()
        }

        result["volunteers"].append(volunteer_info)

    result["total_volunteers"] = len(result["volunteers"])
    
    # Count by skills
    result["by_skills"] = {}
    for volunteer in volunteers:
        vol_skills = volunteer.skills if isinstance(volunteer.skills, list) else []
        for skill in vol_skills:
            result["by_skills"][skill] = result["by_skills"].get(skill, 0) + 1

    print(f"👥 [VOLUNTEERS] Found {len(volunteers)} available volunteers")
    return result
