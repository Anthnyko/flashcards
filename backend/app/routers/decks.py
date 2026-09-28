from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.dependencies.auth import get_current_user
from app.models.deck import Deck
from app.models.review_history import ReviewHistory
from app.models.user import User
from app.schemas.deck import DeckCreate, DeckOut

router = APIRouter(prefix="/decks", tags=["decks"])


def serialize_deck(deck: Deck, db: Session, user_id: int) -> dict:
    due_cards = db.query(func.count(func.distinct(ReviewHistory.card_id))).filter(
        ReviewHistory.deck_id == deck.id,
        ReviewHistory.user_id == user_id,
        ReviewHistory.next_review_date <= datetime.utcnow(),
    ).scalar() or 0
    return {
        "id": deck.id,
        "name": deck.name,
        "description": deck.description,
        "due_cards": due_cards,
    }


@router.get("/", response_model=list[DeckOut])
def list_decks(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    decks = db.query(Deck).filter(Deck.owner_id == current_user.id).order_by(Deck.name).all()
    return [serialize_deck(deck, db, current_user.id) for deck in decks]


@router.post("/", response_model=DeckOut, status_code=status.HTTP_201_CREATED)
def create_deck(deck: DeckCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    new_deck = Deck(name=deck.name, description=deck.description, owner_id=current_user.id)
    db.add(new_deck)
    db.commit()
    db.refresh(new_deck)
    return serialize_deck(new_deck, db, current_user.id)


@router.get("/{deck_id}", response_model=DeckOut)
def get_deck(deck_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    deck = db.query(Deck).filter(Deck.id == deck_id, Deck.owner_id == current_user.id).first()
    if not deck:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Deck not found.")
    return serialize_deck(deck, db, current_user.id)


@router.delete("/{deck_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_deck(deck_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    deck = db.query(Deck).filter(Deck.id == deck_id, Deck.owner_id == current_user.id).first()
    if not deck:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Deck not found.")
    db.query(ReviewHistory).filter(ReviewHistory.deck_id == deck.id).delete(synchronize_session=False)
    db.delete(deck)
    db.commit()
    return None
