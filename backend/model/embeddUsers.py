from fastapi import APIRouter
from pydantic import BaseModel
from uuid import UUID
from typing import List
from .sentenceTransformers import transformer_model

router = APIRouter()
class User(BaseModel):
    id: UUID
    text: str


def processUser(user):
    vector = transformer_model.encode(user.text).tolist()
    return str(user.id), vector


@router.post("/embedd/all")
def embedd_users_for_db(user: List[User]):
    return [
        {"id": user_id, "vector": vector} for user_id, vector in map(processUser, user)
    ]


@router.post("/embedd")
def embedd_book(user: User):
    user_id, vector = processUser(user)
    return {"id": user_id, "vector": vector}
