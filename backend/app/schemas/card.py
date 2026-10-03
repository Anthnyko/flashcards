from pydantic import BaseModel
from app.schemas.tag import TagOut

class CardBase(BaseModel):
    front: str
    back: str

class CardCreate(CardBase):
    deck_id: int

class CardUpdate(CardBase):
    pass

class CardOut(CardBase):
    id: int
    deck_id: int
    tags: list[TagOut] = []

    class Config:
        from_attributes = True # allows pydantic to read ORM objects
