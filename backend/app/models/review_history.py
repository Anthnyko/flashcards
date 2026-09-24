from sqlalchemy import Column, Integer, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

from app.db.base import Base

class ReviewHistory(Base):
    __tablename__ = "review_history"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("user.id"), nullable=False) # who reviewed
    deck_id = Column(Integer, ForeignKey("deck.id"), nullable=False) # which deck it belongs to
    card_id = Column(Integer, ForeignKey("card.id"), nullable=False) # which card was reviewed

    timestamp = Column(DateTime, default=datetime.utcnow) # when
    was_correct = Column(Boolean, nullable=False) # did user remember

    interval = Column(Integer, default=1) # how long till next review (in days)
    ease_factor = Column(Integer, default=250)  # SM-2 uses 250 as baseline (2.5)
    next_review_date = Column(DateTime, nullable=False) # when card should be shown again

    user = relationship("User")
    deck = relationship("Deck")
    card = relationship("Card")