from embeddBooks import router as books_router
from embeddUsers import router as user_router
from cosineDistance import router as search_router
from api.fastapi import app  # Absolute import

app.include_router(books_router, prefix="/books", tags=["Embedding"])
app.include_router(user_router, prefix="/users", tags=["Embedding"])
app.include_router(search_router, tags=["Search"])


@app.get("/")
def root():
    return {"message": "Welcome to LibSense API"}