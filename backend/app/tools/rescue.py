import uuid
from datetime import datetime

def report_emergency(
    injury_type: str = "none",
    flood_level: str = "ankle",
    people_count: int = 1
):
    ticket_id = f"RSC-{uuid.uuid4().hex[:6].upper()}"

    ticket = {
        "ticket_id": ticket_id,
        "type": "rescue",
        "priority": "HIGH" if flood_level in ["waist", "roof"] else "MEDIUM",
        "injury_type": injury_type,
        "flood_level": flood_level,
        "people_count": people_count,
        "status": "submitted",
        "created_at": datetime.utcnow().isoformat()
    }

    print("🚨 [RESCUE TOOL CALLED]", ticket)
    return ticket