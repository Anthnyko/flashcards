from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.deck import Deck
from app.schemas.deck import DeckCreate, DeckOut
from app.dependencies.auth import get_current_user
from app.models.user import User

router = APIRouter(prefix="/decks", tags=["decks"])

@router.post("/", response_model=DeckOut)
def create_deck(
    deck: DeckCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_deck = Deck(
        name=deck.name,
        description=deck.description,
        owner_id=current_user.id
    )

    db.add(new_deck) # stages the object in database memory
    db.commit() # does an INSERT statement and adds the object to database
    db.refresh(new_deck) # ensures data is up-to-date after change

    return new_deck