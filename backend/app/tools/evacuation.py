"""Evacuation center and hazard checking tools."""
from typing import Optional, List, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import and_, func
from datetime import datetime, timedelta
import requests
import math
import time

from app.models.emergency import Incident, IncidentStatus, IncidentType
from app.models.nice_to_have import CrowdsourcedHazard, HazardType, HazardStatus, HazardSeverity
from app.models.monitoring import WaterLevelReading
from app.models.location import LocationHistory
from app.models.citizen import VulnerabilityProfile, RiskLevel


def find_evacuation_center(
    db: Session,
    citizen_id: Optional[Any] = None,
    location: Optional[str] = None,
    latitude: Optional[float] = None,
    longitude: Optional[float] = None,
    transport_mode: str = "walking"
):
    """
    Find safe evacuation centers based on current hazards, water levels, and incidents.
    """
    # Get user's vulnerability profile if citizen_id provided
    vulnerability_info = None
    if citizen_id:
        vulnerability = db.query(VulnerabilityProfile).filter(
            VulnerabilityProfile.citizen_id == citizen_id
        ).first()
        if vulnerability:
            vulnerability_info = {
                "risk_level": vulnerability.risk_level.value,
                "risk_score": vulnerability.risk_score
            }

    # Get user's last known location if coordinates not provided
    if not latitude or not longitude:
        if citizen_id:
            last_location = db.query(LocationHistory).filter(
                LocationHistory.citizen_id == citizen_id
            ).order_by(LocationHistory.recorded_at.desc()).first()
            if last_location:
                latitude = last_location.latitude
                longitude = last_location.longitude

    # Geocode location name if coordinates not provided
    if not latitude or not longitude:
        if location:
            try:
                # Use Nominatim (OpenStreetMap) for geocoding
                geocode_url = "https://nominatim.openstreetmap.org/search"
                params = {
                    "q": f"{location}, Philippines",
                    "format": "json",
                    "limit": 1,
                    "countrycodes": "ph"
                }
                headers = {"User-Agent": "SAGIP-Disaster-Response/1.0"}
                response = requests.get(geocode_url, params=params, headers=headers, timeout=5)
                if response.status_code == 200:
                    data = response.json()
                    if data:
                        latitude = float(data[0]["lat"])
                        longitude = float(data[0]["lon"])
                        print(f"📍 [GEOCODE] Resolved '{location}' to {latitude}, {longitude}")
            except Exception as e:
                print(f"⚠️ [GEOCODE] Failed to geocode '{location}': {e}")
        
        # Fallback to default if still no coordinates
        if not latitude:
            latitude = 14.6042  # Default to Manila area
        if not longitude:
            longitude = 121.0122

    # Query verified hazards in the area (within ~5km radius)
    lat_range = 0.045  # ~5km
    lng_range = 0.045
    
    nearby_hazards = db.query(CrowdsourcedHazard).filter(
        and_(
            CrowdsourcedHazard.status == HazardStatus.VERIFIED,
            CrowdsourcedHazard.latitude.between(latitude - lat_range, latitude + lat_range),
            CrowdsourcedHazard.longitude.between(longitude - lng_range, longitude + lng_range)
        )
    ).all()

    # Query water level readings in the area
    recent_water_readings = db.query(WaterLevelReading).filter(
        and_(
            WaterLevelReading.reading_timestamp >= datetime.utcnow() - timedelta(hours=6),
            WaterLevelReading.latitude.between(latitude - lat_range, latitude + lat_range),
            WaterLevelReading.longitude.between(longitude - lng_range, longitude + lng_range)
        )
    ).order_by(WaterLevelReading.reading_timestamp.desc()).limit(5).all()

    # Query active incidents in the area
    active_incidents = db.query(Incident).filter(
        and_(
            Incident.status.in_([IncidentStatus.MONITORING, IncidentStatus.ACTIVE]),
            Incident.latitude.between(latitude - lat_range, latitude + lat_range) if Incident.latitude else True,
            Incident.longitude.between(longitude - lng_range, longitude + lng_range) if Incident.longitude else True
        )
    ).all()

    # Determine hazard status
    hazard_summary = {
        "has_hazards": len(nearby_hazards) > 0,
        "hazard_count": len(nearby_hazards),
        "highest_severity": None,
        "water_level_critical": False,
        "active_incidents": len(active_incidents)
    }

    if nearby_hazards:
        severities = [h.severity.value for h in nearby_hazards]
        if "high" in severities:
            hazard_summary["highest_severity"] = "high"
        elif "medium" in severities:
            hazard_summary["highest_severity"] = "medium"
        else:
            hazard_summary["highest_severity"] = "low"

    if recent_water_readings:
        max_water_level = max([r.water_level_cm for r in recent_water_readings])
        hazard_summary["max_water_level_cm"] = max_water_level
        hazard_summary["water_level_critical"] = max_water_level > 100  # > 1 meter

    # Search for evacuation centers using OpenStreetMap/Nominatim
    evac_centers = []
    
    # Search terms for evacuation centers in the Philippines
    search_terms = [
        "evacuation center",
        "evacuation site",
        "barangay hall",
        "gymnasium",
        "sports complex",
        "community center",
        "school",
        "church"
    ]
    
    try:
        for search_term in search_terms[:3]:  # Limit to 3 searches to avoid rate limits
            search_url = "https://nominatim.openstreetmap.org/search"
            params = {
                "q": f"{search_term} near {latitude},{longitude}",
                "format": "json",
                "limit": 5,
                "countrycodes": "ph",
                "bounded": 1,
                "viewbox": f"{longitude-0.1},{latitude-0.1},{longitude+0.1},{latitude+0.1}",  # ~10km radius
                "addressdetails": 1
            }
            headers = {"User-Agent": "SAGIP-Disaster-Response/1.0"}
            
            response = requests.get(search_url, params=params, headers=headers, timeout=5)
            if response.status_code == 200:
                results = response.json()
                for result in results:
                    try:
                        center_lat = float(result["lat"])
                        center_lon = float(result["lon"])
                        
                        # Calculate distance using Haversine formula
                        def haversine_distance(lat1, lon1, lat2, lon2):
                            R = 6371  # Earth radius in km
                            dlat = math.radians(lat2 - lat1)
                            dlon = math.radians(lon2 - lon1)
                            a = math.sin(dlat/2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon/2)**2
                            c = 2 * math.asin(math.sqrt(a))
                            return R * c
                        
                        distance_km = haversine_distance(latitude, longitude, center_lat, center_lon)
                        
                        # Only include centers within 10km
                        if distance_km <= 10:
                            center_name = result.get("display_name", result.get("name", "Unknown Location"))
                            # Simplify name (take first part before comma)
                            if "," in center_name:
                                center_name = center_name.split(",")[0]
                            
                            evac_centers.append({
                                "name": center_name,
                                "distance_km": round(distance_km, 2),
                                "latitude": center_lat,
                                "longitude": center_lon,
                                "address": result.get("display_name", ""),
                                "safe": True,  # Assume safe unless hazard data says otherwise
                                "reason": "Found via location search"
                            })
                    except (ValueError, KeyError) as e:
                        continue
            
            # Small delay to respect rate limits
            time.sleep(0.5)
    
    except Exception as e:
        print(f"⚠️ [EVAC SEARCH] Error searching for evacuation centers: {e}")
    
    # If no centers found via search, use fallback locations
    if not evac_centers:
        print("⚠️ [EVAC SEARCH] No centers found, using fallback locations")
        evac_centers = [
            {
                "name": "Nearest Barangay Hall",
                "distance_km": 1.0,
                "latitude": latitude + 0.01,
                "longitude": longitude + 0.01,
                "safe": True,
                "reason": "Fallback location - contact local authorities"
            }
        ]
    
    # Remove duplicates (same location)
    seen = set()
    unique_centers = []
    for center in evac_centers:
        key = (round(center["latitude"], 4), round(center["longitude"], 4))
        if key not in seen:
            seen.add(key)
            unique_centers.append(center)
    evac_centers = unique_centers
    
    # Sort by distance
    evac_centers.sort(key=lambda x: x["distance_km"])
    
    # Mark centers as unsafe if they're in high-risk areas
    for center in evac_centers:
        # Check if center is near verified hazards
        center_lat_range = 0.01  # ~1km
        center_lng_range = 0.01
        nearby_hazards_to_center = [h for h in nearby_hazards 
                                   if abs(h.latitude - center["latitude"]) < center_lat_range
                                   and abs(h.longitude - center["longitude"]) < center_lng_range]
        
        if nearby_hazards_to_center:
            center["safe"] = False
            center["reason"] = "Near verified hazards"
        elif hazard_summary["water_level_critical"]:
            # Check if center is in high water level area
            nearby_water = [w for w in recent_water_readings
                          if abs(w.latitude - center["latitude"]) < center_lat_range
                          and abs(w.longitude - center["longitude"]) < center_lng_range
                          and w.water_level_cm > 100]
            if nearby_water:
                center["safe"] = False
                center["reason"] = "Area affected by high water levels"
    
    # Filter to safe centers only
    safe_centers = [c for c in evac_centers if c.get("safe", True)]
    if not safe_centers:
        safe_centers = evac_centers[:3]  # Fallback to nearest 3 if none are safe
    
    # Select nearest safe center
    nearest_center = safe_centers[0] if safe_centers else evac_centers[0]

    # Calculate ETA based on transport mode
    speed_kmh = 4 if transport_mode == "walking" else 25
    eta_minutes = int((nearest_center["distance_km"] / speed_kmh) * 60)

    result = {
        "from_location": location or f"{latitude}, {longitude}",
        "center_name": nearest_center["name"],
        "center_address": nearest_center.get("address", ""),
        "distance_km": nearest_center["distance_km"],
        "coordinates": {
            "latitude": nearest_center["latitude"],
            "longitude": nearest_center["longitude"]
        },
        "eta_minutes": eta_minutes,
        "transport_mode": transport_mode,
        "hazard_status": hazard_summary,
        "instructions": [
            f"Head to {nearest_center['name']}",
            "Follow evacuation signage and officials",
            "Bring essential items only (ID, medicines, water, food)",
            f"Estimated travel time: {eta_minutes} minutes by {transport_mode}",
            "Contact local authorities if you need assistance getting there"
        ],
        "alternative_centers": [
            {
                "name": c["name"],
                "address": c.get("address", ""),
                "distance_km": c["distance_km"],
                "safe": c.get("safe", True),
                "coordinates": {
                    "latitude": c["latitude"],
                    "longitude": c["longitude"]
                }
            }
            for c in safe_centers[1:4]  # Skip first one (it's the nearest)
        ],
        "total_centers_found": len(evac_centers),
        "safe_centers_count": len(safe_centers)
    }

    # Add vulnerability-aware recommendations
    if vulnerability_info and vulnerability_info["risk_level"] in ["high", "critical"]:
        result["priority_note"] = "High priority evacuation recommended due to vulnerability profile"

    print(f"🧭 [EVAC TOOL] Found {len(safe_centers)} safe centers, nearest: {nearest_center['name']}")
    return result


