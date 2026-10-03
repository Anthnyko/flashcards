from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.deck import Deck
from app.models.card import Card
from app.models.tag import Tag

router = APIRouter(prefix="/import", tags=["import"])

@router.post("/")
def import_deck(data: dict, db: Session = Depends(get_db)):
    deck_info = data["deck"]
    cards_info = data["cards"]

    deck = Deck(name=deck_info["name"], description=deck_info.get("description"))
    db.add(deck)
    db.commit()
    db.refresh(deck)

    for card_data in cards_info:
        card = Card(
            front=card_data["front"],
            back=card_data["back"],
            deck_id=deck.id
        )
        db.add(card)
        db.commit()
        db.refresh(card)

        for tag_name in card_data.get("tags", []):
            tag = db.query(Tag).filter(Tag.name == tag_name).first()
            if not tag:
                tag = Tag(name=tag_name)
                db.add(tag)
                db.commit()
                db.refresh(tag)

            card.tags.append(tag)

        db.commit()

    return {"message": "Deck imported", "deck_id": deck.id}
