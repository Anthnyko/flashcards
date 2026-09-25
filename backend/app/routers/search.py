from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.db.session import get_db
from app.models.card import Card
from app.models.deck import Deck
from app.models.tag import Tag

router = APIRouter(prefix="/search", tags=["search"])

@router.get("/cards")
def search_cards(q: str, db: Session = Depends(get_db)):
    results = (
        db.query(Card)
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
def search_decks(q: str, db: Session = Depends(get_db)):
    results = (
        db.query(Deck)
        .filter(Deck.name.ilike(f"%{q}%"))
        .all()
    )
    return results


@router.get("/tags")
def search_tags(q: str, db: Session = Depends(get_db)):
    results = (
        db.query(Tag)
        .filter(Tag.name.ilike(f"%{q}%"))
        .all()
    )
    return results
