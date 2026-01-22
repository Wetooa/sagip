"""Emergency-related factories."""
import factory
import random
from datetime import datetime, timedelta
from app.factories.base import BaseFactory, fake, get_philippine_coordinates
from app.models.emergency import (
    Incident,
    SOSSignal,
    RollCall,
    RollCallResponse,
    RescueDispatch,
    IncidentType,
    IncidentStatus,
    Severity,
    SignalType,
    SignalStatus,
    RollCallStatus,
    ResponseStatus,
    DispatchStatus,
)
from app.factories.citizen import CitizenFactory


class IncidentFactory(BaseFactory):
    """Factory for Incident model."""

    class Meta:
        model = Incident

    incident_name = factory.LazyAttribute(
        lambda obj: fake.random_element(elements=[
            "Typhoon Odette", "Flood Alert Metro Manila", "Landslide Baguio",
            "Earthquake Mindanao", "Flash Flood Cebu", "Storm Surge Leyte"
        ])
    )
    incident_type = factory.Iterator([
        IncidentType.TYPHOON,
        IncidentType.FLOOD,
        IncidentType.LANDSLIDE,
        IncidentType.EARTHQUAKE,
        IncidentType.OTHER,
    ], cycle=True)
    status = factory.Iterator([
        IncidentStatus.MONITORING,
        IncidentStatus.ACTIVE,
        IncidentStatus.RESOLVED,
        IncidentStatus.CANCELLED,
    ], cycle=True)
    severity = factory.Iterator([
        Severity.LOW,
        Severity.MEDIUM,
        Severity.HIGH,
        Severity.CRITICAL,
    ], cycle=True)
    affected_region = factory.LazyAttribute(
        lambda obj: fake.random_element(elements=[
            "Metro Manila", "Cebu", "Davao", "Baguio", "Leyte", "Palawan", "Mindanao"
        ])
    )
    latitude = factory.LazyFunction(lambda: get_philippine_coordinates()[0])
    longitude = factory.LazyFunction(lambda: get_philippine_coordinates()[1])
    description = factory.LazyAttribute(
        lambda obj: fake.text(max_nb_chars=500) if fake.boolean(chance_of_getting_true=80) else None
    )
    activated_at = factory.LazyFunction(
        lambda: datetime.utcnow() - timedelta(hours=random.randint(1,168))
        if fake.boolean(chance_of_getting_true=70) else None
    )
    resolved_at = factory.LazyFunction(
        lambda: datetime.utcnow() - timedelta(hours=random.randint(0,72))
        if fake.boolean(chance_of_getting_true=30) else None
    )
    created_at = factory.LazyFunction(datetime.utcnow)
    updated_at = factory.LazyFunction(datetime.utcnow)


class SOSSignalFactory(BaseFactory):
    """Factory for SOSSignal model."""

    class Meta:
        model = SOSSignal

    citizen = factory.SubFactory(CitizenFactory)
    incident = factory.SubFactory(IncidentFactory) if fake.boolean(chance_of_getting_true=60) else None
    latitude = factory.LazyFunction(lambda: get_philippine_coordinates()[0])
    longitude = factory.LazyFunction(lambda: get_philippine_coordinates()[1])
    signal_type = factory.Iterator([
        SignalType.LORA,
        SignalType.MESH,
        SignalType.MANUAL,
    ], cycle=True)
    status = factory.Iterator([
        SignalStatus.PENDING,
        SignalStatus.RECEIVED,
        SignalStatus.DISPATCHED,
        SignalStatus.RESOLVED,
    ], cycle=True)
    priority = factory.Iterator([
        Severity.LOW,
        Severity.MEDIUM,
        Severity.HIGH,
        Severity.CRITICAL,
    ], cycle=True)
    message = factory.LazyAttribute(
        lambda obj: fake.text(max_nb_chars=200) if fake.boolean(chance_of_getting_true=70) else None
    )
    received_at = factory.LazyFunction(
        lambda: datetime.utcnow() - timedelta(minutes=random.randint(0,1440))
    )
    resolved_at = factory.LazyFunction(
        lambda: datetime.utcnow() - timedelta(minutes=random.randint(0,720))
        if fake.boolean(chance_of_getting_true=30) else None
    )
    created_at = factory.LazyFunction(datetime.utcnow)
    updated_at = factory.LazyFunction(datetime.utcnow)


