"""Communication-related Pydantic schemas."""
from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from uuid import UUID

from app.schemas.common import BaseSchema


class ChatbotMessageBase(BaseSchema):
    """Base chatbot message schema."""
    message: str
    message_type: str
    is_anonymized: bool = False


class ChatbotMessageCreate(ChatbotMessageBase):
    """Schema for creating a chatbot message."""
    session_id: str


class ChatbotMessageResponse(ChatbotMessageBase):
    """Schema for chatbot message response."""
    id: UUID
    citizen_id: Optional[UUID] = None
    session_id: str
    response: str
    created_at: datetime


class NotificationBase(BaseSchema):
    """Base notification schema."""
    notification_type: str
    title: str
    message: str
    priority: str
    status: str


class NotificationCreate(NotificationBase):
    """Schema for creating a notification."""
    citizen_id: Optional[UUID] = None


class NotificationResponse(NotificationBase):
    """Schema for notification response."""
    id: UUID
    citizen_id: Optional[UUID] = None
    sent_at: Optional[datetime] = None
    read_at: Optional[datetime] = None
    created_at: datetime


class MeshPacketBase(BaseSchema):
    """Base mesh packet schema."""
    packet_type: str
    packet_data: dict
    source_latitude: Optional[float] = None
    source_longitude: Optional[float] = None
    received_via_gateway: bool = False


class MeshPacketCreate(MeshPacketBase):
    """Schema for creating a mesh packet."""
    sender_citizen_id: Optional[UUID] = None
    receiver_citizen_id: Optional[UUID] = None
    transmitted_at: datetime
    received_at: datetime


class MeshPacketResponse(MeshPacketBase):
    """Schema for mesh packet response."""
    id: UUID
    sender_citizen_id: Optional[UUID] = None
    receiver_citizen_id: Optional[UUID] = None
    transmitted_at: datetime
    received_at: datetime
    created_at: datetime
