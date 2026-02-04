from fastapi import APIRouter
from utils.processText import process_text  # No dot
from pydantic import BaseModel
from uuid import UUID
from typing import List, Optional
from sentenceTransformers import transformer_model# No dot

router = APIRouter()


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


@router.post("/embedd/all")
def embedd_books_for_db(books: List[Book]):
    print(f"📥 Received request to embed {len(books)} books")
    result = [
        {"id": book_id, "vector": vector} for book_id, vector in map(processBook, books)
    ]
    print(f"✅ Successfully generated {len(result)} embeddings")
    return result


@router.post("/embedd")
def embedd_book(book: Book):
    print(f"📥 Received embedding request for book: {book.id}")
    print(f"📖 Title: {book.title}")
    
    book_id, vector = processBook(book)
    
    print(f"✅ Generated vector with {len(vector)} dimensions")
    
    return {"id": book_id, "vector": vector}