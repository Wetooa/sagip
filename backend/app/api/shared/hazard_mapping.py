"""
Hazard mapping API endpoints for NOAH data metadata.

This module provides REST API endpoints to discover available Project NOAH hazard map data.
The main endpoint returns metadata about all available hazard maps organized by type.

Note: Actual hazard map data endpoints are provided by the geojson module.
"""
from fastapi import APIRouter, HTTPException, Query
from pathlib import Path
from typing import Optional
import logging

from app.core.config import settings
from app.schemas.hazard import AvailableMapsResponse
from app.utils.hazard_processing import get_available_maps

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
