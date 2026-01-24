import string


def process_text(text: str) -> str:
    text = text.lower().translate(str.maketrans("", "", string.punctuation))
    return text
