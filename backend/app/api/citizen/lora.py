"""LoRa device endpoints."""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.devices import LoRaDeviceCreate, LoRaDeviceResponse

router = APIRouter()


@router.post("/register", response_model=LoRaDeviceResponse)
async def register_lora_device(device_data: LoRaDeviceCreate, db: Session = Depends(get_db)):
    """Register a LoRa device."""
    # TODO: Implement LoRa device registration logic
    pass
