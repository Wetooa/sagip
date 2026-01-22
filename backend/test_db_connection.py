"""Test script to verify Supabase database connection using Session Pooler."""

from sqlalchemy import create_engine, text
from dotenv import load_dotenv
import os
import sys

# Load environment variables from .env
load_dotenv()

# Fetch variables (using DB_ prefix to match config.py)
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_NAME = os.getenv("DB_NAME")

# Alternative: Use DATABASE_URL directly if provided
DATABASE_URL = os.getenv("DATABASE_URL")

# Construct the SQLAlchemy connection string
if DATABASE_URL:
    # If DATABASE_URL is provided, use it directly
    # Ensure it has sslmode=require if not already present
    if "sslmode=" not in DATABASE_URL:
        DATABASE_URL = (
            f"{DATABASE_URL}?sslmode=require"
            if "?" not in DATABASE_URL
            else f"{DATABASE_URL}&sslmode=require"
        )
    connection_string = DATABASE_URL
else:
    # Construct from individual components
    if not all([DB_USER, DB_PASSWORD, DB_HOST, DB_NAME]):
        print("✗ Missing required environment variables!")
        print(
            "Please set either DATABASE_URL or all of: DB_USER, DB_PASSWORD, DB_HOST, DB_NAME"
        )
        print("\nFor Session Pooler, use:")
        print("  DB_HOST=aws-0-region.pooler.supabase.com")
        print("  DB_USER=postgres.xxxxx  (includes project reference)")
        print("  DB_PASSWORD=your-password")
        print("  DB_PORT=5432")
        print("  DB_NAME=postgres")
        sys.exit(1)

    connection_string = f"postgresql+psycopg2://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}?sslmode=require"

# Create the SQLAlchemy engine
# Note: For Session Pooler, we can use default pooling or NullPool
# Using default pooling is fine for testing
engine = create_engine(connection_string, pool_pre_ping=True)


# Test the connection
def test_connection():
    """Test the database connection."""
    try:
        print("Testing database connection...")
        print(
            f"Host: {DB_HOST or (DATABASE_URL.split('@')[1].split('/')[0] if DATABASE_URL else 'N/A')}"
        )

        with engine.connect() as connection:
            # Execute a simple query to test connection
            result = connection.execute(text("SELECT 1"))
            row = result.fetchone()

            if row and row[0] == 1:
                print("✓ Connection successful!")
                print("✓ Database is accessible")
                return True
            else:
                print("✗ Connection test failed: Unexpected result")
                return False

    except Exception as e:
        error_msg = str(e)
        print(f"✗ Connection failed: {error_msg}")

        # Check if it's a network error
        if "Network is unreachable" in error_msg:
            print("\n⚠️  IPv6 Network Issue Detected!")
            print(
                "\nIf using direct connection (db.*.supabase.co), switch to Session Pooler:"
            )
            print(
                "1. Go to: https://supabase.com/dashboard → Your Project → Settings → Database"
            )
            print("2. Scroll to 'Connection Pooling' section")
            print("3. Copy the 'Session mode' connection string")
            print("4. Update your .env file:")
            print("   DB_HOST=aws-0-region.pooler.supabase.com")
            print("   DB_USER=postgres.xxxxx")
            print("\n📖 See IPV4_FIX.md for detailed instructions")
        elif "Connection refused" in error_msg or "timeout" in error_msg.lower():
            print("\nTroubleshooting:")
            print("1. Check your internet connection")
            print("2. Verify the Supabase host is correct")
            print(
                "3. Ensure you're using Session Pooler (pooler.supabase.com) for IPv4 compatibility"
            )
        else:
            print("\nTroubleshooting:")
            print("1. Check that your .env file exists and contains correct values")
            print("2. Verify your Supabase credentials are correct")
            print("3. Ensure SSL mode is set to 'require'")
            print("4. Check that your Supabase project is active and accessible")

        return False


if __name__ == "__main__":
    success = test_connection()
    sys.exit(0 if success else 1)
