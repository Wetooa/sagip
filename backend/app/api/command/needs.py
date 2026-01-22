"""Command Center needs ticket management endpoints."""
from fastapi import APIRouter, Depends, HTTPException, status, Query, Path
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import Optional
from uuid import UUID

from app.core.database import get_db
from app.core.security import get_current_user, get_current_user_optional
from app.schemas.post_disaster import NeedsTicketResponse, NeedsTicketUpdate
from app.models.post_disaster import NeedsTicket, TicketStatus
from app.models.citizen import Citizen
from app.utils.helpers import paginate_query, not_found_error, validation_error, forbidden_error

router = APIRouter()


@router.get("/tickets", response_model=list[NeedsTicketResponse])
async def get_needs_tickets(
    status: Optional[str] = Query(None, description="Filter by status"),
    priority: Optional[str] = Query(None, description="Filter by priority"),
    need_type: Optional[str] = Query(None, description="Filter by need type"),
    citizen_id: Optional[UUID] = Query(None, description="Filter by citizen ID"),
    limit: Optional[int] = Query(100, ge=1, le=1000, description="Maximum number of results"),
    offset: Optional[int] = Query(0, ge=0, description="Number of results to skip"),
    current_user: Optional[Citizen] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    """List all needs tickets (command center, with filters)."""
    # Check authorization - command center only
    if not current_user or current_user.role.value != "command_center":
        raise forbidden_error("Command center access required")
    
    query = db.query(NeedsTicket)
    
    # Apply filters
    if status:
        try:
            status_enum = TicketStatus(status)
            query = query.filter(NeedsTicket.status == status_enum)
        except ValueError:
            raise validation_error(f"Invalid status: {status}")
    
    if priority:
        from app.models.post_disaster import Severity
        try:
            priority_enum = Severity(priority)
            query = query.filter(NeedsTicket.priority == priority_enum)
        except ValueError:
            raise validation_error(f"Invalid priority: {priority}")
    
    if need_type:
        from app.models.post_disaster import NeedType
        try:
            need_type_enum = NeedType(need_type)
            query = query.filter(NeedsTicket.need_type == need_type_enum)
        except ValueError:
            raise validation_error(f"Invalid need_type: {need_type}")
    
    if citizen_id:
        query = query.filter(NeedsTicket.citizen_id == citizen_id)
    
    # Order by most recent first
    query = query.order_by(desc(NeedsTicket.created_at))
    
    # Apply pagination
    query, total_count = paginate_query(query, limit=limit, offset=offset)
    
    tickets = query.all()
    
    return [
        NeedsTicketResponse(
            id=ticket.id,
            citizen_id=ticket.citizen_id,
            ticket_number=ticket.ticket_number,
            need_type=ticket.need_type.value,
            description=ticket.description,
            priority=ticket.priority.value,
            status=ticket.status.value,
            verified_at=ticket.verified_at,
            matched_with=ticket.matched_with,
            fulfilled_at=ticket.fulfilled_at,
            created_at=ticket.created_at,
            updated_at=ticket.updated_at
        )
        for ticket in tickets
    ]


@router.put("/tickets/{ticket_id}", response_model=NeedsTicketResponse)
async def update_ticket_status(
    ticket_id: UUID = Path(..., description="Needs ticket ID"),
    ticket_update: NeedsTicketUpdate = ...,
    current_user: Optional[Citizen] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    """Update ticket status (command center)."""
    # Check authorization - command center only
    if not current_user or current_user.role.value != "command_center":
        raise forbidden_error("Command center access required")
    
    # Find the ticket
    ticket = db.query(NeedsTicket).filter(NeedsTicket.id == ticket_id).first()
    if not ticket:
        raise not_found_error("Needs ticket", str(ticket_id))
    
    # Update status if provided
    if ticket_update.status is not None:
        try:
            new_status = TicketStatus(ticket_update.status)
            ticket.status = new_status
            
            # Auto-set verified_at if status changes to verified
            if new_status == TicketStatus.VERIFIED and ticket.verified_at is None:
                from datetime import datetime
                ticket.verified_at = datetime.utcnow()
            
            # Auto-set fulfilled_at if status changes to fulfilled
            if new_status == TicketStatus.FULFILLED and ticket.fulfilled_at is None:
                from datetime import datetime
                ticket.fulfilled_at = datetime.utcnow()
        except ValueError:
            raise validation_error(f"Invalid status: {ticket_update.status}")
    
    # Update verified_at if provided
    if ticket_update.verified_at is not None:
        ticket.verified_at = ticket_update.verified_at
    
    # Update fulfilled_at if provided
    if ticket_update.fulfilled_at is not None:
        ticket.fulfilled_at = ticket_update.fulfilled_at
    
    db.commit()
    db.refresh(ticket)
    
    response = NeedsTicketResponse(
        id=ticket.id,
        citizen_id=ticket.citizen_id,
        ticket_number=ticket.ticket_number,
        need_type=ticket.need_type.value,
        description=ticket.description,
        priority=ticket.priority.value,
        status=ticket.status.value,
        verified_at=ticket.verified_at,
        matched_with=ticket.matched_with,
        fulfilled_at=ticket.fulfilled_at,
        created_at=ticket.created_at,
        updated_at=ticket.updated_at
    )
    
    return response
