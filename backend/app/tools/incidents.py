"""Incident and hazard reporting tools."""
import uuid
from datetime import datetime, timedelta
from typing import Optional
from sqlalchemy.orm import Session
from sqlalchemy import and_

from app.models.emergency import Incident, SOSSignal, RescueDispatch, IncidentType, IncidentStatus, Severity
from app.models.nice_to_have import CrowdsourcedHazard, HazardType, HazardSeverity, HazardStatus


def get_active_incidents(
    db: Session,
    citizen_id: Optional[uuid.UUID] = None,
    location: Optional[str] = None,
    incident_type: Optional[str] = None,
    latitude: Optional[float] = None,
    longitude: Optional[float] = None
):
    """
    Get active incidents, optionally filtered by location and type.
    """
    query = db.query(Incident).filter(
        Incident.status.in_([IncidentStatus.MONITORING, IncidentStatus.ACTIVE])
    )

    # Filter by type
    if incident_type:
        try:
            inc_type = IncidentType(incident_type.lower())
            query = query.filter(Incident.incident_type == inc_type)
        except ValueError:
            pass

    # Filter by location if coordinates provided
    if latitude and longitude:
        lat_range = 0.18  # ~20km radius
        lng_range = 0.18
        query = query.filter(
            and_(
                Incident.latitude.between(latitude - lat_range, latitude + lat_range),
                Incident.longitude.between(longitude - lng_range, longitude + lng_range)
            )
        )

    incidents = query.order_by(Incident.created_at.desc()).limit(20).all()

    result = {
        "location": location or (f"{latitude}, {longitude}" if latitude and longitude else "all_areas"),
        "incidents": [
            {
                "incident_id": str(i.id),
                "name": i.incident_name,
                "type": i.incident_type.value,
                "status": i.status.value,
                "severity": i.severity.value,
                "affected_region": i.affected_region,
                "description": i.description,
                "coordinates": {
                    "latitude": i.latitude,
                    "longitude": i.longitude
                } if i.latitude and i.longitude else None,
                "activated_at": i.activated_at.isoformat() if i.activated_at else None,
                "created_at": i.created_at.isoformat()
            }
            for i in incidents
        ],
        "total_active": len(incidents),
        "by_type": {},
        "by_severity": {}
    }

    # Calculate statistics
    for incident in incidents:
        inc_type = incident.incident_type.value
        result["by_type"][inc_type] = result["by_type"].get(inc_type, 0) + 1
        
        severity = incident.severity.value
        result["by_severity"][severity] = result["by_severity"].get(severity, 0) + 1

    print(f"📢 [INCIDENTS] Found {len(incidents)} active incidents")
    return result


def report_hazard(
    db: Session,
    citizen_id: Optional[uuid.UUID] = None,
    hazard_type: Optional[str] = None,
    latitude: Optional[float] = None,
    longitude: Optional[float] = None,
    description: Optional[str] = None,
    severity: Optional[str] = None
):
    """
    Report a crowdsourced hazard.
    """
    if not latitude or not longitude:
        return {"error": "Latitude and longitude are required"}

    # Determine hazard type
    if hazard_type:
        try:
            hazard_type_enum = HazardType(hazard_type.lower())
        except ValueError:
            hazard_type_enum = HazardType.OTHER
    else:
        hazard_type_enum = HazardType.OTHER

    # Determine severity
    if severity:
        try:
            severity_enum = HazardSeverity(severity.lower())
        except ValueError:
            severity_enum = HazardSeverity.MEDIUM
    else:
        severity_enum = HazardSeverity.MEDIUM

    # Validate citizen_id if provided
    final_citizen_id = citizen_id
    if citizen_id:
        from app.models.citizen import Citizen
        citizen = db.query(Citizen).filter(Citizen.id == citizen_id).first()
        if not citizen:
            return {
                "error": "Invalid citizen_id",
                "message": f"Citizen with ID {citizen_id} does not exist in the database",
                "citizen_id": str(citizen_id),
                "note": "You can still report hazards anonymously by not providing a citizen_id"
            }

    # Create hazard report
    hazard = CrowdsourcedHazard(
        reporter_citizen_id=final_citizen_id,
        hazard_type=hazard_type_enum,
        latitude=latitude,
        longitude=longitude,
        description=description or f"Reported {hazard_type_enum.value} hazard",
        severity=severity_enum,
        status=HazardStatus.PENDING,  # Needs verification
        reported_at=datetime.utcnow()
    )

    db.add(hazard)
    db.commit()
    db.refresh(hazard)

    result = {
        "hazard_id": str(hazard.id),
        "hazard_type": hazard.hazard_type.value,
        "severity": hazard.severity.value,
        "status": hazard.status.value,
        "description": hazard.description,
        "coordinates": {
            "latitude": hazard.latitude,
            "longitude": hazard.longitude
        },
        "reported_at": hazard.reported_at.isoformat(),
        "message": "Hazard report submitted. Awaiting verification by command center."
    }

    print(f"⚠️ [HAZARD REPORT] Created hazard report: {hazard.id}")
    return result


