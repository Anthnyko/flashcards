from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.card import Card
from app.models.deck import Deck
from app.schemas.card import CardCreate, CardOut
from app.dependencies.auth import get_current_user
from app.models.user import User

router = APIRouter(prefix="/cards", tags=["cards"])

@router.post("/{deck_id}", response_model=CardOut)
def create_card(
    deck_id: int,
    card: CardCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    deck = db.query(Deck).filter(Deck.id == deck_id).first()

    if not deck or deck.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not own this deck."
        )

    new_card = Card(
        front=card.front,
        back=card.back,
        deck_id=deck_id
    )

    db.add(new_card)
    db.commit()
    db.refresh(new_card)

    return new_card


@router.get("/{deck_id}", response_model=list[CardOut])
def list_cards(
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

    cards = db.query(Card).filter(Card.deck_id == deck_id).all()
    return cards
