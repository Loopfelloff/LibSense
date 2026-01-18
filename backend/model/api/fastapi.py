from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS (VERY IMPORTANT when calling from JS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5000"],  # or ["*"] for dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
