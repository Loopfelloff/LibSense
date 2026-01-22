from .embeddBooks import router as books_router
from .embeddUsers import router as user_router
from .cosineDistance import router as search_router
from .api.fastapi import app
from .routes.classified_genre import router as classified_genre

app.include_router(books_router, prefix="/books", tags=["Embedding"]) # these tags are used only for embedding purposes
app.include_router(user_router, prefix="/users", tags=["Embedding"]) # these tags are useful in the localhost:8000/docs only 
app.include_router(search_router, tags=["Search"])
app.include_router(classified_genre, tags=["Classify"])


@app.get("/")
def root():
    return {"message": "Welcome to LibSense API"}
