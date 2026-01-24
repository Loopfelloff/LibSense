from fastapi import APIRouter
from .utils.processText import process_text
from pydantic import BaseModel
from uuid import UUID
from typing import List, Optional
from .sentenceTransformers import transformer_model

router = APIRouter()


class Book(BaseModel):
    id: UUID
    text: str


def processBook(book: Book):
    processed = process_text(book.text)
    print(processed)
    vector = transformer_model.encode(processed).tolist()
    return str(book.id), vector


@router.post("/embedd/all")
def embedd_books_for_db(books: List[Book]):
    return [
        {"id": book_id, "vector": vector} for book_id, vector in map(processBook, books)
    ]


@router.post("/embedd")
def embedd_book(book: Book):
    book_id, vector = processBook(book)
    return {"id": book_id, "vector": vector}
