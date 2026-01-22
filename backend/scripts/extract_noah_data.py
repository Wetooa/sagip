#!/usr/bin/env python3
"""Script to recursively extract all nested zip files in NOAH data directory."""
import os
import zipfile
from pathlib import Path

def extract_all_zips(root_dir: Path):
    """Recursively extract all zip files in the directory tree."""
    root_dir = Path(root_dir)
    extracted_count = 0
    
    # Find all zip files
    zip_files = list(root_dir.rglob("*.zip"))
    
    for zip_path in zip_files:
        try:
            # Extract to the same directory as the zip file
            extract_dir = zip_path.parent
            
            print(f"Extracting {zip_path.name} to {extract_dir}...")
            with zipfile.ZipFile(zip_path, 'r') as zip_ref:
                zip_ref.extractall(extract_dir)
            
            extracted_count += 1
            
            # Optionally remove the zip file after extraction
            # zip_path.unlink()
            
        except zipfile.BadZipFile:
            print(f"Warning: {zip_path} is not a valid zip file, skipping...")
        except Exception as e:
            print(f"Error extracting {zip_path}: {e}")
    
    print(f"\nExtracted {extracted_count} zip files.")
    return extracted_count

if __name__ == "__main__":
    noah_data_dir = Path(__file__).parent.parent / "data" / "noah"
    
    if not noah_data_dir.exists():
        print(f"Error: {noah_data_dir} does not exist!")
        exit(1)
    
    print(f"Extracting all zip files in {noah_data_dir}...")
    extract_all_zips(noah_data_dir)
    print("Done!")
