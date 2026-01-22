"""
GeoJSON API endpoints for serving geographic data files.

This module provides REST API endpoints to access GeoJSON data files stored in the backend.
The endpoints serve census data, flood hazard data, storm surge data, evacuation centers,
and other geographic datasets that are used by the frontend for map visualization.

All endpoints return standard GeoJSON FeatureCollection format.
"""
from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import JSONResponse
from pathlib import Path
from typing import Optional, Dict, Any
import logging
import random
import hashlib
from datetime import datetime, timedelta

from app.core.config import settings
from app.schemas.hazard import GeoJSONFeatureCollection
from app.utils.hazard_processing import (
    find_shapefile_path,
    process_shapefile,
    load_geojson_file
)
from app.utils.hazard_cache import (
    get_cached_geojson,
    set_cached_geojson
)

logger = logging.getLogger(__name__)

router = APIRouter()


def get_backend_data_path() -> Path:
    """
    Get the absolute path to backend data directory.
    
    Returns:
        Absolute Path object pointing to the backend data directory
    """
    # Assume backend directory is parent of app directory
    backend_dir = Path(__file__).parent.parent.parent.parent
    return backend_dir / "data"


def get_noah_data_path() -> Path:
    """
    Get the absolute path to NOAH data directory.
    
    Resolves the NOAH_DATA_PATH setting to an absolute path. If the path is
    relative, it's resolved relative to the backend directory.
    
    Returns:
        Absolute Path object pointing to the NOAH data directory
        
    Note:
        The path is determined from settings.NOAH_DATA_PATH, which defaults
        to "data/noah" if not set in environment variables.
    """
    # If NOAH_DATA_PATH is relative, make it relative to backend directory
    data_path = Path(settings.NOAH_DATA_PATH)
    if not data_path.is_absolute():
        # Assume backend directory is parent of app directory
        backend_dir = Path(__file__).parent.parent.parent.parent
        data_path = backend_dir / data_path
    return data_path


@router.get("/census", response_model=GeoJSONFeatureCollection)
async def get_census_data():
    """
    Get digital census data for Cebu (v2 - most updated version).
    
    This endpoint returns GeoJSON FeatureCollection containing census data with
    properties like total_pop, elderly_count, stories, and risk_status.
    The data contains various fields that can be used for filtering on the frontend.
    
    Returns:
        GeoJSON FeatureCollection with census data (v2)
        
    Example Request:
        GET /api/shared/geojson/census
        
    Example Response:
        {
            "type": "FeatureCollection",
            "features": [
                {
                    "type": "Feature",
                    "properties": {
                        "total_pop": 12.85,
                        "elderly_count": 0.67,
                        "stories": 1.0,
                        "risk_status": 1
                    },
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": [[[123.919, 10.347], ...]]
                    }
                }
            ]
        }
    """
    try:
        data_path = get_backend_data_path()
        geojson_path = data_path / "gnn" / "digital_census_cebu_v2.geojson"
        
        geojson = load_geojson_file(geojson_path)
        
        return JSONResponse(
            content=geojson,
            headers={
                'Content-Type': 'application/json',
                'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
            }
        )
        
    except FileNotFoundError as e:
        logger.error(f"Census GeoJSON file not found: {e}")
        raise HTTPException(status_code=404, detail="Census data not found")
    except Exception as e:
        logger.error(f"Error loading census data: {e}")
        raise HTTPException(status_code=500, detail=f"Error loading census data: {str(e)}")


