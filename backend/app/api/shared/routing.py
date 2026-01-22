"""
OSRM routing endpoints for evacuation centers.

This module provides routing functionality using the OSRM demo server to find
the nearest evacuation center and generate routes to specific centers.
Supports multiple vehicle types (driving, walking, cycling).
"""
import math
import logging
from typing import Optional, Dict, Any, List, Tuple
from pathlib import Path
from uuid import UUID

import httpx
from fastapi import APIRouter, HTTPException, Query, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.api.shared.geojson import get_backend_data_path
from app.utils.hazard_processing import load_geojson_file
from app.core.database import get_db
from app.models.location import LocationHistory

logger = logging.getLogger(__name__)

router = APIRouter()

# OSRM demo server URL
OSRM_BASE_URL = "https://router.project-osrm.org"

# Valid vehicle types
VALID_VEHICLE_TYPES = ["driving", "walking", "cycling"]


def calculate_straight_line_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Calculate straight-line distance between two points using Haversine formula.
    
    Args:
        lat1: Latitude of first point
        lon1: Longitude of first point
        lat2: Latitude of second point
        lon2: Longitude of second point
        
    Returns:
        Distance in kilometers
    """
    # Earth's radius in kilometers
    R = 6371.0
    
    # Convert to radians
    lat1_rad = math.radians(lat1)
    lon1_rad = math.radians(lon1)
    lat2_rad = math.radians(lat2)
    lon2_rad = math.radians(lon2)
    
    # Haversine formula
    dlat = lat2_rad - lat1_rad
    dlon = lon2_rad - lon1_rad
    
    a = math.sin(dlat / 2)**2 + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    
    distance = R * c
    return distance


def get_evacuation_center_coordinates(feature: Dict[str, Any]) -> Optional[Tuple[float, float]]:
    """
    Extract coordinates from evacuation center feature.
    
    Handles Point, Polygon, and MultiPolygon geometries by calculating centroid.
    
    Args:
        feature: GeoJSON feature with geometry
        
    Returns:
        Tuple of (longitude, latitude) or None if geometry is invalid
    """
    geometry = feature.get("geometry", {})
    geom_type = geometry.get("type")
    coordinates = geometry.get("coordinates")
    
    if not coordinates:
        return None
    
    if geom_type == "Point":
        # Point: [lon, lat]
        return tuple(coordinates)
    
    elif geom_type == "Polygon":
        # Polygon: [[[lon, lat], ...], ...] (exterior ring + holes)
        # Use exterior ring (first array)
        ring = coordinates[0] if coordinates else []
        if not ring:
            return None
        
        # Calculate centroid: average of all points
        total_lon = sum(coord[0] for coord in ring)
        total_lat = sum(coord[1] for coord in ring)
        count = len(ring)
        
        return (total_lon / count, total_lat / count)
    
    elif geom_type == "MultiPolygon":
        # MultiPolygon: [[[[lon, lat], ...], ...], ...]
        # Collect all points from all polygons
        all_points = []
        for polygon in coordinates:
            if polygon and len(polygon) > 0:
                ring = polygon[0]  # Exterior ring of each polygon
                all_points.extend(ring)
        
        if not all_points:
            return None
        
        # Calculate centroid: average of all points
        total_lon = sum(coord[0] for coord in all_points)
        total_lat = sum(coord[1] for coord in all_points)
        count = len(all_points)
        
        return (total_lon / count, total_lat / count)
    
    return None


async def call_osrm_route(
    start_lon: float,
    start_lat: float,
    end_lon: float,
    end_lat: float,
    vehicle_type: str = "driving"
) -> Dict[str, Any]:
    """
    Call OSRM route API to get route between two points.
    
    Args:
        start_lon: Starting longitude
        start_lat: Starting latitude
        end_lon: Ending longitude
        end_lat: Ending latitude
        vehicle_type: Vehicle type (driving, walking, cycling)
        
    Returns:
        OSRM API response dictionary
        
    Raises:
        HTTPException: If OSRM API call fails
    """
    if vehicle_type not in VALID_VEHICLE_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid vehicle_type. Must be one of: {', '.join(VALID_VEHICLE_TYPES)}"
        )
    
    # Format coordinates: lon,lat;lon,lat
    coords = f"{start_lon},{start_lat};{end_lon},{end_lat}"
    
    # Build OSRM API URL
    url = f"{OSRM_BASE_URL}/route/v1/{vehicle_type}/{coords}"
    params = {
        "steps": "true",
        "geometries": "geojson",
        "overview": "full"
    }
    
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(url, params=params)
            response.raise_for_status()
            return response.json()
    except httpx.HTTPError as e:
        logger.error(f"OSRM API error: {e}")
        raise HTTPException(
            status_code=502,
            detail=f"Failed to get route from OSRM: {str(e)}"
        )
    except Exception as e:
        logger.error(f"Unexpected error calling OSRM: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Error calling routing service: {str(e)}"
        )


def load_evacuation_centers(cleaned: bool = True) -> Dict[str, Any]:
    """
    Load evacuation centers GeoJSON file.
    
    Args:
        cleaned: If True, load cleaned data; if False, load raw data
        
    Returns:
        GeoJSON FeatureCollection dictionary
        
    Raises:
        HTTPException: If file not found or error loading
    """
    try:
        data_path = get_backend_data_path()
        
        if cleaned:
            geojson_path = data_path / "evacuation-center" / "src" / "data" / "ph_evacs_cleaned.geojson"
        else:
            geojson_path = data_path / "evacuation-center" / "src" / "data" / "ph_evacs_raw.geojson"
        
        return load_geojson_file(geojson_path)
    except FileNotFoundError as e:
        logger.error(f"Evacuation center GeoJSON file not found: {e}")
        raise HTTPException(
            status_code=404,
            detail=f"Evacuation center data not found (cleaned={cleaned})"
        )
    except Exception as e:
        logger.error(f"Error loading evacuation center data: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Error loading evacuation center data: {str(e)}"
        )


@router.get("/nearest-evacuation-center")
async def get_nearest_evacuation_center(
    latitude: float = Query(..., description="User's latitude"),
    longitude: float = Query(..., description="User's longitude"),
    vehicle_type: str = Query("driving", description="Vehicle type: driving, walking, or cycling"),
    cleaned: bool = Query(True, description="Use cleaned evacuation center data")
):
    """
    Find the top 3 nearest evacuation centers based on routing (not straight-line distance).
    
    This endpoint:
    1. Loads all evacuation centers
    2. Calculates straight-line distance to filter top 5 nearest
    3. Gets routes from OSRM for each of the top 5
    4. Returns the top 3 based on route duration
    
    **Frontend Location Handling:**
    This endpoint uses a frontend-driven location approach. The frontend should:
    1. On app load: Fetch user's location history from `/api/shared/location/history/last?citizen_id={id}`
    2. Store location in localStorage: `{ latitude, longitude, timestamp }`
    3. When calling this endpoint: Read location from localStorage and send coordinates
    
    This approach allows the frontend to manage location from multiple sources (GPS, manual input, 
    backend history) and works offline if location is cached in localStorage.
    
    Args:
        latitude: User's current latitude (typically from frontend localStorage)
        longitude: User's current longitude (typically from frontend localStorage)
        vehicle_type: Vehicle type for routing (driving, walking, cycling)
        cleaned: Use cleaned evacuation center data
        
    Returns:
        JSON response with:
        - code: Response code ("Ok" if successful)
        - centers: List of top 3 evacuation centers, each containing:
          - rank: Ranking (1, 2, or 3)
          - route: Full OSRM route response (with geometry for path visualization)
          - evacuation_center: Evacuation center properties
          - route_duration_seconds: Route duration in seconds
          - route_distance_meters: Route distance in meters
    """
    # Validate coordinates
    if not (-90 <= latitude <= 90):
        raise HTTPException(status_code=400, detail="Latitude must be between -90 and 90")
    if not (-180 <= longitude <= 180):
        raise HTTPException(status_code=400, detail="Longitude must be between -180 and 180")
    
    # Validate vehicle type
    if vehicle_type not in VALID_VEHICLE_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid vehicle_type. Must be one of: {', '.join(VALID_VEHICLE_TYPES)}"
        )
    
    # Load evacuation centers
    geojson = load_evacuation_centers(cleaned=cleaned)
    features = geojson.get("features", [])
    
    if not features:
        raise HTTPException(status_code=404, detail="No evacuation centers found")
    
    # Calculate straight-line distances and collect valid centers
    center_distances = []
    for feature in features:
        coords = get_evacuation_center_coordinates(feature)
        if coords is None:
            continue
        
        center_lon, center_lat = coords
        distance = calculate_straight_line_distance(latitude, longitude, center_lat, center_lon)
        center_distances.append((distance, feature, coords))
    
    if not center_distances:
        raise HTTPException(status_code=404, detail="No valid evacuation centers found")
    
    # Sort by distance and get top 5
    center_distances.sort(key=lambda x: x[0])
    top_5 = center_distances[:5]
    
    # Get routes for top 5 candidates
    route_results = []
    for distance, feature, (center_lon, center_lat) in top_5:
        try:
            route_response = await call_osrm_route(
                longitude, latitude, center_lon, center_lat, vehicle_type
            )
            
            # Extract route duration and distance
            if route_response.get("code") == "Ok" and route_response.get("routes"):
                route = route_response["routes"][0]
                duration = route.get("duration", 0)  # in seconds
                route_distance = route.get("distance", 0)  # in meters
                
                route_results.append({
                    "distance_km": distance,
                    "route_duration_seconds": duration,
                    "route_distance_meters": route_distance,
                    "route_response": route_response,
                    "feature": feature,
                    "coordinates": (center_lon, center_lat)
                })
            else:
                # If route failed, still include with distance only
                route_results.append({
                    "distance_km": distance,
                    "route_duration_seconds": None,
                    "route_distance_meters": None,
                    "route_response": None,
                    "feature": feature,
                    "coordinates": (center_lon, center_lat)
                })
        except Exception as e:
            logger.warning(f"Failed to get route for evacuation center: {e}")
            # Continue with other candidates
            route_results.append({
                "distance_km": distance,
                "route_duration_seconds": None,
                "route_distance_meters": None,
                "route_response": None,
                "feature": feature,
                "coordinates": (center_lon, center_lat)
            })
    
    if not route_results:
        raise HTTPException(status_code=502, detail="Failed to get routes for any evacuation center")
    
    # Filter valid routes (skip None values) and sort by route duration
    valid_routes = [r for r in route_results if r["route_duration_seconds"] is not None]
    
    if not valid_routes:
        # If no valid routes, fall back to straight-line distance
        valid_routes = route_results
    
    # Sort by route duration (or distance if duration is None)
    valid_routes.sort(key=lambda x: (
        x["route_duration_seconds"] if x["route_duration_seconds"] is not None else float('inf'),
        x["distance_km"]
    ))
    
    # Get top 3
    top_3 = valid_routes[:3]
    
    # Build response with top 3 centers
    centers = []
    for rank, result in enumerate(top_3, start=1):
        center_data = {
            "rank": rank,
            "route": result["route_response"],
            "evacuation_center": result["feature"]["properties"],
            "route_duration_seconds": result["route_duration_seconds"],
            "route_distance_meters": result["route_distance_meters"]
        }
        centers.append(center_data)
    
    response_data = {
        "code": "Ok",
        "centers": centers
    }
    
    return JSONResponse(content=response_data)


@router.get("/route")
async def get_route_to_evacuation_center(
    latitude: float = Query(..., description="User's latitude"),
    longitude: float = Query(..., description="User's longitude"),
    evacuation_center_id: str = Query(..., description="Evacuation center ID"),
    vehicle_type: str = Query("driving", description="Vehicle type: driving, walking, or cycling"),
    cleaned: bool = Query(True, description="Use cleaned evacuation center data")
):
    """
    Get route to a specific evacuation center.
    
    **Frontend Location Handling:**
    This endpoint uses a frontend-driven location approach. The frontend should:
    1. On app load: Fetch user's location history from `/api/shared/location/history/last?citizen_id={id}`
    2. Store location in localStorage: `{ latitude, longitude, timestamp }`
    3. When calling this endpoint: Read location from localStorage and send coordinates
    
    This approach allows the frontend to manage location from multiple sources (GPS, manual input, 
    backend history) and works offline if location is cached in localStorage.
    
    Args:
        latitude: User's current latitude (typically from frontend localStorage)
        longitude: User's current longitude (typically from frontend localStorage)
        evacuation_center_id: ID of the evacuation center (from properties.id)
        vehicle_type: Vehicle type for routing (driving, walking, cycling)
        cleaned: Use cleaned evacuation center data
        
    Returns:
        JSON response with:
        - route: Full OSRM route response
        - evacuation_center: Evacuation center properties
    """
    # Validate coordinates
    if not (-90 <= latitude <= 90):
        raise HTTPException(status_code=400, detail="Latitude must be between -90 and 90")
    if not (-180 <= longitude <= 180):
        raise HTTPException(status_code=400, detail="Longitude must be between -180 and 180")
    
    # Validate vehicle type
    if vehicle_type not in VALID_VEHICLE_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid vehicle_type. Must be one of: {', '.join(VALID_VEHICLE_TYPES)}"
        )
    
    # Load evacuation centers
    geojson = load_evacuation_centers(cleaned=cleaned)
    features = geojson.get("features", [])
    
    # Find evacuation center by ID
    target_feature = None
    for feature in features:
        props = feature.get("properties", {})
        if str(props.get("id", "")) == str(evacuation_center_id):
            target_feature = feature
            break
    
    if target_feature is None:
        raise HTTPException(
            status_code=404,
            detail=f"Evacuation center with ID '{evacuation_center_id}' not found"
        )
    
    # Get evacuation center coordinates
    coords = get_evacuation_center_coordinates(target_feature)
    if coords is None:
        raise HTTPException(
            status_code=500,
            detail="Failed to extract coordinates from evacuation center geometry"
        )
    
    center_lon, center_lat = coords
    
    # Get route from OSRM
    route_response = await call_osrm_route(
        longitude, latitude, center_lon, center_lat, vehicle_type
    )
    
    # Build response
    response_data = {
        "code": route_response.get("code", "Ok"),
        "route": route_response,
        "evacuation_center": target_feature["properties"]
    }
    
    return JSONResponse(content=response_data)


@router.get("/user-location")
async def get_user_last_location(
    citizen_id: UUID = Query(..., description="Citizen ID"),
    db: Session = Depends(get_db)
):
    """
    Get user's last known location from location history.
    
    Convenience endpoint for frontend to fetch user's last location
    to populate localStorage on app load. This endpoint returns a simplified
    location object suitable for storing in localStorage and using with routing endpoints.
    
    Note: This is a convenience wrapper around `/api/shared/location/history/last`.
    The frontend can use either endpoint, but this one returns a format optimized
    for routing use cases.
    
    Args:
        citizen_id: Citizen ID to get last location for
        
    Returns:
        JSON response with:
        - latitude: Last known latitude
        - longitude: Last known longitude
        - timestamp: ISO timestamp of when location was recorded
        - accuracy: Location accuracy in meters (if available)
        
    Raises:
        HTTPException: If no location history found for the citizen
    """
    # Query location_history for most recent entry for this citizen
    last_location = db.query(LocationHistory).filter(
        LocationHistory.citizen_id == citizen_id
    ).order_by(desc(LocationHistory.recorded_at)).first()
    
    if not last_location:
        raise HTTPException(
            status_code=404,
            detail=f"No location history found for citizen_id '{citizen_id}'"
        )
    
    # Return simplified location data for localStorage
    return JSONResponse(content={
        "latitude": last_location.latitude,
        "longitude": last_location.longitude,
        "timestamp": last_location.recorded_at.isoformat() if last_location.recorded_at else None,
        "accuracy": last_location.accuracy,
        "source": last_location.source.value if last_location.source else None
    })
