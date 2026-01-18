from pathlib import Path
from .utils.processText import process_text
from pydantic import BaseModel
from uuid import UUID
from typing import List, Optional
from .api.fastapi import app
from .sentenceTransformers import transformer_model


class Book(BaseModel):
    id: UUID
    title: str
    description: str
    author: str
    genre: Optional[str] = None


def processBook(book: Book):
    text = " ".join([book.title, book.description, book.author, book.genre or ""])
    processed = process_text(text)
    vector = transformer_model.encode(processed).tolist()
    return str(book.id), vector


@app.post("/embeddbook/all")
def embedd_books_for_db(books: List[Book]):
    return [
        {"id": book_id, "vector": vector} for book_id, vector in map(processBook, books)
    ]


@app.post("/embeddbook")
def embedd_book(book: Book):
    book_id, vector = processBook(book)
    return {"id": book_id, "vector": vector}
