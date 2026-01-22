#!/usr/bin/env python3
"""Populate rescue requests with pictures from data/pictures directory.

Creates one rescue request per picture, using Cebu coordinates for
Bagyong Tino affected areas. Each request is linked to a randomly
generated Filipino citizen.
"""
import os
import sys
import shutil
import uuid
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.core.database import SessionLocal
from app.factories.rescue import RescueRequestFactory
from app.factories.citizen import CitizenFactory
from app.models.rescue_request import RescueUrgency


# Cebu coordinates for Bagyong Tino affected areas (metro Cebu)
CEBU_COORDINATES = [
    (10.2935, 123.9020, "Cebu City Hall area"),
    (10.2955, 123.8985, "Colon / Sto. Niño Basilica area"),
    (10.2805, 123.8915, "SM Seaside / SRP area"),
    (10.3290, 123.9055, "IT Park / Lahug area"),
    (10.3735, 123.9155, "Talamban residential area"),
    (10.3236, 123.9228, "Mandaue City center"),
    (10.3765, 123.9580, "Consolacion area"),
    (10.3103, 123.9494, "Lapu-Lapu City center"),
    (10.3137, 123.9826, "Mactan Airport area"),
    (10.2476, 123.9617, "Cordova area"),
]


def get_photo_files():
    """Get all photo files from data/pictures directory."""
    pictures_dir = Path(__file__).parent.parent.parent / "data" / "pictures"
    
    if not pictures_dir.exists():
        print(f"❌ Pictures directory not found: {pictures_dir}")
        sys.exit(1)
    
    photo_files = []
    for ext in ["*.jpg", "*.jpeg", "*.png", "*.gif"]:
        photo_files.extend(pictures_dir.glob(ext))
    
    if not photo_files:
        print(f"❌ No photo files found in {pictures_dir}")
        sys.exit(1)
    
    return sorted(photo_files)


def setup_rescue_photos_directory():
    """Create rescue_photos directory in backend/app/static if it doesn't exist."""
    static_dir = Path(__file__).parent.parent / "app" / "static"
    rescue_photos_dir = static_dir / "rescue_photos"
    
    # Create directories if they don't exist
    rescue_photos_dir.mkdir(parents=True, exist_ok=True)
    
    return rescue_photos_dir


def copy_photo_to_static(source_path: Path, rescue_photos_dir: Path) -> str:
    """Copy photo to static directory with UUID filename.
    
    Returns the photo_url path that should be stored in the database.
    """
    # Generate unique filename
    file_extension = source_path.suffix.lower()
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    destination = rescue_photos_dir / unique_filename
    
    # Copy file
    shutil.copy2(source_path, destination)
    
    # Return the URL path (relative to static mount point)
    return f"/static/rescue_photos/{unique_filename}"


def generate_urgency_for_needs(needs: dict, urgency: RescueUrgency) -> dict:
    """Adjust needs based on urgency level and add correlated 'other' text."""
    if urgency == RescueUrgency.CRITICAL:
        # Critical: most needs are true, specific urgent requests in 'other'
        needs["water"] = True
        needs["food"] = True
        needs["medical"] = True
        needs["shelter"] = True
        needs["evacuation"] = True
        needs["other"] = "Need immediate rescue boat and medical supplies for injured"
        
    elif urgency == RescueUrgency.HIGH:
        # High: many needs, some specific requests
        needs["water"] = True
        needs["food"] = True
        needs["medical"] = needs.get("medical", False)
        needs["shelter"] = True
        needs["evacuation"] = True
        needs["other"] = "Require evacuation assistance due to rising floodwaters"
        
    else:  # NORMAL
        # Normal: fewer needs, monitoring requests
        needs["water"] = needs.get("water", False)
        needs["food"] = needs.get("food", False)
        needs["medical"] = False
        needs["shelter"] = needs.get("shelter", False)
        needs["evacuation"] = False
        needs["other"] = "Monitoring flood levels, may need assistance if water rises"
    
    return needs


def create_rescue_requests_with_photos():
    """Create rescue requests with photos from data/pictures."""
    print("🚀 Starting rescue request population with pictures...")
    
    # Setup
    db = SessionLocal()
    photo_files = get_photo_files()
    rescue_photos_dir = setup_rescue_photos_directory()
    
    print(f"📸 Found {len(photo_files)} photos")
    print(f"📁 Rescue photos will be stored in: {rescue_photos_dir}")
    
    created_count = 0
    
    try:
        for idx, photo_path in enumerate(photo_files):
            # Get coordinates for this pin (cycle through coordinates)
            coord_idx = idx % len(CEBU_COORDINATES)
            lat, lon, area_name = CEBU_COORDINATES[coord_idx]
            
            print(f"\n📍 Creating rescue request #{idx + 1} for {photo_path.name}...")
            print(f"   Location: {area_name} ({lat}, {lon})")
            
            # Copy photo to static directory
            photo_url = copy_photo_to_static(photo_path, rescue_photos_dir)
            print(f"   ✅ Photo copied: {photo_url}")
            
            # Create a Filipino citizen (factory will auto-generate name and phone)
            citizen = CitizenFactory.create()
            print(f"   👤 Created citizen: {citizen.full_name} ({citizen.phone_number})")
            
            # Create rescue request
            rescue_request = RescueRequestFactory.create(
                citizen=citizen,
                latitude=lat,
                longitude=lon,
                photo_url=photo_url,
            )
            
            # Update needs with correlated 'other' text based on urgency
            rescue_request.needs = generate_urgency_for_needs(
                rescue_request.needs.copy(), 
                rescue_request.urgency
            )
            
            print(f"   🆘 Created rescue request:")
            print(f"      - ID: {rescue_request.id}")
            print(f"      - Urgency: {rescue_request.urgency.value}")
            print(f"      - Household: {rescue_request.household_size} people")
            print(f"      - Status: {rescue_request.status.value}")
            print(f"      - Needs: {', '.join([k for k, v in rescue_request.needs.items() if v and k != 'other'])}")
            if rescue_request.needs.get("other"):
                print(f"      - Other needs: {rescue_request.needs['other']}")
            print(f"      - Note: {rescue_request.note[:80]}..." if len(rescue_request.note) > 80 else f"      - Note: {rescue_request.note}")
            
            db.commit()
            created_count += 1
        
        print(f"\n✅ Successfully created {created_count} rescue requests with photos!")
        print(f"📊 Summary:")
        print(f"   - Photos processed: {len(photo_files)}")
        print(f"   - Citizens created: {created_count}")
        print(f"   - Rescue requests created: {created_count}")
        print(f"   - Location: Cebu City and surrounding areas (Bagyong Tino affected)")
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    create_rescue_requests_with_photos()
