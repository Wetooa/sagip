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
from typing import Optional
import logging

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
