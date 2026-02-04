from fastapi import APIRouter
from gensim.models import Word2Vec
from pydantic import BaseModel
from uuid import UUID
from typing import List
from pathlib import Path
import numpy as np
from .utils.processText import process_text

MODEL_PATH = Path(__file__).parent / "artifacts" / "word2vec.model"
model = Word2Vec.load(str(MODEL_PATH))
router = APIRouter()


class User(BaseModel):
    id: UUID
    text: str


def processUser(user):
    book_vector = np.zeros(model.vector_size)
    wordVector = []
    tokens = process_text(user.text)
    for token in tokens:
        if token in model.wv:
            wordVector.append(model.wv[token])

    if len(wordVector) > 0:
        book_vector = np.mean(wordVector, axis=0)
    return str(user.id), book_vector.tolist()


@router.post("/embedd/all")
def embedd_users_for_db(user: List[User]):
    return [
        {"id": user_id, "vector": vector} for user_id, vector in map(processUser, user)
    ]


@router.post("/embedd")
def embedd_book(user: User):
    user_id, vector = processUser(user)
    return {"id": user_id, "vector": vector}
