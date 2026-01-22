"""Utility functions for loading and using XGBoost models."""
import logging
from pathlib import Path
import xgboost as xgb

logger = logging.getLogger(__name__)

# In-memory cache for loaded models
_model_cache: dict[str, xgb.Booster] = {}


def load_xgboost_model(model_path: Path) -> xgb.Booster:
    """
    Load an XGBoost model from a JSON file.
    
    Args:
        model_path: Path to the XGBoost model JSON file
        
    Returns:
        Loaded XGBoost Booster model
        
    Raises:
        FileNotFoundError: If the model file doesn't exist
        ValueError: If the model file is invalid or cannot be loaded
    """
    model_path_str = str(model_path.resolve())
    
    # Check cache first
    if model_path_str in _model_cache:
        logger.debug(f"Using cached model: {model_path_str}")
        return _model_cache[model_path_str]
    
    # Validate file exists
    if not model_path.exists():
        raise FileNotFoundError(f"Model file not found: {model_path}")
    
    try:
        # Load XGBoost model from JSON
        model = xgb.Booster()
        model.load_model(str(model_path))
        
        # Cache the model
        _model_cache[model_path_str] = model
        logger.info(f"Successfully loaded and cached model: {model_path_str}")
        
        return model
    except Exception as e:
        logger.error(f"Error loading model from {model_path}: {str(e)}")
        raise ValueError(f"Failed to load model: {str(e)}") from e


def predict_with_model(model: xgb.Booster, features: list[float]) -> float:
    """
    Run prediction on a feature array using an XGBoost model.
    
    Args:
        model: Loaded XGBoost Booster model
        features: List of feature values in the correct order
        
    Returns:
        Predicted numerical value
        
    Raises:
        ValueError: If the feature array length doesn't match expected input size
    """
    try:
        # Convert to DMatrix format expected by XGBoost
        dmatrix = xgb.DMatrix([features])
        
        # Run prediction
        prediction = model.predict(dmatrix)
        
        # Return the first (and only) prediction value
        return float(prediction[0])
    except Exception as e:
        logger.error(f"Error during prediction: {str(e)}")
        raise ValueError(f"Prediction failed: {str(e)}") from e


def get_model_path(model_name: str, models_dir: Path) -> Path:
    """
    Get the full path to a model file.
    
    Args:
        model_name: Name of the model file (e.g., "Leptospirosis_model_final.json")
        models_dir: Directory containing the model files
        
    Returns:
        Path to the model file
    """
    return models_dir / model_name


def clear_model_cache():
    """Clear the in-memory model cache. Useful for testing or reloading models."""
    global _model_cache
    _model_cache.clear()
    logger.info("Model cache cleared")
