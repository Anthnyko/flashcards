from pydantic import BaseModel

class CardBase(BaseModel):
    front: str
    back: str

class CardCreate(CardBase):
    pass

class CardOut(CardBase):
    id: int
    deck_id: int

    class Config:
        from_attributes = True # allows pydantic to read ORM objects
