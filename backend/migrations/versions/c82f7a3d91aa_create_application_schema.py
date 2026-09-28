"""create application schema

Revision ID: c82f7a3d91aa
Revises: b204064ecabe
"""

from alembic import op
import sqlalchemy as sa


revision = "c82f7a3d91aa"
down_revision = "b204064ecabe"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("email", sa.String(), nullable=False, unique=True),
        sa.Column("hashed_password", sa.String(), nullable=False),
    )
    op.create_index("ix_users_email", "users", ["email"])
    op.create_table(
        "decks",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("name", sa.String(), nullable=False),
        sa.Column("description", sa.String(), nullable=True),
        sa.Column("owner_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False),
    )
    op.create_table(
        "cards",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("front", sa.String(), nullable=False),
        sa.Column("back", sa.String(), nullable=False),
        sa.Column("deck_id", sa.Integer(), sa.ForeignKey("decks.id"), nullable=False),
    )
    op.create_table(
        "tags",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("name", sa.String(), nullable=False, unique=True),
    )
    op.create_table(
        "card_tags",
        sa.Column("card_id", sa.Integer(), sa.ForeignKey("cards.id"), primary_key=True),
        sa.Column("tag_id", sa.Integer(), sa.ForeignKey("tags.id"), primary_key=True),
    )
    op.create_table(
        "review_history",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("deck_id", sa.Integer(), sa.ForeignKey("decks.id"), nullable=False),
        sa.Column("card_id", sa.Integer(), sa.ForeignKey("cards.id"), nullable=False),
        sa.Column("timestamp", sa.DateTime(), nullable=False),
        sa.Column("was_correct", sa.Boolean(), nullable=False),
        sa.Column("interval", sa.Integer(), nullable=False),
        sa.Column("ease_factor", sa.Integer(), nullable=False),
        sa.Column("next_review_date", sa.DateTime(), nullable=False),
    )


def downgrade() -> None:
    op.drop_table("review_history")
    op.drop_table("card_tags")
    op.drop_table("tags")
    op.drop_table("cards")
    op.drop_table("decks")
    op.drop_index("ix_users_email", table_name="users")
    op.drop_table("users")