@router.get("/flood-hazard", response_model=GeoJSONFeatureCollection)
async def get_flood_hazard_data(
    return_period: str = Query(..., description="Return period (e.g., '5yr', '25yr', '100yr')"),
    province: Optional[str] = Query(None, description="Province name (optional)")
):
    """
    Get flood hazard data from NOAH data.
    
    This endpoint returns GeoJSON FeatureCollection containing flood hazard zones
    with normalized DEPTH_M property indicating flood depth in meters.
    The data is sourced from Project NOAH and processed with geometry fixes
    and property normalization.
    
    Args:
        return_period: Return period string (e.g., '5yr', '25yr', '100yr')
        province: Optional province name (e.g., 'Cebu', 'Palawan'). If not provided,
                 returns data for the first available province in the period.
        
    Returns:
        GeoJSON FeatureCollection with flood hazard data
        
    Example Request:
        GET /api/shared/geojson/flood-hazard?return_period=5yr&province=Cebu
        
    Example Response:
        {
            "type": "FeatureCollection",
            "features": [
                {
                    "type": "Feature",
                    "properties": {
                        "DEPTH_M": 1.5,
                        "Var": 1.5
                    },
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": [[[123.0, 10.0], ...]]
                    }
                }
            ]
        }
    """
    try:
        # Check cache first
        cached = get_cached_geojson("flood", return_period, province)
        if cached:
            return JSONResponse(
                content=cached,
                headers={
                    'Content-Type': 'application/json',
                    'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
                }
            )
        
        # Find shapefile in NOAH data
        base_path = get_noah_data_path()
        shapefile_path = find_shapefile_path(base_path, "flood", return_period, province)
        
        if not shapefile_path:
            raise HTTPException(
                status_code=404,
                detail=f"Flood hazard map not found for return period '{return_period}'"
                + (f" and province '{province}'" if province else "")
            )
        
        # Process shapefile
        geojson = process_shapefile(shapefile_path)
        
        # Cache the result
        set_cached_geojson("flood", return_period, geojson, province)
        
        return JSONResponse(
            content=geojson,
            headers={
                'Content-Type': 'application/json',
                'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
            }
        )
        
    except HTTPException:
        raise
    except FileNotFoundError as e:
        logger.error(f"Shapefile not found: {e}")
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        logger.error(f"Error processing flood hazard data: {e}")
        raise HTTPException(status_code=500, detail=f"Error processing flood hazard data: {str(e)}")


@router.get("/storm-surge", response_model=GeoJSONFeatureCollection)
async def get_storm_surge_data(
    advisory_level: str = Query(..., description="Advisory level (e.g., '1', '2')"),
    province: Optional[str] = Query(None, description="Province name (optional)")
):
    """
    Get storm surge hazard data from NOAH data.
    
    This endpoint returns GeoJSON FeatureCollection containing storm surge hazard zones
    for the specified advisory level. The data is sourced from Project NOAH and processed
    with geometry fixes and property normalization.
    
    Args:
        advisory_level: Advisory level string (e.g., '1', '2')
        province: Optional province name (e.g., 'Cebu', 'Palawan'). If not provided,
                 returns data for the first available province for the advisory level.
        
    Returns:
        GeoJSON FeatureCollection with storm surge hazard data
        
    Example Request:
        GET /api/shared/geojson/storm-surge?advisory_level=1&province=Cebu
        
    Example Response:
        {
            "type": "FeatureCollection",
            "features": [
                {
                    "type": "Feature",
                    "properties": {
                        "DEPTH_M": 2.0,
                        ...
                    },
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": [[[123.0, 10.0], ...]]
                    }
                }
            ]
        }
    """
    try:
        # Check cache first
        cached = get_cached_geojson("storm_surge", advisory_level, province)
        if cached:
            return JSONResponse(
                content=cached,
                headers={
                    'Content-Type': 'application/json',
                    'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
                }
            )
        
        # Find shapefile in NOAH data
        base_path = get_noah_data_path()
        shapefile_path = find_shapefile_path(base_path, "storm_surge", advisory_level, province)
        
        if not shapefile_path:
            raise HTTPException(
                status_code=404,
                detail=f"Storm surge hazard map not found for advisory level '{advisory_level}'"
                + (f" and province '{province}'" if province else "")
            )
        
        # Process shapefile
        geojson = process_shapefile(shapefile_path)
        
        # Cache the result
        set_cached_geojson("storm_surge", advisory_level, geojson, province)
        
        return JSONResponse(
            content=geojson,
            headers={
                'Content-Type': 'application/json',
                'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
            }
        )
        
    except HTTPException:
        raise
    except FileNotFoundError as e:
        logger.error(f"Shapefile not found: {e}")
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        logger.error(f"Error processing storm surge hazard data: {e}")
        raise HTTPException(status_code=500, detail=f"Error processing storm surge hazard data: {str(e)}")