def check_hazard_status(
    db: Session,
    citizen_id: Optional[Any] = None,
    location: Optional[str] = None,
    latitude: Optional[float] = None,
    longitude: Optional[float] = None
):
    """
    Check current hazard status for a location.
    """
    # Get coordinates
    if not latitude or not longitude:
        if citizen_id:
            last_location = db.query(LocationHistory).filter(
                LocationHistory.citizen_id == citizen_id
            ).order_by(LocationHistory.recorded_at.desc()).first()
            if last_location:
                latitude = last_location.latitude
                longitude = last_location.longitude

    if not latitude or not longitude:
        return {"error": "Location coordinates required"}

    # Query radius (~5km)
    lat_range = 0.045
    lng_range = 0.045

    # Get verified hazards
    hazards = db.query(CrowdsourcedHazard).filter(
        and_(
            CrowdsourcedHazard.status == HazardStatus.VERIFIED,
            CrowdsourcedHazard.latitude.between(latitude - lat_range, latitude + lat_range),
            CrowdsourcedHazard.longitude.between(longitude - lng_range, longitude + lng_range)
        )
    ).all()

    # Get recent water level readings
    water_readings = db.query(WaterLevelReading).filter(
        and_(
            WaterLevelReading.reading_timestamp >= datetime.utcnow() - timedelta(hours=6),
            WaterLevelReading.latitude.between(latitude - lat_range, latitude + lat_range),
            WaterLevelReading.longitude.between(longitude - lng_range, longitude + lng_range)
        )
    ).order_by(WaterLevelReading.reading_timestamp.desc()).limit(10).all()

    # Get active incidents
    incidents = db.query(Incident).filter(
        and_(
            Incident.status.in_([IncidentStatus.MONITORING, IncidentStatus.ACTIVE]),
            Incident.latitude.between(latitude - lat_range, latitude + lat_range) if Incident.latitude else True,
            Incident.longitude.between(longitude - lng_range, longitude + lng_range) if Incident.longitude else True
        )
    ).all()

    result = {
        "location": location or f"{latitude}, {longitude}",
        "coordinates": {"latitude": latitude, "longitude": longitude},
        "hazards": [
            {
                "id": str(h.id),
                "type": h.hazard_type.value,
                "severity": h.severity.value,
                "description": h.description,
                "verified": h.status == HazardStatus.VERIFIED,
                "reported_at": h.reported_at.isoformat()
            }
            for h in hazards
        ],
        "water_levels": [
            {
                "sensor_id": r.sensor_id,
                "location_name": r.location_name,
                "water_level_cm": r.water_level_cm,
                "reading_timestamp": r.reading_timestamp.isoformat(),
                "sensor_status": r.sensor_status.value
            }
            for r in water_readings
        ],
        "active_incidents": [
            {
                "id": str(i.id),
                "name": i.incident_name,
                "type": i.incident_type.value,
                "severity": i.severity.value,
                "status": i.status.value,
                "affected_region": i.affected_region
            }
            for i in incidents
        ],
        "summary": {
            "total_hazards": len(hazards),
            "total_incidents": len(incidents),
            "max_water_level_cm": max([r.water_level_cm for r in water_readings]) if water_readings else None,
            "overall_risk": "high" if (hazards or incidents or (water_readings and max([r.water_level_cm for r in water_readings]) > 100)) else "low"
        }
    }

    print(f"⚠️ [HAZARD CHECK] Found {len(hazards)} hazards, {len(incidents)} incidents")
    return result