def check_incident_status(
    db: Session,
    citizen_id: Optional[uuid.UUID] = None,
    incident_id: Optional[str] = None,
    location: Optional[str] = None,
    latitude: Optional[float] = None,
    longitude: Optional[float] = None
):
    """
    Check detailed status of an incident, including SOS signals and rescue dispatches.
    """
    if incident_id:
        try:
            incident_uuid = uuid.UUID(incident_id)
            incident = db.query(Incident).filter(Incident.id == incident_uuid).first()
        except ValueError:
            return {"error": "Invalid incident ID format"}
    elif latitude and longitude:
        # Find nearest incident
        lat_range = 0.18
        lng_range = 0.18
        incidents = db.query(Incident).filter(
            and_(
                Incident.status.in_([IncidentStatus.MONITORING, IncidentStatus.ACTIVE]),
                Incident.latitude.between(latitude - lat_range, latitude + lat_range),
                Incident.longitude.between(longitude - lng_range, longitude + lng_range)
            )
        ).all()
        incident = incidents[0] if incidents else None
    else:
        return {"error": "Either incident_id or location coordinates must be provided"}

    if not incident:
        return {
            "status": "not_found",
            "message": "No incident found"
        }

    # Get related SOS signals
    sos_signals = db.query(SOSSignal).filter(
        SOSSignal.incident_id == incident.id
    ).all()

    # Get rescue dispatches
    rescue_dispatches = db.query(RescueDispatch).filter(
        RescueDispatch.incident_id == incident.id
    ).all()

    # Get related roll calls
    from app.models.emergency import RollCall
    roll_calls = db.query(RollCall).filter(
        RollCall.incident_id == incident.id
    ).all()

    result = {
        "incident_id": str(incident.id),
        "name": incident.incident_name,
        "type": incident.incident_type.value,
        "status": incident.status.value,
        "severity": incident.severity.value,
        "affected_region": incident.affected_region,
        "description": incident.description,
        "coordinates": {
            "latitude": incident.latitude,
            "longitude": incident.longitude
        } if incident.latitude and incident.longitude else None,
        "activated_at": incident.activated_at.isoformat() if incident.activated_at else None,
        "created_at": incident.created_at.isoformat(),
        "response": {
            "sos_signals": len(sos_signals),
            "rescue_dispatches": len(rescue_dispatches),
            "roll_calls": len(roll_calls),
            "sos_details": [
                {
                    "sos_id": str(s.id),
                    "status": s.status.value,
                    "priority": s.priority.value,
                    "received_at": s.received_at.isoformat()
                }
                for s in sos_signals[:5]
            ],
            "rescue_teams": [
                {
                    "team_name": r.team_name,
                    "team_size": r.team_size,
                    "status": r.status.value,
                    "dispatched_at": r.dispatched_at.isoformat()
                }
                for r in rescue_dispatches
            ]
        }
    }

    print(f"📢 [INCIDENT STATUS] Retrieved status for incident: {incident.id}")
    return result
