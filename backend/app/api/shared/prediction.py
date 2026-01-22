"""Health prediction model API endpoints."""
from fastapi import APIRouter, HTTPException, status
from pathlib import Path
import logging

from app.core.config import settings
from app.schemas.prediction import HealthPredictionInput, HealthPredictionResponse
from app.utils.model_loader import load_xgboost_model, predict_with_model, get_model_path

logger = logging.getLogger(__name__)

router = APIRouter()


def get_models_directory() -> Path:
    """
    Get the absolute path to AI models directory.
    
    Returns:
        Absolute Path object pointing to the AI models directory
    """
    models_path = Path(settings.AI_MODELS_PATH)
    if not models_path.is_absolute():
        # Assume backend directory is parent of app directory
        backend_dir = Path(__file__).parent.parent.parent.parent
        models_path = backend_dir / models_path
    return models_path


def convert_input_to_features(input_data: HealthPredictionInput) -> list[float]:
    """
    Convert HealthPredictionInput to feature array in the correct order.
    
    The feature order must match the model's expected input:
    ["Precipitation","Wind","Temperature","Humidity","Soil_Moisture","Elevation",
     "Precipitation_RollingMean_3W","Temperature_RollingMean_3W","sin_week","cos_week",
     "Leptospirosis_Lag_1W","Dengue_Chikungunya_Lag_1W",
     "Acute_Bloody_Diarrhea_Cholera_Typhoid_Lag_1W","Population_Density",
     "Water_Access_Index","Spatial_Lag"]
    
    Args:
        input_data: HealthPredictionInput schema instance
        
    Returns:
        List of feature values in the correct order
    """
    return [
        input_data.precipitation,
        input_data.wind,
        input_data.temperature,
        input_data.humidity,
        input_data.soil_moisture,
        input_data.elevation,
        input_data.precipitation_rolling_mean_3w,
        input_data.temperature_rolling_mean_3w,
        input_data.sin_week,
        input_data.cos_week,
        input_data.leptospirosis_lag_1w,
        input_data.dengue_chikungunya_lag_1w,
        input_data.acute_bloody_diarrhea_cholera_typhoid_lag_1w,
        input_data.population_density,
        input_data.water_access_index,
        input_data.spatial_lag,
    ]


@router.post("/leptospirosis", response_model=HealthPredictionResponse, status_code=status.HTTP_200_OK)
async def predict_leptospirosis(input_data: HealthPredictionInput):
    """
    Predict Leptospirosis cases based on input features.
    
    This endpoint uses the Leptospirosis XGBoost model to predict the number
    of Leptospirosis cases based on environmental and epidemiological features.
    
    Args:
        input_data: HealthPredictionInput with all 16 required features
        
    Returns:
        HealthPredictionResponse with the predicted numerical value
        
    Raises:
        HTTPException 500: If model loading or prediction fails
    """
    try:
        models_dir = get_models_directory()
        model_path = get_model_path("Leptospirosis_model_final.json", models_dir)
        
        # Load model (cached after first load)
        model = load_xgboost_model(model_path)
        
        # Convert input to feature array
        features = convert_input_to_features(input_data)
        
        # Run prediction
        prediction = predict_with_model(model, features)
        
        return HealthPredictionResponse(prediction=prediction)
        
    except FileNotFoundError as e:
        logger.error(f"Model file not found: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Leptospirosis model file not found: {str(e)}"
        )
    except ValueError as e:
        logger.error(f"Prediction error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Prediction failed: {str(e)}"
        )
    except Exception as e:
        logger.error(f"Unexpected error in leptospirosis prediction: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )


@router.post("/dengue-chikungunya", response_model=HealthPredictionResponse, status_code=status.HTTP_200_OK)
async def predict_dengue_chikungunya(input_data: HealthPredictionInput):
    """
    Predict Dengue/Chikungunya cases based on input features.
    
    This endpoint uses the Dengue/Chikungunya XGBoost model to predict the number
    of Dengue and Chikungunya cases based on environmental and epidemiological features.
    
    Args:
        input_data: HealthPredictionInput with all 16 required features
        
    Returns:
        HealthPredictionResponse with the predicted numerical value
        
    Raises:
        HTTPException 500: If model loading or prediction fails
    """
    try:
        models_dir = get_models_directory()
        model_path = get_model_path("Dengue_Chikungunya_model_final.json", models_dir)
        
        # Load model (cached after first load)
        model = load_xgboost_model(model_path)
        
        # Convert input to feature array
        features = convert_input_to_features(input_data)
        
        # Run prediction
        prediction = predict_with_model(model, features)
        
        return HealthPredictionResponse(prediction=prediction)
        
    except FileNotFoundError as e:
        logger.error(f"Model file not found: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Dengue/Chikungunya model file not found: {str(e)}"
        )
    except ValueError as e:
        logger.error(f"Prediction error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Prediction failed: {str(e)}"
        )
    except Exception as e:
        logger.error(f"Unexpected error in dengue/chikungunya prediction: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )


@router.post("/acute-bloody-diarrhea", response_model=HealthPredictionResponse, status_code=status.HTTP_200_OK)
async def predict_acute_bloody_diarrhea(input_data: HealthPredictionInput):
    """
    Predict Acute Bloody Diarrhea/Cholera/Typhoid cases based on input features.
    
    This endpoint uses the Acute Bloody Diarrhea/Cholera/Typhoid XGBoost model
    to predict the number of cases based on environmental and epidemiological features.
    
    Args:
        input_data: HealthPredictionInput with all 16 required features
        
    Returns:
        HealthPredictionResponse with the predicted numerical value
        
    Raises:
        HTTPException 500: If model loading or prediction fails
    """
    try:
        models_dir = get_models_directory()
        model_path = get_model_path("Acute_Bloody_Diarrhea_Cholera_Typhoid_model_final.json", models_dir)
        
        # Load model (cached after first load)
        model = load_xgboost_model(model_path)
        
        # Convert input to feature array
        features = convert_input_to_features(input_data)
        
        # Run prediction
        prediction = predict_with_model(model, features)
        
        return HealthPredictionResponse(prediction=prediction)
        
    except FileNotFoundError as e:
        logger.error(f"Model file not found: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Acute Bloody Diarrhea/Cholera/Typhoid model file not found: {str(e)}"
        )
    except ValueError as e:
        logger.error(f"Prediction error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Prediction failed: {str(e)}"
        )
    except Exception as e:
        logger.error(f"Unexpected error in acute bloody diarrhea prediction: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )
