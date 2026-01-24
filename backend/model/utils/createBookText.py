def create_book_text_train(item: dict) -> str:
    parts = []

    book = item.get("book", {})

    title = book.get("book_title")
    description = book.get("description")

    if title:
        parts.append(title)

    if description:
        parts.append(description)

    # Authors
    authors = item.get("authors", [])
    for a in authors:
        author_name = " ".join(
            filter(
                None,
                [
                    a.get("author_first_name"),
                    a.get("author_middle_name"),
                    a.get("author_last_name"),
                ],
            )
        )
        if author_name:
            parts.append(author_name)

    # Genres
    genres = item.get("genres", [])
    if genres:
        parts.append(" ".join(genres))

    return " ".join(parts)
