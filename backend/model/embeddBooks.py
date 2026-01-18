import joblib
from pathlib import Path
from .utils.processText import process_text
from pydantic import BaseModel
from uuid import UUID
from typing import List, Optional
from .api.fastapi import app

BASE_DIR = Path(__file__).resolve().parents[1]
MODEL_DIR = BASE_DIR / "model" / "artifacts"


class Book(BaseModel):
    id: UUID
    title: str
    description: str
    author: str
    genre: Optional[str] = None


vectorizer = joblib.load(MODEL_DIR / "tfidf_vectorizer.pkl")


@app.post("/embeddbook/all")
def embedd_books_for_db(books: List[Book]) -> list:
    result = []

    for b in books:
        book_dict = b.model_dump()
        id = b.id
        text = " ".join(str(word) for word in book_dict.values())
        processed = process_text(text)
        vector = vectorizer.transform([processed]).toarray()[0].tolist()
        result.append({"id": id, "vector": vector})

    return result


@app.post("/embeddbook")
def embedd_book(book: Book):
    book_dict = book.model_dump()
    id = book.id
    text = " ".join(str(word) for word in book_dict.values())
    processed = process_text(text)
    vector = vectorizer.transform([processed]).toarray()[0].tolist()
    return {"id": id, "vector": vector}
