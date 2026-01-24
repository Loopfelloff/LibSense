from pathlib import Path
from fastapi import APIRouter
from gensim.models import Word2Vec
from .utils.processText import process_text
from pydantic import BaseModel
from uuid import UUID
from typing import List
import numpy as np

MODEL_PATH = Path(__file__).parent / "artifacts" / "word2vec.model"
model = Word2Vec.load(str(MODEL_PATH))

router = APIRouter()


class Book(BaseModel):
    id: UUID
    text: str


def processBook(book: Book):
    book_vector = np.zeros(model.vector_size)
    wordVector = []

    token = process_text(book.text)
    for token in token:
        if token in model.wv:
            wordVector.append(model.wv[token])

    if len(wordVector) > 0:
        book_vector = np.mean(wordVector, axis=0)

    return str(book.id), book_vector.tolist()


@router.post("/embedd/all")
def embedd_books_for_db(books: List[Book]):
    return [
        {"id": book_id, "vector": vector} for book_id, vector in map(processBook, books)
    ]


@router.post("/embedd")
def embedd_book(book: Book):
    book_id, vector = processBook(book)
    return {"id": book_id, "vector": vector}
