from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from app.db.base import Base

class Card(Base):
    __tablename__ = "cards"

    id = Column(Integer, primary_key=True, index=True)
    front = Column(String, nullable=False)
    back = Column(String, nullable=True)
    
    deck_id = Column(Integer, ForeignKey("decks.id"), nullable=False)
    
    deck = relationship("Deck", back_populates="cards")
    tags = relationship("Tag", secondary="card_tags", back_populates="cards")

        