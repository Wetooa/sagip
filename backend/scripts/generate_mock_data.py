#!/usr/bin/env python3
"""Script to generate and insert mock data into the database."""
import argparse
import sys
import random
from datetime import datetime
from typing import Optional

# Add parent directory to path to import app modules
from pathlib import Path
backend_dir = Path(__file__).parent.parent
sys.path.insert(0, str(backend_dir))

from app.core.database import Base, engine
from app.models import *  # noqa: F401, F403 - Import all models
from app.factories.base import db_session
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
from app.models import (
    Citizen,
    CensusData,
    VulnerabilityProfile,
    Device,
    LoRaDevice,
    LocationHistory,
    PredictedLocation,
    Incident,
    SOSSignal,
    RollCall,
    RollCallResponse,
    RescueDispatch,
    WaterLevelReading,
    ChatbotConversation,
    Notification,
    MeshPacket,
    NeedsTicket,
    HealthReport,
    HealthCluster,
    MedicalDispatch,
    Asset,
    Volunteer,
    DonationFund,
    ExternalHelpRequest,
    CrowdsourcedHazard,
)


def clear_table(model, session):
    """Clear all records from a table."""
    try:
        session.query(model).delete()
        session.commit()
        return True
    except Exception as e:
        session.rollback()
        print(f"Error clearing {model.__name__}: {e}")
        return False


def generate_data(
    model_name: str,
    count: int,
    session,
    clear: bool = False,
    seed: Optional[int] = None,
):
    """Generate mock data for a specific model."""
    if seed is not None:
        random.seed(seed)
        import factory
        factory.Faker.seed(seed)

    factory_map = {
        "citizens": (CitizenFactory, Citizen),
        "census_data": (CensusDataFactory, CensusData),
        "vulnerability_profiles": (VulnerabilityProfileFactory, VulnerabilityProfile),
        "devices": (DeviceFactory, Device),
        "lora_devices": (LoRaDeviceFactory, LoRaDevice),
        "location_history": (LocationHistoryFactory, LocationHistory),
        "predicted_locations": (PredictedLocationFactory, PredictedLocation),
        "incidents": (IncidentFactory, Incident),
        "sos_signals": (SOSSignalFactory, SOSSignal),
        "roll_calls": (RollCallFactory, RollCall),
        "roll_call_responses": (RollCallResponseFactory, RollCallResponse),
        "rescue_dispatches": (RescueDispatchFactory, RescueDispatch),
        "water_level_readings": (WaterLevelReadingFactory, WaterLevelReading),
        "chatbot_conversations": (ChatbotConversationFactory, ChatbotConversation),
        "notifications": (NotificationFactory, Notification),
        "mesh_packets": (MeshPacketFactory, MeshPacket),
        "needs_tickets": (NeedsTicketFactory, NeedsTicket),
        "health_reports": (HealthReportFactory, HealthReport),
        "health_clusters": (HealthClusterFactory, HealthCluster),
        "medical_dispatches": (MedicalDispatchFactory, MedicalDispatch),
        "assets": (AssetFactory, Asset),
        "volunteers": (VolunteerFactory, Volunteer),
        "donation_funds": (DonationFundFactory, DonationFund),
        "external_help_requests": (ExternalHelpRequestFactory, ExternalHelpRequest),
        "crowdsourced_hazards": (CrowdsourcedHazardFactory, CrowdsourcedHazard),
    }

    if model_name not in factory_map:
        print(f"Unknown model: {model_name}")
        print(f"Available models: {', '.join(factory_map.keys())}")
        return False

    factory_class, model_class = factory_map[model_name]

    try:
        if clear:
            print(f"Clearing existing {model_name}...")
            if not clear_table(model_class, session):
                return False

        print(f"Generating {count} {model_name}...")
        start_time = datetime.now()

        # Generate in batches for better performance
        batch_size = 100
        total_generated = 0

        for i in range(0, count, batch_size):
            batch_count = min(batch_size, count - total_generated)
            factory_class.create_batch(batch_count)
            total_generated += batch_count
            print(f"  Generated {total_generated}/{count}...", end="\r")

        elapsed = (datetime.now() - start_time).total_seconds()
        print(f"\n✓ Generated {total_generated} {model_name} in {elapsed:.2f}s")
        return True

    except Exception as e:
        session.rollback()
        print(f"\n✗ Error generating {model_name}: {e}")
        import traceback
        traceback.print_exc()
        return False


