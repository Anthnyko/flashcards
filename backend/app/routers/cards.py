from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.dependencies.auth import get_current_user
from app.models.card import Card
from app.models.deck import Deck
from app.models.review_history import ReviewHistory
from app.models.user import User
from app.schemas.card import CardCreate, CardOut, CardUpdate

router = APIRouter(prefix="/cards", tags=["cards"])


def get_owned_deck(deck_id: int, db: Session, current_user: User) -> Deck:
    deck = db.query(Deck).filter(Deck.id == deck_id, Deck.owner_id == current_user.id).first()
    if not deck:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Deck not found.")
    return deck


@router.post("/", response_model=CardOut, status_code=status.HTTP_201_CREATED)
def create_card(card: CardCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    get_owned_deck(card.deck_id, db, current_user)
    new_card = Card(front=card.front, back=card.back, deck_id=card.deck_id)
    db.add(new_card)
    db.commit()
    db.refresh(new_card)
    return new_card


@router.get("/{deck_id}", response_model=list[CardOut])
def list_cards(deck_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    get_owned_deck(deck_id, db, current_user)
    return db.query(Card).filter(Card.deck_id == deck_id).order_by(Card.id).all()


@router.put("/{card_id}", response_model=CardOut)
def update_card(card_id: int, payload: CardUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    card = db.query(Card).filter(Card.id == card_id).first()
    if not card:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Card not found.")
    get_owned_deck(card.deck_id, db, current_user)
    card.front = payload.front
    card.back = payload.back
    db.commit()
    db.refresh(card)
    return card


@router.delete("/{card_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_card(card_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    card = db.query(Card).filter(Card.id == card_id).first()
    if not card:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Card not found.")
    get_owned_deck(card.deck_id, db, current_user)
    db.query(ReviewHistory).filter(ReviewHistory.card_id == card.id).delete(synchronize_session=False)
    db.delete(card)
    db.commit()
    return None
