"""Command Center rescue coordination endpoints."""
from fastapi import APIRouter, Depends, HTTPException, status, Query, Path
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, desc
from typing import Optional
from datetime import datetime
from uuid import UUID

from app.core.database import get_db
from app.core.security import get_current_user, get_current_user_optional
from app.schemas.emergency import (
    SOSSignalCreate, SOSSignalResponse, SOSSignalUpdate,
    RescueDispatchCreate, RescueDispatchResponse
)
from app.models.emergency import SOSSignal, SignalType, SignalStatus, Severity
from app.models.citizen import Citizen
from app.utils.helpers import paginate_query, not_found_error, validation_error, forbidden_error

router = APIRouter()


@router.post("/sos", response_model=SOSSignalResponse, status_code=status.HTTP_201_CREATED)
async def create_sos_signal(
    sos_data: SOSSignalCreate,
    current_user: Citizen = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create SOS signal (citizen endpoint)."""
    # Validate signal type
    try:
        signal_type = SignalType(sos_data.signal_type)
    except ValueError:
        raise validation_error(f"Invalid signal_type: {sos_data.signal_type}")
    
    # Validate priority
    try:
        priority = Severity(sos_data.priority)
    except ValueError:
        raise validation_error(f"Invalid priority: {sos_data.priority}")
    
    # Validate status (should be pending for new signals)
    try:
        signal_status = SignalStatus(sos_data.status) if sos_data.status else SignalStatus.PENDING
    except ValueError:
        raise validation_error(f"Invalid status: {sos_data.status}")
    
    # Validate incident_id if provided
    if sos_data.incident_id:
        from app.models.emergency import Incident
        incident = db.query(Incident).filter(Incident.id == sos_data.incident_id).first()
        if not incident:
            raise not_found_error("Incident", str(sos_data.incident_id))
    
    # Create SOS signal
    new_sos = SOSSignal(
        citizen_id=current_user.id,
        incident_id=sos_data.incident_id,
        latitude=sos_data.latitude,
        longitude=sos_data.longitude,
        signal_type=signal_type,
        status=signal_status,
        priority=priority,
        message=sos_data.message,
        received_at=sos_data.received_at
    )
    
    db.add(new_sos)
    db.commit()
    db.refresh(new_sos)
    
    response = SOSSignalResponse(
        id=new_sos.id,
        citizen_id=new_sos.citizen_id,
        incident_id=new_sos.incident_id,
        latitude=new_sos.latitude,
        longitude=new_sos.longitude,
        signal_type=new_sos.signal_type.value,
        status=new_sos.status.value,
        priority=new_sos.priority.value,
        message=new_sos.message,
        received_at=new_sos.received_at,
        resolved_at=new_sos.resolved_at,
        created_at=new_sos.created_at,
        updated_at=new_sos.updated_at
    )
    
    return response


@router.get("/sos/signals", response_model=list[SOSSignalResponse])
async def get_sos_signals(
    incident_id: Optional[UUID] = Query(None, description="Filter by incident ID"),
    status: Optional[str] = Query(None, description="Filter by status"),
    priority: Optional[str] = Query(None, description="Filter by priority"),
    citizen_id: Optional[UUID] = Query(None, description="Filter by citizen ID"),
    limit: Optional[int] = Query(100, ge=1, le=1000, description="Maximum number of results"),
    offset: Optional[int] = Query(0, ge=0, description="Number of results to skip"),
    current_user: Optional[Citizen] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    """List SOS signals (command center, with filters)."""
    # Check authorization - command center only, or citizens can see their own
    if current_user:
        if current_user.role.value == "citizen":
            # Citizens can only see their own signals
            query = db.query(SOSSignal).filter(SOSSignal.citizen_id == current_user.id)
        else:
            # Command center can see all signals
            query = db.query(SOSSignal)
    else:
        raise forbidden_error("Authentication required")
    
    # Apply filters
    if incident_id:
        query = query.filter(SOSSignal.incident_id == incident_id)
    
    if status:
        try:
            status_enum = SignalStatus(status)
            query = query.filter(SOSSignal.status == status_enum)
        except ValueError:
            raise validation_error(f"Invalid status: {status}")
    
    if priority:
        try:
            priority_enum = Severity(priority)
            query = query.filter(SOSSignal.priority == priority_enum)
        except ValueError:
            raise validation_error(f"Invalid priority: {priority}")
    
    if citizen_id and current_user.role.value == "command_center":
        query = query.filter(SOSSignal.citizen_id == citizen_id)
    
    # Order by most recent first
    query = query.order_by(desc(SOSSignal.received_at))
    
    # Apply pagination
    query, total_count = paginate_query(query, limit=limit, offset=offset)
    
    signals = query.all()
    
    return [
        SOSSignalResponse(
            id=sig.id,
            citizen_id=sig.citizen_id,
            incident_id=sig.incident_id,
            latitude=sig.latitude,
            longitude=sig.longitude,
            signal_type=sig.signal_type.value,
            status=sig.status.value,
            priority=sig.priority.value,
            message=sig.message,
            received_at=sig.received_at,
            resolved_at=sig.resolved_at,
            created_at=sig.created_at,
            updated_at=sig.updated_at
        )
        for sig in signals
    ]


@router.put("/sos/{signal_id}", response_model=SOSSignalResponse)
async def update_sos_signal(
    signal_id: UUID = Path(..., description="SOS signal ID"),
    sos_update: SOSSignalUpdate = ...,
    current_user: Citizen = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update SOS signal status."""
    # Find the signal
    signal = db.query(SOSSignal).filter(SOSSignal.id == signal_id).first()
    if not signal:
        raise not_found_error("SOS signal", str(signal_id))
    
    # Check authorization - citizens can only update their own signals
    if current_user.role.value == "citizen" and signal.citizen_id != current_user.id:
        raise forbidden_error("You can only update your own SOS signals")
    
    # Update status if provided
    if sos_update.status is not None:
        try:
            signal.status = SignalStatus(sos_update.status)
        except ValueError:
            raise validation_error(f"Invalid status: {sos_update.status}")
    
    # Update resolved_at if provided
    if sos_update.resolved_at is not None:
        signal.resolved_at = sos_update.resolved_at
        # Auto-update status to resolved if resolved_at is set
        if signal.status != SignalStatus.RESOLVED:
            signal.status = SignalStatus.RESOLVED
    
    db.commit()
    db.refresh(signal)
    
    response = SOSSignalResponse(
        id=signal.id,
        citizen_id=signal.citizen_id,
        incident_id=signal.incident_id,
        latitude=signal.latitude,
        longitude=signal.longitude,
        signal_type=signal.signal_type.value,
        status=signal.status.value,
        priority=signal.priority.value,
        message=signal.message,
        received_at=signal.received_at,
        resolved_at=signal.resolved_at,
        created_at=signal.created_at,
        updated_at=signal.updated_at
    )
    
    return response


@router.post("/dispatch", response_model=RescueDispatchResponse)
async def dispatch_rescue_team(dispatch_data: RescueDispatchCreate, db: Session = Depends(get_db)):
    """Dispatch a rescue team."""
    # TODO: Implement rescue dispatch logic
    pass
