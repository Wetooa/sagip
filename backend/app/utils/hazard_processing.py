"""
Utilities for processing NOAH hazard map shapefiles.

This module provides functions to:
- Convert shapefiles to GeoJSON format (on-demand or from pre-converted files)
- Fix polygon geometry issues (ensure rings are closed)
- Normalize property names across different data sources
- Locate shapefiles based on hazard type, period/advisory, and province
- Discover available hazard maps by scanning the filesystem

The processing pipeline:
1. Check for pre-converted GeoJSON file (faster)
2. If not found, convert shapefile using geopandas
3. Fix polygon geometries (ensure rings are closed)
4. Normalize properties (standardize depth/hazard level fields)
5. Return GeoJSON FeatureCollection

Pre-converted GeoJSON files are stored alongside shapefiles with .geojson extension.
"""
import os
from pathlib import Path
from typing import Optional, Dict, Any
import geopandas as gpd
import json
import logging

logger = logging.getLogger(__name__)


def fix_polygon_geometry(feature: Dict[str, Any]) -> Dict[str, Any]:
    """
    Ensure polygon rings are properly closed.
    
    Args:
        feature: GeoJSON feature dictionary
        
    Returns:
        Feature with fixed geometry
    """
    if feature.get("geometry", {}).get("type") == "Polygon":
        coords = feature["geometry"]["coordinates"]
        fixed_coords = []
        for ring in coords:
            if len(ring) > 0:
                first = ring[0]
                last = ring[-1]
                # Check if ring is closed
                if first[0] != last[0] or first[1] != last[1]:
                    fixed_ring = ring + [[first[0], first[1]]]
                else:
                    fixed_ring = ring
                fixed_coords.append(fixed_ring)
        feature["geometry"]["coordinates"] = fixed_coords
        
    elif feature.get("geometry", {}).get("type") == "MultiPolygon":
        coords = feature["geometry"]["coordinates"]
        fixed_coords = []
        for polygon in coords:
            fixed_polygon = []
            for ring in polygon:
                if len(ring) > 0:
                    first = ring[0]
                    last = ring[-1]
                    if first[0] != last[0] or first[1] != last[1]:
                        fixed_ring = ring + [[first[0], first[1]]]
                    else:
                        fixed_ring = ring
                    fixed_polygon.append(fixed_ring)
            fixed_coords.append(fixed_polygon)
        feature["geometry"]["coordinates"] = fixed_coords
    
    return feature


def normalize_properties(feature: Dict[str, Any]) -> Dict[str, Any]:
    """
    Normalize property names to standard format.
    
    Different shapefiles may use different property names for the same data
    (e.g., 'Var', 'DEPTH_M', 'depth', etc. for flood depth). This function
    standardizes these to 'DEPTH_M' for consistency across the API.
    
    Args:
        feature: GeoJSON feature dictionary with a 'properties' field
        
    Returns:
        Feature with normalized properties. Original properties are preserved,
        with 'DEPTH_M' added if a depth/hazard level property is found.
        
    Note:
        The function checks multiple common property name variations:
        - Var, VAR, var
        - DEPTH_M, DEPTH, depth_m, depth, Depth
        - FLOOD_DEPTH, FloodDepth
        - HAZARD, Hazard, hazard
        - HAZ_LEVEL, haz_level, HAZARD_LEVEL, hazard_level
        
    Example:
        >>> feature = {
        ...     "properties": {"Var": 1.5, "other": "data"}
        ... }
        >>> normalized = normalize_properties(feature)
        >>> normalized["properties"]["DEPTH_M"]  # 1.5
        >>> normalized["properties"]["Var"]  # Still present
    """
    props = feature.get("properties", {})
    normalized = {**props}
    
    # Try to find depth/hazard level property with various name variations
    depth_keys = [
        "Var", "VAR", "var", "DEPTH_M", "DEPTH", "depth_m", "depth", "Depth",
        "FLOOD_DEPTH", "FloodDepth", "HAZARD", "Hazard", "hazard",
        "HAZ_LEVEL", "haz_level", "HAZARD_LEVEL", "hazard_level"
    ]
    
    for key in depth_keys:
        if key in props and props[key] is not None and props[key] != "":
            try:
                value = float(props[key]) if not isinstance(props[key], (int, float)) else props[key]
                if not (value != value or not (value == value)):  # Check for NaN
                    normalized["DEPTH_M"] = value
                    break
            except (ValueError, TypeError):
                continue
    
    return normalized


