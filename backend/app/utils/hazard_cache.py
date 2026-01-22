"""
Caching utilities for processed hazard map GeoJSON.

This module provides an in-memory cache for processed GeoJSON FeatureCollections
to avoid re-processing shapefiles on every API request. The cache stores
pre-converted or on-demand processed GeoJSON data.

Cache Strategy:
- Cache key format: {hazard_type}_{period/advisory}_{province}
  Examples: "flood_5yr_cebu", "storm_surge_1_cebu"
- Cache is in-memory only (cleared on application restart)
- No automatic eviction (cache grows until application restart)
- Cache stores the final processed GeoJSON (after geometry fixing and normalization)

Cache Lifecycle:
1. On API request, check cache first
2. If cache hit, return cached GeoJSON immediately
3. If cache miss, process shapefile (or load pre-converted GeoJSON)
4. Store result in cache for future requests
5. Cache persists for application lifetime

Note:
The cache size is unbounded. For production use with many provinces/periods,
consider implementing LRU eviction or size limits.
"""
from functools import lru_cache
from typing import Dict, Any, Optional
from pathlib import Path
import hashlib
import json

# Global cache dictionary for processed GeoJSON
# Key format: {hazard_type}_{period/advisory}_{province}
# Example keys: "flood_5yr_cebu", "storm_surge_1_palawan"
_cache: Dict[str, Dict[str, Any]] = {}


def _make_cache_key(hazard_type: str, period_or_advisory: str, province: Optional[str] = None) -> str:
    """
    Create a cache key from hazard parameters.
    
    The cache key uniquely identifies a processed GeoJSON based on its
    hazard type, period/advisory level, and province. Keys are normalized
    to lowercase with underscores.
    
    Args:
        hazard_type: Type of hazard - 'flood' or 'storm_surge'
        period_or_advisory: 
            - For flood: Return period (e.g., '5yr', '25yr', '100yr')
            - For storm surge: Advisory level (e.g., '1', '2', '3', '4')
        province: Optional province name (e.g., 'Cebu', 'Palawan')
        
    Returns:
        Cache key string in format: {hazard_type}_{period/advisory}_{province}
        Examples:
        - "flood_5yr_cebu"
        - "storm_surge_1_cebu"
        - "flood_25yr" (if province is None)
        
    Note:
        Province names are normalized to lowercase and spaces replaced with underscores.
    """
    key_parts = [hazard_type, period_or_advisory]
    if province:
        key_parts.append(province.lower().replace(" ", "_"))
    return "_".join(key_parts)


def get_cached_geojson(
    hazard_type: str,
    period_or_advisory: str,
    province: Optional[str] = None
) -> Optional[Dict[str, Any]]:
    """
    Get cached GeoJSON if available.
    
    Retrieves a previously cached GeoJSON FeatureCollection from the in-memory
    cache. Returns None if not found (cache miss).
    
    Args:
        hazard_type: Type of hazard - 'flood' or 'storm_surge'
        period_or_advisory: Return period (flood) or advisory level (storm surge)
        province: Optional province name
        
    Returns:
        Cached GeoJSON FeatureCollection dictionary if found, None otherwise.
        The returned GeoJSON is already processed (geometry fixed, properties normalized).
        
    Example:
        >>> geojson = get_cached_geojson("flood", "5yr", "Cebu")
        >>> if geojson:
        ...     print(f"Cache hit: {len(geojson['features'])} features")
        ... else:
        ...     print("Cache miss")
    """
    cache_key = _make_cache_key(hazard_type, period_or_advisory, province)
    return _cache.get(cache_key)


def set_cached_geojson(
    hazard_type: str,
    period_or_advisory: str,
    geojson: Dict[str, Any],
    province: Optional[str] = None
) -> None:
    """
    Cache processed GeoJSON.
    
    Stores a processed GeoJSON FeatureCollection in the in-memory cache for
    future requests. The GeoJSON should already be processed (geometry fixed,
    properties normalized) before caching.
    
    Args:
        hazard_type: Type of hazard - 'flood' or 'storm_surge'
        period_or_advisory: Return period (flood) or advisory level (storm surge)
        geojson: GeoJSON FeatureCollection dictionary to cache. Should have
                structure: {"type": "FeatureCollection", "features": [...]}
        province: Optional province name
        
    Note:
        The cache key is automatically generated from the parameters.
        If a value already exists for the key, it will be overwritten.
        
    Example:
        >>> geojson = {"type": "FeatureCollection", "features": [...]}
        >>> set_cached_geojson("flood", "5yr", geojson, "Cebu")
        >>> # Now future requests for flood/5yr/Cebu will use cached data
    """
    cache_key = _make_cache_key(hazard_type, period_or_advisory, province)
    _cache[cache_key] = geojson


def clear_cache() -> None:
    """
    Clear all cached GeoJSON data.
    
    Removes all entries from the in-memory cache. Useful for testing or
    when you need to force re-processing of all shapefiles.
    
    Note:
        This operation cannot be undone. All cached data will be lost
        and will need to be re-processed on next request.
    """
    global _cache
    _cache.clear()


def get_cache_size() -> int:
    """
    Get the number of items in cache.
    
    Returns:
        Integer count of cached GeoJSON entries
        
    Example:
        >>> size = get_cache_size()
        >>> print(f"Cache contains {size} entries")
    """
    return len(_cache)


def get_cache_info() -> Dict[str, Any]:
    """
    Get cache statistics and information.
    
    Returns a dictionary with cache metadata including size and all cache keys.
    Useful for debugging and monitoring cache usage.
    
    Returns:
        Dictionary with structure:
        {
            "size": int,  # Number of cached entries
            "keys": [str, ...]  # List of all cache keys
        }
        
    Example:
        >>> info = get_cache_info()
        >>> print(f"Cache size: {info['size']}")
        >>> print(f"Cache keys: {info['keys']}")
        # Output:
        # Cache size: 3
        # Cache keys: ['flood_5yr_cebu', 'flood_25yr_cebu', 'storm_surge_1_cebu']
    """
    return {
        "size": len(_cache),
        "keys": list(_cache.keys())
    }
