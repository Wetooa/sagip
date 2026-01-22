"""Base factory configuration."""
import factory
from factory.alchemy import SQLAlchemyModelFactory
from faker import Faker
import random as py_random
from app.core.database import SessionLocal

# Initialize Faker with Philippine locale for realistic data
# Try to use en_PH, fallback to en if not available
try:
    fake = Faker("en_PH")
except:
    fake = Faker("en")

# Add phone provider if not available
try:
    # Try to use phone_number method
    fake.phone_number()
except (AttributeError, TypeError):
    # If not available, we'll use our custom function
    pass

# Get database session
db_session = SessionLocal()


class BaseFactory(SQLAlchemyModelFactory):
    """Base factory for all SQLAlchemy models."""

    class Meta:
        sqlalchemy_session = db_session
        sqlalchemy_session_persistence = "commit"


def get_philippine_coordinates():
    """Generate coordinates within Philippines bounds."""
    # Philippines approximate bounds: 4.6°N to 19.0°N, 116.9°E to 126.6°E
    latitude = fake.latitude() * 0.5 + 12.0  # Center around 12°N
    longitude = fake.longitude() * 0.3 + 121.5  # Center around 121.5°E
    
    # Ensure within bounds
    latitude = max(4.6, min(19.0, latitude))
    longitude = max(116.9, min(126.6, longitude))
    
    return latitude, longitude


def get_philippine_phone():
    """Generate Philippine phone number."""
    # Philippine mobile format: 09XXXXXXXXX (11 digits total)
    # Format: 09 + 9 digits
    return f"09{py_random.randint(100000000, 999999999)}"
