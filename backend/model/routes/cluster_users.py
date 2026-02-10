from fastapi import Depends,HTTPException
from fastapi.routing import APIRouter
from pathlib import Path
import json
from sqlalchemy.orm import Session
from sklearn.cluster import DBSCAN
import numpy as np
from model.db.database import (
    SessionLocal,
    UserVector,
)
router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/user_clustering/{user_id}")
def user_clustering(user_id: str, db: Session = Depends(get_db)):
    if not user_id or not user_id.strip():
        raise HTTPException(status_code=400, detail="Search query cannot be empty")
    results = db.query(UserVector).all()

    vector_embeddings = np.array([bv.embedding for bv in results]) 

    user_id_in_list = [bv.user_id for bv in results]

    user_id_index = user_id_in_list.index(user_id)

    db_scan = DBSCAN(eps=1.2, min_samples=5)

    labels = db_scan.fit_predict(vector_embeddings)

    user_cluster_val = labels[user_id_index]

    print(labels)
    


    user_community = []

    for index, i in enumerate(labels):
        if i == user_cluster_val and index != user_id_index:
            user_community.append(user_id_in_list[index])
            if len(user_community) > 5:
                break

    return {
        "community" : user_community
    }
   









