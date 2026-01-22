"""Post-disaster-related factories."""
import factory
import random
from datetime import datetime, timedelta
from app.factories.base import BaseFactory, fake, get_philippine_coordinates
from app.models.post_disaster import (
    NeedsTicket,
    HealthReport,
    HealthCluster,
    MedicalDispatch,
    NeedType,
    TicketStatus,
    Severity,
    HealthSeverity,
    ClusterStatus,
    DispatchStatus,
)
from app.factories.citizen import CitizenFactory


class NeedsTicketFactory(BaseFactory):
    """Factory for NeedsTicket model."""

    class Meta:
        model = NeedsTicket

    citizen = factory.SubFactory(CitizenFactory)
    ticket_number = factory.LazyAttribute(lambda obj: f"TICKET-{random.randint(100000,999999)}")
    need_type = factory.Iterator([
        NeedType.MEDICINE,
        NeedType.FOOD,
        NeedType.WATER,
        NeedType.SHELTER,
        NeedType.CLOTHING,
        NeedType.OTHER,
    ], cycle=True)
    description = factory.LazyAttribute(lambda obj: fake.text(max_nb_chars=500))
    priority = factory.Iterator([
        Severity.LOW,
        Severity.MEDIUM,
        Severity.HIGH,
        Severity.CRITICAL,
    ], cycle=True)
    status = factory.Iterator([
        TicketStatus.PENDING,
        TicketStatus.VERIFIED,
        TicketStatus.MATCHED,
        TicketStatus.FULFILLED,
        TicketStatus.CANCELLED,
    ], cycle=True)
    verified_at = factory.LazyFunction(
        lambda: datetime.utcnow() - timedelta(hours=random.randint(0,168))
        if fake.boolean(chance_of_getting_true=60) else None
    )
    matched_with = factory.LazyFunction(
        lambda: fake.uuid4() if fake.boolean(chance_of_getting_true=30) else None
    )
    fulfilled_at = factory.LazyFunction(
        lambda: datetime.utcnow() - timedelta(hours=random.randint(0,72))
        if fake.boolean(chance_of_getting_true=20) else None
    )
    created_at = factory.LazyFunction(
        lambda: datetime.utcnow() - timedelta(hours=random.randint(0,720))
    )
    updated_at = factory.LazyFunction(datetime.utcnow)


class HealthReportFactory(BaseFactory):
    """Factory for HealthReport model."""

    class Meta:
        model = HealthReport

    citizen = factory.SubFactory(CitizenFactory) if fake.boolean(chance_of_getting_true=70) else None
    symptoms = factory.LazyAttribute(
        lambda obj: fake.random_elements(
            elements=[
                "fever", "cough", "headache", "nausea", "dizziness",
                "fatigue", "body aches", "shortness of breath", "sore throat"
            ],
            length=random.randint(1,5),
            unique=True
        )
    )
    severity = factory.Iterator([
        HealthSeverity.MILD,
        HealthSeverity.MODERATE,
        HealthSeverity.SEVERE,
    ], cycle=True)
    location_latitude = factory.LazyFunction(
        lambda: get_philippine_coordinates()[0] if fake.boolean(chance_of_getting_true=60) else None
    )
    location_longitude = factory.LazyFunction(
        lambda: get_philippine_coordinates()[1] if fake.boolean(chance_of_getting_true=60) else None
    )
    is_anonymized = factory.LazyFunction(lambda: fake.boolean(chance_of_getting_true=80))
    reported_at = factory.LazyFunction(
        lambda: datetime.utcnow() - timedelta(hours=random.randint(0,168))
    )
    created_at = factory.LazyFunction(datetime.utcnow)


class HealthClusterFactory(BaseFactory):
    """Factory for HealthCluster model."""

    class Meta:
        model = HealthCluster

    cluster_name = factory.LazyAttribute(
        lambda obj: fake.random_element(elements=[
            "Fever Cluster", "Respiratory Cluster", "Gastrointestinal Cluster",
            "Unknown Illness Cluster", "Outbreak Zone Alpha"
        ])
    )
    cluster_type = factory.LazyAttribute(
        lambda obj: fake.random_element(elements=[
            "fever", "respiratory", "gastrointestinal", "unknown", "viral"
        ])
    )
    center_latitude = factory.LazyFunction(lambda: get_philippine_coordinates()[0])
    center_longitude = factory.LazyFunction(lambda: get_philippine_coordinates()[1])
    radius_km = factory.LazyFunction(lambda: random.uniform(0.5, 10.0))
    affected_count = factory.LazyFunction(lambda: random.randint(5,200))
    severity = factory.Iterator([
        Severity.LOW,
        Severity.MEDIUM,
        Severity.HIGH,
        Severity.CRITICAL,
    ], cycle=True)
    status = factory.Iterator([
        ClusterStatus.DETECTED,
        ClusterStatus.INVESTIGATING,
        ClusterStatus.RESOLVED,
    ], cycle=True)
    detected_at = factory.LazyFunction(
        lambda: datetime.utcnow() - timedelta(hours=random.randint(0,336))
    )
    resolved_at = factory.LazyFunction(
        lambda: datetime.utcnow() - timedelta(hours=random.randint(0,168))
        if fake.boolean(chance_of_getting_true=30) else None
    )
    created_at = factory.LazyFunction(datetime.utcnow)
    updated_at = factory.LazyFunction(datetime.utcnow)


class MedicalDispatchFactory(BaseFactory):
    """Factory for MedicalDispatch model."""

    class Meta:
        model = MedicalDispatch

    health_cluster = factory.SubFactory(HealthClusterFactory)
    team_name = factory.LazyAttribute(
        lambda obj: fake.random_element(elements=[
            "Medical Team Alpha", "Health Response Unit 1", "Emergency Medical Squad",
            "Public Health Team", "Medical Assessment Unit"
        ])
    )
    team_size = factory.LazyFunction(lambda: random.randint(2,10))
    status = factory.Iterator([
        DispatchStatus.DISPATCHED,
        DispatchStatus.EN_ROUTE,
        DispatchStatus.ON_SITE,
        DispatchStatus.COMPLETED,
        DispatchStatus.CANCELLED,
    ], cycle=True)
    target_latitude = factory.LazyAttribute(lambda obj: obj.health_cluster.center_latitude)
    target_longitude = factory.LazyAttribute(lambda obj: obj.health_cluster.center_longitude)
    dispatched_at = factory.LazyFunction(
        lambda: datetime.utcnow() - timedelta(hours=random.randint(0,48))
    )
    arrived_at = factory.LazyFunction(
        lambda: datetime.utcnow() - timedelta(hours=random.randint(0,24))
        if fake.boolean(chance_of_getting_true=40) else None
    )
    completed_at = factory.LazyFunction(
        lambda: datetime.utcnow() - timedelta(hours=random.randint(0,12))
        if fake.boolean(chance_of_getting_true=30) else None
    )
    notes = factory.LazyAttribute(
        lambda obj: fake.text(max_nb_chars=300) if fake.boolean(chance_of_getting_true=60) else None
    )
    created_at = factory.LazyFunction(datetime.utcnow)
    updated_at = factory.LazyFunction(datetime.utcnow)