def load_geojson_file(geojson_path: Path) -> Dict[str, Any]:
    """
    Load a pre-converted GeoJSON file.
    
    This function loads a GeoJSON file that was previously converted from a shapefile.
    Pre-converted files are faster to load than on-demand conversion.
    
    Args:
        geojson_path: Path to the GeoJSON file (.geojson)
        
    Returns:
        GeoJSON FeatureCollection dictionary
        
    Raises:
        FileNotFoundError: If the GeoJSON file doesn't exist
        json.JSONDecodeError: If the file contains invalid JSON
        IOError: If the file cannot be read
        
    Example:
        >>> geojson_path = Path("data/noah/NOAH Downloads/Flood/5yr/Cebu/PH072200000_FH_5yr.geojson")
        >>> geojson = load_geojson_file(geojson_path)
        >>> print(f"Loaded {len(geojson['features'])} features")
    """
    if not geojson_path.exists():
        raise FileNotFoundError(f"GeoJSON file not found: {geojson_path}")
    
    try:
        with open(geojson_path, 'r', encoding='utf-8') as f:
            geojson = json.load(f)
        
        # Validate it's a FeatureCollection
        if geojson.get('type') != 'FeatureCollection':
            raise ValueError(f"Invalid GeoJSON type: expected FeatureCollection, got {geojson.get('type')}")
        
        return geojson
    except json.JSONDecodeError as e:
        logger.error(f"Invalid JSON in {geojson_path}: {e}")
        raise
    except Exception as e:
        logger.error(f"Error loading GeoJSON file {geojson_path}: {e}")
        raise


def find_shapefile_path(
    base_path: Path,
    hazard_type: str,
    period_or_advisory: str,
    province: Optional[str] = None
) -> Optional[Path]:
    """
    Locate shapefile based on hazard type, period/advisory, and province.
    
    This function searches the NOAH data directory structure to find the appropriate
    shapefile. It handles different file naming conventions and directory structures.
    
    Args:
        base_path: Base path to NOAH data directory (e.g., 'data/noah')
        hazard_type: Type of hazard - 'flood' or 'storm_surge'
        period_or_advisory: 
            - For flood: Return period string (e.g., '5yr', '25yr', '100yr')
            - For storm surge: Advisory level string (e.g., '1', '2', '3', '4')
        province: Optional province name (e.g., 'Cebu', 'Palawan'). If None,
                 returns the first shapefile found in the period/advisory directory.
        
    Returns:
        Path to shapefile (.shp) if found, None otherwise
        
    Note:
        For flood data, the expected structure is:
        - NOAH Downloads/Flood/{return_period}/{Province}/*.shp
        - Some provinces have subdirectories, others have files directly in period dir
        
        For storm surge data:
        - NOAH Downloads/Storm Surge/StormSurgeAdvisory{level}/{Province}_*.shp
        
    Example:
        >>> base_path = Path("data/noah")
        >>> shp_path = find_shapefile_path(base_path, "flood", "5yr", "Cebu")
        >>> # Returns: Path("data/noah/NOAH Downloads/Flood/5yr/Cebu/PH072200000_FH_5yr.shp")
    """
    base_path = Path(base_path)
    
    if hazard_type == "flood":
        # Flood data: NOAH Downloads/Flood/{return_period}/{Province}/*.shp
        flood_dir = base_path / "NOAH Downloads" / "Flood" / period_or_advisory
        if not flood_dir.exists():
            return None
        
        if province:
            # Try to find province-specific shapefile
            # Some provinces have subdirectories, others have files directly
            province_normalized = province.replace(" ", "_")
            
            # First, try subdirectory (e.g., Flood/5yr/Albay/*.shp)
            province_subdir = flood_dir / province
            if province_subdir.exists() and province_subdir.is_dir():
                shp_files = list(province_subdir.glob("*.shp"))
                if shp_files:
                    return shp_files[0]
            
            # Try direct file patterns in the period directory
            patterns = [
                f"{province}_Flood_*.shp",
                f"{province_normalized}_Flood_*.shp",
                f"{province}_FH_{period_or_advisory}.shp",
            ]
            
            # Handle special cases like "Oriental_Occidental_Mindoro" -> "Mindoro"
            if "Mindoro" in province:
                patterns.append("Mindoro_FH_*.shp")
            
            for pattern in patterns:
                matches = list(flood_dir.glob(pattern))
                if matches:
                    return matches[0]
            
            # Last resort: search recursively and match by province name in filename
            for shp_file in flood_dir.rglob("*.shp"):
                filename_lower = shp_file.stem.lower()
                province_lower = province.lower()
                # Check if province name appears in filename
                if (province_lower in filename_lower or 
                    province_lower.replace(" ", "_") in filename_lower or
                    province_lower.replace("_", "") in filename_lower):
                    return shp_file
        else:
            # Return first shapefile found in the period directory
            shp_files = list(flood_dir.rglob("*.shp"))
            if shp_files:
                return shp_files[0]
    
    elif hazard_type == "storm_surge":
        # Storm surge: NOAH Downloads/Storm Surge/StormSurgeAdvisory{level}/{Province}/*.shp
        advisory_dir = base_path / "NOAH Downloads" / "Storm Surge" / f"StormSurgeAdvisory{period_or_advisory}"
        if not advisory_dir.exists():
            return None
        
        if province:
            # Try to find province-specific shapefile
            province_normalized = province.replace(" ", "_")
            
            # Try multiple patterns
            search_patterns = [
                f"{province}_StormSurge_SSA{period_or_advisory}.shp",
                f"{province_normalized}_StormSurge_SSA{period_or_advisory}.shp",
                f"{province}_*.shp",
            ]
            
            for pattern in search_patterns:
                matches = list(advisory_dir.glob(pattern))
                if matches:
                    return matches[0]
            
            # Also search case-insensitively
            for shp_file in advisory_dir.glob("*.shp"):
                if province.lower() in shp_file.stem.lower():
                    return shp_file
        else:
            # Return first shapefile found in the advisory directory
            shp_files = list(advisory_dir.glob("*.shp"))
            if shp_files:
                return shp_files[0]
    
    return None


