"""Location-related factories."""
import factory
import random
from datetime import datetime, timedelta
from app.factories.base import BaseFactory, fake, get_philippine_coordinates
from app.models.location import LocationHistory, PredictedLocation, LocationSource
from app.factories.citizen import CitizenFactory
from app.factories.devices import DeviceFactory, LoRaDeviceFactory


class LocationHistoryFactory(BaseFactory):
    """Factory for LocationHistory model."""

    class Meta:
        model = LocationHistory

    # One of device_id, lora_device_id, or citizen_id should be set
    # Default to using a device (most common case)
    device = factory.SubFactory(DeviceFactory)
    lora_device = None
    citizen = factory.LazyAttribute(lambda obj: obj.device.citizen if obj.device else None)
    
    @factory.lazy_attribute
    def latitude(self):
        """Generate latitude within Philippines."""
        return get_philippine_coordinates()[0]
    
    @factory.lazy_attribute
    def longitude(self):
        """Generate longitude within Philippines."""
        return get_philippine_coordinates()[1]
    
    accuracy = factory.LazyFunction(
        lambda: random.uniform(5.0, 50.0) if fake.boolean(chance_of_getting_true=70) else None
    )
    altitude = factory.LazyFunction(
        lambda: random.uniform(0.0, 2000.0) if fake.boolean(chance_of_getting_true=50) else None
    )
    heading = factory.LazyFunction(
        lambda: random.uniform(0.0, 360.0) if fake.boolean(chance_of_getting_true=40) else None
    )
    speed = factory.LazyFunction(
        lambda: random.uniform(0.0, 100.0) if fake.boolean(chance_of_getting_true=50) else None
    )
    source = factory.Iterator([LocationSource.GPS, LocationSource.LORA, LocationSource.MANUAL, LocationSource.PREDICTED], cycle=True)
    recorded_at = factory.LazyFunction(
        lambda: datetime.utcnow() - timedelta(minutes=random.randint(0, 10080))  # Up to 7 days ago
    )
    created_at = factory.LazyFunction(datetime.utcnow)


class PredictedLocationFactory(BaseFactory):
    """Factory for PredictedLocation model."""

    class Meta:
        model = PredictedLocation

    location_history = factory.SubFactory(LocationHistoryFactory)
    citizen = factory.LazyAttribute(lambda obj: obj.location_history.citizen)
    device = factory.LazyAttribute(lambda obj: obj.location_history.device)
    lora_device = factory.LazyAttribute(lambda obj: obj.location_history.lora_device)
    
    @factory.lazy_attribute
    def predicted_latitude(self):
        """Generate predicted latitude near the location history."""
        base_lat = self.location_history.latitude
        # Add small random offset (within ~1km)
        return base_lat + random.uniform(-0.01, 0.01)
    
    @factory.lazy_attribute
    def predicted_longitude(self):
        """Generate predicted longitude near the location history."""
        base_lon = self.location_history.longitude
        # Add small random offset (within ~1km)
        return base_lon + random.uniform(-0.01, 0.01)
    
    confidence_score = factory.LazyFunction(lambda: random.uniform(0.5, 1.0))
    prediction_method = factory.LazyAttribute(
        lambda obj: fake.random_element(elements=["ml_model", "pattern_analysis", "historical_trend", "neural_network"])
    )
    predicted_for_timestamp = factory.LazyFunction(
        lambda: datetime.utcnow() + timedelta(hours=random.randint(1, 48))
    )
    created_at = factory.LazyFunction(datetime.utcnow)
