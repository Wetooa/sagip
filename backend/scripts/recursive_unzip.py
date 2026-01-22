#!/usr/bin/env python3
"""
Recursively unzip all zip files in a directory, including nested zips.

This script:
1. Finds all .zip files in the target directory (recursively)
2. Extracts each zip file
3. Continues recursively until no more zip files are found
4. Handles nested zip structures

Usage:
    python scripts/recursive_unzip.py --path "data/noah"
    python scripts/recursive_unzip.py --path "data/noah" --delete-zips
"""
import argparse
import sys
import zipfile
from pathlib import Path
import logging
import shutil

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


def unzip_file(zip_path: Path, extract_to: Path, delete_after: bool = False) -> bool:
    """
    Unzip a zip file to the specified directory.
    
    Args:
        zip_path: Path to the zip file
        extract_to: Directory to extract to (will create subdirectory with zip name if needed)
        delete_after: If True, delete the zip file after extraction
        
    Returns:
        True if extraction was successful, False otherwise
    """
    try:
        # Create extraction directory based on zip file name (without .zip extension)
        extract_dir = extract_to / zip_path.stem
        
        # Skip if already extracted (directory exists and is not empty)
        if extract_dir.exists() and any(extract_dir.iterdir()):
            logger.debug(f"Skipping {zip_path.name} (already extracted)")
            return True
        
        logger.info(f"Extracting {zip_path.name}...")
        
        # Create extraction directory
        extract_dir.mkdir(parents=True, exist_ok=True)
        
        with zipfile.ZipFile(zip_path, 'r') as zip_ref:
            zip_ref.extractall(extract_dir)
        
        logger.info(f"✓ Extracted {zip_path.name} -> {extract_dir.name}/")
        
        if delete_after:
            zip_path.unlink()
            logger.debug(f"Deleted {zip_path.name}")
        
        return True
        
    except Exception as e:
        logger.error(f"✗ Error extracting {zip_path.name}: {e}")
        return False


def find_all_zips(directory: Path) -> list[Path]:
    """
    Find all zip files in a directory recursively.
    
    Args:
        directory: Directory to search
        
    Returns:
        List of Path objects for all zip files found
    """
    zip_files = list(directory.rglob("*.zip"))
    return zip_files


def recursive_unzip(base_path: Path, delete_zips: bool = False, max_iterations: int = 10) -> tuple[int, int]:
    """
    Recursively unzip all zip files, including nested ones.
    
    This function continues extracting zip files until no more are found.
    It handles nested zip structures by iterating until no new zips appear.
    
    Args:
        base_path: Base directory containing zip files
        delete_zips: If True, delete zip files after extraction
        max_iterations: Maximum number of iterations to prevent infinite loops
        
    Returns:
        Tuple of (total_extracted, total_failed)
    """
    base_path = Path(base_path)
    
    if not base_path.exists():
        logger.error(f"Directory not found: {base_path}")
        return (0, 0)
    
    total_extracted = 0
    total_failed = 0
    iteration = 0
    
    while iteration < max_iterations:
        iteration += 1
        logger.info(f"Iteration {iteration}: Searching for zip files...")
        
        # Find all zip files
        zip_files = find_all_zips(base_path)
        
        if not zip_files:
            logger.info("No more zip files found. Extraction complete.")
            break
        
        logger.info(f"Found {len(zip_files)} zip file(s) to extract")
        
        iteration_extracted = 0
        iteration_failed = 0
        
        for zip_path in zip_files:
            # Extract to the same directory as the zip file
            extract_to = zip_path.parent
            
            if unzip_file(zip_path, extract_to, delete_after=delete_zips):
                iteration_extracted += 1
            else:
                iteration_failed += 1
        
        total_extracted += iteration_extracted
        total_failed += iteration_failed
        
        logger.info(f"Iteration {iteration} complete: {iteration_extracted} extracted, {iteration_failed} failed")
        
        # If we deleted zips and extracted some, continue to next iteration
        # Otherwise, we're done
        if iteration_extracted == 0:
            logger.info("No new files extracted. Stopping.")
            break
    
    if iteration >= max_iterations:
        logger.warning(f"Reached maximum iterations ({max_iterations}). Some zip files may remain.")
    
    return (total_extracted, total_failed)


def main():
    """Main entry point for the recursive unzip script."""
    parser = argparse.ArgumentParser(
        description="Recursively unzip all zip files in a directory, including nested zips"
    )
    parser.add_argument(
        '--path',
        type=str,
        required=True,
        help='Directory path containing zip files (relative to backend directory or absolute)'
    )
    parser.add_argument(
        '--delete-zips',
        action='store_true',
        help='Delete zip files after extraction'
    )
    parser.add_argument(
        '--max-iterations',
        type=int,
        default=10,
        help='Maximum number of extraction iterations (default: 10)'
    )
    
    args = parser.parse_args()
    
    # Determine base path
    if Path(args.path).is_absolute():
        base_path = Path(args.path)
    else:
        # Make relative to backend directory
        backend_dir = Path(__file__).parent.parent
        base_path = backend_dir / args.path
    
    logger.info(f"Recursively unzipping files in: {base_path}")
    if args.delete_zips:
        logger.info("Will delete zip files after extraction")
    
    # Recursively unzip
    total_extracted, total_failed = recursive_unzip(
        base_path=base_path,
        delete_zips=args.delete_zips,
        max_iterations=args.max_iterations
    )
    
    # Summary
    logger.info("=" * 60)
    logger.info(f"Recursive extraction complete: {total_extracted} total extractions, {total_failed} failed")
    
    if total_failed > 0:
        sys.exit(1)
    else:
        sys.exit(0)


if __name__ == "__main__":
    main()