def process_shapefile(
    shapefile_path: Path,
    normalize: bool = True,
    fix_geometry: bool = True,
    use_preconverted: bool = True
) -> Dict[str, Any]:
    """
    Process shapefile and convert to GeoJSON FeatureCollection.
    
    This function first checks for a pre-converted GeoJSON file (faster), and if
    not found, converts the shapefile on-demand using geopandas. The processing
    pipeline includes geometry fixing and property normalization.
    
    Processing steps:
    1. Check for pre-converted GeoJSON file (if use_preconverted=True)
    2. If not found, read shapefile using geopandas
    3. Convert to GeoJSON format
    4. Fix polygon geometries (ensure rings are closed)
    5. Normalize properties (standardize depth/hazard level fields)
    
    Args:
        shapefile_path: Path to shapefile (.shp file)
        normalize: Whether to normalize property names (default: True)
        fix_geometry: Whether to fix polygon geometry issues (default: True)
        use_preconverted: If True, check for pre-converted .geojson file first (default: True)
        
    Returns:
        GeoJSON FeatureCollection dictionary with structure:
        {
            "type": "FeatureCollection",
            "features": [
                {
                    "type": "Feature",
                    "geometry": {...},
                    "properties": {...}
                },
                ...
            ]
        }
        
    Raises:
        FileNotFoundError: If shapefile doesn't exist
        ValueError: If shapefile cannot be read or is invalid
        Exception: For other processing errors
        
    Note:
        Pre-converted GeoJSON files are expected to be in the same directory as
        the shapefile with a .geojson extension (e.g., file.shp -> file.geojson).
        Pre-converted files are faster to load and reduce server load.
        
    Example:
        >>> shp_path = Path("data/noah/NOAH Downloads/Flood/5yr/Cebu/PH072200000_FH_5yr.shp")
        >>> geojson = process_shapefile(shp_path)
        >>> print(f"Processed {len(geojson['features'])} features")
    """
    shapefile_path = Path(shapefile_path)
    
    if not shapefile_path.exists():
        raise FileNotFoundError(f"Shapefile not found: {shapefile_path}")
    
    # Check for pre-converted GeoJSON file first
    if use_preconverted:
        geojson_path = shapefile_path.with_suffix('.geojson')
        if geojson_path.exists():
            logger.debug(f"Loading pre-converted GeoJSON: {geojson_path}")
            try:
                geojson = load_geojson_file(geojson_path)
                # Still apply processing if needed (though pre-converted should already be processed)
                if "features" in geojson and (normalize or fix_geometry):
                    processed_features = []
                    for feature in geojson["features"]:
                        if fix_geometry:
                            feature = fix_polygon_geometry(feature)
                        if normalize:
                            feature["properties"] = normalize_properties(feature)
                        processed_features.append(feature)
                    geojson["features"] = processed_features
                return geojson
            except Exception as e:
                logger.warning(f"Failed to load pre-converted GeoJSON {geojson_path}: {e}. Falling back to on-demand conversion.")
    
    # On-demand conversion from shapefile
    try:
        logger.debug(f"Converting shapefile on-demand: {shapefile_path}")
        
        # Read shapefile using geopandas
        gdf = gpd.read_file(shapefile_path)
        
        # Convert to GeoJSON
        geojson = json.loads(gdf.to_json())
        
        # Process features
        if "features" in geojson:
            processed_features = []
            for feature in geojson["features"]:
                if fix_geometry:
                    feature = fix_polygon_geometry(feature)
                if normalize:
                    feature["properties"] = normalize_properties(feature)
                processed_features.append(feature)
            
            geojson["features"] = processed_features
        
        return geojson
        
    except Exception as e:
        logger.error(f"Error processing shapefile {shapefile_path}: {e}")
        raise


