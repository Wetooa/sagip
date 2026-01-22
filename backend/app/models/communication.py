"""Communication-related database models."""
import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, Text, DateTime, Float, ForeignKey, Enum as SQLEnum, Index, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import enum

from app.core.database import Base


class MessageType(str, enum.Enum):
    """Chatbot message type enumeration."""
    QUESTION = "question"
    SYMPTOM_REPORT = "symptom_report"
    GENERAL = "general"


class NotificationType(str, enum.Enum):
    """Notification type enumeration."""
    ALERT = "alert"
    EVACUATION = "evacuation"
    ROLL_CALL = "roll_call"
    AID = "aid"
    GENERAL = "general"


class NotificationPriority(str, enum.Enum):
    """Notification priority enumeration."""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    URGENT = "urgent"


class NotificationStatus(str, enum.Enum):
    """Notification status enumeration."""
    PENDING = "pending"
    SENT = "sent"
    READ = "read"
    FAILED = "failed"


class PacketType(str, enum.Enum):
    """Mesh packet type enumeration."""
    STATUS = "status"
    SOS = "sos"
    LOCATION = "location"
    MESSAGE = "message"


class ChatbotConversation(Base):
    """Chatbot conversation model."""
    __tablename__ = "chatbot_conversations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    citizen_id = Column(UUID(as_uuid=True), ForeignKey("citizens.id"), nullable=True)
    session_id = Column(String, nullable=False, index=True)
    message = Column(Text, nullable=False)
    response = Column(Text, nullable=False)
    message_type = Column(SQLEnum(MessageType), nullable=False)
    is_anonymized = Column(Boolean, nullable=False, default=False)
    created_at = Column(DateTime, nullable=False, index=True)

    # Relationships
    citizen = relationship("Citizen")


class Notification(Base):
    """System notification model."""
    __tablename__ = "notifications"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    citizen_id = Column(UUID(as_uuid=True), ForeignKey("citizens.id"), nullable=True)
    notification_type = Column(SQLEnum(NotificationType), nullable=False)
    title = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    priority = Column(SQLEnum(NotificationPriority), nullable=False)
    status = Column(SQLEnum(NotificationStatus), nullable=False)
    sent_at = Column(DateTime, nullable=True)
    read_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, nullable=False, index=True)

    # Relationships
    citizen = relationship("Citizen")


class MeshPacket(Base):
    """BLE mesh network packet model."""
    __tablename__ = "mesh_packets"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    sender_citizen_id = Column(UUID(as_uuid=True), ForeignKey("citizens.id"), nullable=True)
    receiver_citizen_id = Column(UUID(as_uuid=True), ForeignKey("citizens.id"), nullable=True)
    packet_type = Column(SQLEnum(PacketType), nullable=False)
    packet_data = Column(JSON, nullable=False)  # Compressed packet data
    source_latitude = Column(Float, nullable=True)
    source_longitude = Column(Float, nullable=True)
    received_via_gateway = Column(Boolean, nullable=False, default=False)
    transmitted_at = Column(DateTime, nullable=False, index=True)
    received_at = Column(DateTime, nullable=False, index=True)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)

    # Relationships
    sender = relationship("Citizen", foreign_keys=[sender_citizen_id])
    receiver = relationship("Citizen", foreign_keys=[receiver_citizen_id])
