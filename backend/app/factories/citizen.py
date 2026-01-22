"""Citizen-related factories."""
import factory
import random
from datetime import datetime, timedelta, date
from app.factories.base import BaseFactory, fake, get_philippine_coordinates, get_philippine_phone
from app.models.citizen import Citizen, CensusData, VulnerabilityProfile, FamilyMember, UserRole, RiskLevel
from app.core.security import get_password_hash

# Cache for password hash to avoid recomputing
_password_hash_cache = None


def _get_default_password_hash():
    """Lazy-load password hash to avoid bcrypt initialization issues at import time."""
    global _password_hash_cache
    if _password_hash_cache is None:
        _password_hash_cache = get_password_hash("password123")
    return _password_hash_cache


class CitizenFactory(BaseFactory):
    """Factory for Citizen model."""

    class Meta:
        model = Citizen

    email = factory.LazyAttribute(lambda obj: fake.unique.email())
    phone_number = factory.LazyFunction(lambda: get_philippine_phone() if fake.boolean(chance_of_getting_true=80) else None)
    full_name = factory.LazyAttribute(lambda obj: fake.name())
    password_hash = factory.LazyFunction(_get_default_password_hash)
    role = factory.Iterator([UserRole.CITIZEN, UserRole.COMMAND_CENTER], cycle=True)
    is_active = True
    created_at = factory.LazyFunction(datetime.utcnow)
    updated_at = factory.LazyFunction(datetime.utcnow)


class CensusDataFactory(BaseFactory):
    """Factory for CensusData model."""

    class Meta:
        model = CensusData

    citizen = factory.SubFactory(CitizenFactory)
    family_size = factory.LazyFunction(lambda: random.randint(1, 10))
    medical_needs = factory.LazyAttribute(
        lambda obj: fake.text(max_nb_chars=200) if fake.boolean(chance_of_getting_true=30) else None
    )
    volunteer_willingness = factory.LazyFunction(lambda: fake.boolean(chance_of_getting_true=40))
    address = factory.LazyAttribute(lambda obj: fake.street_address())
    barangay = factory.LazyAttribute(lambda obj: fake.city_suffix() + " " + fake.word().title())
    city = factory.LazyAttribute(lambda obj: fake.city())
    province = factory.LazyAttribute(
        lambda obj: fake.random_element(elements=[
            "Metro Manila", "Cebu", "Davao", "Laguna", "Cavite", "Rizal", 
            "Bulacan", "Pampanga", "Batangas", "Quezon", "Negros Occidental",
            "Iloilo", "Zamboanga del Sur", "Palawan", "Bohol"
        ])
    )
    government_id = factory.LazyAttribute(
        lambda obj: fake.random_element(elements=[
            f"SSS-{random.randint(1000000, 9999999)}",
            f"TIN-{random.randint(100000000, 999999999)}",
            f"PHILHEALTH-{random.randint(10000000, 99999999)}",
            f"PAGIBIG-{random.randint(10000000, 99999999)}",
        ]) if fake.boolean(chance_of_getting_true=70) else None
    )
    birth_date = factory.LazyFunction(
        lambda: (datetime.utcnow() - timedelta(days=random.randint(18*365, 80*365))).date()
        if fake.boolean(chance_of_getting_true=80) else None
    )
    has_vulnerable_family_member = factory.LazyFunction(lambda: fake.boolean(chance_of_getting_true=30))
    additional_info = factory.LazyAttribute(
        lambda obj: {
            "emergency_contact": get_philippine_phone(),
            "special_requirements": fake.text(max_nb_chars=100) if fake.boolean(chance_of_getting_true=20) else None,
        } if fake.boolean(chance_of_getting_true=50) else None
    )
    submitted_at = factory.LazyFunction(datetime.utcnow)
    created_at = factory.LazyFunction(datetime.utcnow)
    updated_at = factory.LazyFunction(datetime.utcnow)


class VulnerabilityProfileFactory(BaseFactory):
    """Factory for VulnerabilityProfile model."""

    class Meta:
        model = VulnerabilityProfile

    citizen = factory.SubFactory(CitizenFactory)
    census_data = factory.SubFactory(CensusDataFactory, citizen=factory.SelfAttribute("..citizen"))
    
    @factory.lazy_attribute
    def risk_level(self):
        """Generate risk level."""
        return fake.random_element(elements=[RiskLevel.LOW, RiskLevel.MEDIUM, RiskLevel.HIGH, RiskLevel.CRITICAL])
    
    @factory.lazy_attribute
    def risk_score(self):
        """Calculate risk score based on risk level."""
        if self.risk_level == RiskLevel.LOW:
            return random.uniform(0.0, 0.3)
        elif self.risk_level == RiskLevel.MEDIUM:
            return random.uniform(0.3, 0.6)
        elif self.risk_level == RiskLevel.HIGH:
            return random.uniform(0.6, 0.85)
        else:  # CRITICAL
            return random.uniform(0.85, 1.0)
    
    factors = factory.LazyAttribute(
        lambda obj: {
            "age": random.randint(18, 80),
            "medical_conditions": random.randint(0, 3),
            "mobility_issues": fake.boolean(chance_of_getting_true=20),
            "location_risk": random.uniform(0.0, 1.0),
            "family_size": random.randint(1, 10),
        }
    )
    last_calculated_at = factory.LazyFunction(datetime.utcnow)
    created_at = factory.LazyFunction(datetime.utcnow)
    updated_at = factory.LazyFunction(datetime.utcnow)


class FamilyMemberFactory(BaseFactory):
    """Factory for FamilyMember model."""

    class Meta:
        model = FamilyMember

    census_data = factory.SubFactory(CensusDataFactory)
    full_name = factory.LazyAttribute(lambda obj: fake.name())
    family_relationship = factory.LazyAttribute(
        lambda obj: fake.random_element(elements=["spouse", "child", "parent", "sibling", "other"])
    )
    
    @factory.lazy_attribute
    def age(self):
        """Generate age based on relationship."""
        relationship = self.family_relationship
        if relationship == "child":
            return random.randint(0, 18)
        elif relationship == "parent":
            return random.randint(50, 90)
        elif relationship == "spouse":
            return random.randint(25, 65)
        elif relationship == "sibling":
            return random.randint(15, 50)
        else:
            return random.randint(0, 80)
    
    government_id = factory.LazyAttribute(
        lambda obj: fake.random_element(elements=[
            f"SSS-{random.randint(1000000, 9999999)}",
            f"TIN-{random.randint(100000000, 999999999)}",
            f"PHILHEALTH-{random.randint(10000000, 99999999)}",
        ]) if fake.boolean(chance_of_getting_true=50) else None
    )
    
    @factory.lazy_attribute
    def is_vulnerable(self):
        """Determine if member is vulnerable (20% chance)."""
        return fake.boolean(chance_of_getting_true=20)
    
    @factory.lazy_attribute
    def vulnerability_type(self):
        """Set vulnerability type if member is vulnerable."""
        if self.is_vulnerable:
            return fake.random_element(elements=["elderly", "PWD", "bed-ridden", "sickly"])
        return None
    
    medical_conditions = factory.LazyAttribute(
        lambda obj: fake.text(max_nb_chars=200) if obj.is_vulnerable and fake.boolean(chance_of_getting_true=60) else None
    )
    created_at = factory.LazyFunction(datetime.utcnow)
    updated_at = factory.LazyFunction(datetime.utcnow)
