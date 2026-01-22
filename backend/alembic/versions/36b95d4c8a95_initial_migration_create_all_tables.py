"""Initial migration - create all tables

Revision ID: 36b95d4c8a95
Revises: 
Create Date: 2026-01-22 16:54:45.985877

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# Import all models to ensure they're registered with Base.metadata
from app.core.database import Base
from app.models import *  # noqa: F401, F403

# revision identifiers, used by Alembic.
revision = '36b95d4c8a95'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create all tables using SQLAlchemy metadata
    # This ensures proper ordering and foreign key handling
    bind = op.get_bind()
    Base.metadata.create_all(bind=bind, checkfirst=True)


def downgrade() -> None:
    # Drop all tables in reverse dependency order
    bind = op.get_bind()
    Base.metadata.drop_all(bind=bind, checkfirst=True)
