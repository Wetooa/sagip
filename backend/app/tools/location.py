"""Location tracking and family member tracking tools."""
import uuid
from datetime import datetime, timedelta
from typing import Optional
from sqlalchemy.orm import Session
from sqlalchemy import and_

from app.models.location import LocationHistory, PredictedLocation
from app.models.devices import Device, LoRaDevice
from app.models.citizen import Citizen


def get_citizen_location(
    db: Session,
    citizen_id: Optional[uuid.UUID] = None,
    target_citizen_id: Optional[str] = None
):
    """
    Get the current or last known location of a citizen.
    Uses target_citizen_id if provided, otherwise uses citizen_id.
    """
    # Determine which citizen to query
    query_citizen_id = None
    if target_citizen_id:
        try:
            query_citizen_id = uuid.UUID(target_citizen_id)
        except ValueError:
            return {"error": "Invalid target_citizen_id format"}
    elif citizen_id:
        query_citizen_id = citizen_id
    else:
        return {"error": "Either citizen_id or target_citizen_id must be provided"}

    # Get last known location from location history
    last_location = db.query(LocationHistory).filter(
        LocationHistory.citizen_id == query_citizen_id
    ).order_by(LocationHistory.recorded_at.desc()).first()

    # Get predicted location if available
    predicted_location = db.query(PredictedLocation).filter(
        PredictedLocation.citizen_id == query_citizen_id
    ).order_by(PredictedLocation.predicted_for_timestamp.desc()).first()

    # Get device information
    devices = db.query(Device).filter(
        Device.citizen_id == query_citizen_id
    ).all()

    lora_devices = db.query(LoRaDevice).filter(
        LoRaDevice.citizen_id == query_citizen_id
    ).all()

    # Get citizen info
    citizen = db.query(Citizen).filter(Citizen.id == query_citizen_id).first()

    result = {
        "citizen_id": str(query_citizen_id),
        "citizen_name": citizen.full_name if citizen else None,
        "last_known_location": None,
        "predicted_location": None,
        "devices": [],
        "location_accuracy": None,
        "last_seen": None
    }

    if last_location:
        result["last_known_location"] = {
            "latitude": last_location.latitude,
            "longitude": last_location.longitude,
            "accuracy": last_location.accuracy,
            "altitude": last_location.altitude,
            "source": last_location.source.value,
            "recorded_at": last_location.recorded_at.isoformat(),
            "age_minutes": int((datetime.utcnow() - last_location.recorded_at).total_seconds() / 60)
        }
        result["last_seen"] = last_location.recorded_at.isoformat()
        result["location_accuracy"] = last_location.accuracy

    if predicted_location:
        result["predicted_location"] = {
            "latitude": predicted_location.predicted_latitude,
            "longitude": predicted_location.predicted_longitude,
            "confidence_score": predicted_location.confidence_score,
            "prediction_method": predicted_location.prediction_method,
            "predicted_for_timestamp": predicted_location.predicted_for_timestamp.isoformat()
        }

    # Device information
    for device in devices:
        result["devices"].append({
            "device_id": str(device.id),
            "device_type": device.device_type.value,
            "device_name": device.device_name,
            "is_active": device.is_active,
            "current_location": {
                "latitude": device.current_latitude,
                "longitude": device.current_longitude
            } if device.current_latitude and device.current_longitude else None,
            "last_seen_at": device.last_seen_at.isoformat() if device.last_seen_at else None
        })

    for lora_device in lora_devices:
        result["devices"].append({
            "device_id": str(lora_device.id),
            "device_type": "lora",
            "device_name": lora_device.device_name,
            "is_active": lora_device.is_active,
            "current_location": {
                "latitude": lora_device.current_latitude,
                "longitude": lora_device.current_longitude
            } if lora_device.current_latitude and lora_device.current_longitude else None,
            "last_seen_at": lora_device.last_seen_at.isoformat() if lora_device.last_seen_at else None
        })

    if not result["last_known_location"] and not result["predicted_location"]:
        result["status"] = "no_location_data"
        result["message"] = "No location data available for this citizen"

    print(f"📍 [LOCATION] Retrieved location for citizen: {query_citizen_id}")
    return result


def track_family_member(
    db: Session,
    citizen_id: Optional[uuid.UUID] = None,
    target_citizen_id: Optional[str] = None
):
    """
    Track a family member's location and device status.
    Similar to get_citizen_location but with family-specific context.
    """
    if not target_citizen_id:
        return {"error": "target_citizen_id is required to track a family member"}

    try:
        target_uuid = uuid.UUID(target_citizen_id)
    except ValueError:
        return {"error": "Invalid target_citizen_id format"}

    # Get target citizen
    target_citizen = db.query(Citizen).filter(Citizen.id == target_uuid).first()
    if not target_citizen:
        return {"error": "Target citizen not found"}

    # Get location data (reuse get_citizen_location logic)
    location_data = get_citizen_location(db, citizen_id=citizen_id, target_citizen_id=target_citizen_id)

    # Get recent location history (last 24 hours)
    recent_locations = db.query(LocationHistory).filter(
        and_(
            LocationHistory.citizen_id == target_uuid,
            LocationHistory.recorded_at >= datetime.utcnow() - timedelta(hours=24)
        )
    ).order_by(LocationHistory.recorded_at.desc()).limit(10).all()

    # Check for SOS signals
    from app.models.emergency import SOSSignal, SignalStatus
    active_sos = db.query(SOSSignal).filter(
        and_(
            SOSSignal.citizen_id == target_uuid,
            SOSSignal.status.in_([SignalStatus.PENDING, SignalStatus.RECEIVED])
        )
    ).order_by(SOSSignal.created_at.desc()).first()

    result = {
        "target_citizen": {
            "id": str(target_citizen.id),
            "name": target_citizen.full_name,
            "phone": target_citizen.phone_number
        },
        "location": location_data,
        "recent_movements": [
            {
                "latitude": loc.latitude,
                "longitude": loc.longitude,
                "recorded_at": loc.recorded_at.isoformat(),
                "source": loc.source.value
            }
            for loc in recent_locations
        ],
        "sos_active": active_sos is not None,
        "sos_details": {
            "sos_id": str(active_sos.id),
            "status": active_sos.status.value,
            "priority": active_sos.priority.value,
            "message": active_sos.message,
            "received_at": active_sos.received_at.isoformat()
        } if active_sos else None,
        "status": "safe" if not active_sos else "needs_attention"
    }

    print(f"👨‍👩‍👧‍👦 [FAMILY TRACK] Tracking family member: {target_citizen.full_name}")
    return result
