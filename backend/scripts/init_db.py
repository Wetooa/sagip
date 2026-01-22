#!/usr/bin/env python3
"""Script to initialize database from scratch - drops all tables, creates them, and optionally populates with mock data."""
import argparse
import sys
from pathlib import Path
from sqlalchemy import inspect

# Add parent directory to path to import app modules
backend_dir = Path(__file__).parent.parent
sys.path.insert(0, str(backend_dir))

from app.core.database import Base, engine, SessionLocal
from app.core.config import settings
# Import all models to ensure they're registered with Base
from app.models import *  # noqa: F401, F403


def drop_all_tables():
    """Drop all existing tables."""
    print("Dropping all existing tables...")
    try:
        Base.metadata.drop_all(bind=engine)
        print("✓ All tables dropped successfully")
        return True
    except Exception as e:
        print(f"✗ Error dropping tables: {e}")
        import traceback
        traceback.print_exc()
        return False


def create_all_tables():
    """Create all tables from models."""
    print("Creating all tables...")
    try:
        Base.metadata.create_all(bind=engine)
        print("✓ All tables created successfully")
        return True
    except Exception as e:
        print(f"✗ Error creating tables: {e}")
        import traceback
        traceback.print_exc()
        return False


def list_tables():
    """List all tables in the database."""
    inspector = inspect(engine)
    tables = inspector.get_table_names()
    return tables


def generate_mock_data(counts: dict = None):
    """Generate mock data for all models."""
    if counts is None:
        # Default counts for each model
        counts = {
            "citizens": 50,
            "census_data": 50,
            "vulnerability_profiles": 50,
            "devices": 40,
            "lora_devices": 30,
            "location_history": 100,
            "predicted_locations": 50,
            "incidents": 5,
            "sos_signals": 20,
            "roll_calls": 10,
            "roll_call_responses": 50,
            "rescue_dispatches": 8,
            "water_level_readings": 30,
            "chatbot_conversations": 40,
            "notifications": 60,
            "mesh_packets": 50,
            "needs_tickets": 30,
            "health_reports": 25,
            "health_clusters": 3,
            "medical_dispatches": 5,
            "assets": 15,
            "volunteers": 20,
            "donation_funds": 10,
            "external_help_requests": 8,
            "crowdsourced_hazards": 15,
        }

    print("\nGenerating mock data...")
    print("=" * 60)

    # Import the generation function from the other script
    from scripts.generate_mock_data import generate_data

    db_session = SessionLocal()
    success_count = 0
    fail_count = 0

    for model_name, count in counts.items():
        if count > 0:
            if generate_data(model_name, count, db_session, clear=False, seed=None):
                success_count += 1
            else:
                fail_count += 1

    db_session.close()

    print(f"\n{'='*60}")
    print(f"Mock data generation complete!")
    print(f"  Successful: {success_count}")
    print(f"  Failed: {fail_count}")
    print(f"{'='*60}")


def main():
    """Main CLI entry point."""
    parser = argparse.ArgumentParser(
        description="Initialize database - creates tables (optionally drops existing ones) and optionally populates with mock data",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Initialize database (create tables if they don't exist, no data)
  python scripts/init_db.py

  # Initialize and populate with default mock data
  python scripts/init_db.py --populate

  # Initialize and populate with custom counts
  python scripts/init_db.py --populate --citizens 100 --incidents 10

  # DROP ALL TABLES and recreate (DESTRUCTIVE - use with caution!)
  python scripts/init_db.py --drop-tables

  # Drop tables and populate with data
  python scripts/init_db.py --drop-tables --populate

  # List existing tables
  python scripts/init_db.py --list-tables
        """,
    )

    parser.add_argument(
        "--drop-tables",
        action="store_true",
        help="Drop all existing tables before creating new ones (DESTRUCTIVE - use with caution)",
    )
    parser.add_argument(
        "--populate",
        action="store_true",
        help="Populate database with mock data after initialization",
    )
    parser.add_argument(
        "--list-tables",
        action="store_true",
        help="List all tables in the database and exit",
    )

    # Add arguments for each model (same as generate_mock_data.py)
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
            help=f"Number of {model} to generate (only used with --populate)",
        )

    args = parser.parse_args()

    # List tables and exit if requested
    if args.list_tables:
        try:
            tables = list_tables()
            if tables:
                print("Existing tables in database:")
                for table in sorted(tables):
                    print(f"  - {table}")
            else:
                print("No tables found in database.")
        except Exception as e:
            print(f"Error listing tables: {e}")
        return

    print("=" * 60)
    print("Database Initialization Script")
    print("=" * 60)
    print(f"Database: {settings.database_url.split('@')[-1] if '@' in settings.database_url else 'N/A'}")
    print()

    # Drop tables only if explicitly requested
    if args.drop_tables:
        if not drop_all_tables():
            print("\n✗ Failed to drop tables. Aborting.")
            return
        print()

    # Create tables
    if not create_all_tables():
        print("\n✗ Failed to create tables. Aborting.")
        return

    # List created tables
    try:
        tables = list_tables()
        if tables:
            print(f"\nCreated {len(tables)} tables:")
            for table in sorted(tables):
                print(f"  - {table}")
    except Exception as e:
        print(f"\nWarning: Could not list tables: {e}")

    # Populate with mock data if requested
    if args.populate:
        # Build counts dictionary from arguments
        counts = {}
        for model in models:
            count = getattr(args, model.replace("-", "_"))
            if count > 0:
                counts[model] = count

        # If no specific counts provided, use defaults
        if not counts:
            counts = None

        generate_mock_data(counts)

    print("\n" + "=" * 60)
    print("Database initialization complete!")
    print("=" * 60)


if __name__ == "__main__":
    main()
