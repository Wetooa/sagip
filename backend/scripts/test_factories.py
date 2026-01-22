#!/usr/bin/env python3
"""Test script to validate all factory components before running full data generation."""
import argparse
import sys
import traceback
from pathlib import Path
from contextlib import contextmanager

# Add parent directory to path to import app modules
backend_dir = Path(__file__).parent.parent
sys.path.insert(0, str(backend_dir))

from sqlalchemy.orm import Session
from sqlalchemy import text

from app.core.database import SessionLocal, engine
from app.core.security import get_password_hash, verify_password
from app.factories.base import get_philippine_coordinates, get_philippine_phone
from app.factories import (
    CitizenFactory,
    CensusDataFactory,
    VulnerabilityProfileFactory,
    DeviceFactory,
    LoRaDeviceFactory,
    LocationHistoryFactory,
    PredictedLocationFactory,
    IncidentFactory,
    SOSSignalFactory,
    RollCallFactory,
    RollCallResponseFactory,
    RescueDispatchFactory,
    WaterLevelReadingFactory,
    ChatbotConversationFactory,
    NotificationFactory,
    MeshPacketFactory,
    NeedsTicketFactory,
    HealthReportFactory,
    HealthClusterFactory,
    MedicalDispatchFactory,
    AssetFactory,
    VolunteerFactory,
    DonationFundFactory,
    ExternalHelpRequestFactory,
    CrowdsourcedHazardFactory,
)


# ANSI color codes for terminal output
class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    RESET = '\033[0m'
    BOLD = '\033[1m'


def print_pass(message):
    """Print a passing test message."""
    print(f"  {Colors.GREEN}✓{Colors.RESET} {message}")


def print_fail(message, error=None, verbose=False):
    """Print a failing test message."""
    print(f"  {Colors.RED}✗{Colors.RESET} {message}")
    if error and verbose:
        print(f"    {Colors.RED}Error: {str(error)}{Colors.RESET}")
        print(f"    {traceback.format_exc()}")


def print_info(message):
    """Print an info message."""
    print(f"  {Colors.BLUE}ℹ{Colors.RESET} {message}")


@contextmanager
def test_transaction():
    """Context manager for test transactions that rollback."""
    session = SessionLocal()
    try:
        yield session
        session.rollback()  # Always rollback test data
    finally:
        session.close()


# Infrastructure Tests
def test_database_connection():
    """Test database connection."""
    try:
        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1"))
            result.fetchone()
        return True, None
    except Exception as e:
        return False, e


def test_password_hashing():
    """Test password hashing functionality."""
    try:
        # Use a simple password to avoid bcrypt issues
        password = "test123"
        hashed = get_password_hash(password)
        if not hashed or len(hashed) == 0:
            return False, "Empty hash returned"
        if not verify_password(password, hashed):
            return False, "Password verification failed"
        if verify_password("wrong_password", hashed):
            return False, "Wrong password was accepted"
        return True, None
    except Exception as e:
        return False, e


def test_coordinate_generation():
    """Test Philippine coordinate generation."""
    try:
        for _ in range(10):
            lat, lon = get_philippine_coordinates()
            # Check types
            if not isinstance(lat, (int, float)):
                return False, f"Latitude is not numeric: {type(lat)}"
            if not isinstance(lon, (int, float)):
                return False, f"Longitude is not numeric: {type(lon)}"
            # Check bounds (Philippines: 4.6°N to 19.0°N, 116.9°E to 126.6°E)
            if not (4.6 <= lat <= 19.0):
                return False, f"Latitude out of bounds: {lat}"
            if not (116.9 <= lon <= 126.6):
                return False, f"Longitude out of bounds: {lon}"
        return True, None
    except Exception as e:
        return False, e


def test_phone_generation():
    """Test Philippine phone number generation."""
    try:
        for _ in range(10):
            phone = get_philippine_phone()
            if not isinstance(phone, str):
                return False, f"Phone is not string: {type(phone)}"
            if not phone.startswith("09"):
                return False, f"Phone doesn't start with 09: {phone}"
            if len(phone) != 11:
                return False, f"Phone length incorrect: {len(phone)} (expected 11)"
        return True, None
    except Exception as e:
        return False, e


