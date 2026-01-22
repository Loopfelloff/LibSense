import spacy
import json
from pathlib import Path

nlp = spacy.load("en_core_web_sm")
original_word={}
synonym_word = {}

BASE_DIR = Path(__file__).resolve().parent.parent

DATA_DIR = BASE_DIR / 'data'

with open(f"{DATA_DIR}/original_words.json", "r", encoding="utf-8") as f:
    original_word = json.load(f) 
with open(f"{DATA_DIR}/synonym_map.json", "r", encoding="utf-8") as f:
    synonym_word = json.load(f) 

def transformText(text):
    doc = nlp(text)
    filtered_token = []
    for token in doc:
        if token.is_stop or token.is_punct:
            continue
        filtered_token.append(token.lemma_)

    return replaceWithSynonym(" ".join(filtered_token))

def replaceWithSynonym(text):
    list_word = text.split()
    filtered_word=[]
    for word in list_word:
        if word in original_word:
            filtered_word.append(word)
        elif word in synonym_word:
            filtered_word.append(synonym_word[word][0])
        elif word not in synonym_word and word not in original_word:
            filtered_word.append(word)
    return " ".join(filtered_word)


