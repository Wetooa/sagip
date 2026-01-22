"""Device-related factories."""
import factory
import random
from datetime import datetime, timedelta
from app.factories.base import BaseFactory, fake, get_philippine_coordinates
from app.models.devices import Device, LoRaDevice, DeviceType
from app.factories.citizen import CitizenFactory


class DeviceFactory(BaseFactory):
    """Factory for Device model."""

    class Meta:
        model = Device

    citizen = factory.SubFactory(CitizenFactory)
    device_type = factory.Iterator([DeviceType.PHONE, DeviceType.TABLET, DeviceType.OTHER], cycle=True)
    device_identifier = factory.LazyAttribute(lambda obj: fake.uuid4())
    device_name = factory.LazyAttribute(
        lambda obj: fake.random_element(elements=["iPhone", "Samsung Galaxy", "iPad", "Android Tablet"]) 
        if fake.boolean(chance_of_getting_true=70) else None
    )
    is_active = factory.LazyFunction(lambda: fake.boolean(chance_of_getting_true=90))
    current_latitude = factory.LazyFunction(lambda: get_philippine_coordinates()[0] if fake.boolean(chance_of_getting_true=80) else None)
    current_longitude = factory.LazyFunction(lambda: get_philippine_coordinates()[1] if fake.boolean(chance_of_getting_true=80) else None)
    last_seen_at = factory.LazyFunction(
        lambda: datetime.utcnow() - timedelta(minutes=random.randint(0, 1440)) 
        if fake.boolean(chance_of_getting_true=80) else None
    )
    registered_at = factory.LazyFunction(datetime.utcnow)
    created_at = factory.LazyFunction(datetime.utcnow)
    updated_at = factory.LazyFunction(datetime.utcnow)


class LoRaDeviceFactory(BaseFactory):
    """Factory for LoRaDevice model."""

    class Meta:
        model = LoRaDevice

    citizen = factory.SubFactory(CitizenFactory)
    device_id = factory.LazyAttribute(lambda obj: f"LORA-{random.randint(100000, 999999)}")
    device_name = factory.LazyAttribute(
        lambda obj: fake.random_element(elements=["LoRa Beacon", "LoRa Tracker", "LoRa Emergency Device"])
        if fake.boolean(chance_of_getting_true=60) else None
    )
    is_active = factory.LazyFunction(lambda: fake.boolean(chance_of_getting_true=85))
    current_latitude = factory.LazyFunction(lambda: get_philippine_coordinates()[0] if fake.boolean(chance_of_getting_true=75) else None)
    current_longitude = factory.LazyFunction(lambda: get_philippine_coordinates()[1] if fake.boolean(chance_of_getting_true=75) else None)
    last_seen_at = factory.LazyFunction(
        lambda: datetime.utcnow() - timedelta(minutes=random.randint(0, 2880))
        if fake.boolean(chance_of_getting_true=75) else None
    )
    registered_at = factory.LazyFunction(datetime.utcnow)
    created_at = factory.LazyFunction(datetime.utcnow)
    updated_at = factory.LazyFunction(datetime.utcnow)