class RollCallFactory(BaseFactory):
    """Factory for RollCall model."""

    class Meta:
        model = RollCall

    incident = factory.SubFactory(IncidentFactory)
    roll_call_name = factory.LazyAttribute(
        lambda obj: f"Roll Call - {obj.incident.incident_name} - {fake.date_time().strftime('%Y%m%d')}"
    )
    affected_region = factory.LazyAttribute(lambda obj: obj.incident.affected_region)
    status = factory.Iterator([
        RollCallStatus.PENDING,
        RollCallStatus.ACTIVE,
        RollCallStatus.COMPLETED,
    ], cycle=True)
    triggered_at = factory.LazyFunction(
        lambda: datetime.utcnow() - timedelta(minutes=random.randint(0,2880))
    )
    completed_at = factory.LazyFunction(
        lambda: datetime.utcnow() - timedelta(minutes=random.randint(0,1440))
        if fake.boolean(chance_of_getting_true=50) else None
    )
    created_at = factory.LazyFunction(datetime.utcnow)
    updated_at = factory.LazyFunction(datetime.utcnow)


class RollCallResponseFactory(BaseFactory):
    """Factory for RollCallResponse model."""

    class Meta:
        model = RollCallResponse

    roll_call = factory.SubFactory(RollCallFactory)
    citizen = factory.SubFactory(CitizenFactory)
    response_status = factory.Iterator([
        ResponseStatus.SAFE,
        ResponseStatus.STRANDED,
        ResponseStatus.NEEDS_HELP,
        ResponseStatus.NO_RESPONSE,
    ], cycle=True)
    latitude = factory.LazyFunction(
        lambda: get_philippine_coordinates()[0] if fake.boolean(chance_of_getting_true=70) else None
    )
    longitude = factory.LazyFunction(
        lambda: get_philippine_coordinates()[1] if fake.boolean(chance_of_getting_true=70) else None
    )
    message = factory.LazyAttribute(
        lambda obj: fake.text(max_nb_chars=200) if fake.boolean(chance_of_getting_true=50) else None
    )
    responded_at = factory.LazyFunction(
        lambda: datetime.utcnow() - timedelta(minutes=random.randint(0,1440))
    )
    created_at = factory.LazyFunction(datetime.utcnow)


class RescueDispatchFactory(BaseFactory):
    """Factory for RescueDispatch model."""

    class Meta:
        model = RescueDispatch

    incident = factory.SubFactory(IncidentFactory)
    sos_signal = factory.SubFactory(SOSSignalFactory, incident=factory.SelfAttribute("..incident")) if fake.boolean(chance_of_getting_true=60) else None
    team_name = factory.LazyAttribute(
        lambda obj: fake.random_element(elements=[
            "Rescue Team Alpha", "Emergency Response Unit 1", "Search and Rescue Team",
            "Disaster Response Squad", "Emergency Medical Team"
        ])
    )
    team_size = factory.LazyFunction(lambda: random.randint(3,15))
    status = factory.Iterator([
        DispatchStatus.DISPATCHED,
        DispatchStatus.EN_ROUTE,
        DispatchStatus.ON_SITE,
        DispatchStatus.COMPLETED,
        DispatchStatus.CANCELLED,
    ], cycle=True)
    target_latitude = factory.LazyFunction(lambda: get_philippine_coordinates()[0])
    target_longitude = factory.LazyFunction(lambda: get_philippine_coordinates()[1])
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
