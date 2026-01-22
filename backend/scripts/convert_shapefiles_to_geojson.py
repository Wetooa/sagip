#!/usr/bin/env python3
"""
Pre-convert NOAH hazard map shapefiles to GeoJSON format.

This script scans the NOAH data directory for all shapefiles and converts them
to GeoJSON format, saving the results alongside the original shapefiles with
a .geojson extension. This pre-conversion speeds up API responses by avoiding
on-demand geopandas processing.

Usage:
    python scripts/convert_shapefiles_to_geojson.py
    python scripts/convert_shapefiles_to_geojson.py --force
    python scripts/convert_shapefiles_to_geojson.py --path "data/noah/NOAH Downloads/Flood/5yr"
"""
import argparse
import sys
from pathlib import Path
import json
import logging

# Add parent directory to path to import app modules
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.utils.hazard_processing import process_shapefile
from app.core.config import settings

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


def convert_shapefile_to_geojson(
    shapefile_path: Path,
    force: bool = False
) -> bool:
    """
    Convert a single shapefile to GeoJSON format.
    
    Args:
        shapefile_path: Path to the shapefile (.shp)
        force: If True, overwrite existing GeoJSON files
        
    Returns:
        True if conversion was successful, False otherwise
    """
    geojson_path = shapefile_path.with_suffix('.geojson')
    
    # Skip if GeoJSON already exists and not forcing
    if geojson_path.exists() and not force:
        logger.info(f"Skipping {shapefile_path.name} (GeoJSON already exists)")
        return True
    
    try:
        logger.info(f"Converting {shapefile_path.name}...")
        
        # Process shapefile to GeoJSON
        geojson = process_shapefile(shapefile_path, normalize=True, fix_geometry=True)
        
        # Save GeoJSON file
        with open(geojson_path, 'w', encoding='utf-8') as f:
            json.dump(geojson, f, indent=2, ensure_ascii=False)
        
        feature_count = len(geojson.get('features', []))
        logger.info(f"✓ Converted {shapefile_path.name} ({feature_count} features) -> {geojson_path.name}")
        return True
        
    except Exception as e:
        logger.error(f"✗ Error converting {shapefile_path.name}: {e}")
        return False


def convert_all_shapefiles(
    base_path: Path,
    force: bool = False,
    target_path: Path = None
) -> tuple[int, int]:
    """
    Convert all shapefiles in the NOAH data directory to GeoJSON.
    
    Args:
        base_path: Base path to NOAH data directory
        force: If True, overwrite existing GeoJSON files
        target_path: Optional specific directory to convert (instead of all)
        
    Returns:
        Tuple of (successful_count, failed_count)
    """
    base_path = Path(base_path)
    
    if not base_path.exists():
        logger.error(f"NOAH data directory not found: {base_path}")
        return (0, 0)
    
    # Find all shapefiles
    if target_path:
        search_path = Path(target_path)
        if not search_path.exists():
            logger.error(f"Target path not found: {search_path}")
            return (0, 0)
        shapefiles = list(search_path.rglob("*.shp"))
    else:
        shapefiles = list(base_path.rglob("*.shp"))
    
    if not shapefiles:
        logger.warning(f"No shapefiles found in {base_path}")
        return (0, 0)
    
    logger.info(f"Found {len(shapefiles)} shapefile(s) to convert")
    
    successful = 0
    failed = 0
    
    for shapefile_path in shapefiles:
        if convert_shapefile_to_geojson(shapefile_path, force=force):
            successful += 1
        else:
            failed += 1
    
    return (successful, failed)


def main():
    """Main entry point for the conversion script."""
    parser = argparse.ArgumentParser(
        description="Pre-convert NOAH hazard map shapefiles to GeoJSON format"
    )
    parser.add_argument(
        '--force',
        action='store_true',
        help='Force re-conversion of existing GeoJSON files'
    )
    parser.add_argument(
        '--path',
        type=str,
        help='Specific directory path to convert (relative to NOAH data directory)'
    )
    parser.add_argument(
        '--data-path',
        type=str,
        default=None,
        help='Override NOAH data path (defaults to settings.NOAH_DATA_PATH)'
    )
    
    args = parser.parse_args()
    
    # Determine base path
    if args.data_path:
        base_path = Path(args.data_path)
    else:
        # Use settings or default
        data_path = Path(settings.NOAH_DATA_PATH)
        if not data_path.is_absolute():
            # Make relative to backend directory
            backend_dir = Path(__file__).parent.parent
            base_path = backend_dir / data_path
        else:
            base_path = data_path
    
    # Determine target path if specified
    target_path = None
    if args.path:
        target_path = base_path / args.path
    
    logger.info(f"Starting conversion in: {base_path}")
    if target_path:
        logger.info(f"Target directory: {target_path}")
    if args.force:
        logger.info("Force mode: Will overwrite existing GeoJSON files")
    
    # Convert all shapefiles
    successful, failed = convert_all_shapefiles(
        base_path=base_path,
        force=args.force,
        target_path=target_path
    )
    
    # Summary
    total = successful + failed
    logger.info("=" * 60)
    logger.info(f"Conversion complete: {successful}/{total} successful, {failed} failed")
    
    if failed > 0:
        sys.exit(1)
    else:
        sys.exit(0)


if __name__ == "__main__":
    main()