def parse_capacity_to_max_occupancy(capacity: Optional[str]) -> int:
    """
    Parse capacity string and generate a random max_occupancy value within the range.
    
    Args:
        capacity: Capacity string like ">500", "100-250", "250-500", or None
        
    Returns:
        Random integer within the appropriate range based on capacity string
    """
    if capacity is None:
        return random.randint(50, 1000)
    
    capacity = capacity.strip()
    
    # Handle ">500" format
    if capacity.startswith(">"):
        try:
            min_val = int(capacity[1:])
            return random.randint(min_val, min_val + 500)  # Range from min to min+500
        except ValueError:
            return random.randint(50, 1000)
    
    # Handle "100-250" or "250-500" format
    if "-" in capacity:
        try:
            parts = capacity.split("-")
            min_val = int(parts[0].strip())
            max_val = int(parts[1].strip())
            return random.randint(min_val, max_val)
        except (ValueError, IndexError):
            return random.randint(50, 1000)
    
    # If we can't parse it, return default range
    return random.randint(50, 1000)


def convert_geometry_to_point(geometry: Dict[str, Any]) -> Dict[str, Any]:
    """
    Convert Polygon or MultiPolygon geometry to Point geometry using centroid.
    
    This function is used to convert building boundary geometries to point
    representations for proper circle rendering on the frontend map.
    
    Args:
        geometry: GeoJSON geometry object (Point, Polygon, or MultiPolygon)
        
    Returns:
        Point geometry with centroid coordinates [longitude, latitude]
    """
    geom_type = geometry.get("type")
    coordinates = geometry.get("coordinates")
    
    if geom_type == "Point":
        return geometry
    
    elif geom_type == "Polygon":
        # Calculate centroid from exterior ring
        ring = coordinates[0] if coordinates else []
        if not ring:
            return {"type": "Point", "coordinates": [0, 0]}
        
        total_lon = sum(coord[0] for coord in ring)
        total_lat = sum(coord[1] for coord in ring)
        count = len(ring)
        
        return {
            "type": "Point",
            "coordinates": [total_lon / count, total_lat / count]
        }
    
    elif geom_type == "MultiPolygon":
        # Collect all points from all polygons
        all_points = []
        for polygon in coordinates:
            if polygon and len(polygon) > 0:
                ring = polygon[0]  # Exterior ring
                all_points.extend(ring)
        
        if not all_points:
            return {"type": "Point", "coordinates": [0, 0]}
        
        total_lon = sum(coord[0] for coord in all_points)
        total_lat = sum(coord[1] for coord in all_points)
        count = len(all_points)
        
        return {
            "type": "Point",
            "coordinates": [total_lon / count, total_lat / count]
        }
    
    # Fallback for unknown geometry types
    return {"type": "Point", "coordinates": [0, 0]}


