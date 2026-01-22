from fastapi import HTTPException
from fastapi.routing import APIRouter
import joblib
from model.utils.top_fifty_genre import item
from pydantic import BaseModel
from model.utils.text_process_for_classification import transformText
class BookDescription(BaseModel):
    text : str | None
router = APIRouter()
@router.post("/genre_classification")
def classified_genre(description : BookDescription | None):

    if description is None:
        raise HTTPException(status_code=400 , detail="missing description in the request header") 
    if description.text is None:
        raise HTTPException(status_code=400 , detail="missing description in the request header") 

    description_text = description.text.strip()

    if description_text == '':
        raise HTTPException(status_code=400 , detail="missing description in the request header") 

    pipeline = joblib.load("../trained_model/one_vs_all_approach.joblib")

    recommendedGenre = [] 

    # right now i am directly using the raw text to test the api later on make sure to lemmatize and everything 

    found_genre = pipeline.predict([transformText(description_text.lower())])[0]

    for index , i in enumerate(item):
        if found_genre[index] == 1:
            recommendedGenre.append(i)

    return {
        'success' : True,
        "data" :  recommendedGenre
    }




