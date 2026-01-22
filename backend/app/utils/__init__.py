# Utility functions
from app.utils.hazard_processing import (
    process_shapefile,
    find_shapefile_path,
    get_available_maps,
    fix_polygon_geometry,
    normalize_properties,
    load_geojson_file,
)
from app.utils.hazard_cache import (
    get_cached_geojson,
    set_cached_geojson,
    clear_cache,
    get_cache_size,
    get_cache_info,
)

__all__ = [
    "process_shapefile",
    "find_shapefile_path",
    "get_available_maps",
    "fix_polygon_geometry",
    "normalize_properties",
    "load_geojson_file",
    "get_cached_geojson",
    "set_cached_geojson",
    "clear_cache",
    "get_cache_size",
    "get_cache_info",
]
