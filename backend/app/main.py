from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.routers import auth, decks, cards

app = FastAPI()

app.include_router(auth.router)
app.include_router(decks.router)
app.include_router(cards.router)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/health")
def health_check():
    return {"status":"ok"}