"""Nice-to-have feature factories."""
import factory
import random
from datetime import datetime, timedelta
from decimal import Decimal
from app.factories.base import BaseFactory, fake, get_philippine_coordinates, get_philippine_phone
from app.models.nice_to_have import (
    Asset,
    Volunteer,
    DonationFund,
    ExternalHelpRequest,
    CrowdsourcedHazard,
    AssetType,
    AvailabilityStatus,
    FundStatus,
    OrganizationType,
    HelpRequestStatus,
    HazardType,
    HazardSeverity,
    HazardStatus,
)
from app.factories.citizen import CitizenFactory
from app.factories.post_disaster import NeedsTicketFactory


class AssetFactory(BaseFactory):
    """Factory for Asset model."""

    class Meta:
        model = Asset

    citizen = factory.SubFactory(CitizenFactory)
    asset_type = factory.Iterator([
        AssetType.BOAT,
        AssetType.VEHICLE,
        AssetType.EQUIPMENT,
        AssetType.OTHER,
    ], cycle=True)
    asset_name = factory.LazyAttribute(
        lambda obj: fake.random_element(elements=[
            "Rescue Boat", "Ambulance", "4x4 Vehicle", "Generator",
            "Water Pump", "Medical Equipment", "Communication Radio"
        ]) if obj.asset_type != AssetType.OTHER else fake.word().title()
    )
    description = factory.LazyAttribute(
        lambda obj: fake.text(max_nb_chars=300) if fake.boolean(chance_of_getting_true=70) else None
    )
    is_available = factory.LazyFunction(lambda: fake.boolean(chance_of_getting_true=80))
    location_latitude = factory.LazyFunction(
        lambda: get_philippine_coordinates()[0] if fake.boolean(chance_of_getting_true=70) else None
    )
    location_longitude = factory.LazyFunction(
        lambda: get_philippine_coordinates()[1] if fake.boolean(chance_of_getting_true=70) else None
    )
    registered_at = factory.LazyFunction(datetime.utcnow)
    created_at = factory.LazyFunction(datetime.utcnow)
    updated_at = factory.LazyFunction(datetime.utcnow)


class VolunteerFactory(BaseFactory):
    """Factory for Volunteer model."""

    class Meta:
        model = Volunteer

    citizen = factory.SubFactory(CitizenFactory)
    skills = factory.LazyAttribute(
        lambda obj: fake.random_elements(
            elements=[
                "first_aid", "search_rescue", "cooking", "logistics",
                "communication", "medical", "engineering", "translation",
                "counseling", "coordination"
            ],
            length=random.randint(1,5),
            unique=True
        )
    )
    availability_status = factory.Iterator([
        AvailabilityStatus.AVAILABLE,
        AvailabilityStatus.BUSY,
        AvailabilityStatus.UNAVAILABLE,
    ], cycle=True)
    barangay = factory.LazyAttribute(
        lambda obj: fake.city_suffix() + " " + fake.word().title()
    )
    registered_at = factory.LazyFunction(datetime.utcnow)
    created_at = factory.LazyFunction(datetime.utcnow)
    updated_at = factory.LazyFunction(datetime.utcnow)


class DonationFundFactory(BaseFactory):
    """Factory for DonationFund model."""

    class Meta:
        model = DonationFund

    transaction_hash = factory.LazyAttribute(lambda obj: fake.sha256())
    donor_address = factory.LazyAttribute(
        lambda obj: fake.random_element(elements=[
            f"0x{fake.hexify(text='^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^', upper=False)}",
            None
        ])
    )
    amount = factory.LazyFunction(lambda: Decimal(str(random.uniform(100.0, 100000.0))))
    currency = factory.LazyAttribute(lambda obj: fake.random_element(elements=["PHP", "USD", "ETH", "BTC"]))
    purpose = factory.LazyAttribute(
        lambda obj: fake.text(max_nb_chars=200) if fake.boolean(chance_of_getting_true=70) else None
    )
    status = factory.Iterator([
        FundStatus.PENDING,
        FundStatus.CONFIRMED,
        FundStatus.AUTHORIZED,
        FundStatus.DISTRIBUTED,
    ], cycle=True)
    blockchain_network = factory.LazyAttribute(
        lambda obj: fake.random_element(elements=["ethereum", "polygon", "binance", "bitcoin"])
    )
    transaction_timestamp = factory.LazyFunction(
        lambda: datetime.utcnow() - timedelta(hours=random.randint(0,720))
    )
    created_at = factory.LazyFunction(datetime.utcnow)
    updated_at = factory.LazyFunction(datetime.utcnow)


