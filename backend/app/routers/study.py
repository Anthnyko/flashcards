from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime

from app.db.session import get_db
from app.dependencies.auth import get_current_user
from app.models.deck import Deck
from app.models.card import Card
from app.models.review_history import ReviewHistory
from app.schemas.review_history import ReviewHistoryCreate, ReviewHistoryOut
from app.core.selector import get_next_card
from app.core.scheduler import schedule_next_review
from app.models.user import User

router = APIRouter(prefix="/study", tags=["study"])


@router.post("/start/{deck_id}") # starts the study session using a deck_id
def start_session(
    deck_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    deck = db.query(Deck).filter(Deck.id == deck_id).first()

    if not deck or deck.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not own this deck."
        )

    total_cards = db.query(Card).filter(Card.deck_id == deck_id).count()

    due_cards = (
        db.query(ReviewHistory)
        .filter(
            ReviewHistory.deck_id == deck_id,
            ReviewHistory.user_id == current_user.id,
            ReviewHistory.next_review_date <= datetime.utcnow()
        )
        .count()
    )

    new_cards = (
        db.query(Card)
        .outerjoin(ReviewHistory, ReviewHistory.card_id == Card.id)
        .filter(Card.deck_id == deck_id, ReviewHistory.id.is_(None))
        .count()
    )

    return {
        "deck_id": deck_id,
        "total_cards": total_cards,
        "due_cards": due_cards,
        "new_cards": new_cards,
        "message": "Study session initialized."
    }


@router.get("/next-card/{deck_id}") # cycles through every card within a deck
def next_card(
    deck_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    card = get_next_card(deck_id, current_user.id, db)

    if not card:
        return {"message": "No cards left to study.", "card": None}

    return {
        "card_id": card.id,
        "front": card.front,
        "back": card.back
    }


@router.post("/submit-answer")
def submit_answer(
    card_id: int,
    was_correct: bool,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Get latest review history for this card
    last_review = (
        db.query(ReviewHistory)
        .filter(
            ReviewHistory.card_id == card_id,
            ReviewHistory.user_id == current_user.id
        )
        .order_by(ReviewHistory.timestamp.desc())
        .first()
    )

    if last_review:
        interval = last_review.interval
        ease_factor = last_review.ease_factor
    else:
        interval = 1
        ease_factor = 250  # baseline (2.5)
    
    new_interval, new_ease_factor, next_review_date = schedule_next_review(
        was_correct, interval, ease_factor
    )

    card = db.query(Card).filter(Card.id == card_id).first()

    new_review = ReviewHistory(
        user_id=current_user.id,
        deck_id=card.deck_id,
        card_id=card_id,
        was_correct=was_correct,
        interval=new_interval,
        ease_factor=new_ease_factor,
        next_review_date=next_review_date
    )

    db.add(new_review)
    db.commit()
    db.refresh(new_review)

    return {
        "message": "Answer recorded.",
        "review": {
            "card_id": card_id,
            "was_correct": was_correct,
            "interval": new_interval,
            "ease_factor": new_ease_factor,
            "next_review_date": next_review_date
        }
    }


@router.get("/progress/{deck_id}")
def study_progress(
    deck_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    total_cards = db.query(Card).filter(Card.deck_id == deck_id).count()

    due_cards = (
        db.query(ReviewHistory)
        .filter(
            ReviewHistory.deck_id == deck_id,
            ReviewHistory.user_id == current_user.id,
            ReviewHistory.next_review_date <= datetime.utcnow()
        )
        .count()
    )

    new_cards = (
        db.query(Card)
        .outerjoin(ReviewHistory, ReviewHistory.card_id == Card.id)
        .filter(Card.deck_id == deck_id, ReviewHistory.id.is_(None))
        .count()
    )

    return {
        "total_cards": total_cards,
        "due_cards": due_cards,
        "new_cards": new_cards,
        "completed_cards": total_cards - new_cards - due_cards
    }
