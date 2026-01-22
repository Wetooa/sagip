"""Rescue and emergency reporting tools."""
import uuid
from datetime import datetime
from typing import Optional
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_

from app.models.emergency import (
    Incident, SOSSignal, RescueDispatch,
    IncidentType, IncidentStatus, SignalType, SignalStatus, Severity, DispatchStatus
)


def report_emergency(
    db: Session,
    citizen_id: Optional[uuid.UUID] = None,
    location: Optional[str] = None,
    latitude: Optional[float] = None,
    longitude: Optional[float] = None,
    incident_type: Optional[str] = None,
    severity: Optional[str] = None,
    message: Optional[str] = None,
    injury_type: Optional[str] = None,
    flood_level: Optional[str] = None,
    people_count: Optional[int] = None
):
    """
    Report an emergency and create an SOS signal.
    If citizen_id is provided, links to citizen. Otherwise creates anonymous report.
    """
    # Determine severity from parameters
    if severity:
        try:
            priority = Severity(severity.lower())
        except ValueError:
            priority = Severity.HIGH
    elif flood_level:
        # Map flood levels to severity
        flood_to_severity = {
            "ankle": Severity.MEDIUM,
            "waist": Severity.HIGH,
            "roof": Severity.CRITICAL
        }
        priority = flood_to_severity.get(flood_level.lower(), Severity.HIGH)
    else:
        priority = Severity.HIGH

    # Find related incident if location/type provided
    incident_id = None
    if location or (latitude and longitude):
        # Try to find active incident in the area
        incident_query = db.query(Incident).filter(
            Incident.status.in_([IncidentStatus.MONITORING, IncidentStatus.ACTIVE])
        )
        
        if incident_type:
            try:
                inc_type = IncidentType(incident_type.lower())
                incident_query = incident_query.filter(Incident.incident_type == inc_type)
            except ValueError:
                pass
        
        # If coordinates provided, find nearby incidents (within ~10km radius approximation)
        if latitude and longitude:
            # Simple bounding box search (rough approximation)
            lat_range = 0.09  # ~10km
            lng_range = 0.09
            incident_query = incident_query.filter(
                and_(
                    Incident.latitude.between(latitude - lat_range, latitude + lat_range),
                    Incident.longitude.between(longitude - lng_range, longitude + lng_range)
                )
            )
        
        related_incident = incident_query.first()
        if related_incident:
            incident_id = related_incident.id

    # Default coordinates if not provided (use 0,0 as fallback - should be improved)
    if not latitude:
        latitude = 0.0
    if not longitude:
        longitude = 0.0

    # Validate citizen_id exists if provided
    final_citizen_id = citizen_id
    if citizen_id:
        from app.models.citizen import Citizen
        citizen = db.query(Citizen).filter(Citizen.id == citizen_id).first()
        if not citizen:
            return {
                "error": "Invalid citizen_id",
                "message": f"Citizen with ID {citizen_id} does not exist in the database",
                "citizen_id": str(citizen_id)
            }
    else:
        # For anonymous reports, we need to handle this differently
        # Since citizen_id is required (nullable=False), we return an error
        # In production, you might want to create an anonymous citizen record or make the column nullable
        return {
            "error": "citizen_id_required",
            "message": "citizen_id is required to report an emergency. Please provide a valid citizen ID.",
            "note": "Anonymous emergency reports are not currently supported due to database constraints"
        }

    # Create SOS signal
    sos_signal = SOSSignal(
        citizen_id=final_citizen_id,
        incident_id=incident_id,
        latitude=latitude,
        longitude=longitude,
        signal_type=SignalType.MANUAL,
        status=SignalStatus.PENDING,
        priority=priority,
        message=message or f"Emergency reported: {incident_type or 'unknown'}",
        received_at=datetime.utcnow()
    )
    
    db.add(sos_signal)
    db.commit()
    db.refresh(sos_signal)

    # Check if rescue is already dispatched
    existing_dispatch = db.query(RescueDispatch).filter(
        RescueDispatch.sos_signal_id == sos_signal.id
    ).first()

    result = {
        "sos_signal_id": str(sos_signal.id),
        "ticket_id": f"RSC-{sos_signal.id.hex[:6].upper()}",
        "type": "rescue",
        "priority": priority.value,
        "status": "submitted",
        "incident_id": str(incident_id) if incident_id else None,
        "rescue_dispatched": existing_dispatch is not None,
        "rescue_status": existing_dispatch.status.value if existing_dispatch else None,
        "created_at": sos_signal.created_at.isoformat()
    }

    if existing_dispatch:
        result["dispatch_team"] = existing_dispatch.team_name
        result["dispatch_status"] = existing_dispatch.status.value
        result["dispatched_at"] = existing_dispatch.dispatched_at.isoformat()

    print(f"🚨 [RESCUE TOOL] SOS Signal created: {sos_signal.id}")
    return result


def check_rescue_status(
    db: Session,
    citizen_id: Optional[uuid.UUID] = None,
    sos_signal_id: Optional[str] = None
):
    """
    Check the status of a rescue request.
    Can query by citizen_id (latest SOS) or specific sos_signal_id.
    """
    if sos_signal_id:
        try:
            signal_uuid = uuid.UUID(sos_signal_id)
            sos_signal = db.query(SOSSignal).filter(SOSSignal.id == signal_uuid).first()
        except ValueError:
            return {"error": "Invalid SOS signal ID format"}
    elif citizen_id:
        # Get latest SOS signal for this citizen
        sos_signal = db.query(SOSSignal).filter(
            SOSSignal.citizen_id == citizen_id
        ).order_by(SOSSignal.created_at.desc()).first()
    else:
        return {"error": "Either sos_signal_id or citizen_id must be provided"}

    if not sos_signal:
        return {
            "status": "not_found",
            "message": "No SOS signal found"
        }

    # Get rescue dispatch if exists
    rescue_dispatch = db.query(RescueDispatch).filter(
        RescueDispatch.sos_signal_id == sos_signal.id
    ).first()

    result = {
        "sos_signal_id": str(sos_signal.id),
        "status": sos_signal.status.value,
        "priority": sos_signal.priority.value,
        "location": {
            "latitude": sos_signal.latitude,
            "longitude": sos_signal.longitude
        },
        "message": sos_signal.message,
        "received_at": sos_signal.received_at.isoformat(),
        "rescue_dispatched": rescue_dispatch is not None
    }

    if rescue_dispatch:
        result["rescue"] = {
            "dispatch_id": str(rescue_dispatch.id),
            "team_name": rescue_dispatch.team_name,
            "team_size": rescue_dispatch.team_size,
            "status": rescue_dispatch.status.value,
            "dispatched_at": rescue_dispatch.dispatched_at.isoformat(),
            "arrived_at": rescue_dispatch.arrived_at.isoformat() if rescue_dispatch.arrived_at else None,
            "completed_at": rescue_dispatch.completed_at.isoformat() if rescue_dispatch.completed_at else None,
            "notes": rescue_dispatch.notes
        }

        # Calculate ETA if en route
        if rescue_dispatch.status == DispatchStatus.EN_ROUTE:
            # Rough ETA calculation (would need actual routing in production)
            result["rescue"]["estimated_arrival"] = "15-30 minutes"

    return result
