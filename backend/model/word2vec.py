import csv
from pathlib import Path
import re
from gensim.models import Word2Vec
import logging

logging.basicConfig(
    format="%(asctime)s : %(levelname)s : %(message)s", level=logging.INFO
)

BASE_DIR = Path(__file__).parent / "artifacts"
CSV_PATH = BASE_DIR / "books.csv"
MODEL_PATH = BASE_DIR / "word2vec.model"


def load_tokenized_sentences(csv_path):
    sentences = []

    with open(csv_path, "r", encoding="utf-8") as file:
        reader = csv.DictReader(file)

        for row in reader:
            combined_text = (
                f"{row['Title']} {row['Description']} {row['Author']} {row['Genres']}"
            )
            tokens = re.findall(r"\b\w+\b", combined_text)

            sentences.append(tokens)
    print(sentences[0])
    return sentences


try:
    print("Loading tokenized sentences from CSV...")
    sentences = load_tokenized_sentences(CSV_PATH)

    if not sentences:
        print("Warning: No valid sentences found in the CSV file")
    else:
        print(f"Loaded {len(sentences)} sentences")
        print(f"Training Word2Vec model...")

        model = Word2Vec(
            sentences=sentences,
            vector_size=100,
            window=5,
            min_count=1,
            workers=4,
            sg=1,
            negative=5,
            epochs=10,
        )

        model.save(str(MODEL_PATH))
        print(f"✓ Model saved successfully to {MODEL_PATH}")
        print(f"✓ Vocabulary size: {len(model.wv)} words")

except FileNotFoundError:
    print(f"Error: File not found at {CSV_PATH}")
except Exception as e:
    print(f"An error occurred: {type(e).__name__}: {e}")
