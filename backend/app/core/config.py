"""Configuration settings for the application."""

from pydantic_settings import BaseSettings
from pydantic import computed_field
from typing import Optional

class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # Supabase Database connection components
    # Using DB_ prefix to avoid conflicts with system environment variables (like USER)
    DB_USER: Optional[str] = None
    DB_PASSWORD: Optional[str] = None
    DB_HOST: Optional[str] = None
    DB_PORT: Optional[str] = "5432"
    DB_NAME: Optional[str] = None

    # Alternative: Direct DATABASE_URL (if provided, takes precedence)
    DATABASE_URL: Optional[str] = None

    # Database pool settings
    DB_POOL_SIZE: int = 5
    DB_MAX_OVERFLOW: int = 10

    # Environment
    ENV: Optional[str] = None

    @computed_field
    @property
    def database_url(self) -> str:
        """
        Construct or return the database URL.
        If DATABASE_URL is provided directly, use it.
        Otherwise, construct from individual components.

        Note: Supabase direct connections (db.*.supabase.co) are IPv6-only.
        For IPv4 compatibility, use the Connection Pooler (pooler.supabase.com).
        See IPV4_FIX.md for instructions.
        """
        if self.DATABASE_URL:
            return self.DATABASE_URL

        # Construct from individual components
        if not all([self.DB_USER, self.DB_PASSWORD, self.DB_HOST, self.DB_NAME]):
            raise ValueError(
                "Either DATABASE_URL must be provided, or all of DB_USER, DB_PASSWORD, DB_HOST, and DB_NAME must be set"
            )

        return f"postgresql+psycopg2://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}?sslmode=require"

    # Security settings
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # CORS settings
    CORS_ORIGINS: list[str] = ["http://localhost:3000", "http://localhost:3001"]

    # API settings
    API_PREFIX: str = "/api"
    PROJECT_NAME: str = "Project Disaster API"
    VERSION: str = "1.0.0"

    # NOAH hazard mapping settings
    NOAH_DATA_PATH: str = "data/noah"
    HAZARD_CACHE_SIZE: int = 100

    # AI models settings
    AI_MODELS_PATH: str = "data/ai-models"

    # OpenAI settings
    OPENAI_API_KEY: Optional[str] = None

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
