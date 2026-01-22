"""
Hazard mapping API endpoints for NOAH flood and storm surge data.

This module provides REST API endpoints to access Project NOAH hazard map data.
The endpoints support both flood hazard maps (by return period) and storm surge
hazard maps (by advisory level).

Request Flow:
1. API receives request with parameters (return_period/advisory_level, province)
2. Check in-memory cache for processed GeoJSON
3. If cache miss, check for pre-converted GeoJSON file
4. If pre-converted file exists, load it and cache the result
5. If not, convert shapefile on-demand, cache result, and return
6. Return GeoJSON FeatureCollection to client

Caching Strategy:
- In-memory cache stores processed GeoJSON by key: {hazard_type}_{period/advisory}_{province}
- Cache persists for the lifetime of the application
- Pre-converted GeoJSON files provide faster first-time access
- On-demand conversion serves as fallback if pre-converted files are missing
"""
from fastapi import APIRouter, HTTPException, Query
from pathlib import Path
from typing import Optional
import logging

from app.core.config import settings
from app.schemas.hazard import GeoJSONFeatureCollection, AvailableMapsResponse
from app.utils.hazard_processing import (
    find_shapefile_path,
    process_shapefile,
    get_available_maps
)
from app.utils.hazard_cache import (
    get_cached_geojson,
    set_cached_geojson
)

logger = logging.getLogger(__name__)

router = APIRouter()


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


@router.get("/flood", response_model=GeoJSONFeatureCollection)
async def get_flood_hazard_map(
    return_period: str = Query(..., description="Return period (e.g., '5yr', '25yr', '100yr')"),
    province: Optional[str] = Query(None, description="Province name (optional)")
):
    """
    Get flood hazard map data for a specific return period.
    
    This endpoint returns GeoJSON FeatureCollection data representing flood hazard
    zones for the specified return period. The data includes polygon geometries
    with normalized properties including flood depth (DEPTH_M).
    
    Request Flow:
    1. Check in-memory cache for processed GeoJSON
    2. If cache miss, locate shapefile based on return_period and province
    3. Check for pre-converted GeoJSON file (faster)
    4. If not found, convert shapefile on-demand using geopandas
    5. Cache the result and return GeoJSON
    
    Args:
        return_period: Return period string. Common values: '5yr', '25yr', '100yr'
        province: Optional province name (e.g., 'Cebu', 'Palawan'). If not provided,
                 returns data for the first available province in the period.
        
    Returns:
        GeoJSON FeatureCollection with structure:
        {
            "type": "FeatureCollection",
            "features": [
                {
                    "type": "Feature",
                    "geometry": {
                        "type": "Polygon" | "MultiPolygon",
                        "coordinates": [...]
                    },
                    "properties": {
                        "DEPTH_M": float,  # Flood depth in meters
                        ...  # Other original properties
                    }
                },
                ...
            ]
        }
        
    Raises:
        HTTPException 404: If no shapefile found for the specified parameters
        HTTPException 500: If processing fails
        
    Example Request:
        GET /api/shared/hazard-mapping/flood?return_period=5yr&province=Cebu
        
    Example Response:
        {
            "type": "FeatureCollection",
            "features": [
                {
                    "type": "Feature",
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": [[[123.0, 10.0], [124.0, 10.0], ...]]
                    },
                    "properties": {
                        "DEPTH_M": 1.5,
                        "Var": 1.5
                    }
                }
            ]
        }
    """
    try:
        # Check cache first
        cached = get_cached_geojson("flood", return_period, province)
        if cached:
            return cached
        
        # Find shapefile
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
        
        return geojson
        
    except FileNotFoundError as e:
        logger.error(f"Shapefile not found: {e}")
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        logger.error(f"Error processing flood hazard map: {e}")
        raise HTTPException(status_code=500, detail=f"Error processing flood hazard map: {str(e)}")


@router.get("/storm-surge", response_model=GeoJSONFeatureCollection)
async def get_storm_surge_hazard_map(
    advisory_level: str = Query(..., description="Advisory level (e.g., '1', '2')"),
    province: Optional[str] = Query(None, description="Province name (optional)")
):
    """
    Get storm surge hazard map data for a specific advisory level.
    
    Args:
        advisory_level: Advisory level (e.g., '1', '2')
        province: Optional province name to filter
        
    Returns:
        GeoJSON FeatureCollection with storm surge hazard data
    """
    try:
        # Check cache first
        cached = get_cached_geojson("storm_surge", advisory_level, province)
        if cached:
            return cached
        
        # Find shapefile
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
        
        return geojson
        
    except FileNotFoundError as e:
        logger.error(f"Shapefile not found: {e}")
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        logger.error(f"Error processing storm surge hazard map: {e}")
        raise HTTPException(status_code=500, detail=f"Error processing storm surge hazard map: {str(e)}")


@router.get("/metadata", response_model=AvailableMapsResponse)
async def get_hazard_map_metadata():
    """
    Get metadata about available hazard maps.
    
    This endpoint scans the filesystem to discover all available hazard map shapefiles
    and returns metadata about them, organized by hazard type, return period (flood),
    or advisory level (storm surge).
    
    Returns:
        AvailableMapsResponse with structure:
        {
            "flood": {
                "5yr": [
                    {"province": "Cebu", "file": "NOAH Downloads/Flood/5yr/Cebu/..."},
                    ...
                ],
                "25yr": [...],
                "100yr": [...]
            },
            "storm_surge": {
                "1": [
                    {"province": "Cebu", "file": "NOAH Downloads/Storm Surge/StormSurgeAdvisory1/..."},
                    ...
                ],
                "2": [...],
                ...
            }
        }
        
    Raises:
        HTTPException 500: If filesystem scan fails
        
    Example Request:
        GET /api/shared/hazard-mapping/metadata
        
    Example Response:
        {
            "flood": {
                "5yr": [
                    {"province": "Cebu", "file": "NOAH Downloads/Flood/5yr/Cebu/PH072200000_FH_5yr.shp"}
                ],
                "25yr": [],
                "100yr": []
            },
            "storm_surge": {
                "1": [
                    {"province": "Cebu", "file": "NOAH Downloads/Storm Surge/StormSurgeAdvisory1/Cebu_StormSurge_SSA1.shp"}
                ],
                "2": [...]
            }
        }
    """
    try:
        base_path = get_noah_data_path()
        available = get_available_maps(base_path)
        return AvailableMapsResponse(**available)
    except Exception as e:
        logger.error(f"Error getting hazard map metadata: {e}")
        raise HTTPException(status_code=500, detail=f"Error getting metadata: {str(e)}")
