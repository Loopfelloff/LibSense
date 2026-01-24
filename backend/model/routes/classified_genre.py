from fastapi import HTTPException
from fastapi.routing import APIRouter
import joblib
from pydantic import BaseModel
from model.utils.text_process_for_classification import transformText
from pathlib import Path
import json

BASE_DIR = Path(__file__).resolve().parent.parent

class BookDescription(BaseModel):
    description : str | None
router = APIRouter()
@router.post("/genre_classification")
def classified_genre(description : BookDescription | None):

    if description is None:
        raise HTTPException(status_code=400 , detail="missing description in the request header") 
    if description.description is None:
        raise HTTPException(status_code=400 , detail="missing description in the request header") 

    description_text = description.description.strip()

    if description_text == '':
        raise HTTPException(status_code=400 , detail="missing description in the request header") 

    pipeline = joblib.load(f"{BASE_DIR}/trained_model/one_vs_all_approach.joblib")

    recommendedGenre = [] 

    # right now i am directly using the raw text to test the api later on make sure to lemmatize and everything 

    found_genre = pipeline.predict([transformText(description_text.lower())])[0]

    with open(f"{BASE_DIR}/utils/top_fifty_genre.json", "r", encoding="utf-8") as f:
        top_fifty_genre_json = json.load(f) 
    item  = top_fifty_genre_json["topFifty"]

    for index , i in enumerate(item):
        if found_genre[index] == 1:
            recommendedGenre.append(i)

    return {
        'success' : True,
        "data" :  recommendedGenre
    }