def test_factory(factory_class, factory_name, count=1, verbose=False):
    """Test a factory by creating records."""
    try:
        # Test build (in-memory) - doesn't require database
        instance = factory_class.build()
        if instance is None:
            return False, "build() returned None"
        
        # Test create (persisted) - uses factory's default session
        # Note: This will commit to database, but that's okay for testing
        instances = factory_class.create_batch(count)
        if len(instances) != count:
            return False, f"Expected {count} instances, got {len(instances)}"
        
        # Verify instances are valid
        for inst in instances:
            if inst is None:
                return False, "One of the created instances is None"
        
        return True, None
    except Exception as e:
        return False, e


def run_infrastructure_tests(verbose=False):
    """Run all infrastructure tests."""
    print(f"\n{Colors.BOLD}Testing Infrastructure...{Colors.RESET}")
    results = []
    
    # Database connection
    passed, error = test_database_connection()
    results.append(("Database connection", passed))
    if passed:
        print_pass("Database connection")
    else:
        print_fail("Database connection", error, verbose)
    
    # Password hashing
    passed, error = test_password_hashing()
    results.append(("Password hashing", passed))
    if passed:
        print_pass("Password hashing")
    else:
        print_fail("Password hashing", error, verbose)
    
    # Coordinate generation
    passed, error = test_coordinate_generation()
    results.append(("Coordinate generation", passed))
    if passed:
        print_pass("Coordinate generation")
    else:
        print_fail("Coordinate generation", error, verbose)
    
    # Phone generation
    passed, error = test_phone_generation()
    results.append(("Phone number generation", passed))
    if passed:
        print_pass("Phone number generation")
    else:
        print_fail("Phone number generation", error, verbose)
    
    return results


def run_factory_tests(verbose=False):
    """Run all factory tests."""
    print(f"\n{Colors.BOLD}Testing Factories...{Colors.RESET}")
    results = []
    
    factories = [
        ("CitizenFactory", CitizenFactory),
        ("CensusDataFactory", CensusDataFactory),
        ("VulnerabilityProfileFactory", VulnerabilityProfileFactory),
        ("DeviceFactory", DeviceFactory),
        ("LoRaDeviceFactory", LoRaDeviceFactory),
        ("LocationHistoryFactory", LocationHistoryFactory),
        ("PredictedLocationFactory", PredictedLocationFactory),
        ("IncidentFactory", IncidentFactory),
        ("SOSSignalFactory", SOSSignalFactory),
        ("RollCallFactory", RollCallFactory),
        ("RollCallResponseFactory", RollCallResponseFactory),
        ("RescueDispatchFactory", RescueDispatchFactory),
        ("WaterLevelReadingFactory", WaterLevelReadingFactory),
        ("ChatbotConversationFactory", ChatbotConversationFactory),
        ("NotificationFactory", NotificationFactory),
        ("MeshPacketFactory", MeshPacketFactory),
        ("NeedsTicketFactory", NeedsTicketFactory),
        ("HealthReportFactory", HealthReportFactory),
        ("HealthClusterFactory", HealthClusterFactory),
        ("MedicalDispatchFactory", MedicalDispatchFactory),
        ("AssetFactory", AssetFactory),
        ("VolunteerFactory", VolunteerFactory),
        ("DonationFundFactory", DonationFundFactory),
        ("ExternalHelpRequestFactory", ExternalHelpRequestFactory),
        ("CrowdsourcedHazardFactory", CrowdsourcedHazardFactory),
    ]
    
    for name, factory_class in factories:
        passed, error = test_factory(factory_class, name, count=1, verbose=verbose)
        results.append((name, passed))
        if passed:
            print_pass(f"{name} (1 record)")
        else:
            print_fail(f"{name} (1 record)", error, verbose)
    
    return results