def get_available_maps(base_path: Path) -> Dict[str, Any]:
    """
    Scan filesystem to discover available hazard maps.
    
    This function recursively scans the NOAH data directory to find all available
    shapefiles and organizes them by hazard type, return period (for flood), or
    advisory level (for storm surge).
    
    Args:
        base_path: Base path to NOAH data directory (e.g., 'data/noah')
        
    Returns:
        Dictionary with structure:
        {
            "flood": {
                "5yr": [{"province": "Cebu", "file": "..."}, ...],
                "25yr": [...],
                "100yr": [...]
            },
            "storm_surge": {
                "1": [{"province": "Cebu", "file": "..."}, ...],
                "2": [...],
                ...
            }
        }
        
    Note:
        Province names are extracted from filenames, which may not always be
        accurate. The 'file' field contains the relative path from base_path.
        
    Example:
        >>> base_path = Path("data/noah")
        >>> available = get_available_maps(base_path)
        >>> print(available["flood"]["5yr"][0]["province"])  # "Cebu"
    """
    base_path = Path(base_path)
    available = {
        "flood": {},
        "storm_surge": {}
    }
    
    # Scan flood data
    flood_base = base_path / "NOAH Downloads" / "Flood"
    if flood_base.exists():
        for period_dir in flood_base.iterdir():
            if period_dir.is_dir():
                period = period_dir.name
                available["flood"][period] = []
                
                # Find all shapefiles in this period
                shp_files = list(period_dir.rglob("*.shp"))
                for shp_file in shp_files:
                    # Try to extract province name from filename
                    province = shp_file.stem.replace("_Flood_", "_").replace(f"_{period}", "").split("_")[0]
                    available["flood"][period].append({
                        "province": province,
                        "file": str(shp_file.relative_to(base_path))
                    })
    
    # Scan storm surge data
    surge_base = base_path / "NOAH Downloads" / "Storm Surge"
    if surge_base.exists():
        for advisory_dir in surge_base.iterdir():
            if advisory_dir.is_dir() and "StormSurgeAdvisory" in advisory_dir.name:
                # Extract advisory level
                advisory_level = advisory_dir.name.replace("StormSurgeAdvisory", "")
                available["storm_surge"][advisory_level] = []
                
                # Find all shapefiles in this advisory
                shp_files = list(advisory_dir.glob("*.shp"))
                for shp_file in shp_files:
                    # Extract province name from filename
                    province = shp_file.stem.replace(f"_StormSurge_SSA{advisory_level}", "").split("_")[0]
                    available["storm_surge"][advisory_level].append({
                        "province": province,
                        "file": str(shp_file.relative_to(base_path))
                    })
    
    return available