class ExternalHelpRequestFactory(BaseFactory):
    """Factory for ExternalHelpRequest model."""

    class Meta:
        model = ExternalHelpRequest

    needs_ticket = factory.SubFactory(NeedsTicketFactory) if fake.boolean(chance_of_getting_true=60) else None
    organization_name = factory.LazyAttribute(
        lambda obj: fake.random_element(elements=[
            "Red Cross Philippines", "World Vision", "UNICEF",
            "Save the Children", "Local NGO", "Community Foundation"
        ])
    )
    organization_type = factory.Iterator([
        OrganizationType.NGO,
        OrganizationType.PRIVATE_DONOR,
        OrganizationType.GOVERNMENT,
        OrganizationType.OTHER,
    ], cycle=True)
    contact_info = factory.LazyAttribute(
        lambda obj: {
            "email": fake.email(),
            "phone": get_philippine_phone(),
            "address": fake.address(),
        }
    )
    offered_resources = factory.LazyAttribute(
        lambda obj: {
            "food": random.randint(0,1000),
            "water": random.randint(0,5000),
            "medicine": random.randint(0,500),
            "shelter": random.randint(0,100),
            "volunteers": random.randint(0,50),
        }
    )
    status = factory.Iterator([
        HelpRequestStatus.PENDING,
        HelpRequestStatus.MATCHED,
        HelpRequestStatus.FULFILLED,
        HelpRequestStatus.CANCELLED,
    ], cycle=True)
    matched_at = factory.LazyFunction(
        lambda: datetime.utcnow() - timedelta(hours=random.randint(0,168))
        if fake.boolean(chance_of_getting_true=40) else None
    )
    created_at = factory.LazyFunction(datetime.utcnow)
    updated_at = factory.LazyFunction(datetime.utcnow)


class CrowdsourcedHazardFactory(BaseFactory):
    """Factory for CrowdsourcedHazard model."""

    class Meta:
        model = CrowdsourcedHazard

    reporter_citizen = factory.SubFactory(CitizenFactory) if fake.boolean(chance_of_getting_true=80) else None
    hazard_type = factory.Iterator([
        HazardType.FLOOD,
        HazardType.LANDSLIDE,
        HazardType.DEBRIS,
        HazardType.DAMAGE,
        HazardType.OTHER,
    ], cycle=True)
    latitude = factory.LazyFunction(lambda: get_philippine_coordinates()[0])
    longitude = factory.LazyFunction(lambda: get_philippine_coordinates()[1])
    description = factory.LazyAttribute(lambda obj: fake.text(max_nb_chars=500))
    severity = factory.Iterator([
        HazardSeverity.LOW,
        HazardSeverity.MEDIUM,
        HazardSeverity.HIGH,
    ], cycle=True)
    status = factory.Iterator([
        HazardStatus.PENDING,
        HazardStatus.VERIFIED,
        HazardStatus.REJECTED,
    ], cycle=True)
    verified_by = factory.LazyFunction(
        lambda: fake.uuid4() if fake.boolean(chance_of_getting_true=40) else None
    )
    verified_at = factory.LazyFunction(
        lambda: datetime.utcnow() - timedelta(hours=random.randint(0,168))
        if fake.boolean(chance_of_getting_true=40) else None
    )
    reported_at = factory.LazyFunction(
        lambda: datetime.utcnow() - timedelta(hours=random.randint(0,336))
    )
    created_at = factory.LazyFunction(datetime.utcnow)
    updated_at = factory.LazyFunction(datetime.utcnow)
