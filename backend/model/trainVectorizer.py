import joblib

from sklearn.feature_extraction.text import TfidfVectorizer

from model.utils.processText import process_text
from model.utils.createBookText import create_book_text_train

import json

from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[1]  # backend/
BOOKS_PATH = BASE_DIR / "prisma" / "seed" / "books_final.json"
MODEL_DIR = BASE_DIR / "model" / "artifacts"
MODEL_DIR.mkdir(parents=True, exist_ok=True)
vectorizer = TfidfVectorizer(max_features=1536, stop_words="english", lowercase=True)


def load_books_from_json():
    with open("prisma/seed/books_final.json", "r") as f:
        books_list = json.load(f)

    return books_list


def train_and_persist_model():
    books = load_books_from_json()
    corpus = []
    for b in books:
        books_text = create_book_text_train(b)
        processed_text = process_text(books_text)
        corpus.append(processed_text)

    tfidf_matrix = vectorizer.fit_transform(corpus)
    joblib.dump(vectorizer, MODEL_DIR / "tfidf_vectorizer.pkl")
    joblib.dump(tfidf_matrix, MODEL_DIR / "book_vectors.pkl")


train_and_persist_model()
