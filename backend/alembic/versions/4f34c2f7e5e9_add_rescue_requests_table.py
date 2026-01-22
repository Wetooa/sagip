"""Add rescue requests table

Revision ID: 4f34c2f7e5e9
Revises: 36b95d4c8a95
Create Date: 2026-01-22 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy import inspect
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = "4f34c2f7e5e9"
down_revision = "36b95d4c8a95"
branch_labels = None
depends_on = None


def upgrade() -> None:
    bind = op.get_bind()
    inspector = inspect(bind)

    rescue_status = postgresql.ENUM(
        "open",
        "in_progress",
        "resolved",
        "cancelled",
        name="rescuerequeststatus",
        create_type=False,
    )
    rescue_status.create(bind, checkfirst=True)

    rescue_urgency = postgresql.ENUM(
        "normal", "high", "critical", name="rescueurgency", create_type=False
    )
    rescue_urgency.create(bind, checkfirst=True)

    if "rescue_requests" in inspector.get_table_names():
        return

    op.create_table(
        "rescue_requests",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column(
            "citizen_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("citizens.id"),
            nullable=True,
        ),
        sa.Column("name", sa.String(), nullable=True),
        sa.Column("contact", sa.String(), nullable=True),
        sa.Column("household_size", sa.Integer(), nullable=True),
        sa.Column(
            "status",
            rescue_status,
            nullable=False,
            server_default=sa.text("'open'::rescuerequeststatus"),
        ),
        sa.Column(
            "urgency",
            rescue_urgency,
            nullable=False,
            server_default=sa.text("'normal'::rescueurgency"),
        ),
        sa.Column("latitude", sa.Float(), nullable=False),
        sa.Column("longitude", sa.Float(), nullable=False),
        sa.Column(
            "needs",
            postgresql.JSONB(astext_type=sa.Text()),
            nullable=False,
            server_default=sa.text("'{}'::jsonb"),
        ),
        sa.Column("note", sa.Text(), nullable=True),
        sa.Column("photo_url", sa.String(), nullable=True),
        sa.Column(
            "created_at", sa.DateTime(), nullable=False, server_default=sa.text("now()")
        ),
        sa.Column(
            "updated_at", sa.DateTime(), nullable=False, server_default=sa.text("now()")
        ),
    )
    op.create_index(
        "ix_rescue_requests_status_created_at",
        "rescue_requests",
        ["status", "created_at"],
        unique=False,
    )
    op.create_index(
        "ix_rescue_requests_location",
        "rescue_requests",
        ["latitude", "longitude"],
        unique=False,
    )
    op.create_index(
        "ix_rescue_requests_citizen_id",
        "rescue_requests",
        ["citizen_id"],
        unique=False,
    )


def downgrade() -> None:
    bind = op.get_bind()
    inspector = inspect(bind)

    if "rescue_requests" in inspector.get_table_names():
        existing_indexes = {
            ix["name"] for ix in inspector.get_indexes("rescue_requests")
        }
        if "ix_rescue_requests_citizen_id" in existing_indexes:
            op.drop_index("ix_rescue_requests_citizen_id", table_name="rescue_requests")
        if "ix_rescue_requests_location" in existing_indexes:
            op.drop_index("ix_rescue_requests_location", table_name="rescue_requests")
        if "ix_rescue_requests_status_created_at" in existing_indexes:
            op.drop_index("ix_rescue_requests_status_created_at", table_name="rescue_requests")
        op.drop_table("rescue_requests")

    rescue_status = postgresql.ENUM(name="rescuerequeststatus")
    rescue_urgency = postgresql.ENUM(name="rescueurgency")
    rescue_status.drop(bind, checkfirst=True)
    rescue_urgency.drop(bind, checkfirst=True)
