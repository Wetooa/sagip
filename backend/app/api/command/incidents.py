"""Command Center incident management endpoints."""
from fastapi import APIRouter, Depends, HTTPException, status, Query, Path
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, desc
from typing import Optional
from datetime import datetime
from uuid import UUID

from app.core.database import get_db
from app.core.security import get_current_user, get_current_user_optional
from app.schemas.emergency import IncidentCreate, IncidentResponse, IncidentUpdate
from app.models.emergency import Incident, IncidentType, IncidentStatus, Severity
from app.models.citizen import Citizen
from app.utils.helpers import paginate_query, not_found_error, validation_error, forbidden_error

router = APIRouter()


@router.get("/dashboard")
async def get_dashboard(
    current_user: Optional[Citizen] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    """Get command center dashboard data."""
    # TODO: Implement dashboard data aggregation
    # This is a placeholder - should aggregate data from multiple sources
    pass


@router.post("/", response_model=IncidentResponse, status_code=status.HTTP_201_CREATED)
async def create_incident(
    incident_data: IncidentCreate,
    current_user: Optional[Citizen] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    """Create or activate an incident."""
    # Validate incident type
    try:
        incident_type = IncidentType(incident_data.incident_type)
    except ValueError:
        raise validation_error(f"Invalid incident_type: {incident_data.incident_type}")
    
    # Validate status
    try:
        incident_status = IncidentStatus(incident_data.status)
    except ValueError:
        raise validation_error(f"Invalid status: {incident_data.status}")
    
    # Validate severity
    try:
        severity = Severity(incident_data.severity)
    except ValueError:
        raise validation_error(f"Invalid severity: {incident_data.severity}")
    
    # Create incident
    new_incident = Incident(
        incident_name=incident_data.incident_name,
        incident_type=incident_type,
        status=incident_status,
        severity=severity,
        affected_region=incident_data.affected_region,
        latitude=incident_data.latitude,
        longitude=incident_data.longitude,
        description=incident_data.description,
        activated_at=datetime.utcnow() if incident_status == IncidentStatus.ACTIVE else None
    )
    
    db.add(new_incident)
    db.commit()
    db.refresh(new_incident)
    
    response = IncidentResponse(
        id=new_incident.id,
        incident_name=new_incident.incident_name,
        incident_type=new_incident.incident_type.value,
        status=new_incident.status.value,
        severity=new_incident.severity.value,
        affected_region=new_incident.affected_region,
        latitude=new_incident.latitude,
        longitude=new_incident.longitude,
        description=new_incident.description,
        activated_at=new_incident.activated_at,
        resolved_at=new_incident.resolved_at,
        created_at=new_incident.created_at,
        updated_at=new_incident.updated_at
    )
    
    return response


@router.get("/", response_model=list[IncidentResponse])
async def list_incidents(
    status: Optional[str] = Query(None, description="Filter by status"),
    severity: Optional[str] = Query(None, description="Filter by severity"),
    incident_type: Optional[str] = Query(None, description="Filter by incident type"),
    limit: Optional[int] = Query(100, ge=1, le=1000, description="Maximum number of results"),
    offset: Optional[int] = Query(0, ge=0, description="Number of results to skip"),
    current_user: Optional[Citizen] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    """List all incidents (with filters)."""
    query = db.query(Incident)
    
    # Apply filters
    if status:
        try:
            status_enum = IncidentStatus(status)
            query = query.filter(Incident.status == status_enum)
        except ValueError:
            raise validation_error(f"Invalid status: {status}")
    
    if severity:
        try:
            severity_enum = Severity(severity)
            query = query.filter(Incident.severity == severity_enum)
        except ValueError:
            raise validation_error(f"Invalid severity: {severity}")
    
    if incident_type:
        try:
            type_enum = IncidentType(incident_type)
            query = query.filter(Incident.incident_type == type_enum)
        except ValueError:
            raise validation_error(f"Invalid incident_type: {incident_type}")
    
    # Order by most recent first
    query = query.order_by(desc(Incident.created_at))
    
    # Apply pagination
    query, total_count = paginate_query(query, limit=limit, offset=offset)
    
    incidents = query.all()
    
    return [
        IncidentResponse(
            id=inc.id,
            incident_name=inc.incident_name,
            incident_type=inc.incident_type.value,
            status=inc.status.value,
            severity=inc.severity.value,
            affected_region=inc.affected_region,
            latitude=inc.latitude,
            longitude=inc.longitude,
            description=inc.description,
            activated_at=inc.activated_at,
            resolved_at=inc.resolved_at,
            created_at=inc.created_at,
            updated_at=inc.updated_at
        )
        for inc in incidents
    ]


@router.get("/{incident_id}", response_model=IncidentResponse)
async def get_incident(
    incident_id: UUID = Path(..., description="Incident ID"),
    current_user: Optional[Citizen] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    """Get incident details."""
    incident = db.query(Incident).filter(Incident.id == incident_id).first()
    if not incident:
        raise not_found_error("Incident", str(incident_id))
    
    response = IncidentResponse(
        id=incident.id,
        incident_name=incident.incident_name,
        incident_type=incident.incident_type.value,
        status=incident.status.value,
        severity=incident.severity.value,
        affected_region=incident.affected_region,
        latitude=incident.latitude,
        longitude=incident.longitude,
        description=incident.description,
        activated_at=incident.activated_at,
        resolved_at=incident.resolved_at,
        created_at=incident.created_at,
        updated_at=incident.updated_at
    )
    
    return response


@router.put("/{incident_id}", response_model=IncidentResponse)
async def update_incident(
    incident_id: UUID = Path(..., description="Incident ID"),
    incident_data: IncidentUpdate = ...,
    current_user: Optional[Citizen] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    """Update incident."""
    incident = db.query(Incident).filter(Incident.id == incident_id).first()
    if not incident:
        raise not_found_error("Incident", str(incident_id))
    
    # Business logic: can't update resolved incidents
    if incident.status == IncidentStatus.RESOLVED:
        raise validation_error("Cannot update a resolved incident")
    
    # Update fields
    if incident_data.incident_name is not None:
        incident.incident_name = incident_data.incident_name
    
    if incident_data.status is not None:
        try:
            new_status = IncidentStatus(incident_data.status)
            # Auto-set activated_at if status changes to active
            if new_status == IncidentStatus.ACTIVE and incident.status != IncidentStatus.ACTIVE:
                incident.activated_at = datetime.utcnow()
            # Auto-set resolved_at if status changes to resolved
            if new_status == IncidentStatus.RESOLVED:
                incident.resolved_at = datetime.utcnow()
            incident.status = new_status
        except ValueError:
            raise validation_error(f"Invalid status: {incident_data.status}")
    
    if incident_data.severity is not None:
        try:
            incident.severity = Severity(incident_data.severity)
        except ValueError:
            raise validation_error(f"Invalid severity: {incident_data.severity}")
    
    if incident_data.description is not None:
        incident.description = incident_data.description
    
    if incident_data.activated_at is not None:
        incident.activated_at = incident_data.activated_at
    
    if incident_data.resolved_at is not None:
        incident.resolved_at = incident_data.resolved_at
    
    db.commit()
    db.refresh(incident)
    
    response = IncidentResponse(
        id=incident.id,
        incident_name=incident.incident_name,
        incident_type=incident.incident_type.value,
        status=incident.status.value,
        severity=incident.severity.value,
        affected_region=incident.affected_region,
        latitude=incident.latitude,
        longitude=incident.longitude,
        description=incident.description,
        activated_at=incident.activated_at,
        resolved_at=incident.resolved_at,
        created_at=incident.created_at,
        updated_at=incident.updated_at
    )
    
    return response
