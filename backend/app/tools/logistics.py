"""Logistics and needs request tools."""
import uuid
from datetime import datetime, timedelta
from typing import Optional
from sqlalchemy.orm import Session
from sqlalchemy import and_

from app.models.post_disaster import NeedsTicket, NeedType, TicketStatus, Severity
from app.models.nice_to_have import Asset, AssetType, ExternalHelpRequest, HelpRequestStatus


def log_logistics_request(
    db: Session,
    citizen_id: Optional[uuid.UUID] = None,
    need_type: Optional[str] = None,
    description: Optional[str] = None,
    priority: Optional[str] = None,
    location: Optional[str] = None,
    item: Optional[str] = None,
    quantity: Optional[int] = None
):
    """
    Create a needs ticket for logistics/relief goods.
    Maps old 'item' parameter to need_type if needed.
    """
    # Map item to need_type if provided
    if item and not need_type:
        item_to_need_type = {
            "food": NeedType.FOOD,
            "water": NeedType.WATER,
            "medicine": NeedType.MEDICINE,
            "shelter": NeedType.SHELTER,
            "clothing": NeedType.CLOTHING
        }
        need_type_enum = item_to_need_type.get(item.lower(), NeedType.OTHER)
    elif need_type:
        try:
            need_type_enum = NeedType(need_type.lower())
        except ValueError:
            need_type_enum = NeedType.OTHER
    else:
        need_type_enum = NeedType.OTHER

    # Determine priority
    if priority:
        try:
            priority_enum = Severity(priority.lower())
        except ValueError:
            priority_enum = Severity.MEDIUM
    else:
        priority_enum = Severity.MEDIUM

    # Check for duplicate recent tickets
    if citizen_id:
        recent_duplicate = db.query(NeedsTicket).filter(
            and_(
                NeedsTicket.citizen_id == citizen_id,
                NeedsTicket.need_type == need_type_enum,
                NeedsTicket.status.in_([TicketStatus.PENDING, TicketStatus.VERIFIED, TicketStatus.MATCHED]),
                NeedsTicket.created_at >= datetime.utcnow() - timedelta(hours=24)
            )
        ).first()
        
        if recent_duplicate:
            return {
                "request_id": f"LOG-{recent_duplicate.id.hex[:6].upper()}",
                "ticket_number": recent_duplicate.ticket_number,
                "status": "duplicate",
                "message": "Similar request already exists",
                "existing_ticket": {
                    "id": str(recent_duplicate.id),
                    "ticket_number": recent_duplicate.ticket_number,
                    "status": recent_duplicate.status.value,
                    "created_at": recent_duplicate.created_at.isoformat()
                }
            }

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
        # NeedsTicket requires citizen_id (nullable=False)
        return {
            "error": "citizen_id_required",
            "message": "citizen_id is required to create a needs ticket. Please provide a valid citizen ID.",
            "note": "Anonymous needs requests are not currently supported due to database constraints"
        }

    # Generate unique ticket number
    ticket_number = f"NT-{datetime.utcnow().strftime('%Y%m%d')}-{uuid.uuid4().hex[:6].upper()}"

    # Create needs ticket
    needs_ticket = NeedsTicket(
        citizen_id=final_citizen_id,
        ticket_number=ticket_number,
        need_type=need_type_enum,
        description=description or f"Request for {item or need_type_enum.value}",
        priority=priority_enum,
        status=TicketStatus.PENDING
    )

    db.add(needs_ticket)
    db.commit()
    db.refresh(needs_ticket)

    # Check for available assets
    available_assets = db.query(Asset).filter(
        and_(
            Asset.is_available == True,
            Asset.asset_type == AssetType.EQUIPMENT  # Could be more specific matching
        )
    ).limit(5).all()

    # Check for external help requests
    matching_help = db.query(ExternalHelpRequest).filter(
        and_(
            ExternalHelpRequest.status == HelpRequestStatus.PENDING,
            ExternalHelpRequest.needs_ticket_id.is_(None)  # Not yet matched
        )
    ).limit(3).all()

    result = {
        "request_id": f"LOG-{needs_ticket.id.hex[:6].upper()}",
        "ticket_number": needs_ticket.ticket_number,
        "ticket_id": str(needs_ticket.id),
        "item": item or need_type_enum.value,
        "quantity": quantity or 1,
        "location": location or "unknown",
        "status": needs_ticket.status.value,
        "priority": needs_ticket.priority.value,
        "estimated_delivery": "2-4 hours" if priority_enum in [Severity.HIGH, Severity.CRITICAL] else "4-8 hours",
        "created_at": needs_ticket.created_at.isoformat(),
        "potential_matches": len(available_assets) + len(matching_help)
    }

    if available_assets:
        result["available_resources"] = len(available_assets)
    
    if matching_help:
        result["external_help_offers"] = len(matching_help)

    print(f"📦 [LOGISTICS TOOL] Needs ticket created: {needs_ticket.ticket_number}")
    return result


def check_needs_status(
    db: Session,
    citizen_id: Optional[uuid.UUID] = None,
    ticket_number: Optional[str] = None
):
    """
    Check the status of a needs ticket.
    Can query by citizen_id (all tickets) or specific ticket_number.
    """
    if ticket_number:
        ticket = db.query(NeedsTicket).filter(
            NeedsTicket.ticket_number == ticket_number
        ).first()
        tickets = [ticket] if ticket else []
    elif citizen_id:
        tickets = db.query(NeedsTicket).filter(
            NeedsTicket.citizen_id == citizen_id
        ).order_by(NeedsTicket.created_at.desc()).limit(10).all()
    else:
        return {"error": "Either ticket_number or citizen_id must be provided"}

    if not tickets:
        return {
            "status": "not_found",
            "message": "No needs tickets found"
        }

    # Get matched assets if any
    matched_assets = []
    for ticket in tickets:
        if ticket.matched_with:
            # In a full implementation, this would query the matched asset/resource
            matched_assets.append({
                "ticket_id": str(ticket.id),
                "matched_resource_id": str(ticket.matched_with)
            })

    result = {
        "tickets": [
            {
                "ticket_number": t.ticket_number,
                "ticket_id": str(t.id),
                "need_type": t.need_type.value,
                "description": t.description,
                "priority": t.priority.value,
                "status": t.status.value,
                "created_at": t.created_at.isoformat(),
                "verified_at": t.verified_at.isoformat() if t.verified_at else None,
                "fulfilled_at": t.fulfilled_at.isoformat() if t.fulfilled_at else None,
                "matched": t.matched_with is not None
            }
            for t in tickets
        ],
        "total_tickets": len(tickets),
        "pending": len([t for t in tickets if t.status == TicketStatus.PENDING]),
        "matched": len([t for t in tickets if t.status == TicketStatus.MATCHED]),
        "fulfilled": len([t for t in tickets if t.status == TicketStatus.FULFILLED])
    }

    return result
