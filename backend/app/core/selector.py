from datetime import datetime
from sqlalchemy.orm import Session

from app.models.card import Card
from app.models.review_history import ReviewHistory

def get_next_card(deck_id: int, user_id: int, db: Session):
    now = datetime.utcnow()

    due_cards = (
        db.query(Card)
        .join(ReviewHistory, ReviewHistory.card_id == Card.id)
        .filter(
            Card.deck_id == deck_id,
            ReviewHistory.user_id == user_id,
            ReviewHistory.next_review_date <= now
        )
        .all()
    )

    if due_cards:
        return due_cards[0]

    new_cards = (
        db.query(Card)
        .filter(Card.deck_id == deck_id)
        .outerjoin(ReviewHistory, ReviewHistory.card_id == Card.id)
        .filter(ReviewHistory.id.is_(None))
        .all()
    )

    if new_cards:
        return new_cards[0]

    overdue_cards = (
        db.query(Card)
        .join(ReviewHistory, ReviewHistory.card_id == Card.id)
        .filter(
            Card.deck_id == deck_id,
            ReviewHistory.user_id == user_id,
            ReviewHistory.next_review_date < now
        )
        .all()
    )

    if overdue_cards:
        return overdue_cards[0]

    return None