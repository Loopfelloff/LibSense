import string


def process_text(text: str) -> str:
    to_remove = string.punctuation + string.digits
    text = text.translate(
        str.maketrans(
            "",
            "",
            to_remove,
        )
    )
    return text.lower()
