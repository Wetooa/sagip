#!/usr/bin/env python3
"""
Unzip and convert all NOAH hazard map data to GeoJSON format.

This script:
1. Unzips all zip files in the NOAH data directory
2. Finds all shapefiles (including in unzipped directories)
3. Converts each shapefile to GeoJSON format
4. Supports Flood, Storm Surge, and Landslide data

Usage:
    python scripts/convert_noah_to_geojson.py
    python scripts/convert_noah_to_geojson.py --force
    python scripts/convert_noah_to_geojson.py --unzip-only
"""
import argparse
import sys
import zipfile
from pathlib import Path
import json
import logging
import shutil

# Add parent directory to path to import app modules
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.utils.hazard_processing import process_shapefile
from app.core.config import settings

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


def unzip_file(zip_path: Path, extract_to: Path, force: bool = False) -> bool:
    """
    Unzip a zip file to the specified directory.
    
    Args:
        zip_path: Path to the zip file
        extract_to: Directory to extract to (will create subdirectory with zip name)
        force: If True, overwrite existing extracted directories
        
    Returns:
        True if extraction was successful, False otherwise
    """
    try:
        # Create extraction directory based on zip file name (without .zip extension)
        extract_dir = extract_to / zip_path.stem
        
        # Skip if already extracted and not forcing
        if extract_dir.exists() and not force:
            logger.info(f"Skipping {zip_path.name} (already extracted)")
            return True
        
        # Remove existing directory if forcing
        if extract_dir.exists() and force:
            logger.info(f"Removing existing extraction: {extract_dir}")
            shutil.rmtree(extract_dir)
        
        logger.info(f"Extracting {zip_path.name}...")
        
        with zipfile.ZipFile(zip_path, 'r') as zip_ref:
            zip_ref.extractall(extract_to)
        
        logger.info(f"✓ Extracted {zip_path.name} -> {extract_dir}")
        return True
        
    except Exception as e:
        logger.error(f"✗ Error extracting {zip_path.name}: {e}")
        return False


def unzip_all_files(base_path: Path, force: bool = False) -> tuple[int, int]:
    """
    Unzip all zip files in the NOAH data directory.
    
    Args:
        base_path: Base path to NOAH data directory
        force: If True, re-extract existing directories
        
    Returns:
        Tuple of (successful_count, failed_count)
    """
    base_path = Path(base_path)
    
    if not base_path.exists():
        logger.error(f"NOAH data directory not found: {base_path}")
        return (0, 0)
    
    # Find all zip files recursively
    zip_files = list(base_path.rglob("*.zip"))
    
    if not zip_files:
        logger.info("No zip files found to extract")
        return (0, 0)
    
    logger.info(f"Found {len(zip_files)} zip file(s) to extract")
    
    successful = 0
    failed = 0
    
    for zip_path in zip_files:
        # Extract to the same directory as the zip file
        extract_to = zip_path.parent
        if unzip_file(zip_path, extract_to, force=force):
            successful += 1
        else:
            failed += 1
    
    return (successful, failed)


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
        logger.debug(f"Skipping {shapefile_path.name} (GeoJSON already exists)")
        return True
    
    try:
        logger.info(f"Converting {shapefile_path.name}...")
        
        # Process shapefile to GeoJSON
        geojson = process_shapefile(
            shapefile_path, 
            normalize=True, 
            fix_geometry=True,
            use_preconverted=False  # Force conversion
        )
        
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
    force: bool = False
) -> tuple[int, int]:
    """
    Convert all shapefiles in the NOAH data directory to GeoJSON.
    
    Args:
        base_path: Base path to NOAH data directory
        force: If True, overwrite existing GeoJSON files
        
    Returns:
        Tuple of (successful_count, failed_count)
    """
    base_path = Path(base_path)
    
    if not base_path.exists():
        logger.error(f"NOAH data directory not found: {base_path}")
        return (0, 0)
    
    # Find all shapefiles recursively
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
        description="Unzip and convert all NOAH hazard map data to GeoJSON format"
    )
    parser.add_argument(
        '--force',
        action='store_true',
        help='Force re-extraction and re-conversion of existing files'
    )
    parser.add_argument(
        '--unzip-only',
        action='store_true',
        help='Only unzip files, do not convert to GeoJSON'
    )
    parser.add_argument(
        '--convert-only',
        action='store_true',
        help='Only convert shapefiles, do not unzip'
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
    
    logger.info(f"NOAH data directory: {base_path}")
    if args.force:
        logger.info("Force mode: Will overwrite existing files")
    
    # Step 1: Unzip files (unless convert-only)
    if not args.convert_only:
        logger.info("=" * 60)
        logger.info("Step 1: Unzipping zip files...")
        logger.info("=" * 60)
        unzip_successful, unzip_failed = unzip_all_files(base_path, force=args.force)
        logger.info(f"Unzip complete: {unzip_successful} successful, {unzip_failed} failed")
        
        if args.unzip_only:
            logger.info("Unzip-only mode: Skipping conversion")
            sys.exit(0 if unzip_failed == 0 else 1)
    
    # Step 2: Convert shapefiles (unless unzip-only)
    if not args.unzip_only:
        logger.info("=" * 60)
        logger.info("Step 2: Converting shapefiles to GeoJSON...")
        logger.info("=" * 60)
        convert_successful, convert_failed = convert_all_shapefiles(
            base_path=base_path,
            force=args.force
        )
        logger.info(f"Conversion complete: {convert_successful} successful, {convert_failed} failed")
        
        # Summary
        total = convert_successful + convert_failed
        logger.info("=" * 60)
        logger.info(f"Total: {convert_successful}/{total} shapefiles converted successfully")
        
        if convert_failed > 0:
            sys.exit(1)
        else:
            sys.exit(0)
    else:
        sys.exit(0)


if __name__ == "__main__":
    main()
