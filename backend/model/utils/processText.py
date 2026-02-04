import re
import string


def process_text(text: str) -> list:
    to_remove = string.punctuation + string.digits
    text = text.translate(
        str.maketrans(
            "",
            "",
            to_remove,
        )
    )
    tokens = re.findall(r"\b\w+\b", text.lower())
    return tokens
