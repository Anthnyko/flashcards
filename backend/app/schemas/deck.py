from pydantic import BaseModel

class DeckBase(BaseModel):
    name: str
    description: str | None = None # allows for no description

class DeckCreate(DeckBase):
    pass

class DeckOut(DeckBase):
    id: int
    due_cards: int = 0

    class Config:
        from_attributes = True # allows pydantic to read ORM objects
