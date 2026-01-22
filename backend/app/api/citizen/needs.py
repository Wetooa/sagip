"""Needs ticket endpoints."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime
import random
import string

from app.core.database import get_db
from app.core.security import get_current_user
from app.schemas.post_disaster import NeedsTicketCreate, NeedsTicketResponse
from app.models.post_disaster import NeedsTicket, NeedType, Severity, TicketStatus
from app.models.citizen import Citizen
from app.utils.helpers import validation_error

router = APIRouter()


def generate_ticket_number() -> str:
    """Generate a unique ticket number."""
    timestamp = datetime.utcnow().strftime("%Y%m%d%H%M%S")
    random_suffix = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
    return f"TKT-{timestamp}-{random_suffix}"


@router.post("/ticket", response_model=NeedsTicketResponse, status_code=status.HTTP_201_CREATED)
async def create_needs_ticket(
    ticket_data: NeedsTicketCreate,
    current_user: Citizen = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a needs ticket (citizen)."""
    # Validate need type
    try:
        need_type = NeedType(ticket_data.need_type)
    except ValueError:
        raise validation_error(f"Invalid need_type: {ticket_data.need_type}")
    
    # Validate priority
    try:
        priority = Severity(ticket_data.priority)
    except ValueError:
        raise validation_error(f"Invalid priority: {ticket_data.priority}")
    
    # Validate status (should be pending for new tickets)
    try:
        ticket_status = TicketStatus(ticket_data.status) if ticket_data.status else TicketStatus.PENDING
    except ValueError:
        raise validation_error(f"Invalid status: {ticket_data.status}")
    
    # Generate unique ticket number
    ticket_number = generate_ticket_number()
    # Ensure uniqueness (retry if collision, though very unlikely)
    while db.query(NeedsTicket).filter(NeedsTicket.ticket_number == ticket_number).first():
        ticket_number = generate_ticket_number()
    
    # Create needs ticket
    new_ticket = NeedsTicket(
        citizen_id=current_user.id,
        ticket_number=ticket_number,
        need_type=need_type,
        description=ticket_data.description,
        priority=priority,
        status=ticket_status
    )
    
    db.add(new_ticket)
    db.commit()
    db.refresh(new_ticket)
    
    response = NeedsTicketResponse(
        id=new_ticket.id,
        citizen_id=new_ticket.citizen_id,
        ticket_number=new_ticket.ticket_number,
        need_type=new_ticket.need_type.value,
        description=new_ticket.description,
        priority=new_ticket.priority.value,
        status=new_ticket.status.value,
        verified_at=new_ticket.verified_at,
        matched_with=new_ticket.matched_with,
        fulfilled_at=new_ticket.fulfilled_at,
        created_at=new_ticket.created_at,
        updated_at=new_ticket.updated_at
    )
    
    return response


@router.get("/ticket", response_model=list[NeedsTicketResponse])
async def get_own_needs_tickets(
    current_user: Citizen = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get own needs tickets (citizen)."""
    tickets = db.query(NeedsTicket).filter(
        NeedsTicket.citizen_id == current_user.id
    ).order_by(NeedsTicket.created_at.desc()).all()
    
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
