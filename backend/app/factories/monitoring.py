"""Monitoring-related factories."""
import factory
import random
from datetime import datetime, timedelta
from app.factories.base import BaseFactory, fake, get_philippine_coordinates
from app.models.monitoring import WaterLevelReading, SensorStatus


class WaterLevelReadingFactory(BaseFactory):
    """Factory for WaterLevelReading model."""

    class Meta:
        model = WaterLevelReading

    sensor_id = factory.LazyAttribute(
        lambda obj: f"SENSOR-{random.randint(1000, 9999)}"
    )
    location_name = factory.LazyAttribute(
        lambda obj: fake.random_element(elements=[
            "Pasig River", "Marikina River", "Tullahan River", "San Juan River",
            "Laguna Lake", "Manila Bay", "Cebu River", "Davao River"
        ])
    )
    latitude = factory.LazyFunction(lambda: get_philippine_coordinates()[0])
    longitude = factory.LazyFunction(lambda: get_philippine_coordinates()[1])
    water_level_cm = factory.LazyFunction(lambda: random.uniform(0.0, 500.0))
    reading_timestamp = factory.LazyFunction(
        lambda: datetime.utcnow() - timedelta(minutes=random.randint(0, 1440))
    )
    sensor_status = factory.Iterator([
        SensorStatus.ACTIVE,
        SensorStatus.MAINTENANCE,
        SensorStatus.OFFLINE,
    ], cycle=True)
    sensor_metadata = factory.LazyAttribute(
        lambda obj: {
            "battery_level": random.uniform(0.0, 100.0),
            "signal_strength": random.uniform(-120.0, -50.0),
            "temperature": random.uniform(20.0, 40.0),
            "humidity": random.uniform(40.0, 100.0),
        } if fake.boolean(chance_of_getting_true=80) else None
    )
    created_at = factory.LazyFunction(datetime.utcnow)
