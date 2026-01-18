import joblib
from pathlib import Path
from .utils.processText import process_text
from pydantic import BaseModel
from uuid import UUID
from typing import List, Optional
from .api.fastapi import app

# Define paths to your saved artifacts
BASE_DIR = Path(__file__).resolve().parents[1]
MODEL_DIR = BASE_DIR / "model" / "artifacts"


class Book(BaseModel):
    id: UUID
    title: str
    description: str
    author: str
    genre: Optional[str] = None


@app.get("/")
def root():
    return {"message": "Hello FastAPI"}


@app.post("/embeddbooks")
def embedd_books_for_db(books: List[Book]) -> list:
    vectorizer = joblib.load(MODEL_DIR / "tfidf_vectorizer.pkl")
    result = []

    for b in books:
        book_dict = b.model_dump()
        id = b.id
        text = " ".join(str(word) for word in book_dict.values())
        processed = process_text(text)
        vector = vectorizer.transform([processed]).toarray()[0].tolist()
        result.append({"id": id, "vector": vector})

    return result
