from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.routers import auth, decks, cards, study, search, tags

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(decks.router)
app.include_router(cards.router)
app.include_router(study.router)
app.include_router(search.router)
app.include_router(tags.router)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/health")
def health_check():
    return {"status":"ok"}
