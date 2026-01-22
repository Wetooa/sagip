"""Health prediction model schemas."""
from pydantic import BaseModel, Field


class HealthPredictionInput(BaseModel):
    """Schema for health prediction model input features."""
    precipitation: float = Field(..., ge=0.0, le=299.99, description="Precipitation (0.00 - 299.99)")
    wind: float = Field(..., ge=0.0, le=20.0, description="Wind (0.00 - 20.00)")
    temperature: float = Field(..., ge=20.0, le=35.0, description="Temperature (20.00 - 35.00)")
    humidity: float = Field(..., ge=60.0, le=100.0, description="Humidity (60.00 - 100.00)")
    soil_moisture: float = Field(..., ge=0.0, le=1.0, description="Soil Moisture (0.00 - 1.00)")
    elevation: float = Field(..., ge=0.08, le=1999.91, description="Elevation (0.08 - 1999.91)")
    precipitation_rolling_mean_3w: float = Field(
        ..., 
        ge=5.05, 
        le=293.29, 
        description="Precipitation Rolling Mean 3W (5.05 - 293.29)"
    )
    temperature_rolling_mean_3w: float = Field(
        ..., 
        ge=20.37, 
        le=34.58, 
        description="Temperature Rolling Mean 3W (20.37 - 34.58)"
    )
    sin_week: float = Field(..., ge=-1.0, le=1.0, description="sin(week)")
    cos_week: float = Field(..., ge=-1.0, le=1.0, description="cos(week)")
    leptospirosis_lag_1w: float = Field(..., ge=0.0, le=49.0, description="Leptospirosis Lag 1W (0.00 - 49.00)")
    dengue_chikungunya_lag_1w: float = Field(..., ge=0.0, le=199.0, description="Dengue Chikungunya Lag 1W (0.00 - 199.00)")
    acute_bloody_diarrhea_cholera_typhoid_lag_1w: float = Field(
        ..., 
        ge=0.0, 
        le=99.0, 
        description="Acute Bloody Diarrhea Cholera Typhoid Lag 1W (0.00 - 99.00)"
    )
    population_density: float = Field(..., ge=50.01, le=499.97, description="Population Density (50.01 - 499.97)")
    water_access_index: float = Field(..., ge=0.5, le=1.0, description="Water Access Index (0.50 - 1.00)")
    spatial_lag: float = Field(..., ge=0.01, le=99.99, description="Spatial Lag (0.01 - 99.99)")


class HealthPredictionResponse(BaseModel):
    """Schema for health prediction model response."""
    prediction: float = Field(..., description="Predicted numerical value")
