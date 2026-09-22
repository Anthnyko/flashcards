from pydantic import BaseModel
from datetime import datetime

class ReviewHistoryBase(BaseModel):
    was_correct: bool

class ReviewHistoryCreate(ReviewHistoryBase):
    pass

class ReviewHistoryOut(ReviewHistoryBase):
    id: int
    card_id: int
    deck_id: int
    user_id: int
    timestamp: datetime
    interval: int
    ease_factor: int
    next_review_time: datetime

    class Config:
        from_attributes = True