from sqlalchemy import Column, Integer, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

from app.db.base import Base

class ReviewHistory(Base):
    __tablename__ = "review_history"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    deck_id = Column(Integer, ForeignKey("deck.id"), nullable=False)
    card_id = Column(Integer, ForeignKey("card.id"), nullable=False)

    timestamp = Column(DateTime, default=datetime.utcnow)
    was_correct = Column(Boolean, nullable=False)

    interval = Column(Integer, default=1) # in days
    ease_factor = Column(Integer, default=250)  # SM-2 uses 250 as baseline (2.5)
    next_review_date = Column(DateTime, nullable=False)

    user = relationship("User")
    deck = relationship("Deck")
    card = relationship("Card")