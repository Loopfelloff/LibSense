import spacy

nlp = spacy.load("en_core_web_sm")

def transformText(text):
    doc = nlp(text)
    filtered_token = []
    for token in doc:
        if token.is_stop or token.is_punct:
            continue
        filtered_token.append(token.lemma_)

    return " ".join(filtered_token)