def run_relationship_tests(verbose=False):
    """Test factories with relationships."""
    print(f"\n{Colors.BOLD}Testing Relationships...{Colors.RESET}")
    results = []
    
    try:
        # Test Citizen with CensusData relationship
        citizen = CitizenFactory.create()
        census = CensusDataFactory.create(citizen=citizen)
        if census.citizen_id != citizen.id:
            results.append(("Citizen-CensusData relationship", False))
            print_fail("Citizen-CensusData relationship", "citizen_id mismatch", verbose)
        else:
            results.append(("Citizen-CensusData relationship", True))
            print_pass("Citizen-CensusData relationship")
    except Exception as e:
        results.append(("Citizen-CensusData relationship", False))
        print_fail("Citizen-CensusData relationship", e, verbose)
    
    try:
        # Test Incident with SOSSignal relationship
        incident = IncidentFactory.create()
        sos = SOSSignalFactory.create(incident=incident)
        if sos.incident_id != incident.id:
            results.append(("Incident-SOSSignal relationship", False))
            print_fail("Incident-SOSSignal relationship", "incident_id mismatch", verbose)
        else:
            results.append(("Incident-SOSSignal relationship", True))
            print_pass("Incident-SOSSignal relationship")
    except Exception as e:
        results.append(("Incident-SOSSignal relationship", False))
        print_fail("Incident-SOSSignal relationship", e, verbose)
    
    try:
        # Test RollCall with RollCallResponse relationship
        roll_call = RollCallFactory.create()
        response = RollCallResponseFactory.create(roll_call=roll_call)
        if response.roll_call_id != roll_call.id:
            results.append(("RollCall-RollCallResponse relationship", False))
            print_fail("RollCall-RollCallResponse relationship", "roll_call_id mismatch", verbose)
        else:
            results.append(("RollCall-RollCallResponse relationship", True))
            print_pass("RollCall-RollCallResponse relationship")
    except Exception as e:
        results.append(("RollCall-RollCallResponse relationship", False))
        print_fail("RollCall-RollCallResponse relationship", e, verbose)
    
    return results


def main():
    """Main test runner."""
    parser = argparse.ArgumentParser(
        description="Test all factory components before running full data generation",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Run all tests
  python scripts/test_factories.py

  # Run specific category
  python scripts/test_factories.py --category infrastructure
  python scripts/test_factories.py --category factories
  python scripts/test_factories.py --category relationships

  # Verbose output with error details
  python scripts/test_factories.py --verbose
        """,
    )
    
    parser.add_argument(
        "--category",
        choices=["infrastructure", "factories", "relationships", "all"],
        default="all",
        help="Which category of tests to run (default: all)",
    )
    
    parser.add_argument(
        "--verbose",
        action="store_true",
        help="Show detailed error messages and tracebacks",
    )
    
    args = parser.parse_args()
    
    print("=" * 60)
    print(f"{Colors.BOLD}Factory System Test Suite{Colors.RESET}")
    print("=" * 60)
    
    all_results = []
    
    # Run tests based on category
    if args.category in ["infrastructure", "all"]:
        results = run_infrastructure_tests(verbose=args.verbose)
        all_results.extend(results)
    
    if args.category in ["factories", "all"]:
        results = run_factory_tests(verbose=args.verbose)
        all_results.extend(results)
    
    if args.category in ["relationships", "all"]:
        results = run_relationship_tests(verbose=args.verbose)
        all_results.extend(results)
    
    # Print summary
    print(f"\n{Colors.BOLD}{'='*60}{Colors.RESET}")
    passed = sum(1 for _, result in all_results if result)
    total = len(all_results)
    failed = total - passed
    
    if passed == total:
        print(f"{Colors.GREEN}{Colors.BOLD}Summary: {passed}/{total} tests passed ✓{Colors.RESET}")
    else:
        print(f"{Colors.YELLOW}{Colors.BOLD}Summary: {passed}/{total} tests passed ({failed} failed){Colors.RESET}")
        if not args.verbose:
            print(f"\n{Colors.YELLOW}Tip: Use --verbose to see detailed error messages{Colors.RESET}")
    
    print(f"{Colors.BOLD}{'='*60}{Colors.RESET}\n")
    
    # Exit with error code if any tests failed
    sys.exit(0 if passed == total else 1)


if __name__ == "__main__":
    main()
