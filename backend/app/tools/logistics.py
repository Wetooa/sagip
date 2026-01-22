import uuid
from datetime import datetime

def log_logistics_request(
    item: str,
    quantity: int,
    location: str = "unknown"
):
    request_id = f"LOG-{uuid.uuid4().hex[:6].upper()}"

    request = {
        "request_id": request_id,
        "item": item,
        "quantity": quantity,
        "location": location,
        "status": "queued",
        "estimated_delivery": "2-4 hours",
        "created_at": datetime.utcnow().isoformat()
    }

    print("📦 [LOGISTICS TOOL CALLED]", request)
    return request