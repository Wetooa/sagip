"""Add census improvements - government_id, birth_date, has_vulnerable_family_member, and family_members table

Revision ID: 9a831c19d7a2
Revises: 36b95d4c8a95
Create Date: 2026-01-22 17:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '9a831c19d7a2'
down_revision = '36b95d4c8a95'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Add new columns to census_data table
    op.add_column('census_data', sa.Column('government_id', sa.String(), nullable=True))
    op.add_column('census_data', sa.Column('birth_date', sa.Date(), nullable=True))
    op.add_column('census_data', sa.Column('has_vulnerable_family_member', sa.Boolean(), nullable=False, server_default='false'))
    
    # Create family_members table
    op.create_table(
        'family_members',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('census_data_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('full_name', sa.String(), nullable=False),
        sa.Column('relationship', sa.String(), nullable=False),
        sa.Column('age', sa.Integer(), nullable=True),
        sa.Column('government_id', sa.String(), nullable=True),
        sa.Column('is_vulnerable', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('vulnerability_type', sa.String(), nullable=True),
        sa.Column('medical_conditions', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.text('now()')),
        sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.text('now()')),
        sa.ForeignKeyConstraint(['census_data_id'], ['census_data.id'], ondelete='CASCADE'),
    )
    
    # Create indexes for better query performance
    op.create_index('ix_family_members_census_data_id', 'family_members', ['census_data_id'])
    op.create_index('ix_family_members_is_vulnerable', 'family_members', ['is_vulnerable'])


def downgrade() -> None:
    # Drop indexes
    op.drop_index('ix_family_members_is_vulnerable', table_name='family_members')
    op.drop_index('ix_family_members_census_data_id', table_name='family_members')
    
    # Drop family_members table
    op.drop_table('family_members')
    
    # Remove columns from census_data table
    op.drop_column('census_data', 'has_vulnerable_family_member')
    op.drop_column('census_data', 'birth_date')
    op.drop_column('census_data', 'government_id')