@router.get("/evacuation-centers", response_model=GeoJSONFeatureCollection)
async def get_evacuation_centers(
    cleaned: Optional[bool] = Query(True, description="Use cleaned data (true) or raw data (false)")
):
    """
    Get evacuation center data for the Philippines.
    
    This endpoint returns GeoJSON FeatureCollection containing evacuation center locations
    throughout the Philippines. The data can be returned as raw (from OSM) or cleaned.
    
    Args:
        cleaned: If True, return cleaned data; if False, return raw data
        
    Returns:
        GeoJSON FeatureCollection with evacuation center data
        
    Example Request:
        GET /api/shared/geojson/evacuation-centers?cleaned=true
        
    Example Response:
        {
            "type": "FeatureCollection",
            "features": [
                {
                    "type": "Feature",
                    "properties": {
                        "name": "Evacuation Center Name",
                        ...
                    },
                    "geometry": {
                        "type": "Point",
                        "coordinates": [123.0, 10.0]
                    }
                }
            ]
        }
    """
    try:
        data_path = get_backend_data_path()
        
        if cleaned:
            geojson_path = data_path / "evacuation-center" / "src" / "data" / "ph_evacs_cleaned.geojson"
        else:
            geojson_path = data_path / "evacuation-center" / "src" / "data" / "ph_evacs_raw.geojson"
        
        geojson = load_geojson_file(geojson_path)
        
        # Add randomized properties to each feature for presentation
        for feature in geojson.get("features", []):
            props = feature.get("properties", {})
            
            # Generate max_occupancy based on existing capacity field
            max_occupancy = parse_capacity_to_max_occupancy(props.get("capacity"))
            
            # Generate current_occupancy (0 to max_occupancy)
            current_occupancy = random.randint(0, max_occupancy)
            
            # Generate has_wifi (90% True, 10% False)
            has_wifi = random.random() < 0.9
            
            # Generate last_updated (random timestamp within last 7 days)
            days_ago = random.uniform(0, 7)
            last_updated = (datetime.utcnow() - timedelta(days=days_ago)).isoformat() + "Z"
            
            # Calculate occupancy_percentage
            occupancy_percentage = round((current_occupancy / max_occupancy) * 100, 1) if max_occupancy > 0 else 0.0
            
            # Add new properties
            props["max_occupancy"] = max_occupancy
            props["current_occupancy"] = current_occupancy
            props["has_wifi"] = has_wifi
            props["last_updated"] = last_updated
            props["occupancy_percentage"] = occupancy_percentage
        
        # Convert Polygon/MultiPolygon geometries to Point geometries for proper circle rendering
        for feature in geojson.get("features", []):
            if "geometry" in feature:
                feature["geometry"] = convert_geometry_to_point(feature["geometry"])
        
        return JSONResponse(
            content=geojson,
            headers={
                'Content-Type': 'application/json',
                'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
            }
        )
        
    except FileNotFoundError as e:
        logger.error(f"Evacuation center GeoJSON file not found: {e}")
        raise HTTPException(
            status_code=404,
            detail=f"Evacuation center data not found (cleaned={cleaned})"
        )
    except Exception as e:
        logger.error(f"Error loading evacuation center data: {e}")
        raise HTTPException(status_code=500, detail=f"Error loading evacuation center data: {str(e)}")


def generate_health_risks(barangay_id: str) -> dict:
    """
    Generate mock health risk data for a barangay.
    
    Uses a consistent seed based on barangay ID to ensure reproducible results.
    Each barangay will have health risk predictions for the 3 sickness types
    that match the available AI models.
    
    Args:
        barangay_id: Unique identifier for the barangay (used as seed)
        
    Returns:
        Dictionary with health risk data structure (sickness-first):
        {
            "leptospirosis": {
                "regression_score": 0.65,
                "risk_level": "medium"
            },
            "dengue_chikungunya": {
                "regression_score": 0.45,
                "risk_level": "low"
            },
            "acute_bloody_diarrhea_cholera_typhoid": {
                "regression_score": 0.78,
                "risk_level": "high"
            }
        }
    """
    # Create a deterministic seed from barangay ID
    seed_hash = int(hashlib.md5(barangay_id.encode()).hexdigest()[:8], 16)
    rng = random.Random(seed_hash)
    
    # Three sicknesses matching the three AI models
    sicknesses = [
        "leptospirosis",
        "dengue_chikungunya",
        "acute_bloody_diarrhea_cholera_typhoid"
    ]
    
    health_risks = {}
    
    for sickness in sicknesses:
        # Add slight variation per sickness by modifying seed
        sickness_seed = seed_hash + hash(sickness)
        sickness_rng = random.Random(sickness_seed)
        
        # Generate regression score (0-1)
        regression_score = round(sickness_rng.uniform(0.0, 1.0), 3)
        
        # Map score to risk level
        if regression_score < 0.3:
            risk_level = "low"
        elif regression_score < 0.7:
            risk_level = "medium"
        else:
            risk_level = "high"
        
        health_risks[sickness] = {
            "regression_score": regression_score,
            "risk_level": risk_level
        }
    
    return health_risks