def main():
    """Main CLI entry point."""
    parser = argparse.ArgumentParser(
        description="Generate mock data for the disaster management system",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Generate 50 citizens
  python generate_mock_data.py --citizens 50

  # Generate multiple model types
  python generate_mock_data.py --citizens 100 --incidents 10 --sos-signals 50

  # Clear and regenerate
  python generate_mock_data.py --citizens 50 --clear

  # Fresh start: drop all tables, recreate, and generate data
  python generate_mock_data.py --fresh-start --citizens 50 --incidents 5

  # Use a seed for reproducible data
  python generate_mock_data.py --citizens 50 --seed 42

Available models:
  citizens, census-data, vulnerability-profiles, devices, lora-devices,
  location-history, predicted-locations, incidents, sos-signals, roll-calls,
  roll-call-responses, rescue-dispatches, water-level-readings,
  chatbot-conversations, notifications, mesh-packets, needs-tickets,
  health-reports, health-clusters, medical-dispatches, assets, volunteers,
  donation-funds, external-help-requests, crowdsourced-hazards
        """,
    )

    # Add arguments for each model
    models = [
        "citizens",
        "census_data",
        "vulnerability_profiles",
        "devices",
        "lora_devices",
        "location_history",
        "predicted_locations",
        "incidents",
        "sos_signals",
        "roll_calls",
        "roll_call_responses",
        "rescue_dispatches",
        "water_level_readings",
        "chatbot_conversations",
        "notifications",
        "mesh_packets",
        "needs_tickets",
        "health_reports",
        "health_clusters",
        "medical_dispatches",
        "assets",
        "volunteers",
        "donation_funds",
        "external_help_requests",
        "crowdsourced_hazards",
    ]

    for model in models:
        parser.add_argument(
            f"--{model.replace('_', '-')}",
            type=int,
            default=0,
            help=f"Number of {model} to generate",
        )

    parser.add_argument(
        "--clear",
        action="store_true",
        help="Clear existing data before generating new data",
    )
    parser.add_argument(
        "--seed",
        type=int,
        default=None,
        help="Random seed for reproducible data generation",
    )
    parser.add_argument(
        "--clear-all",
        action="store_true",
        help="Clear all data from all tables before generating",
    )
    parser.add_argument(
        "--fresh-start",
        action="store_true",
        help="Drop all tables, recreate them, then generate data (full database reset)",
    )

    args = parser.parse_args()

    # Fresh start: drop and recreate all tables
    if args.fresh_start:
        print("=" * 60)
        print("FRESH START: Dropping and recreating all tables")
        print("=" * 60)
        try:
            print("Dropping all existing tables...")
            Base.metadata.drop_all(bind=engine)
            print("✓ All tables dropped")
            
            print("Creating all tables...")
            Base.metadata.create_all(bind=engine)
            print("✓ All tables created")
            print()
        except Exception as e:
            print(f"✗ Error during fresh start: {e}")
            import traceback
            traceback.print_exc()
            return

    # Set seed if provided
    if args.seed is not None:
        random.seed(args.seed)
        import factory
        factory.Faker.seed(args.seed)
        print(f"Using seed: {args.seed}")

    # Clear all if requested
    if args.clear_all:
        print("Clearing all existing data...")
        model_classes = [
            Citizen,
            CensusData,
            VulnerabilityProfile,
            Device,
            LoRaDevice,
            LocationHistory,
            PredictedLocation,
            Incident,
            SOSSignal,
            RollCall,
            RollCallResponse,
            RescueDispatch,
            WaterLevelReading,
            ChatbotConversation,
            Notification,
            MeshPacket,
            NeedsTicket,
            HealthReport,
            HealthCluster,
            MedicalDispatch,
            Asset,
            Volunteer,
            DonationFund,
            ExternalHelpRequest,
            CrowdsourcedHazard,
        ]
        for model_class in model_classes:
            clear_table(model_class, db_session)
        print("All data cleared.\n")

    # Generate data for requested models
    total_requests = sum(
        getattr(args, model.replace("-", "_"))
        for model in models
    )

    if total_requests == 0:
        print("No models specified. Use --help to see available options.")
        return

    print(f"Starting data generation at {datetime.now()}\n")

    success_count = 0
    fail_count = 0

    for model in models:
        count = getattr(args, model.replace("-", "_"))
        if count > 0:
            if generate_data(
                model,
                count,
                db_session,
                clear=args.clear,
                seed=args.seed,
            ):
                success_count += 1
            else:
                fail_count += 1

    print(f"\n{'='*60}")
    print(f"Generation complete!")
    print(f"  Successful: {success_count}")
    print(f"  Failed: {fail_count}")
    print(f"{'='*60}")

    db_session.close()


if __name__ == "__main__":
    main()
