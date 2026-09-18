from pydantic import BaseModel

class DeckBase(BaseModel):
    name: str
    description: str | None = None # allows for no description

class DeckCreate(DeckBase):
    id: int
    owner_id: int

    class Config:
        from_attributes = True # allows pydantic to read ORM objects