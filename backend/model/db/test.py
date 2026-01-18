from fastapi import FastAPI, Depends
import joblib
from sqlalchemy.orm import Session
from .database import SessionLocal, BookVector, Book
from pathlib import Path
from model.sentenceTransformers import transformer_model

app = FastAPI()
BASE_DIR = Path(__file__).resolve().parent.parent


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/test-recommendation/{search}")
def test_rec(search: str, db: Session = Depends(get_db)):

    target_embedding = transformer_model.encode(search)

    results = (
        db.query(BookVector)
        .join(Book)
        .order_by(BookVector.embedding.cosine_distance(target_embedding))
        .limit(6)
        .all()
    )
    return {
        "query": search,
        "recommendations": [
            {
                "title": bv.book.book_title,  # Accessing data via relationship
                "description": bv.book.description[:100] + "...",
                "book_id": bv.book_id,
            }
            for bv in results
        ],
    }
