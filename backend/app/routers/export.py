from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.deck import Deck
from app.models.card import Card

router = APIRouter(prefix="/export", tags=["export"])

@router.get("/{deck_id}")
def export_deck(deck_id: int, db: Session = Depends(get_db)):
    deck = db.query(Deck).filter(Deck.id == deck_id).first()
    if not deck:
        raise HTTPException(404, "Deck not found")

    cards = db.query(Card).filter(Card.deck_id == deck_id).all()

    export_data = {
        "deck": {
            "name": deck.name,
            "description": deck.description
        },
        "cards": [
            {
                "front": c.front,
                "back": c.back,
                "tags": [t.name for t in c.tags]
            }
            for c in cards
        ]
    }

    return export_data
