import joblib
from pathlib import Path
from .utils.processText import process_text
from pydantic import BaseModel
from uuid import UUID
from typing import List, Optional
from .api.fastapi import app


class Book(BaseModel):
    id: UUID
    title: str
    description: str
    author: str
    genre: Optional[str] = None


# @app.post()
