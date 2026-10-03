from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.db.session import get_db
from app.models.card import Card
from app.models.deck import Deck
from app.models.tag import Tag
from app.models.user import User
from app.dependencies.auth import get_current_user

router = APIRouter(prefix="/search", tags=["search"])

@router.get("/cards")
def search_cards(q: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    results = (
        db.query(Card)
        .join(Deck)
        .filter(Deck.owner_id == current_user.id)
        .filter(
            or_(
                Card.front.ilike(f"%{q}%"),
                Card.back.ilike(f"%{q}%")
            )
        )
        .all()
    )
    return results


@router.get("/decks")
def search_decks(q: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    results = (
        db.query(Deck)
        .filter(Deck.owner_id == current_user.id, Deck.name.ilike(f"%{q}%"))
        .all()
    )
    return results


@router.get("/tags")
def search_tags(q: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    results = (
        db.query(Tag).join(Tag.cards).join(Card.deck)
        .filter(Deck.owner_id == current_user.id, Tag.name.ilike(f"%{q}%"))
        .distinct()
        .all()
    )
    return results
