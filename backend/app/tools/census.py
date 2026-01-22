"""Census and roll call tools."""
import uuid
from datetime import datetime
from typing import Optional
from sqlalchemy.orm import Session
from sqlalchemy import and_

from app.models.citizen import CensusData, VulnerabilityProfile, RiskLevel
from app.models.emergency import RollCall, RollCallResponse, RollCallStatus, ResponseStatus


def update_census_status(
    db: Session,
    citizen_id: Optional[uuid.UUID] = None,
    status: Optional[str] = None,
    headcount: Optional[int] = None,
    location: Optional[str] = None,
    household_id: Optional[str] = None
):
    """
    Update or create census data and respond to active roll calls.
    """
    if not citizen_id:
        return {"error": "citizen_id is required"}

    # Get or create census data
    census_data = db.query(CensusData).filter(
        CensusData.citizen_id == citizen_id
    ).first()

    # Map status to response status for roll calls
    status_mapping = {
        "SAFE": ResponseStatus.SAFE,
        "NEED_HELP": ResponseStatus.NEEDS_HELP,
        "STRANDED": ResponseStatus.STRANDED
    }
    response_status = status_mapping.get(status.upper() if status else "SAFE", ResponseStatus.SAFE)

    # Update or create census data
    if census_data:
        if headcount:
            census_data.family_size = headcount
        census_data.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(census_data)
    else:
        # Create new census data entry
        census_data = CensusData(
            citizen_id=citizen_id,
            family_size=headcount or 1,
            address=location or "Unknown",
            barangay=location or "Unknown",  # Simplified - should parse location
            city="Unknown",
            province="Unknown",
            submitted_at=datetime.utcnow()
        )
        db.add(census_data)
        db.commit()
        db.refresh(census_data)

    # Check for active roll calls in the area
    active_roll_calls = db.query(RollCall).filter(
        and_(
            RollCall.status == RollCallStatus.ACTIVE,
            RollCall.affected_region.contains(location or "") if location else True
        )
    ).all()

    roll_call_responses = []
    for roll_call in active_roll_calls:
        # Check if already responded
        existing_response = db.query(RollCallResponse).filter(
            and_(
                RollCallResponse.roll_call_id == roll_call.id,
                RollCallResponse.citizen_id == citizen_id
            )
        ).first()

        if not existing_response:
            # Create roll call response
            response = RollCallResponse(
                roll_call_id=roll_call.id,
                citizen_id=citizen_id,
                response_status=response_status,
                responded_at=datetime.utcnow()
            )
            db.add(response)
            roll_call_responses.append({
                "roll_call_id": str(roll_call.id),
                "roll_call_name": roll_call.roll_call_name,
                "response_status": response_status.value
            })
        else:
            # Update existing response
            existing_response.response_status = response_status
            existing_response.responded_at = datetime.utcnow()
            roll_call_responses.append({
                "roll_call_id": str(roll_call.id),
                "roll_call_name": roll_call.roll_call_name,
                "response_status": response_status.value,
                "updated": True
            })

    db.commit()

    # Get vulnerability profile
    vulnerability = db.query(VulnerabilityProfile).filter(
        VulnerabilityProfile.citizen_id == citizen_id
    ).first()

    result = {
        "household_id": household_id or str(census_data.id),
        "status": status or "SAFE",
        "headcount": census_data.family_size,
        "census_data_id": str(census_data.id),
        "last_updated": census_data.updated_at.isoformat(),
        "roll_call_responses": roll_call_responses,
        "vulnerability_profile": {
            "risk_level": vulnerability.risk_level.value if vulnerability else "unknown",
            "risk_score": vulnerability.risk_score if vulnerability else None
        } if vulnerability else None
    }

    print(f"📋 [CENSUS TOOL] Updated census for citizen {citizen_id}, responded to {len(roll_call_responses)} roll calls")
    return result


def check_roll_call_status(
    db: Session,
    citizen_id: Optional[uuid.UUID] = None,
    roll_call_id: Optional[str] = None,
    location: Optional[str] = None
):
    """
    Check active roll calls and response status.
    """
    if roll_call_id:
        try:
            roll_call_uuid = uuid.UUID(roll_call_id)
            roll_calls = db.query(RollCall).filter(RollCall.id == roll_call_uuid).all()
        except ValueError:
            return {"error": "Invalid roll call ID format"}
    elif location:
        roll_calls = db.query(RollCall).filter(
            and_(
                RollCall.status == RollCallStatus.ACTIVE,
                RollCall.affected_region.contains(location)
            )
        ).all()
    else:
        # Get all active roll calls
        roll_calls = db.query(RollCall).filter(
            RollCall.status == RollCallStatus.ACTIVE
        ).all()

    if not roll_calls:
        return {
            "status": "no_active_roll_calls",
            "message": "No active roll calls found"
        }

    result = {
        "roll_calls": []
    }

    for roll_call in roll_calls:
        # Get response statistics
        total_responses = db.query(RollCallResponse).filter(
            RollCallResponse.roll_call_id == roll_call.id
        ).count()

        safe_count = db.query(RollCallResponse).filter(
            and_(
                RollCallResponse.roll_call_id == roll_call.id,
                RollCallResponse.response_status == ResponseStatus.SAFE
            )
        ).count()

        needs_help_count = db.query(RollCallResponse).filter(
            and_(
                RollCallResponse.roll_call_id == roll_call.id,
                RollCallResponse.response_status == ResponseStatus.NEEDS_HELP
            )
        ).count()

        stranded_count = db.query(RollCallResponse).filter(
            and_(
                RollCallResponse.roll_call_id == roll_call.id,
                RollCallResponse.response_status == ResponseStatus.STRANDED
            )
        ).count()

        # Check if citizen has responded
        citizen_response = None
        if citizen_id:
            response = db.query(RollCallResponse).filter(
                and_(
                    RollCallResponse.roll_call_id == roll_call.id,
                    RollCallResponse.citizen_id == citizen_id
                )
            ).first()
            if response:
                citizen_response = {
                    "status": response.response_status.value,
                    "responded_at": response.responded_at.isoformat()
                }

        result["roll_calls"].append({
            "roll_call_id": str(roll_call.id),
            "name": roll_call.roll_call_name,
            "affected_region": roll_call.affected_region,
            "status": roll_call.status.value,
            "triggered_at": roll_call.triggered_at.isoformat(),
            "statistics": {
                "total_responses": total_responses,
                "safe": safe_count,
                "needs_help": needs_help_count,
                "stranded": stranded_count,
                "no_response": 0  # Would need total citizens in area to calculate
            },
            "citizen_response": citizen_response
        })

    result["total_active"] = len(roll_calls)
    return result
