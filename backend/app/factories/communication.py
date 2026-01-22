"""Communication-related factories."""
import factory
import random
from datetime import datetime, timedelta
from app.factories.base import BaseFactory, fake, get_philippine_coordinates
from app.models.communication import (
    ChatbotConversation,
    Notification,
    MeshPacket,
    MessageType,
    NotificationType,
    NotificationPriority,
    NotificationStatus,
    PacketType,
)
from app.factories.citizen import CitizenFactory


class ChatbotConversationFactory(BaseFactory):
    """Factory for ChatbotConversation model."""

    class Meta:
        model = ChatbotConversation

    citizen = factory.SubFactory(CitizenFactory) if fake.boolean(chance_of_getting_true=70) else None
    session_id = factory.LazyAttribute(lambda obj: fake.uuid4())
    message = factory.LazyAttribute(lambda obj: fake.text(max_nb_chars=500))
    response = factory.LazyAttribute(lambda obj: fake.text(max_nb_chars=1000))
    message_type = factory.Iterator([
        MessageType.QUESTION,
        MessageType.SYMPTOM_REPORT,
        MessageType.GENERAL,
    ], cycle=True)
    is_anonymized = factory.LazyFunction(lambda: fake.boolean(chance_of_getting_true=30))
    created_at = factory.LazyFunction(
        lambda: datetime.utcnow() - timedelta(minutes=random.randint(0,10080))
    )


class NotificationFactory(BaseFactory):
    """Factory for Notification model."""

    class Meta:
        model = Notification

    citizen = factory.SubFactory(CitizenFactory) if fake.boolean(chance_of_getting_true=80) else None
    notification_type = factory.Iterator([
        NotificationType.ALERT,
        NotificationType.EVACUATION,
        NotificationType.ROLL_CALL,
        NotificationType.AID,
        NotificationType.GENERAL,
    ], cycle=True)
    title = factory.LazyAttribute(
        lambda obj: fake.random_element(elements=[
            "Emergency Alert", "Evacuation Notice", "Roll Call Request",
            "Aid Available", "Weather Update", "Safety Reminder"
        ])
    )
    message = factory.LazyAttribute(lambda obj: fake.text(max_nb_chars=500))
    priority = factory.Iterator([
        NotificationPriority.LOW,
        NotificationPriority.MEDIUM,
        NotificationPriority.HIGH,
        NotificationPriority.URGENT,
    ], cycle=True)
    status = factory.Iterator([
        NotificationStatus.PENDING,
        NotificationStatus.SENT,
        NotificationStatus.READ,
        NotificationStatus.FAILED,
    ], cycle=True)
    sent_at = factory.LazyFunction(
        lambda: datetime.utcnow() - timedelta(minutes=random.randint(0,1440))
        if fake.boolean(chance_of_getting_true=70) else None
    )
    read_at = factory.LazyFunction(
        lambda: datetime.utcnow() - timedelta(minutes=random.randint(0,720))
        if fake.boolean(chance_of_getting_true=50) else None
    )
    created_at = factory.LazyFunction(
        lambda: datetime.utcnow() - timedelta(minutes=random.randint(0,2880))
    )


class MeshPacketFactory(BaseFactory):
    """Factory for MeshPacket model."""

    class Meta:
        model = MeshPacket

    sender = factory.SubFactory(CitizenFactory) if fake.boolean(chance_of_getting_true=80) else None
    receiver = factory.SubFactory(CitizenFactory) if fake.boolean(chance_of_getting_true=60) else None
    packet_type = factory.Iterator([
        PacketType.STATUS,
        PacketType.SOS,
        PacketType.LOCATION,
        PacketType.MESSAGE,
    ], cycle=True)
    packet_data = factory.LazyAttribute(
        lambda obj: {
            "message": fake.text(max_nb_chars=200) if obj.packet_type == PacketType.MESSAGE else None,
            "status": fake.random_element(elements=["ok", "help", "emergency"]) if obj.packet_type == PacketType.STATUS else None,
            "location": {
                "lat": get_philippine_coordinates()[0],
                "lon": get_philippine_coordinates()[1],
            } if obj.packet_type == PacketType.LOCATION else None,
            "timestamp": datetime.utcnow().isoformat(),
        }
    )
    source_latitude = factory.LazyFunction(
        lambda: get_philippine_coordinates()[0] if fake.boolean(chance_of_getting_true=70) else None
    )
    source_longitude = factory.LazyFunction(
        lambda: get_philippine_coordinates()[1] if fake.boolean(chance_of_getting_true=70) else None
    )
    received_via_gateway = factory.LazyFunction(lambda: fake.boolean(chance_of_getting_true=40))
    transmitted_at = factory.LazyFunction(
        lambda: datetime.utcnow() - timedelta(minutes=random.randint(0,1440))
    )
    received_at = factory.LazyFunction(
        lambda: datetime.utcnow() - timedelta(minutes=random.randint(0,1440))
    )
    created_at = factory.LazyFunction(datetime.utcnow)
