from datetime import datetime
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.card import Card
from app.models.review_history import ReviewHistory

def get_next_card(deck_id: int, user_id: int, db: Session):
    now = datetime.utcnow()

    # 1. Get latest review row per card
    latest_review = (
        db.query(
            ReviewHistory.card_id,
            func.max(ReviewHistory.timestamp).label("latest_timestamp")
        )
        .filter(ReviewHistory.user_id == user_id)
        .group_by(ReviewHistory.card_id)
        .subquery()
    )

    # 2. Due cards (correct logic)
    due_cards = (
        db.query(Card)
        .join(latest_review, latest_review.c.card_id == Card.id)
        .join(
            ReviewHistory,
            (ReviewHistory.card_id == Card.id) &
            (ReviewHistory.timestamp == latest_review.c.latest_timestamp)
        )
        .filter(
            Card.deck_id == deck_id,
            ReviewHistory.next_review_date <= now
        )
        .order_by(ReviewHistory.next_review_date.asc())
        .all()
    )

    if due_cards:
        return due_cards[0]

    # 3. New cards (never reviewed)
    new_cards = (
        db.query(Card)
        .filter(Card.deck_id == deck_id)
        .outerjoin(ReviewHistory, ReviewHistory.card_id == Card.id)
        .filter(ReviewHistory.id.is_(None))
        .all()
    )

    if new_cards:
        return new_cards[0]

    # 4. No cards left
    return None