"""Hazard mapping API schemas."""
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List


class HazardMapMetadataResponse(BaseModel):
    """Schema for hazard map metadata response."""
    hazard_type: str = Field(..., description="Type of hazard: 'flood' or 'storm_surge'")
    return_period: Optional[str] = Field(None, description="Return period for flood data (e.g., '5yr', '25yr')")
    advisory_level: Optional[str] = Field(None, description="Advisory level for storm surge (e.g., '1', '2')")
    province: Optional[str] = Field(None, description="Province name")
    file_path: Optional[str] = Field(None, description="Relative path to shapefile")
    
    class Config:
        from_attributes = True


class AvailableMapsResponse(BaseModel):
    """Schema for available maps listing."""
    flood: Dict[str, List[Dict[str, str]]] = Field(..., description="Available flood maps by return period")
    storm_surge: Dict[str, List[Dict[str, str]]] = Field(..., description="Available storm surge maps by advisory level")


class GeoJSONFeatureCollection(BaseModel):
    """Schema for GeoJSON FeatureCollection response."""
    type: str = Field(default="FeatureCollection", description="GeoJSON type")
    features: List[Dict[str, Any]] = Field(..., description="List of GeoJSON features")
    
    class Config:
        json_schema_extra = {
            "example": {
                "type": "FeatureCollection",
                "features": [
                    {
                        "type": "Feature",
                        "geometry": {
                            "type": "Polygon",
                            "coordinates": [[[120.0, 10.0], [121.0, 10.0], [121.0, 11.0], [120.0, 11.0], [120.0, 10.0]]]
                        },
                        "properties": {
                            "DEPTH_M": 1.5
                        }
                    }
                ]
            }
        }
