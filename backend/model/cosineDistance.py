from fastapi import Depends, HTTPException
from fastapi.routing import APIRouter
from sqlalchemy.orm import Session
<<<<<<< HEAD
from db.database import (
=======
from .utils.processText import process_text
from model.db.database import (
>>>>>>> f690f8fe69fbc23e5d91190313e78a9ed8abc3db
    BookStatusVal,
    Favourite,
    SessionLocal,
    BookVector,
    Book,
    UserVector,
)
<<<<<<< HEAD
from sentenceTransformers import transformer_model
from pathlib import Path
=======
from gensim.models import Word2Vec
from pathlib import Path
import numpy as np

MODEL_PATH = Path(__file__).parent / "artifacts" / "word2vec.model"
model = Word2Vec.load(str(MODEL_PATH))
>>>>>>> f690f8fe69fbc23e5d91190313e78a9ed8abc3db


router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/search/{search}")
def cosine_similarity(search: str, db: Session = Depends(get_db)):

    if not search or not search.strip():
        raise HTTPException(status_code=400, detail="Search query cannot be empty")

    book_vector = np.zeros(model.vector_size)
    wordVector = []
    tokens = process_text(search)
    for token in tokens:
        if token in model.wv:
            wordVector.append(model.wv[token])

    if len(wordVector) > 0:
        book_vector = np.mean(wordVector, axis=0)

    results = (
        db.query(BookVector)
        .join(Book)
        .order_by(BookVector.embedding.cosine_distance(book_vector))
        .limit(12)
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


@router.get("/recommend/books/{userId}")
def recommend_books(userId: str, db: Session = Depends(get_db)):
    user_vector = db.query(UserVector).filter(UserVector.user_id == userId).first()

    if not user_vector:
        raise HTTPException(status_code=404, detail="User vector not found")
    results = (
        db.query(BookVector)
        .join(Book)
        .outerjoin(
            BookStatusVal,
            (BookStatusVal.book_id == Book.id) & (BookStatusVal.user_id == userId),
        )
        .outerjoin(
            Favourite,
            (Favourite.book_id == Book.id) & (Favourite.user_id == userId),
        )
        .filter(BookStatusVal.id.is_(None))
        .filter(Favourite.id.is_(None))
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
