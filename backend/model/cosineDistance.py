from fastapi import FastAPI, Depends, HTTPException
import joblib
from sqlalchemy.orm import Session
from model.db.database import SessionLocal, BookVector, Book, User, UserVector
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


@app.get("/search/{search}")
def cosine_similarity(search: str, db: Session = Depends(get_db)):

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
                "title": bv.book.book_title,
                "description": bv.book.description[:100] + "...",
                "book_id": bv.book_id,
            }
            for bv in results
        ],
    }


@app.get("/recommend/books/{userId}")
def recommend_books(userId: str, db: Session = Depends(get_db)):
    user_vector = db.query(UserVector).filter(UserVector.user_id == userId).first()

    if not user_vector:
        raise HTTPException(status_code=404, detail="User vector not found")

    results = (
        db.query(BookVector)
        .join(Book)
        .order_by(BookVector.embedding.cosine_distance(user_vector.embedding))
        .limit(6)
        .all()
    )

    return {
        "user_id": userId,
        "recommendations": [
            {
                "book_title": bv.book.book_title,
                "book_desc": bv.book.description,
                "book_id": bv.book_id,
            }
            for bv in results
        ],
    }
