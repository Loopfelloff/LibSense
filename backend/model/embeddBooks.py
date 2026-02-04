from pathlib import Path
from fastapi import APIRouter
<<<<<<< HEAD
from utils.processText import process_text  # No dot
from pydantic import BaseModel
from uuid import UUID
from typing import List, Optional
from sentenceTransformers import transformer_model# No dot
=======
from gensim.models import Word2Vec
from .utils.processText import process_text
from pydantic import BaseModel
from uuid import UUID
from typing import List
import numpy as np

MODEL_PATH = Path(__file__).parent / "artifacts" / "word2vec.model"
model = Word2Vec.load(str(MODEL_PATH))
>>>>>>> f690f8fe69fbc23e5d91190313e78a9ed8abc3db

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