@router.get("/barangays", response_model=GeoJSONFeatureCollection)
async def get_barangays_by_province(
    province: str = Query(..., description="Province name (e.g., 'Cebu', 'Abra')")
):
    """
    Get barangay data filtered by province with health risk data.
    
    This endpoint returns GeoJSON FeatureCollection containing barangay boundaries
    for the specified province. Each barangay includes mock health outbreak data
    with predictions from multiple AI models for different sicknesses.
    
    Args:
        province: Province name (e.g., 'Cebu', 'Abra', 'Agusan del Sur')
        
    Returns:
        GeoJSON FeatureCollection with barangay data and health risks
        
    Example Request:
        GET /api/shared/geojson/barangays?province=Cebu
        
    Example Response:
        {
            "type": "FeatureCollection",
            "features": [
                {
                    "type": "Feature",
                    "properties": {
                        "ID_0": 177,
                        "NAME_0": "Philippines",
                        "PROVINCE": "Cebu",
                        "NAME_3": "Barangay Name",
                        "health_risks": {
                            "model_1": {
                                "dengue": {"regression_score": 0.65, "risk_level": "medium"},
                                ...
                            },
                            ...
                        }
                    },
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": [[[123.0, 10.0], ...]]
                    }
                }
            ]
        }
    """
    try:
        data_path = get_backend_data_path()
        geojson_path = data_path / "geojsonph" / "Barangay" / "Barangays.json"
        
        geojson = load_geojson_file(geojson_path)
        
        # Filter features by province
        filtered_features = []
        for feature in geojson.get("features", []):
            props = feature.get("properties", {})
            feature_province = props.get("PROVINCE", "")
            
            # Case-insensitive matching
            if feature_province.lower() == province.lower():
                # Generate unique ID for barangay (use ID_3 or NAME_3 as fallback)
                barangay_id = str(props.get("ID_3", props.get("NAME_3", "")))
                if not barangay_id:
                    # Fallback to a combination of available fields
                    barangay_id = f"{props.get('NAME_1', '')}_{props.get('NAME_2', '')}_{props.get('NAME_3', '')}"
                
                # Generate health risk data
                health_risks = generate_health_risks(barangay_id)
                
                # Add health risks to properties
                props["health_risks"] = health_risks
                
                filtered_features.append(feature)
        
        if not filtered_features:
            raise HTTPException(
                status_code=404,
                detail=f"No barangays found for province '{province}'. Please check the province name."
            )
        
        # Return filtered GeoJSON
        filtered_geojson = {
            "type": "FeatureCollection",
            "features": filtered_features
        }
        
        return JSONResponse(
            content=filtered_geojson,
            headers={
                'Content-Type': 'application/json',
                'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
            }
        )
        
    except HTTPException:
        raise
    except FileNotFoundError as e:
        logger.error(f"Barangay GeoJSON file not found: {e}")
        raise HTTPException(status_code=404, detail="Barangay data file not found")
    except Exception as e:
        logger.error(f"Error loading barangay data: {e}")
        raise HTTPException(status_code=500, detail=f"Error loading barangay data: {str(e)}")
