"""Public rescue request endpoints (map pins)."""
import json
import shutil
from pathlib import Path
from typing import Optional
from uuid import UUID, uuid4

from fastapi import APIRouter, Depends, File, Form, Query, UploadFile
from sqlalchemy import desc
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user_optional
from app.models.citizen import Citizen
from app.models.rescue_request import (
    RescueRequest,
    RescueRequestStatus,
    RescueUrgency,
)
from app.schemas.rescue import RescueNeeds, RescueRequestResponse
from app.utils.helpers import paginate_query, not_found_error, validation_error

router = APIRouter()

UPLOAD_DIR = Path("app/static/rescue_photos")


def _normalize_needs(raw_needs: str) -> dict:
    """Parse and sanitize needs JSON coming from multipart form."""
    try:
        payload = json.loads(raw_needs)
    except json.JSONDecodeError:
        raise validation_error("needs must be valid JSON")

    if not isinstance(payload, dict):
        raise validation_error("needs must be an object with need flags")

    cleaned = {
        "water": bool(payload.get("water", False)),
        "food": bool(payload.get("food", False)),
        "medical": bool(payload.get("medical", False)),
        "shelter": bool(payload.get("shelter", False)),
        "evacuation": bool(payload.get("evacuation", False)),
        "other": payload.get("other"),
    }
    return cleaned


def _persist_photo(photo: UploadFile) -> str:
    """Persist an uploaded photo to disk and return a relative URL."""
    if not photo.filename:
        return ""

    if photo.content_type and not photo.content_type.startswith("image/"):
        raise validation_error("photo must be an image file")

    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    suffix = Path(photo.filename).suffix or ".jpg"
    file_name = f"{uuid4()}{suffix}"
    file_path = UPLOAD_DIR / file_name

    with file_path.open("wb") as buffer:
        shutil.copyfileobj(photo.file, buffer)

    return f"/static/rescue_photos/{file_name}"


def _serialize(rescue: RescueRequest) -> RescueRequestResponse:
    """Convert ORM object to API response schema."""
    return RescueRequestResponse(
        id=rescue.id,
        citizen_id=rescue.citizen_id,
        name=rescue.name,
        contact=rescue.contact,
        household_size=rescue.household_size,
        status=rescue.status.value,
        urgency=rescue.urgency.value,
        latitude=rescue.latitude,
        longitude=rescue.longitude,
        needs=RescueNeeds(**(rescue.needs or {})),
        note=rescue.note,
        photo_url=rescue.photo_url,
        created_at=rescue.created_at,
        updated_at=rescue.updated_at,
    )


@router.post("/requests", response_model=RescueRequestResponse, status_code=201)
async def create_rescue_request(
    latitude: float = Form(..., description="Latitude of the request"),
    longitude: float = Form(..., description="Longitude of the request"),
    needs: str = Form(..., description="JSON object for needs flags"),
    name: Optional[str] = Form(None, description="Name of the person to rescue"),
    contact: Optional[str] = Form(None, description="Contact number or handle"),
    household_size: Optional[int] = Form(None, ge=1, description="Number of people at location"),
    urgency: str = Form("normal", description="normal | high | critical"),
    note: Optional[str] = Form(None, description="Additional note"),
    photo: Optional[UploadFile] = File(None, description="Photo proof of location visit"),
    current_user: Optional[Citizen] = Depends(get_current_user_optional),
    db: Session = Depends(get_db),
):
    """Create a new rescue request; anonymous submissions allowed."""
    try:
        urgency_enum = RescueUrgency(urgency)
    except ValueError:
        raise validation_error(f"Invalid urgency: {urgency}")

    needs_payload = _normalize_needs(needs)

    rescue = RescueRequest(
        citizen_id=current_user.id if current_user else None,
        name=name,
        contact=contact,
        household_size=household_size,
        status=RescueRequestStatus.OPEN,
        urgency=urgency_enum,
        latitude=latitude,
        longitude=longitude,
        needs=needs_payload,
        note=note,
    )

    if photo:
        rescue.photo_url = _persist_photo(photo)

    db.add(rescue)
    db.commit()
    db.refresh(rescue)

    return _serialize(rescue)


@router.get("/requests", response_model=list[RescueRequestResponse])
async def list_rescue_requests(
    status: str = Query("open", description="Filter by status"),
    limit: int = Query(100, ge=1, le=500, description="Maximum results"),
    offset: int = Query(0, ge=0, description="Results to skip"),
    db: Session = Depends(get_db),
):
    """List rescue requests, defaulting to open ones for map display."""
    query = db.query(RescueRequest)

    if status:
        try:
            status_enum = RescueRequestStatus(status)
        except ValueError:
            raise validation_error(f"Invalid status: {status}")
        query = query.filter(RescueRequest.status == status_enum)

    query = query.order_by(desc(RescueRequest.created_at))
    query, _ = paginate_query(query, limit=limit, offset=offset)
    rescues = query.all()

    return [_serialize(rescue) for rescue in rescues]


@router.get("/requests/{rescue_id}", response_model=RescueRequestResponse)
async def get_rescue_request(rescue_id: UUID, db: Session = Depends(get_db)):
    """Fetch a single rescue request by ID."""
    rescue = db.query(RescueRequest).filter(RescueRequest.id == rescue_id).first()
    if not rescue:
        raise not_found_error("Rescue request", str(rescue_id))
    return _serialize(rescue)
