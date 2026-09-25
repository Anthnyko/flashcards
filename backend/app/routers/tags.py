from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.tag import Tag
from app.models.card import Card
from app.schemas.tag import TagCreate, TagOut

router = APIRouter(prefix="/tags", tags=["tags"])

@router.post("/", response_model=TagOut)
def create_tag(tag: TagCreate, db: Session = Depends(get_db)):
    existing = db.query(Tag).filter(Tag.name == tag.name).first()
    if existing:
        raise HTTPException(400, "Tag already exists")

    new_tag = Tag(name=tag.name)
    db.add(new_tag)
    db.commit()
    db.refresh(new_tag)
    return new_tag


@router.post("/assign")
def assign_tag(card_id: int, tag_id: int, db: Session = Depends(get_db)):
    card = db.query(Card).filter(Card.id == card_id).first()
    tag = db.query(Tag).filter(Tag.id == tag_id).first()

    if not card or not tag:
        raise HTTPException(404, "Card or Tag not found")

    card.tags.append(tag)
    db.commit()
    return {"message": "Tag assigned"}


@router.post("/remove")
def remove_tag(card_id: int, tag_id: int, db: Session = Depends(get_db)):
    card = db.query(Card).filter(Card.id == card_id).first()
    tag = db.query(Tag).filter(Tag.id == tag_id).first()

    if not card or not tag:
        raise HTTPException(404, "Card or Tag not found")

    card.tags.remove(tag)
    db.commit()
    return {"message": "Tag removed"}
